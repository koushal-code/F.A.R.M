import React from 'react';
import { Scan, FileText, Calculator, BookOpen, History } from 'lucide-react';
import { AndroidAppTab, SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';

interface AndroidNavBarProps {
  activeTab: AndroidAppTab;
  onTabChange: (tab: AndroidAppTab) => void;
  currentLang: SupportedLanguage;
  hasDiagnosis: boolean;
  historyCount: number;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  activeTab,
  onTabChange,
  currentLang,
  hasDiagnosis,
  historyCount,
}) => {
  const t = TRANSLATIONS[currentLang];

  const tabs: { id: AndroidAppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'scan', label: t.navScan, icon: Scan },
    { id: 'diagnosis', label: t.navDiagnosis, icon: FileText },
    { id: 'calculator', label: t.navCalculator, icon: Calculator },
    { id: 'guide', label: t.navGuide, icon: BookOpen },
    { id: 'history', label: t.navHistory, icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#c0c9c3]/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe print:hidden">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all relative select-none active:scale-95 ${
                isActive 
                  ? 'text-[#003629]' 
                  : 'text-[#56605b] hover:text-[#1b4d3e]'
              }`}
            >
              {/* Active pill indicator */}
              <div className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
                isActive 
                  ? 'bg-[#a0f399] shadow-sm scale-105' 
                  : 'bg-transparent'
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${
                  isActive ? 'stroke-[2.6] text-[#003629]' : 'stroke-2'
                }`} />
              </div>

              {/* Label */}
              <span className={`text-[10.5px] tracking-tight mt-0.5 truncate max-w-[68px] leading-tight ${
                isActive ? 'font-black text-[#003629]' : 'font-medium'
              }`}>
                {tab.label}
              </span>

              {/* Badge for diagnosis availability or history count */}
              {tab.id === 'diagnosis' && hasDiagnosis && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#1b6d24] ring-2 ring-white" />
              )}
              {tab.id === 'history' && historyCount > 0 && (
                <span className="absolute top-0.5 right-2 px-1 rounded-full bg-[#1b6d24] text-white text-[9px] font-extrabold shadow-sm">
                  {historyCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
