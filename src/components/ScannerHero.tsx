import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, Upload, Scan, CheckCircle2, ChevronRight, HelpCircle, Mic, Sparkles, Image as ImageIcon,
  AlertTriangle, CloudRain, Droplets, Wind, Sun, MapPin, RefreshCw, ShieldAlert, ShieldCheck,
  ChevronDown, ChevronUp, AlertCircle, Compass
} from 'lucide-react';
import { CropSample, SupportedLanguage, FarmerProfile } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';
import { VoiceTranscriberModal } from './VoiceTranscriberModal';
import { QuickFarmingTips } from './QuickFarmingTips';
import { fetchLiveWeather, RealtimeWeather, REGION_PRESETS } from '../services/weatherService';
import { reverseGeocodeCoords } from '../services/gpsService';

interface ScannerHeroProps {
  currentLang: SupportedLanguage;
  highContrast: boolean;
  samples: CropSample[];
  selectedSample: CropSample | null;
  onSelectSample: (sample: CropSample) => void;
  onCustomImageSelected: (base64: string, file: File) => void;
  onStartDiagnosis: (cropHint: string, notes: string) => void;
  isAnalyzing: boolean;
  previewImage: string | null;
  farmerProfile?: FarmerProfile | null;
  onOpenProfileModal?: () => void;
}

