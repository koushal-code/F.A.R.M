import React from 'react';
import { 
  Navigation, 
  MapPin, 
  Crosshair, 
  Activity, 
  Compass, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  Mountain,
  Sparkles,
  Radio
} from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';
import { LiveGpsCoordinates, GeocodedRegionalAddress } from '../services/gpsService';

interface LiveGpsPrecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  coords: LiveGpsCoordinates | null;
  address: GeocodedRegionalAddress | null;
  isTracking: boolean;
  onToggleTracking: () => void;
  onRefreshPrecision: () => void;
  isLoading: boolean;
}

export const LiveGpsPrecisionModal: React.FC<LiveGpsPrecisionModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  coords,
  address,
  isTracking,
  onToggleTracking,
  onRefreshPrecision,
  isLoading
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[currentLang];

  const accuracyMeters = coords?.accuracy ? Math.round(coords.accuracy) : null;
  const accuracyColor = !accuracyMeters 
    ? 'text-[#707974]' 
    : accuracyMeters <= 10 
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
      : accuracyMeters <= 30 
        ? 'text-amber-600 bg-amber-50 border-amber-200' 
        : 'text-orange-600 bg-orange-50 border-orange-200';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#c0c9c3] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#003629] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#1b4d3e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1b4d3e] text-[#a0f399] flex items-center justify-center border border-[#a0f399]/40">
              <Navigation className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-white">
                  {t.liveGpsTitle}
                </h3>
                {isTracking && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#a0f399] text-[#003629]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#003629] animate-ping" />
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8abda9]">
                {t.regionalPrecision}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#baeed9] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Live GPS Coordinates Card */}
          <div className="bg-[#f4fbf4] rounded-2xl border border-[#c0c9c3] p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#404945] flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-[#1b6d24]" />
                GNSS Geolocation
              </span>
              {accuracyMeters !== null && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${accuracyColor}`}>
                  ±{accuracyMeters}m {t.liveGpsAccuracy}
                </span>
              )}
            </div>

            {coords ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-[#dde4de]">
                    <span className="block text-[10px] font-semibold text-[#707974]">LATITUDE</span>
                    <span className="font-mono text-sm sm:text-base font-extrabold text-[#003629]">
                      {coords.latitude.toFixed(6)}°
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#dde4de]">
                    <span className="block text-[10px] font-semibold text-[#707974]">LONGITUDE</span>
                    <span className="font-mono text-sm sm:text-base font-extrabold text-[#003629]">
                      {coords.longitude.toFixed(6)}°
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#707974] px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#1b6d24]" />
                    {coords.heading ? `${Math.round(coords.heading)}° Heading` : 'Field Stationary'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-[#1b6d24]" />
                    {new Date(coords.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <div className="w-8 h-8 rounded-full bg-[#e8f0e9] text-[#1b6d24] flex items-center justify-center mx-auto mb-2 animate-spin">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <p className="text-xs text-[#404945] font-semibold">
                  {t.detectingLocation}
                </p>
              </div>
            )}
          </div>

          {/* Regional Micro-Location Card */}
          {address && (
            <div className="bg-white rounded-2xl border border-[#c0c9c3] p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#003629]">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>{address.displayName}</span>
              </div>

              <div className="space-y-2 text-xs border-t border-[#dde4de] pt-3">
                {address.agroClimaticZone && (
                  <div className="flex items-start gap-2 bg-[#f4fbf4] p-2.5 rounded-xl border border-[#c0c9c3]/60">
                    <Layers className="w-4 h-4 text-[#1b6d24] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-black uppercase text-[#404945]">
                        {t.agroZone}
                      </span>
                      <span className="font-semibold text-[#003629]">
                        {address.agroClimaticZone}
                      </span>
                    </div>
                  </div>
                )}

                {address.soilZoneHint && (
                  <div className="flex items-start gap-2 bg-[#fbf8f2] p-2.5 rounded-xl border border-amber-200">
                    <Mountain className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-black uppercase text-amber-800">
                        {t.soilHint}
                      </span>
                      <span className="font-semibold text-[#404945]">
                        {address.soilZoneHint}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits Note for Agro Precision */}
          <div className="p-3 rounded-xl bg-[#eef5ef] border border-[#a0f399]/60 text-[11px] text-[#003629] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#1b6d24] flex-shrink-0 mt-0.5" />
            <p>
              Continuous GPS tracking binds each scanned specimen to micro-meteorological sensor data (humidity, temperature, rain risk) for higher pathological diagnosis accuracy and drift prevention.
            </p>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-[#f4fbf4] border-t border-[#dde4de] flex items-center gap-2.5">
          <button
            onClick={onToggleTracking}
            className={`flex-1 min-h-[46px] px-4 py-2.5 rounded-xl font-display text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${
              isTracking 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-[#003629] hover:bg-[#1b4d3e] text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-[#a0f399]" />
            {isTracking ? t.stopTracking : t.startLiveTracking}
          </button>

          <button
            onClick={onRefreshPrecision}
            disabled={isLoading}
            title="Refresh satellite fix"
            className="p-2.5 min-h-[46px] min-w-[46px] rounded-xl bg-white border border-[#c0c9c3] hover:bg-[#eef5ef] text-[#003629] flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
