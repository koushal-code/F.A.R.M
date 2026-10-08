import React from 'react';
import { Sprout, Sun, CloudRain, Wind, Globe, History, Calculator, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';
import { RealtimeWeather } from '../services/weatherService';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenHistory: () => void;
  onOpenDosage: () => void;
  historyCount: number;
  weather?: RealtimeWeather | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  highContrast,
  onToggleHighContrast,
  onOpenHistory,
  onOpenDosage,
  historyCount,
  weather,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
      highContrast 
        ? 'bg-[#002117] text-white border-white/20' 
        : 'bg-[#f4fbf4]/95 text-[#161d19] border-[#c0c9c3]'
    }`}>
      {/* Top weather & field condition ticker for agricultural operations */}
      <div className={`px-4 py-1.5 text-xs font-medium border-b flex flex-wrap items-center justify-between gap-2 ${
        highContrast 
          ? 'bg-[#003629] text-[#a0f399] border-white/10' 
          : 'bg-[#e8f0e9] text-[#1b4d3e] border-[#dde4de]'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            {weather ? `${weather.temperature}°C` : '28°C'}
          </span>
          <span className="flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-emerald-600" />
            {t.humidity}: {weather ? `${weather.humidity}%` : '70%'}
          </span>
          <span className="flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-teal-600" />
            {weather ? `${weather.windSpeed} km/h` : '6 km/h'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#a0f399] text-[#003629]">
            <Sparkles className="w-3 h-3 text-[#1b6d24]" />
            {weather?.sprayConditionText || `${t.sprayCondition}: ${t.optimalSpray}`}
          </span>
        </div>
      </div>

      {/* Main navigation & brand identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#003629] text-[#a0f399] flex items-center justify-center shadow-md border border-[#1b4d3e]">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-black tracking-tight text-[#003629] dark:text-white">
                FARM
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold rounded-md bg-[#1b4d3e] text-[#baeed9] uppercase tracking-wider">
                Crop Health AI
              </span>
            </div>
            <p className="text-xs text-[#404945] font-medium hidden md:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dosage Calculator shortcut button */}
          <button
            onClick={onOpenDosage}
            title={t.calculatorTitle}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
              highContrast
                ? 'bg-[#1b4d3e] text-white border-white/30 hover:bg-[#256653]'
                : 'bg-white text-[#003629] border-[#c0c9c3] hover:bg-[#eef5ef] shadow-sm'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Dosage Calc</span>
          </button>

          {/* History modal button */}
          <button
            onClick={onOpenHistory}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
              highContrast
                ? 'bg-[#1b4d3e] text-white border-white/30 hover:bg-[#256653]'
                : 'bg-white text-[#003629] border-[#c0c9c3] hover:bg-[#eef5ef] shadow-sm'
            }`}
          >
            <History className="w-4 h-4 text-[#1b6d24]" />
            <span className="hidden sm:inline">{t.recentScans}</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#1b6d24] text-white text-[10px] flex items-center justify-center font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Language selector */}
          <div className="relative">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border bg-white border-[#c0c9c3] text-[#161d19] text-xs font-semibold shadow-sm">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                aria-label="Select language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>

          {/* High sunlight contrast toggle */}
          <button
            onClick={onToggleHighContrast}
            title={highContrast ? t.standardContrast : t.highContrast}
            className={`p-2 rounded-lg border transition-all ${
              highContrast
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-white text-[#404945] border-[#c0c9c3] hover:text-[#003629]'
            }`}
            aria-label="Toggle outdoor sunlight mode"
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