// Client-side image compressor for high-speed, reliable field uploads
function resizeImageFile(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const SEVERITY_LOCALIZED: Record<SupportedLanguage, Record<string, string>> = {
  en: { Healthy: 'Healthy', Moderate: 'Moderate', Critical: 'Critical', High: 'High' },
  hi: { Healthy: 'स्वस्थ', Moderate: 'मध्यम', Critical: 'गंभीर', High: 'उच्च' },
  te: { Healthy: 'ఆరోగ్యకరమైనది', Moderate: 'మితమైన', Critical: 'తీవ్రమైన', High: 'ఎక్కువ' },
  kn: { Healthy: 'ಆರೋಗ್ಯಕರ', Moderate: 'ಮಧ್ಯಮ', Critical: 'ತೀವ್ರ', High: 'ಹೆಚ್ಚು' },
  ta: { Healthy: 'ஆரோக்கியமானது', Moderate: 'மிதமான', Critical: 'தீவிரமானது', High: 'அதிகம்' },
  gu: { Healthy: 'તંદુરસ્ત', Moderate: 'મધ્યમ', Critical: 'ગંભીર', High: 'વધુ' }
};

export const ScannerHero: React.FC<ScannerHeroProps> = ({
  currentLang,
  highContrast,
  samples,
  selectedSample,
  onSelectSample,
  onCustomImageSelected,
  onStartDiagnosis,
  isAnalyzing,
  previewImage,
  farmerProfile,
  onOpenProfileModal,
}) => {
  const t = TRANSLATIONS[currentLang];
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropHint, setCropHint] = useState<string>('');
  const [fieldNotes, setFieldNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [voiceTarget, setVoiceTarget] = useState<'cropHint' | 'notes'>('notes');

  // Weather & Agronomic Warning State
  const [weather, setWeather] = useState<RealtimeWeather | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number }>({ lat: 17.3850, lon: 78.4867 });
  const [locationLabel, setLocationLabel] = useState<string>('Hyderabad (Telangana)');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('gps');
  const [simulateMode, setSimulateMode] = useState<'none' | 'humidity' | 'rain' | 'wind'>('none');
  const [isWarningExpanded, setIsWarningExpanded] = useState<boolean>(true);

  // Load weather data
  const loadWeatherData = async (
    lat: number,
    lon: number,
    label: string,
    simMode: 'none' | 'humidity' | 'rain' | 'wind' = simulateMode
  ) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const modeToPass = simMode === 'none' ? undefined : simMode;
      const data = await fetchLiveWeather(lat, lon, label, currentLang, modeToPass);
      setWeather(data);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setWeatherError('Unable to load real-time meteorological data.');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Detect GPS geolocation using browser API
  const handleDetectGps = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setWeatherError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGps(true);
    setSelectedRegionId('gps');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ lat: latitude, lon: longitude });
        let resolvedName = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
        try {
          const addr = await reverseGeocodeCoords(latitude, longitude);
          if (addr?.displayName) {
            resolvedName = addr.district 
              ? `${addr.district}, ${addr.state || ''}`.trim()
              : addr.displayName;
          }
        } catch (_e) {
          // ignore
        }
        setLocationLabel(resolvedName);
        await loadWeatherData(latitude, longitude, resolvedName, simulateMode);
        setIsLocatingGps(false);
      },
      async (err) => {
        console.warn('Geolocation permission/access warning:', err.message);
        // Fallback to default or farmer profile location
        const fallbackLat = 17.3850;
        const fallbackLon = 78.4867;
        const fallbackLabel = farmerProfile?.district 
          ? `${farmerProfile.district}, ${farmerProfile.state || ''}`
          : 'Hyderabad (Telangana)';
        setCurrentCoords({ lat: fallbackLat, lon: fallbackLon });
        setLocationLabel(fallbackLabel);
        await loadWeatherData(fallbackLat, fallbackLon, fallbackLabel, simulateMode);
        setIsLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Region preset change
  const handlePresetChange = (presetId: string) => {
    setSelectedRegionId(presetId);
    if (presetId === 'gps') {
      handleDetectGps();
      return;
    }

    const preset = REGION_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const label = preset.name[currentLang] || preset.name.en;
      setCurrentCoords({ lat: preset.lat, lon: preset.lon });
      setLocationLabel(label);
      loadWeatherData(preset.lat, preset.lon, label, simulateMode);
    }
  };

  // Simulation mode change (allows testing high humidity or rain warnings on demand)
  const handleSimulationChange = (mode: 'none' | 'humidity' | 'rain' | 'wind') => {
    setSimulateMode(mode);
    loadWeatherData(currentCoords.lat, currentCoords.lon, locationLabel, mode);
  };

  // Initial load on mount or language change
  useEffect(() => {
    // If we're already on a preset, reload with current language label
    if (selectedRegionId !== 'gps') {
      const preset = REGION_PRESETS.find((p) => p.id === selectedRegionId);
      if (preset) {
        const label = preset.name[currentLang] || preset.name.en;
        loadWeatherData(preset.lat, preset.lon, label, simulateMode);
        return;
      }
    }

    // Try GPS detection first on startup
    handleDetectGps();
  }, [currentLang]);

  const handleProcessFile = async (file: File) => {
    try {
      const optimizedBase64 = await resizeImageFile(file);
      onCustomImageSelected(optimizedBase64, file);
    } catch (_err) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onCustomImageSelected(reader.result, file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleProcessFile(file);
    }
  };

  return (
    <section className="w-full space-y-4">
      {/* Personalized Farmer Field & Region Hub Banner */}
      {farmerProfile && (
        <div className="bg-gradient-to-r from-[#003629] via-[#004838] to-[#1b4d3e] text-white p-3.5 sm:p-4 rounded-2xl border border-[#a0f399]/40 shadow-sm flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#a0f399] text-[#003629] flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0">
              {farmerProfile.name ? farmerProfile.name.charAt(0).toUpperCase() : 'K'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-black text-sm sm:text-base text-white truncate">
                  {farmerProfile.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#a0f399] text-[#003629] text-[10px] font-extrabold flex-shrink-0">
                  {farmerProfile.district}, {farmerProfile.state}
                </span>
              </div>
              <p className="text-[11px] text-[#baeed9] font-medium truncate mt-0.5">
                {farmerProfile.landSizeAcres} Acres • {farmerProfile.soilType.split('(')[0].trim()} • {farmerProfile.agroClimaticZone.split('(')[0].trim()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            {farmerProfile.primaryCrops.length > 0 && !cropHint && (
              <button
                type="button"
                onClick={() => {
                  const firstCrop = farmerProfile.primaryCrops[0].split('(')[0].trim();
                  setCropHint(firstCrop);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold border border-white/20 transition-all flex items-center gap-1 active:scale-95"
                title="Auto-fill your registered primary crop into diagnosis"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#a0f399]" />
                <span>Auto-fill {farmerProfile.primaryCrops[0].split('(')[0].trim()}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="px-2.5 py-1.5 rounded-xl bg-[#a0f399] hover:bg-[#8ee587] text-[#003629] text-[11px] font-extrabold transition-all active:scale-95 shadow-xs"
            >
              Farm Settings
            </button>
          </div>
        </div>
      )}

      {/* Weather Warning & Agronomic Disease Risk Monitor */}
      <div className={`rounded-2xl border transition-all overflow-hidden shadow-sm ${
        highContrast
          ? 'bg-[#002117] border-white/40 text-white'
          : weather?.diseaseWarning?.hasWarning
            ? weather.diseaseWarning.severity === 'critical'
              ? 'bg-[#fff5f5] border-red-300 text-[#3b0a0a]'
              : weather.diseaseWarning.warningType === 'heavy_rain'
                ? 'bg-[#f0f7ff] border-blue-300 text-[#0c284d]'
                : weather.diseaseWarning.warningType === 'high_humidity'
                  ? 'bg-[#fffbf0] border-amber-300 text-[#422900]'
                  : 'bg-[#f0faf7] border-teal-300 text-[#063327]'
            : 'bg-white border-[#c0c9c3] text-[#161d19]'
      }`}>
        {/* Top Header Bar */}
        <div className={`p-3.5 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          weather?.diseaseWarning?.hasWarning
            ? weather.diseaseWarning.severity === 'critical'
              ? 'bg-red-500/10 border-red-200'
              : weather.diseaseWarning.warningType === 'heavy_rain'
                ? 'bg-blue-500/10 border-blue-200'
                : weather.diseaseWarning.warningType === 'high_humidity'
                  ? 'bg-amber-500/10 border-amber-200'
                  : 'bg-teal-500/10 border-teal-200'
            : 'bg-[#e8f0e9]/50 border-[#dde4de]'
        }`}>
          {/* Left: Status Badge & Title */}
          <div className="flex items-center gap-2.5 flex-wrap min-w-0">
            {weather?.diseaseWarning?.hasWarning ? (
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                weather.diseaseWarning.severity === 'critical'
                  ? 'bg-red-600 text-white animate-pulse'
                  : weather.diseaseWarning.warningType === 'heavy_rain'
                    ? 'bg-blue-600 text-white'
                    : weather.diseaseWarning.warningType === 'high_humidity'
                      ? 'bg-amber-600 text-white'
                      : 'bg-teal-600 text-white'
              }`}>
                {weather.diseaseWarning.warningType === 'heavy_rain' ? (
                  <CloudRain className="w-4 h-4 stroke-[2.5]" />
                ) : weather.diseaseWarning.warningType === 'high_humidity' ? (
                  <Droplets className="w-4 h-4 stroke-[2.5]" />
                ) : weather.diseaseWarning.warningType === 'high_wind' ? (
                  <Wind className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                )}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#1b6d24] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  weather?.diseaseWarning?.hasWarning
                    ? weather.diseaseWarning.severity === 'critical'
                      ? 'bg-red-600 text-white'
                      : weather.diseaseWarning.warningType === 'heavy_rain'
                        ? 'bg-blue-700 text-white'
                        : weather.diseaseWarning.warningType === 'high_humidity'
                          ? 'bg-amber-600 text-white'
                          : 'bg-teal-700 text-white'
                    : 'bg-[#1b6d24] text-white'
                }`}>
                  {weather?.diseaseWarning?.badgeLabel || 'Weather & Disease Risk Monitor'}
                </span>

                <span className="text-[10px] text-[#56605b] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {weather?.source || 'OpenWeatherMap'}
                </span>
              </div>

              <h4 className="font-display text-xs sm:text-sm font-bold mt-0.5 flex items-center gap-1.5">
                {weather?.diseaseWarning?.headline || 'Real-time Meteorological Health Intelligence'}
              </h4>
            </div>
          </div>

          {/* Right: GPS Location & Region Controls */}
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            {/* Location selector dropdown */}
            <div className="relative">
              <select
                value={selectedRegionId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="text-[11px] font-bold py-1.5 pl-2.5 pr-6 rounded-xl border border-[#c0c9c3] bg-white text-[#003629] focus:outline-none focus:border-[#1b6d24] appearance-none cursor-pointer shadow-2xs"
              >
                <option value="gps">📍 {isLocatingGps ? 'Locating GPS...' : `GPS: ${locationLabel.slice(0, 16)}...`}</option>
                {REGION_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name[currentLang] || p.name.en}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#707974] absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Modern Google Maps Location Button */}
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isLocatingGps || isLoadingWeather}
              title="Detect live GPS coordinates and local weather via Google Maps Location"
              className="group relative p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white hover:bg-[#f8fafd] text-[#3c4043] hover:text-[#1a73e8] border border-[#dadce0] hover:border-[#4285f4] text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs hover:shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {/* Google Maps Location Icon */}
              <div className="relative flex items-center justify-center w-4 h-4 flex-shrink-0">
                {isLocatingGps || isLoadingWeather ? (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#1a73e8] border-t-transparent animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Google Maps Pin Body */}
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                      fill="#EA4335"
                    />
                    {/* Left slice - Google Blue */}
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 11.23 6.27 14.15 8.23 17.22L12 9V2Z"
                      fill="#4285F4"
                    />
                    {/* Right slice - Google Yellow */}
                    <path
                      d="M12 2V9L15.77 17.22C17.73 14.15 19 11.23 19 9C19 5.13 15.87 2 12 2Z"
                      fill="#FBBC04"
                    />
                    {/* Bottom fold - Google Green */}
                    <path
                      d="M12 22C12 22 8.23 17.22 8.23 17.22L12 12L15.77 17.22C15.77 17.22 12 22 12 22Z"
                      fill="#34A853"
                    />
                    {/* Center white circle with Google blue locator dot */}
                    <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
                    <circle cx="12" cy="9" r="1.6" fill="#1A73E8" />
                  </svg>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {isLocatingGps ? 'Locating...' : 'Locate'}
              </span>
            </button>

            {/* Toggle collapse/expand */}
            <button
              type="button"
              onClick={() => setIsWarningExpanded(!isWarningExpanded)}
              className="p-1.5 rounded-xl text-[#707974] hover:bg-black/5 transition-colors"
              aria-label="Toggle details"
            >
              {isWarningExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Weather Metrics & Risk Details Body */}
        {isWarningExpanded && (
          <div className="p-3.5 sm:p-5 space-y-4">
            {/* Live Weather Parameter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {/* Temperature */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-white to-amber-50/40 border border-amber-200/70 shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs">
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] text-[#56605b] font-bold uppercase tracking-wider">
                    Temperature
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="font-display text-base sm:text-lg font-black text-[#161d19]">
                    {weather ? `${weather.temperature}°C` : '--'}
                  </span>
                  <span className="text-[10px] text-[#707974] font-medium">
                    {weather ? `Feels ${weather.apparentTemperature}°` : ''}
                  </span>
                </div>
              </div>

              {/* Humidity with Alert Highlight */}
              <div className={`p-2.5 sm:p-3 rounded-xl border shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs ${
                (weather?.humidity ?? 0) >= 80
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 ring-1 ring-amber-400/50'
                  : 'bg-gradient-to-br from-white to-blue-50/30 border-blue-200/70'
              }`}>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] text-[#56605b] font-bold uppercase tracking-wider">
                    Humidity
                  </span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    (weather?.humidity ?? 0) >= 80
                      ? 'bg-amber-500 text-white font-bold animate-pulse'
                      : 'bg-blue-100/80 text-blue-700'
                  }`}>
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className={`font-display text-base sm:text-lg font-black ${
                    (weather?.humidity ?? 0) >= 80 ? 'text-amber-950 font-black' : 'text-[#161d19]'
                  }`}>
                    {weather ? `${weather.humidity}%` : '--'}
                  </span>
                  {(weather?.humidity ?? 0) >= 80 ? (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      Spore Alert
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Normal
                    </span>
                  )}
                </div>
              </div>

              {/* Precipitation / Rain with Alert Highlight */}
              <div className={`p-2.5 sm:p-3 rounded-xl border shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs ${
                (weather?.rainAmount ?? 0) > 0 || weather?.conditionText.toLowerCase().includes('rain')
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 ring-1 ring-blue-400/50'
                  : 'bg-gradient-to-br from-white to-emerald-50/30 border-emerald-200/70'
              }`}>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] text-[#56605b] font-bold uppercase tracking-wider">
                    Rainfall
                  </span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    (weather?.rainAmount ?? 0) > 0 || weather?.conditionText.toLowerCase().includes('rain')
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-emerald-100/80 text-emerald-700'
                  }`}>
                    <CloudRain className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className={`font-display text-base sm:text-lg font-black truncate ${
                    (weather?.rainAmount ?? 0) > 0 || weather?.conditionText.toLowerCase().includes('rain')
                      ? 'text-blue-950'
                      : 'text-[#161d19]'
                  }`}>
                    {weather?.rainAmount && weather.rainAmount > 0 
                      ? `${weather.rainAmount} mm` 
                      : (weather?.conditionText.toLowerCase().includes('rain') ? 'Raining' : '0.0 mm')}
                  </span>
                  {(weather?.rainAmount ?? 0) > 0 || weather?.conditionText.toLowerCase().includes('rain') ? (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-200 text-blue-900">
                      Washout
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Dry Leaf
                    </span>
                  )}
                </div>
              </div>

              {/* Wind Speed */}
              <div className={`p-2.5 sm:p-3 rounded-xl border shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs ${
                (weather?.windSpeed ?? 0) > 15
                  ? 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-300 ring-1 ring-teal-400/50'
                  : 'bg-gradient-to-br from-white to-teal-50/30 border-teal-200/70'
              }`}>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] text-[#56605b] font-bold uppercase tracking-wider">
                    Wind Speed
                  </span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    (weather?.windSpeed ?? 0) > 15
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-teal-100/80 text-teal-700'
                  }`}>
                    <Wind className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="font-display text-base sm:text-lg font-black text-[#161d19]">
                    {weather ? `${weather.windSpeed}` : '--'}<span className="text-xs font-bold text-[#707974] ml-0.5">km/h</span>
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    (weather?.windSpeed ?? 0) > 15
                      ? 'bg-teal-200 text-teal-900'
                      : 'text-emerald-700 bg-emerald-50'
                  }`}>
                    {(weather?.windSpeed ?? 0) > 15 ? 'Drift Alert' : 'Calm'}
                  </span>
                </div>
              </div>
            </div>

            {/* Weather Warning Agronomic Advisory Card (Active when risk detected) */}
            {weather?.diseaseWarning?.hasWarning ? (
              <div className="p-2.5 sm:p-3 rounded-lg bg-white/95 border border-current/20 space-y-2 shadow-2xs">
                {/* Summary narrative */}
                <p className="text-[11px] sm:text-xs font-medium leading-relaxed">
                  {weather.diseaseWarning.summary}
                </p>

                {/* Pathogen Threat Badges */}
                {weather.diseaseWarning.pathogenThreats?.length > 0 && (
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#707974] block mb-1">
                      ⚠️ High-Risk Foliar Pathogens Under Current Conditions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {weather.diseaseWarning.pathogenThreats.map((threat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/5 border border-black/10 text-current flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {threat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Immediate Action Steps */}
                {weather.diseaseWarning.actionSteps?.length > 0 && (
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#707974] block mb-1">
                      📋 Critical Farm Management Directives:
                    </span>
                    <ul className="space-y-1 text-[11px]">
                      {weather.diseaseWarning.actionSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-black/10 text-current text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium leading-tight">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Spray Protocol Banner */}
                <div className={`p-1.5 sm:p-2 rounded-lg text-[11px] font-bold flex items-center justify-between gap-2 ${
                  weather.diseaseWarning.sprayRecommendation === 'danger_washoff' || weather.diseaseWarning.sprayRecommendation === 'hold_spray'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{weather.diseaseWarning.sprayAdviceText}</span>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/20 uppercase font-black flex-shrink-0">
                    Spray Protocol
                  </span>
                </div>
              </div>
            ) : (
              /* Favorable Weather Reassurance */
              <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-[#003629] flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1b6d24] flex-shrink-0" />
                  <span className="font-semibold truncate">
                    {weather?.diseaseWarning?.summary || 'Current microclimate presents standard baseline disease incubation. Favorable conditions for normal scouting.'}
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#a0f399] text-[#003629] text-[9px] font-extrabold flex-shrink-0">
                  {weather?.sprayConditionText || 'Optimal Spray'}
                </span>
              </div>
            )}

            {/* Quick Testing & Simulation Controls (for verifying warnings) */}
            <div className="pt-2.5 border-t border-[#c0c9c3]/30 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
              {/* Left side: Station location chip */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-[#e8f0e9] text-[#1b6d24] flex items-center justify-center flex-shrink-0 border border-[#a0f399]/60 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                  <span className="font-display font-bold text-xs text-[#003629] truncate">
                    {locationLabel}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#e8f0e9]/80 text-[#1b4d3e] border border-[#c0c9c3]/40">
                    {currentCoords.lat.toFixed(2)}°N, {currentCoords.lon.toFixed(2)}°E
                  </span>
                </div>
              </div>

              {/* Right side: Segmented Simulation Control Switch */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#707974] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#1b6d24]" />
                  Simulate Risk:
                </span>
                <div className="inline-flex items-center p-0.5 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3]/60 shadow-2xs gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleSimulationChange('none')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      simulateMode === 'none'
                        ? 'bg-[#003629] text-white shadow-xs'
                        : 'text-[#404945] hover:text-[#003629] hover:bg-white/80'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${simulateMode === 'none' ? 'bg-[#a0f399]' : 'bg-[#1b6d24]'}`} />
                    Live GPS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulationChange('humidity')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      simulateMode === 'humidity'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-amber-900 hover:bg-amber-100/70'
                    }`}
                    title="Simulate 91% High Humidity Fungal Alert"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    91% Humidity
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulationChange('rain')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      simulateMode === 'rain'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-blue-900 hover:bg-blue-100/70'
                    }`}
                    title="Simulate Heavy Monsoon Rain Washout Alert"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                    Heavy Rain
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulationChange('wind')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      simulateMode === 'wind'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-teal-900 hover:bg-teal-100/70'
                    }`}
                    title="Simulate High Wind Drift Alert"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                    High Wind
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Left Side: Upload & Camera Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 transition-all p-3.5 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] sm:min-h-[360px] ${
              isDragOver 
                ? 'border-[#1b6d24] bg-[#eef5ef]' 
                : highContrast
                  ? 'border-white/40 bg-[#001710]'
                  : 'border-dashed border-[#707974]/40 bg-white shadow-sm'
            }`}
          >
            {/* Hidden native inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewImage ? (
              <div className="w-full flex flex-col items-center">
                {/* Image Inspection viewport */}
                <div className="relative w-full max-h-[320px] rounded-xl overflow-hidden bg-black/5 flex items-center justify-center border border-[#c0c9c3]">
                  <img
                    src={previewImage}
                    alt="Inspected crop leaf specimen"
                    className="max-h-[320px] w-full object-contain"
                  />

                  {/* Scanning HUD Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-[#003629]/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white px-4">
                      <div className="w-full absolute top-0 h-1 bg-gradient-to-r from-transparent via-[#a0f399] to-transparent animate-pulse" />
                      <div className="w-14 h-14 rounded-full border-4 border-[#a0f399] border-t-transparent animate-spin mb-3" />
                      <p className="font-display text-base sm:text-lg font-bold tracking-wide text-center">
                        {t.analyzingLeaf}
                      </p>
                      <p className="text-xs text-[#a0f399] max-w-xs text-center mt-1">
                        {t.analyzingSub}
                      </p>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#003629]/85 text-[#a0f399] text-[11px] font-bold backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a0f399]" />
                    {t.specimenReady}
                  </div>
                </div>

                {/* Retake & Change Controls */}
                <div className="flex items-center gap-2 sm:gap-3 mt-3 w-full">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="flex-1 min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl bg-white border border-[#707974] text-[#003629] hover:bg-[#eef5ef] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    {t.retakePhoto}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="flex-1 min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl bg-white border border-[#707974] text-[#003629] hover:bg-[#eef5ef] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    {t.changeFile}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center text-center py-4 sm:py-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#e8f0e9] text-[#1b6d24] flex items-center justify-center mb-3">
                  <Scan className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#161d19] mb-1">
                  {t.captureOrUpload}
                </h3>
                <p className="text-xs text-[#56605b] max-w-sm mb-5 px-2">
                  {t.captureGuide}
                </p>

                {/* Responsive Touch-Friendly Camera & Upload Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="min-h-[50px] px-4 py-3 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <Camera className="w-5 h-5 text-[#a0f399]" />
                    {t.takePhoto}
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[50px] px-4 py-3 rounded-xl bg-[#eef5ef] text-[#003629] border border-[#a0f399] hover:bg-[#e0ede2] font-display text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <Upload className="w-5 h-5 text-[#1b6d24]" />
                    {t.uploadLeaf}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Optional Crop & Voice Notes Input */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#c0c9c3] shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#404945]">
                    {t.cropTypeOptional}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceTarget('cropHint');
                      setIsVoiceModalOpen(true);
                    }}
                    title="Speak crop type"
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1b6d24] hover:text-[#165a1e] px-1.5 py-0.5 rounded hover:bg-[#eef5ef] transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#1b6d24]" />
                    <span>{t.micRecord}</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={t.cropHintPlaceholder || 'e.g. Tomato, Paddy, Cotton'}
                  value={cropHint}
                  onChange={(e) => setCropHint(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#404945]">
                    {t.fieldNotesOptional}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceTarget('notes');
                      setIsVoiceModalOpen(true);
                    }}
                    title="Speak field notes"
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1b6d24] hover:text-[#165a1e] px-2 py-1 rounded-lg hover:bg-[#eef5ef] active:bg-[#e0ede2] transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#1b6d24]" />
                    <span>{t.micRecord}</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={t.fieldNotesPlaceholder || 'e.g. Yellowing spots, curled margins'}
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
                />
              </div>
            </div>

            {/* Run Diagnosis Action Button */}
            {previewImage && (
              <button
                onClick={() => onStartDiagnosis(cropHint, fieldNotes)}
                disabled={isAnalyzing}
                className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#1b6d24] hover:bg-[#165a1e] text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Scan className="w-5 h-5 text-[#a0f399]" />
                <span>{isAnalyzing ? t.analyzingLeaf : t.runDiagnosis}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Quick-Test Demo Samples Library */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-[#c0c9c3] p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-[#161d19] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1b6d24]" />
                  {t.instantDemoSamples}
                </h3>
                <p className="text-[11px] text-[#56605b]">
                  {t.tapToTest}
                </p>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#e8f0e9] text-[#1b4d3e]">
                {samples.length} {t.readyStatus || 'Ready'}
              </span>
            </div>

            {/* Grid layout on mobile for cleaner browsing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[480px] overflow-y-auto pr-0.5">
              {samples.map((sample) => {
                const isSelected = selectedSample?.id === sample.id;
                const isHealthy = sample.category === 'Healthy';
                const isFarmerCrop = farmerProfile?.primaryCrops.some(c => 
                  c.toLowerCase().includes(sample.cropName.toLowerCase()) || 
                  sample.cropName.toLowerCase().includes(c.split('(')[0].trim().toLowerCase())
                );

                return (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    disabled={isAnalyzing}
                    className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#1b6d24] bg-[#eef5ef] ring-2 ring-[#a0f399]'
                        : isFarmerCrop
                          ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50'
                          : 'border-[#dde4de] hover:border-[#1b4d3e] hover:bg-[#f4fbf4]'
                    }`}
                  >
                    <img
                      src={sample.thumbnail}
                      alt={sample.leafIssue}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0 border border-[#c0c9c3]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold text-[#003629] truncate">
                            {sample.cropName}
                          </span>
                          {isFarmerCrop && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex-shrink-0">
                              Your Crop
                            </span>
                          )}
                        </div>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                          isHealthy
                            ? 'bg-[#a0f399] text-[#003629]'
                            : sample.severity === 'Critical'
                              ? 'bg-[#ffdad6] text-[#ba1a1a]'
                              : 'bg-[#ffdbcf] text-[#7d2800]'
                        }`}>
                          {SEVERITY_LOCALIZED[currentLang]?.[sample.severity] || sample.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#404945] truncate font-medium">
                        {sample.leafIssue}
                      </p>
                      <p className="text-[10px] text-[#707974] line-clamp-1 italic">
                        {sample.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#dde4de] text-[11px] text-[#404945] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#1b6d24] flex-shrink-0" />
              <span>{t.worksOffline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Farming Tips with Offline Caching */}
      <QuickFarmingTips currentLang={currentLang} />

      {/* Audio speech-to-text transcription modal */}
      <VoiceTranscriberModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLang={currentLang}
        targetField={voiceTarget}
        onTranscriptionComplete={(text) => {
          if (voiceTarget === 'cropHint') {
            setCropHint((prev) => (prev ? `${prev}, ${text}` : text));
          } else {
            setFieldNotes((prev) => (prev ? `${prev} ${text}` : text));
          }
        }}
      />
    </section>
  );
};
