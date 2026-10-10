import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Wifi, 
  WifiOff, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  VolumeX, 
  Share2, 
  Check, 
  Sparkles,
  Droplets,
  Bug,
  ShieldAlert,
  Sprout
} from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { QUICK_FARMING_TIPS, FarmingTip } from '../data/farmingTips';
import { TRANSLATIONS } from '../data/translations';

interface QuickFarmingTipsProps {
  currentLang: SupportedLanguage;
}

const STORAGE_CACHE_KEY = 'farm_offline_farming_tips';
const STORAGE_BOOKMARKS_KEY = 'farm_bookmarked_tips';

export const QuickFarmingTips: React.FC<QuickFarmingTipsProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [tips, setTips] = useState<FarmingTip[]>(QUICK_FARMING_TIPS);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'spray' | 'pest' | 'disease'>('all');
  const [expandedTipId, setExpandedTipId] = useState<string | null>(QUICK_FARMING_TIPS[0]?.id || null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Sync cache and bookmarks with localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTips(parsed);
        }
      } else {
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(QUICK_FARMING_TIPS));
      }

      const savedBookmarks = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }
    } catch (_e) {
      // LocalStorage access resilient fallback
    }
  }, []);

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((bId) => bId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (_e) {}
  };

  const handleCopyTip = (tip: FarmingTip, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `🌾 FARM Quick Tip: ${tip.title[currentLang] || tip.title.en}
💡 ${tip.keyRecommendation[currentLang] || tip.keyRecommendation.en}
⏰ ${tip.bestTiming[currentLang] || tip.bestTiming.en}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(tip.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleSpeakTip = (tip: FarmingTip, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechId === tip.id) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${tip.title[currentLang] || tip.title.en}. ${tip.shortDesc[currentLang] || tip.shortDesc.en}. ${tip.keyRecommendation[currentLang] || tip.keyRecommendation.en}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    const langCodes: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      gu: 'gu-IN'
    };
    utterance.lang = langCodes[currentLang] || 'gu-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(tip.id);
    window.speechSynthesis.speak(utterance);
  };

  const filteredTips = tips.filter((tip) => {
    if (selectedCategory === 'all') return true;
    return tip.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: { en: 'All Tips', hi: 'सभी सुझाव', te: 'అన్ని చిట్కాలు', kn: 'ಎಲ್ಲಾ ಸಲಹೆಗಳು', ta: 'அனைத்து குறிப்புகள்', gu: 'બધા સૂચનો' }, icon: Sparkles },
    { id: 'spray', label: { en: 'Spraying', hi: 'छिड़काव', te: 'పిచికారీ', kn: 'ಸಿಂಪಡಣೆ', ta: 'தெளித்தல்', gu: 'છંટકાવ' }, icon: Droplets },
    { id: 'pest', label: { en: 'Pests & Traps', hi: 'कीट और जाल', te: 'పురుగులు & బుట్టలు', kn: 'ಕೀಟ & ಬಲೆ', ta: 'பூச்சிகள் & பொறிகள்', gu: 'જીવાત અને ટ્રેપ' }, icon: Bug },
    { id: 'disease', label: { en: 'Root & Disease', hi: 'रोग और जड़', te: 'తెగుళ్లు & వేరు', kn: 'ರೋಗ & ಬೇರು', ta: 'வேர் & நோய்கள்', gu: 'રોગ અને મૂળ' }, icon: ShieldAlert },
  ];

  const sectionHeadings: Record<SupportedLanguage, { title: string; subtitle: string; cachedMsg: string; offlineReady: string }> = {
    en: {
      title: 'Quick Farming Field Tips',
      subtitle: 'Actionable agronomy practices cached for reliable offline field reference',
      cachedMsg: 'Cached for Offline Reading',
      offlineReady: 'Offline Mode Active'
    },
    hi: {
      title: 'त्वरित कृषि मार्गदर्शन (Tips)',
      subtitle: 'खेत में बिना इंटरनेट भी पढ़ने के लिए ऑफ़लाइन सुरक्षित सुझाव',
      cachedMsg: 'ऑफ़लाइन पढ़ने हेतु सुरक्षित',
      offlineReady: 'ऑफ़लाइन मोड सक्रिय'
    },
    te: {
      title: 'త్వరిత వ్యవసాయ క్షేత్ర చిట్కాలు',
      subtitle: 'పొలంలో నెట్‌వర్క్ లేకపోయినా చదువుకోవడానికి ఆఫ్‌లైన్‌లో భద్రపరచబడినవి',
      cachedMsg: 'ఆఫ్‌లైన్ చదువుకు భద్రం',
      offlineReady: 'ఆఫ్‌లైన్ మోడ్ యాక్టివ్'
    },
    kn: {
      title: 'ತ್ವರಿತ ಕೃಷಿ ಸಲಹೆಗಳು',
      subtitle: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದಿದ್ದರೂ ಓದಲು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾದ ಬೆಳೆ ಸಲಹೆಗಳು',
      cachedMsg: 'ಆಫ್‌ಲೈನ್ ಓದಿಗೆ ಸಿದ್ಧವಾಗಿದೆ',
      offlineReady: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯ'
    },
    ta: {
      title: 'விரைவு விவசாய கள குறிப்புகள்',
      subtitle: 'இணையம் இல்லாதபோதும் படிக்க ஆஃப்லைனில் சேமிக்கப்பட்ட பயிர் குறிப்புகள்',
      cachedMsg: 'ஆஃப்லைனில் படிக்க சேமிக்கப்பட்டது',
      offlineReady: 'ஆஃப்லைன் பயன்முறை'
    },
    gu: {
      title: 'ખેતી ઉપયોગી મહત્વપૂર્ણ ટિપ્સ',
      subtitle: 'ઇન્ટરનેટ વગર ખેતરમાં ઉપયોગ કરવા માટે ઑફલાઇન સંગ્રહિત માર્ગદર્શન',
      cachedMsg: 'ઑફલાઇન વાંચવા માટે સંગ્રહિત',
      offlineReady: 'ઑફલાઇન મોડ સક્રિય'
    }
  };

  const h = sectionHeadings[currentLang] || sectionHeadings.en;

  return (
    <div className="bg-white rounded-2xl border border-[#c0c9c3] p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header & Offline Cache Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#dde4de]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e8f0e9] text-[#1b6d24] flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#003629]">
              {h.title}
            </h3>
          </div>
          <p className="text-xs text-[#56605b] mt-1">
            {h.subtitle}
          </p>
        </div>

        {/* Offline Cache Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
            !isOnline
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-[#f4fbf4] text-[#1b6d24] border-[#a0f399]'
          }`}>
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{h.offlineReady}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-[#1b6d24]" />
                <span>{h.cachedMsg}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Segmented Filter Buttons */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[36px] flex-shrink-0 ${
                isSelected
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f4fbf4] text-[#404945] hover:bg-[#e8f0e9] border border-[#dde4de]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label[currentLang] || cat.label.en}</span>
            </button>
          );
        })}
      </div>

      {/* Tips List */}
      <div className="space-y-3">
        {filteredTips.map((tip) => {
          const isExpanded = expandedTipId === tip.id;
          const isBookmarked = bookmarkedIds.includes(tip.id);
          const isSpeaking = activeSpeechId === tip.id;
          const isCopied = copiedId === tip.id;

          return (
            <div
              key={tip.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'border-[#1b6d24] bg-[#f9fbf9] shadow-xs' 
                  : 'border-[#dde4de] bg-white hover:border-[#8abda9]'
              }`}
            >
              {/* Collapsed / Clickable Header */}
              <div
                onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
                className="p-3.5 sm:p-4 cursor-pointer flex items-start justify-between gap-3 select-none"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#e8f0e9] text-[#1b4d3e] uppercase tracking-wider flex-shrink-0">
                      {tip.categoryLabel[currentLang] || tip.categoryLabel.en}
                    </span>
                    <span className="text-[11px] text-[#707974] flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3 text-[#1b6d24] flex-shrink-0" />
                      <span>{tip.bestTiming[currentLang] || tip.bestTiming.en}</span>
                    </span>
                  </div>

                  <h4 className="font-display text-sm sm:text-base font-bold text-[#003629] leading-normal break-words">
                    {tip.title[currentLang] || tip.title.en}
                  </h4>

                  {!isExpanded && (
                    <p className="text-xs text-[#56605b] mt-1.5 line-clamp-2 leading-relaxed break-words">
                      {tip.shortDesc[currentLang] || tip.shortDesc.en}
                    </p>
                  )}
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                  <button
                    onClick={(e) => toggleBookmark(tip.id, e)}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark tip offline'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isBookmarked
                        ? 'bg-[#a0f399]/40 border-[#1b6d24] text-[#1b6d24]'
                        : 'border-transparent text-[#707974] hover:bg-[#eef5ef]'
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-[#1b6d24]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <div className="p-1 text-[#707974]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Advice */}
              {isExpanded && (
                <div className="px-3.5 sm:px-4 pb-4 pt-1 space-y-3 border-t border-[#dde4de]/80 text-xs">
                  {/* Summary */}
                  <p className="text-xs text-[#2a342e] leading-relaxed break-words">
                    {tip.shortDesc[currentLang] || tip.shortDesc.en}
                  </p>

                  {/* Core Actionable Recommendation */}
                  <div className="p-3 rounded-xl bg-[#eef5ef] border border-[#a0f399] space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#1b6d24]">
                      <Sprout className="w-3.5 h-3.5 flex-shrink-0 text-[#1b6d24]" />
                      <span>{t.fieldRecommendationLabel || 'Field Recommendation'}</span>
                    </div>
                    <p className="text-xs text-[#003629] font-medium leading-relaxed break-words">
                      {tip.keyRecommendation[currentLang] || tip.keyRecommendation.en}
                    </p>
                  </div>

                  {/* Do's and Don'ts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 break-words">
                        <strong className="text-emerald-900 block font-bold text-[11px] mb-0.5">{t.doLabel || 'DO:'}</strong>
                        <span className="text-emerald-950 text-[11px] leading-relaxed block">
                          {tip.dosAndDonts.dos[currentLang] || tip.dosAndDonts.dos.en}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200 flex items-start gap-2 min-w-0">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 break-words">
                        <strong className="text-red-900 block font-bold text-[11px] mb-0.5">{t.dontLabel || "DON'T:"}</strong>
                        <span className="text-red-950 text-[11px] leading-relaxed block">
                          {tip.dosAndDonts.donts[currentLang] || tip.dosAndDonts.donts.en}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar (Audio Reader & Share) */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#dde4de]/60">
                    <button
                      onClick={(e) => handleSpeakTip(tip, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isSpeaking
                          ? 'bg-[#ba1a1a] text-white animate-pulse'
                          : 'bg-[#1b4d3e] text-white hover:bg-[#256653]'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>{t.stopVoice || 'Stop Voice'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#a0f399]" />
                          <span>{t.listenTts || 'Listen (TTS)'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => handleCopyTip(tip, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c0c9c3] bg-white text-[#003629] text-xs font-bold hover:bg-[#eef5ef] active:scale-[0.98] transition-all"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t.copied || 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{t.shareTip || 'Share Tip'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
