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
  Cpu, 
  MapPin, 
  Droplets,
  CloudSun,
  Navigation,
  Crosshair,
  Activity,
  Layers,
  User as UserIcon,
  Cloud,
  LogOut,
  LogIn
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
import { FarmLogo } from './FarmLogo';

interface AndroidTopBarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenFlutterExport?: () => void;
  onOpenAiSetup?: () => void;
  user?: any | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
  isSyncing?: boolean;
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
  user,
  onSignIn,
  onSignOut,
  isSyncing,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
        <div className="bg-[#00261d] px-3 sm:px-4 py-1.5 text-[11px] font-medium border-b border-white/10 flex items-center justify-between gap-2 text-[#baeed9]">
          {/* Location & GPS Button */}
          <div className="relative flex items-center min-w-0">
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center gap-1 font-bold text-white hover:text-[#a0f399] transition-colors py-0.5 truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[260px]"
              title="Click to select or detect farm GPS location"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">
                {regionalAddress?.displayName || weather?.locationName || currentRegion.name[currentLang]}
              </span>
              <ChevronDown className="w-2.5 h-2.5 text-[#8abda9] flex-shrink-0" />
            </button>

            {isLocationMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLocationMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 w-64 bg-white text-[#161d19] rounded-2xl shadow-2xl border border-[#c0c9c3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
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

          {/* Environmental Metrics (Single Line on Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Live GPS status */}
            {isTrackingGps && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="hidden xs:inline">GPS Live</span>
              </span>
            )}

            {/* Temperature */}
            <span className="flex items-center gap-1 text-amber-400 font-extrabold text-xs" title="Current Temperature">
              <Sun className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{weather ? `${weather.temperature}°C` : '28°C'}</span>
            </span>

            {/* Humidity */}
            <span className="hidden xs:flex items-center gap-1 text-xs font-semibold text-white" title="Relative Humidity">
              <CloudRain className="w-3.5 h-3.5 text-[#a0f399] flex-shrink-0" />
              <span className="text-[#a0f399] font-bold">{weather ? `${weather.humidity}%` : '70%'}</span>
            </span>

            {/* Spray Window Status Badge */}
            <button
              onClick={() => setIsGpsModalOpen(true)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider transition-opacity hover:opacity-90 ${
                weather?.sprayCondition === 'wind_alert' || weather?.sprayCondition === 'rain_alert'
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : weather?.sprayCondition === 'humidity_alert'
                    ? 'bg-[#ffdbcf] text-[#7d2800]'
                    : 'bg-[#a0f399] text-[#003629]'
              }`}
              title="Click to view detailed agro-weather and GPS parameters"
            >
              <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate max-w-[85px] sm:max-w-none">{weather?.sprayConditionText || t.optimalSpray}</span>
            </button>
          </div>
        </div>

        {/* Main App Bar Controls */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2.5">
          {/* App Title & Branding */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center border border-[#a0f399]/60 shadow-xs flex-shrink-0 overflow-hidden p-0.5">
              <FarmLogo size={36} showWordmark={false} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display text-base sm:text-xl font-black tracking-tight text-white">
                  FARM
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-[#a0f399] text-[#003629]">
                  AI
                </span>
              </div>
              <p className="text-[10.5px] sm:text-xs text-[#a0f399] font-bold leading-tight mt-0.5 tracking-wide line-clamp-1 sm:line-clamp-none">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Action Controls: Live GPS, AI Engine, Language */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Live GPS Quick Button */}
            <button
              onClick={() => setIsGpsModalOpen(true)}
              title="Live GPS Satellite Tracking"
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-bold border transition-all ${
                isTrackingGps
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm animate-pulse'
                  : 'bg-[#1b4d3e] hover:bg-[#256653] text-[#a0f399] border-white/20'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* AI Vision Engine Status (visible on tablet/desktop, streamlined on mobile) */}
            {onOpenAiSetup && (
              <button
                onClick={onOpenAiSetup}
                title="Gemini AI Vision Engine & Audio Setup"
                className="hidden md:flex h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#1b4d3e] hover:bg-[#256653] text-white text-xs font-bold border border-white/20 shadow-xs items-center gap-1.5 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#a0f399] animate-pulse flex-shrink-0" />
                <Cpu className="w-4 h-4 text-[#a0f399]" />
                <span className="font-semibold">{t.aiEngine}</span>
              </button>
            )}

            {/* Language Selector Dropdown with Indian Languages */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="h-8 sm:h-10 px-2 sm:px-3 rounded-xl bg-[#1b4d3e] hover:bg-[#256653] text-white text-xs font-bold border border-white/20 shadow-xs flex items-center gap-1 sm:gap-1.5 transition-all"
                aria-label="Select Indian Language"
              >
                <Globe className="w-4 h-4 text-[#a0f399]" />
                <span className="text-xs uppercase font-extrabold">{currentLang}</span>
                <ChevronDown className="w-2.5 h-2.5 text-[#8abda9]" />
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white text-[#161d19] rounded-2xl shadow-2xl border border-[#c0c9c3] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
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

            {/* Firebase Account & Cloud Sync */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  title={`${user.displayName || 'Farmer'} (Firestore Synced)`}
                  className="h-9 sm:h-10 px-2 sm:px-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#256653] text-white text-xs font-bold border border-[#a0f399]/40 shadow-xs flex items-center gap-1.5 transition-all"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Farmer'}
                      className="w-5 h-5 rounded-full object-cover border border-[#a0f399]"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#a0f399] text-[#003629] flex items-center justify-center text-[10px] font-black">
                      {(user.displayName || user.email || 'F')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Cloud className={`w-3.5 h-3.5 text-[#a0f399] ${isSyncing ? 'animate-bounce' : ''}`} />
                    <ChevronDown className="w-2.5 h-2.5 text-[#8abda9]" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={onSignIn}
                  title="Sign in with Google to sync scans to Firebase"
                  className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#a0f399] hover:bg-[#b2f7ab] text-[#003629] text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline font-extrabold">Sign In</span>
                </button>
              )}

              {isUserMenuOpen && user && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white text-[#161d19] rounded-2xl shadow-2xl border border-[#c0c9c3] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#dde4de]">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'Farmer'}
                          className="w-9 h-9 rounded-full object-cover border border-[#c0c9c3]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1b4d3e] text-[#a0f399] flex items-center justify-center text-sm font-black">
                          {(user.displayName || user.email || 'F')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate text-[#161d19]">
                          {user.displayName || 'Farmer'}
                        </div>
                        <div className="text-[10px] text-[#707974] truncate">
                          {user.email || 'Signed In'}
                        </div>
                      </div>
                    </div>

                    <div className="py-2 text-[11px] text-[#1b6d24] flex items-center gap-1.5 font-semibold">
                      <Cloud className="w-3.5 h-3.5 text-[#1b6d24]" />
                      <span>Firebase Cloud Database Active</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut?.();
                      }}
                      className="w-full mt-1 px-3 py-2 text-left text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Full Title Banner: Guarantees full legibility of Farmer's Advisory & Resource Module on all mobile devices */}
        <div className="sm:hidden bg-[#00261d] px-3 py-1.5 border-t border-white/10 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a0f399] flex-shrink-0 animate-pulse" />
            <span className="text-[11px] font-extrabold text-[#baeed9] tracking-wide leading-none truncate">
              {t.tagline}
            </span>
          </div>
          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-[#1b4d3e] text-[#a0f399] border border-[#a0f399]/40 flex-shrink-0">
            FARM AI
          </span>
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
