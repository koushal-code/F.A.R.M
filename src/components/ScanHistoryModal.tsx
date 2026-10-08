import React from 'react';
import { X, History, Trash2, ArrowRight, Calendar, AlertTriangle } from 'lucide-react';
import { HistoryItem, SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  currentLang: SupportedLanguage;
}

export const ScanHistoryModal: React.FC<ScanHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#c0c9c3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#003629] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#a0f399]" />
            <div>
              <h3 className="font-display text-base font-bold">
                {t.recentScans}
              </h3>
              <p className="text-xs text-[#8abda9]">
                Compare previous disease records and recovery progress
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-12 text-[#707974]">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#003629]" />
              <p className="text-sm font-medium">{t.noScans}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHistory(item)}
                  className="p-3.5 rounded-xl border border-[#dde4de] hover:border-[#1b6d24] hover:bg-[#f4fbf4] cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.cropName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-[#c0c9c3]"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#003629] truncate">
                          {item.cropName}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          item.severityLevel === 'Critical' 
                            ? 'bg-[#ffdad6] text-[#ba1a1a]' 
                            : 'bg-[#ffdbcf] text-[#7d2800]'
                        }`}>
                          {item.severityLevel}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#161d19] truncate">
                        {item.diagnosisName}
                      </p>
                      <span className="text-[10px] text-[#707974] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString()} • Health: {item.healthScore}/100
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#707974] group-hover:text-[#1b6d24] transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f4fbf4] border-t border-[#c0c9c3] flex items-center justify-between">
          {history.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs font-bold text-[#ba1a1a] hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.clearHistory}
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#003629] text-white text-xs font-bold hover:bg-[#1b4d3e] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
