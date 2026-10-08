import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  Sun, 
  CloudRain, 
  Wind, 
  Globe, 
  Sparkles, 
  ChevronDown, 
  Check, 
  Smartphone, 
  Cpu, 
  MapPin, 
  Droplets,
  CloudSun,
  Navigation,
  Crosshair,
  Activity,
  Layers
} from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';
import { RealtimeWeather, REGION_PRESETS, fetchLiveWeather } from '../services/weatherService';
import { 
  LiveGpsCoordinates, 
  GeocodedRegionalAddress, 
  reverseGeocodeCoords 
} from '../services/gpsService';
import { LiveGpsPrecisionModal } from './LiveGpsPrecisionModal';

interface AndroidTopBarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenFlutterExport?: () => void;
  onOpenAiSetup?: () => void;
}

const INDIAN_LANGUAGES: { code: SupportedLanguage; label: string; script: string }[] = [
  { code: 'en', label: 'English', script: 'English (EN)' },
  { code: 'hi', label: 'हिन्दी', script: 'Hindi' },
  { code: 'te', label: 'తెలుగు', script: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ta', label: 'தமிழ்', script: 'Tamil' }
];

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  currentLang,
  onLanguageChange,
  highContrast,
  onToggleHighContrast,
  onOpenFlutterExport,
  onOpenAiSetup,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [weather, setWeather] = useState<RealtimeWeather | null>(null);
  const [currentRegion, setCurrentRegion] = useState(REGION_PRESETS[0]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Live GPS tracking & regional precision state
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [liveCoords, setLiveCoords] = useState<LiveGpsCoordinates | null>(null);
  const [regionalAddress, setRegionalAddress] = useState<GeocodedRegionalAddress | null>(null);
  const [isTrackingGps, setIsTrackingGps] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Fetch live real-time weather via OpenWeatherMap API pipeline
  const loadWeather = async (lat: number, lon: number, label: string) => {
    setIsLoadingWeather(true);
    try {
      const live = await fetchLiveWeather(lat, lon, label, currentLang);
      setWeather(live);
    } catch (_err) {
      // Handled inside service
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    const locLabel = currentRegion.name[currentLang] || currentRegion.name.en;
    loadWeather(currentRegion.lat, currentRegion.lon, locLabel);
  }, [currentRegion, currentLang]);

  // Clean up GPS watcher on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // One-shot GPS location with reverse geocoding
  const handleDetectGPS = () => {
    if (!navigator.geolocation) return;
    setIsLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const newCoords: LiveGpsCoordinates = {
          latitude: lat,
          longitude: lon,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: pos.timestamp
        };
        setLiveCoords(newCoords);

        // Reverse geocode for exact village/district/zone
        const addr = await reverseGeocodeCoords(lat, lon);
        setRegionalAddress(addr);

        loadWeather(lat, lon, addr.displayName || `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`);
        setIsLocationMenuOpen(false);
      },
      () => {
        setIsLoadingWeather(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle continuous live GPS tracking
  const toggleLiveTracking = () => {
    if (!navigator.geolocation) return;

    if (isTrackingGps) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTrackingGps(false);
    } else {
      setIsTrackingGps(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const coords: LiveGpsCoordinates = {
            latitude: lat,
            longitude: lon,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            speed: pos.coords.speed,
            heading: pos.coords.heading,
            timestamp: pos.timestamp
          };
          setLiveCoords(coords);

          // Geocode periodically or upon new coordinates
          const addr = await reverseGeocodeCoords(lat, lon);
          setRegionalAddress(addr);
          loadWeather(lat, lon, addr.displayName);
        },
        (err) => {
          console.warn('GPS tracking error:', err.message);
          setIsTrackingGps(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-40 border-b shadow-sm transition-colors ${
        highContrast 
          ? 'bg-[#002117] text-white border-white/20' 
          : 'bg-[#003629] text-white border-[#1b4d3e]'
      }`}>
        {/* Real-time Field Weather & Environmental Ticker Bar */}
        <div className="bg-[#00261d] px-3.5 py-1.5 text-[11px] font-medium border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-[#baeed9]">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location & GPS Button */}
            <div className="relative">
              <button
                onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                className="flex items-center gap-1 font-bold text-white hover:text-[#a0f399] transition-colors py-0.5"
                title="Click to select or detect farm GPS location"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate max-w-[110px] sm:max-w-[170px]">
                  {regionalAddress?.displayName || weather?.locationName || currentRegion.name[currentLang]}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-[#8abda9]" />
              </button>

              {isLocationMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLocationMenuOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-64 bg-white text-[#161d19] rounded-2xl shadow-2xl border border-[#c0c9c3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-[#707974] border-b border-[#dde4de] flex items-center justify-between">
                      <span>{t.fieldLocation}</span>
                      <span className="text-[#1b6d24] font-bold">GNSS / GPS</span>
                    </div>

                    <button
                      onClick={handleDetectGPS}
                      className="w-full px-3 py-2 text-left text-xs font-bold text-[#1b6d24] hover:bg-[#eef5ef] flex items-center gap-2 transition-colors"
                    >
                      <Crosshair className="w-4 h-4 text-[#1b6d24]" />
                      <span>{t.autoGps}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsLocationMenuOpen(false);
                        setIsGpsModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-bold text-[#003629] hover:bg-[#eef5ef] flex items-center gap-2 border-b border-[#dde4de] transition-colors"
                    >
                      <Navigation className="w-4 h-4 text-emerald-600" />
                      <span>{t.liveGpsTitle}</span>
                      {isTrackingGps && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </button>

                    <div className="px-3 py-1 text-[10px] font-bold text-[#707974] uppercase mt-1">
                      Major Indian Agro Hubs
                    </div>
                    {REGION_PRESETS.map((reg) => (
                      <button
                        key={reg.id}
                        onClick={() => {
                          setCurrentRegion(reg);
                          setRegionalAddress(null);
                          setIsLocationMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-[#f4fbf4] flex items-center justify-between ${
                          currentRegion.id === reg.id && !regionalAddress ? 'text-[#1b6d24] font-bold bg-[#eef5ef]' : ''
                        }`}
                      >
                        <span>{reg.name[currentLang] || reg.name.en}</span>
                        {currentRegion.id === reg.id && !regionalAddress && (
                          <Check className="w-3.5 h-3.5 text-[#1b6d24]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Live GPS tracking active pill */}
            {isTrackingGps && (
              <button
                onClick={() => setIsGpsModalOpen(true)}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40 animate-pulse"
                title="Continuous Live GPS precision tracking active"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>GPS Live</span>
              </button>
            )}

            {/* OpenWeatherMap Indicator */}
            <div className="hidden lg:flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#baeed9] font-mono">
              <CloudSun className="w-3 h-3 text-amber-300" />
              <span>OWM Live</span>
            </div>

            {/* Temperature */}
            <span className="flex items-center gap-1 text-amber-400 font-extrabold" title="Current Temperature (Influences pathogen incubation rate)">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              {weather ? `${weather.temperature}°C` : '28°C'}
            </span>

            {/* Relative Humidity */}
            <span className="flex items-center gap-1 font-semibold text-white" title="Current Relative Humidity (Crucial for fungal spore germination)">
              <CloudRain className="w-3.5 h-3.5 text-[#a0f399]" />
              <span className="text-[#a0f399] font-black">{weather ? `${weather.humidity}%` : '70%'}</span> {t.humidity}
            </span>

            {/* Soil Moisture */}
            <span className="hidden md:flex items-center gap-1 font-semibold text-teal-300">
              <Droplets className="w-3 h-3" />
              {weather ? `${weather.soilMoisture}%` : '35%'} {t.soilMoisture}
            </span>

            {/* Wind Speed */}
            <span className="hidden sm:flex items-center gap-1 font-semibold text-[#baeed9]">
              <Wind className="w-3 h-3 text-teal-300" />
              {weather ? `${weather.windSpeed} km/h` : '6 km/h'}
            </span>
          </div>

          {/* Dynamic Agricultural Spray Window & Live GPS Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsGpsModalOpen(true)}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
              title="Open Live GPS Tracking & Regional Precision view"
            >
              <Navigation className="w-3 h-3 text-[#a0f399]" />
              <span className="hidden xs:inline">{t.regionalPrecision}</span>
            </button>

            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
              weather?.sprayCondition === 'wind_alert' || weather?.sprayCondition === 'rain_alert'
                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                : weather?.sprayCondition === 'humidity_alert'
                  ? 'bg-[#ffdbcf] text-[#7d2800]'
                  : 'bg-[#a0f399] text-[#003629]'
            }`}>
              <Sparkles className="w-2.5 h-2.5" />
              {weather?.sprayConditionText || t.optimalSpray}
            </span>
          </div>
        </div>

        {/* Main App Bar Controls */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          {/* App Title & Branding */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1b4d3e] text-[#a0f399] flex items-center justify-center border border-[#a0f399]/40 shadow-inner flex-shrink-0">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                  FARM
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold bg-[#a0f399] text-[#003629]">
                  AI
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#8abda9] font-medium leading-none line-clamp-1">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Action Controls: Live GPS, AI Engine, Flutter Export (Clean icon or hidden on tiny screens), Language & Sunlight Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live GPS Quick Button */}
            <button
              onClick={() => setIsGpsModalOpen(true)}
              title="Live GPS Satellite Tracking"
              className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                isTrackingGps
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm animate-pulse'
                  : 'bg-[#1b4d3e] hover:bg-[#256653] text-[#a0f399] border-white/20'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>

            {/* AI Vision Engine Status */}
            {onOpenAiSetup && (
              <button
                onClick={onOpenAiSetup}
                title="Gemini AI Vision Engine & Audio Setup"
                className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#1b4d3e] hover:bg-[#256653] text-white text-xs font-bold border border-white/20 shadow-sm transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#a0f399] animate-pulse" />
                <Cpu className="w-3.5 h-3.5 text-[#a0f399]" />
                <span className="hidden md:inline">{t.aiEngine}</span>
              </button>
            )}

            {/* Flutter Code Button: compact icon button so it's not disturbing on mobile, with clean tooltip */}
            {onOpenFlutterExport && (
              <button
                onClick={onOpenFlutterExport}
                title={t.flutterCodeExplanation}
                className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#a0f399] text-xs font-bold border border-white/15 transition-all"
                aria-label="Flutter Offline APK Code"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px] text-white">Flutter Edge</span>
              </button>
            )}

            {/* Language Selector Dropdown with Indian Languages */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#1b4d3e] hover:bg-[#256653] text-white text-xs font-bold border border-white/20 shadow-sm"
                aria-label="Select Indian Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#a0f399]" />
                <span className="text-xs uppercase">{currentLang}</span>
                <ChevronDown className="w-2.5 h-2.5 text-[#8abda9]" />
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white text-[#161d19] rounded-2xl shadow-2xl border border-[#c0c9c3] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#707974] border-b border-[#dde4de]">
                      Language
                    </div>
                    {INDIAN_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          currentLang === lang.code
                            ? 'bg-[#eef5ef] text-[#1b6d24] font-bold'
                            : 'hover:bg-[#f4fbf4] text-[#161d19]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{lang.label}</span>
                          <span className="text-[10px] text-[#707974]">{lang.script}</span>
                        </div>
                        {currentLang === lang.code && (
                          <Check className="w-4 h-4 text-[#1b6d24]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* High sunlight contrast toggle */}
            <button
              onClick={onToggleHighContrast}
              title={highContrast ? t.standardContrast : t.highContrast}
              className={`p-2 rounded-lg border transition-all ${
                highContrast
                  ? 'bg-amber-400 text-black border-amber-300'
                  : 'bg-[#1b4d3e] text-white/90 border-white/20 hover:text-white hover:bg-[#256653]'
              }`}
              aria-label="Toggle outdoor sunlight mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Live GPS & Regional Precision Modal */}
      <LiveGpsPrecisionModal
        isOpen={isGpsModalOpen}
        onClose={() => setIsGpsModalOpen(false)}
        currentLang={currentLang}
        coords={liveCoords}
        address={regionalAddress}
        isTracking={isTrackingGps}
        onToggleTracking={toggleLiveTracking}
        onRefreshPrecision={handleDetectGPS}
        isLoading={isLoadingWeather}
      />
    </>
  );
};
