import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  MapPin, 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ChevronDown, 
  Navigation, 
  Building2, 
  ExternalLink, 
  Sparkles,
  ShieldAlert,
  Calendar,
  Layers,
  Thermometer
} from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';
import { RealtimeWeather, REGION_PRESETS, RegionPreset, fetchLiveWeather } from '../services/weatherService';
import { reverseGeocodeCoords, LiveGpsCoordinates } from '../services/gpsService';

interface WeatherForecastCardProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  highContrast: boolean;
  onLocationUpdate?: (locationName: string, lat: number, lon: number) => void;
}

export const WeatherForecastCard: React.FC<WeatherForecastCardProps> = ({
  currentLang,
  onLanguageChange,
  highContrast,
  onLocationUpdate,
}) => {
  const t = TRANSLATIONS[currentLang];

  // Location and weather state
  const [currentRegion, setCurrentRegion] = useState<RegionPreset>(REGION_PRESETS[0]);
  const [customLocationName, setCustomLocationName] = useState<string | null>(null);
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lon: number }>({
    lat: REGION_PRESETS[0].lat,
    lon: REGION_PRESETS[0].lon,
  });
  const [weather, setWeather] = useState<RealtimeWeather | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState<boolean>(false);

  // Google Maps Grounded Agricultural Centers State
  const [showAgriCenters, setShowAgriCenters] = useState<boolean>(false);
  const [isLoadingCenters, setIsLoadingCenters] = useState<boolean>(false);
  const [agriCentersData, setAgriCentersData] = useState<{
    text: string;
    places: Array<{ title: string; uri: string }>;
  } | null>(null);

  // Load weather when coordinates or language change
  const refreshWeather = async (lat: number, lon: number, label: string) => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchLiveWeather(lat, lon, label, currentLang);
      setWeather(data);
      if (data.locationName && onLocationUpdate) {
        onLocationUpdate(data.locationName, lat, lon);
      }
    } catch (e) {
      console.error('Weather load error:', e);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    const label = customLocationName || currentRegion.name[currentLang] || currentRegion.name.en;
    refreshWeather(activeCoords.lat, activeCoords.lon, label);
  }, [activeCoords, currentLang]);

  // Standard HTML5 Geolocation API: Track and set user's current location
  const handleDetectUserLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your device browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        setGpsAccuracy(accuracy);
        setActiveCoords({ lat, lon });

        try {
          // Reverse-geocode to get real village/district/state name
          const geocoded = await reverseGeocodeCoords(lat, lon);
          const resolvedName = geocoded.displayName;
          setCustomLocationName(resolvedName);

          // Regional auto-language alignment: match known state to native language
          if (geocoded.state) {
            const st = geocoded.state.toLowerCase();
            if ((st.includes('telangana') || st.includes('andhra')) && currentLang !== 'te') {
              onLanguageChange('te');
            } else if (st.includes('karnataka') && currentLang !== 'kn') {
              onLanguageChange('kn');
            } else if (st.includes('tamil nadu') && currentLang !== 'ta') {
              onLanguageChange('ta');
            } else if ((st.includes('punjab') || st.includes('delhi') || st.includes('haryana') || st.includes('uttar pradesh') || st.includes('bihar') || st.includes('madhya')) && currentLang !== 'hi') {
              onLanguageChange('hi');
            }
          }

          await refreshWeather(lat, lon, resolvedName);
        } catch (_err) {
          const fallbackLabel = `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
          setCustomLocationName(fallbackLabel);
          await refreshWeather(lat, lon, fallbackLabel);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (error) => {
        setIsDetectingGps(false);
        let msg = 'Unable to acquire location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access was blocked. Please grant GPS permissions in browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'GPS location is temporarily unavailable on your device.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'GPS acquisition timed out. Please try again or select your region below.';
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  };

  // Region preset selector
  const handleSelectPresetRegion = (region: RegionPreset) => {
    setCurrentRegion(region);
    setCustomLocationName(null);
    setGpsAccuracy(null);
    setGpsError(null);
    setIsRegionDropdownOpen(false);
    setActiveCoords({ lat: region.lat, lon: region.lon });

    // Optional smart language alignment
    if (region.suggestedLang && region.suggestedLang !== currentLang) {
      onLanguageChange(region.suggestedLang);
    }
  };

  // Google Maps Grounding fetch with gemini-3.5-flash
  const handleFetchNearbyAgriCenters = async () => {
    setShowAgriCenters(true);
    if (agriCentersData) return;

    setIsLoadingCenters(true);
    try {
      const regionLabel = customLocationName || currentRegion.name.en;
      const res = await fetch('/api/nearby-agri-centers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: activeCoords.lat,
          lon: activeCoords.lon,
          lang: currentLang,
          regionName: regionLabel
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAgriCentersData({
          text: data.text,
          places: data.places || []
        });
      }
    } catch (err) {
      console.error('Failed to load grounded agri centers:', err);
    } finally {
      setIsLoadingCenters(false);
    }
  };

  const sprayBadgeConfig = {
    optimal: {
      bg: 'bg-[#a0f399]/30 text-[#003629] border-[#1b6d24]',
      dot: 'bg-[#1b6d24]',
      label: t.optimalSpray
    },
    wind_alert: {
      bg: 'bg-amber-100 text-amber-900 border-amber-400',
      dot: 'bg-amber-600',
      label: 'High Wind Alert (Drift Risk)'
    },
    rain_alert: {
      bg: 'bg-rose-100 text-rose-900 border-rose-400',
      dot: 'bg-rose-600',
      label: 'Rain Alert (Washoff Risk)'
    },
    humidity_alert: {
      bg: 'bg-purple-100 text-purple-900 border-purple-400',
      dot: 'bg-purple-600',
      label: 'High Humidity (Spore Risk)'
    }
  };

  const currentSpray = weather ? sprayBadgeConfig[weather.sprayCondition] || sprayBadgeConfig.optimal : sprayBadgeConfig.optimal;

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${
      highContrast 
        ? 'bg-[#002117] border-white/60 text-white shadow-lg' 
        : 'bg-white border-[#c0c9c3] text-[#161d19] shadow-sm'
    }`}>
      {/* Top Location Bar & Action Controls */}
      <div className="p-4 sm:p-5 border-b border-[#dde4de] flex flex-wrap items-center justify-between gap-3 bg-[#f4fbf4]/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#e8f0e9] text-[#1b6d24] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#56605b] uppercase tracking-wider">
                {t.weatherForecastTitle}
              </span>
              {gpsAccuracy && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#a0f399] text-[#003629] text-[9.5px] font-extrabold">
                  GPS ±{gpsAccuracy}m
                </span>
              )}
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-[#003629] truncate">
              {weather?.locationName || customLocationName || currentRegion.name[currentLang] || currentRegion.name.en}
            </h3>
          </div>
        </div>

        {/* GPS Track & Region Switcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDetectUserLocation}
            disabled={isDetectingGps}
            title="Auto-detect current GPS location"
            className="px-3 py-1.5 rounded-xl bg-[#1b6d24] hover:bg-[#165a1e] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-60"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
            <span>{isDetectingGps ? t.detectingLocation : t.locateMyField}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              className="px-2.5 py-1.5 rounded-xl border border-[#c0c9c3] bg-white hover:bg-[#eef5ef] text-[#003629] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#1b6d24]" />
              <span className="max-w-[100px] sm:max-w-[130px] truncate">
                {currentRegion.name[currentLang] || currentRegion.name.en}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#707974]" />
            </button>

            {isRegionDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl border border-[#c0c9c3] shadow-xl z-30 py-1.5 max-h-60 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#707974] border-b border-[#dde4de]">
                  Select Agricultural Region
                </div>
                {REGION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPresetRegion(preset)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      currentRegion.id === preset.id && !customLocationName
                        ? 'bg-[#eef5ef] font-bold text-[#1b6d24]'
                        : 'text-[#161d19] hover:bg-[#f4fbf4]'
                    }`}
                  >
                    <span>{preset.name[currentLang] || preset.name.en}</span>
                    {preset.suggestedLang && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e8f0e9] text-[#003629]">
                        {preset.suggestedLang.toUpperCase()}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {gpsError && (
        <div className="mx-4 mt-3 p-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Weather Metrics & Context-Aware Spraying Advisory */}
      <div className="p-4 sm:p-6 space-y-4">
        {weather ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Temperature */}
              <div className="p-3 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
                <span className="text-[11px] font-bold text-[#56605b] block mb-0.5">
                  Temperature
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-black text-[#003629]">
                    {weather.temperature}°C
                  </span>
                  <span className="text-[11px] text-[#707974]">
                    ({weather.apparentTemperature}°C)
                  </span>
                </div>
                <span className="text-[11px] text-[#1b6d24] font-medium block truncate mt-0.5">
                  {weather.conditionText}
                </span>
              </div>

              {/* Humidity */}
              <div className="p-3 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
                <span className="text-[11px] font-bold text-[#56605b] block mb-0.5">
                  {t.humidity}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-black text-[#003629]">
                    {weather.humidity}%
                  </span>
                  <Droplets className="w-4 h-4 text-sky-600" />
                </div>
                <span className={`text-[10.5px] font-bold block mt-0.5 ${
                  weather.humidity > 80 ? 'text-purple-700' : 'text-[#707974]'
                }`}>
                  {weather.humidity > 80 ? 'Spore Germination Risk' : 'Normal Leaf Moisture'}
                </span>
              </div>

              {/* Wind Speed */}
              <div className="p-3 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
                <span className="text-[11px] font-bold text-[#56605b] block mb-0.5">
                  Wind Speed
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-black text-[#003629]">
                    {weather.windSpeed}
                  </span>
                  <span className="text-xs font-bold text-[#707974]">km/h</span>
                </div>
                <span className={`text-[10.5px] font-bold block mt-0.5 ${
                  weather.windSpeed > 14 ? 'text-amber-700' : 'text-[#1b6d24]'
                }`}>
                  {weather.windSpeed > 14 ? 'Chemical Drift Hazard' : 'Calm / Low Drift'}
                </span>
              </div>

              {/* Soil Moisture */}
              <div className="p-3 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
                <span className="text-[11px] font-bold text-[#56605b] block mb-0.5">
                  {t.soilMoisture}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-black text-[#003629]">
                    ~{weather.soilMoisture}%
                  </span>
                  <Layers className="w-4 h-4 text-amber-700" />
                </div>
                <span className="text-[10.5px] text-[#56605b] block mt-0.5 font-medium">
                  Root Zone Index
                </span>
              </div>
            </div>

            {/* Context-Aware Agricultural Spray Advisory Banner */}
            <div className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 transition-colors ${currentSpray.bg}`}>
              <div className={`w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0 ${currentSpray.dot} ring-4 ring-white/50`} />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                    {t.sprayCondition}: {currentSpray.label}
                  </span>
                  <span className="text-[10px] opacity-75 font-medium">
                    {weather.source} • Synced {weather.lastUpdated}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-semibold leading-relaxed">
                  {weather.agriculturalAdvice || t.optimalSpray}
                </p>
              </div>
            </div>

            {/* Hourly & 3-Day Microclimate Forecast Strip */}
            {weather.hourly && weather.hourly.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#404945] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1b6d24]" />
                    {t.hourlyForecast}
                  </span>
                  <span className="text-[11px] text-[#707974]">
                    Next 12-24 Hours Outlook
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {weather.hourly.slice(0, 4).map((h, i) => (
                    <div key={i} className="p-2 sm:p-2.5 rounded-xl bg-[#f4fbf4] border border-[#dde4de] text-center">
                      <span className="text-[10.5px] font-bold text-[#707974] block">
                        {h.time}
                      </span>
                      <span className="font-display text-sm sm:text-base font-extrabold text-[#003629] block my-0.5">
                        {h.temp}°C
                      </span>
                      <div className="text-[9.5px] font-bold text-[#1b6d24]">
                        {h.pop > 30 ? `🌧️ ${h.pop}%` : `💨 ${h.wind} km/h`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full border-4 border-[#1b6d24] border-t-transparent animate-spin mb-3" />
            <span className="text-xs font-bold text-[#56605b]">
              Loading precision microclimate data...
            </span>
          </div>
        )}

        {/* Google Maps Grounded Agricultural Research Centers (gemini-3.5-flash) */}
        <div className="border-t border-[#dde4de] pt-3">
          {!showAgriCenters ? (
            <button
              onClick={handleFetchNearbyAgriCenters}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#eef5ef] hover:bg-[#e0ede2] border border-[#a0f399] text-[#003629] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Building2 className="w-4 h-4 text-[#1b6d24]" />
              <span>{t.nearbyAgriCenters}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#1b6d24]" />
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#eef5ef] border border-[#a0f399] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#1b6d24]" />
                  <span className="text-xs font-bold text-[#003629]">
                    {t.nearbyAgriCenters}
                  </span>
                </div>
                <button
                  onClick={() => setShowAgriCenters(false)}
                  className="text-[11px] font-bold text-[#707974] hover:underline"
                >
                  Hide
                </button>
              </div>

              {isLoadingCenters ? (
                <div className="flex items-center justify-center py-4 gap-2 text-xs text-[#1b6d24]">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Querying Krishi Vigyan Kendra & Google Maps database...</span>
                </div>
              ) : agriCentersData ? (
                <div className="space-y-2.5 text-xs text-[#161d19]">
                  <p className="leading-relaxed font-medium">
                    {agriCentersData.text}
                  </p>

                  {agriCentersData.places.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-extrabold uppercase text-[#1b6d24] block">
                        Verified Google Maps Locations:
                      </span>
                      {agriCentersData.places.map((place, idx) => (
                        <a
                          key={idx}
                          href={place.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#dde4de] hover:border-[#1b6d24] text-[#003629] font-bold text-xs transition-colors"
                        >
                          <span className="truncate pr-2">{place.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#1b6d24] flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
