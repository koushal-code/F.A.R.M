import React from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { HistoryItem, SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';

interface HistoryPageProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  currentLang: SupportedLanguage;
  onStartNewScan: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  currentLang,
  onStartNewScan,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#1b4d3e] text-white p-6 rounded-2xl border border-[#003629] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a0f399] text-[#003629] text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            {t.navHistory}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-1">
            {t.fieldLogTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#baeed9]">
            {t.fieldLogSubtitle}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#ba1a1a] text-white text-xs font-bold border border-white/20 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.clearHistory}
          </button>
        )}
      </div>

      {/* History List or Empty State */}
      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#c0c9c3] p-12 text-center max-w-md mx-auto shadow-sm">
          <History className="w-12 h-12 mx-auto text-[#707974] opacity-30 mb-3" />
          <h3 className="font-display text-base font-bold text-[#161d19] mb-1">
            {t.noScans}
          </h3>
          <p className="text-xs text-[#707974] mb-6">
            {t.noActiveDiagnosisDesc}
          </p>
          <button
            onClick={onStartNewScan}
            className="px-5 py-2.5 rounded-xl bg-[#003629] text-white text-xs font-bold hover:bg-[#1b4d3e] transition-colors"
          >
            {t.startFirstScan}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => {
            const isCritical = item.severityLevel === 'Critical';

            return (
              <div
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className="bg-white p-4 rounded-2xl border border-[#dde4de] hover:border-[#1b6d24] transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-start gap-3 mb-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.cropName}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-[#c0c9c3]"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-[#003629] truncate">
                        {item.cropName}
                      </span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        isCritical ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#ffdbcf] text-[#7d2800]'
                      }`}>
                        {item.severityLevel}
                      </span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-[#161d19] truncate">
                      {item.diagnosisName}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-[#707974] mt-1">
                      <span>{t.healthMeter}: {item.healthScore}/100</span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#dde4de] flex items-center justify-between text-xs text-[#1b6d24] font-bold">
                  <span>{t.navDiagnosis}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
