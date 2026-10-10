import React, { useState } from 'react';
import { BookOpen, Search, Bug, Sparkles, ShieldCheck, Droplets, Leaf } from 'lucide-react';
import { GuideCrop, SupportedLanguage, FarmerProfile } from '../types/farm';
import { CROP_GUIDE_DATA } from '../data/cropGuide';
import { TRANSLATIONS } from '../data/translations';

interface CropGuidePageProps {
  currentLang: SupportedLanguage;
  onSelectCropForScan?: (cropName: string) => void;
  farmerProfile?: FarmerProfile | null;
}

export const CropGuidePage: React.FC<CropGuidePageProps> = ({
  currentLang,
  onSelectCropForScan,
  farmerProfile,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedCrop, setSelectedCrop] = useState<GuideCrop>(CROP_GUIDE_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCrops = CROP_GUIDE_DATA.filter(crop => {
    const vern = crop.vernacular[currentLang] || crop.name;
    return crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           vern.toLowerCase().includes(searchQuery.toLowerCase()) ||
           crop.botanical.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-4 sm:space-y-6 pb-28">
      {/* Page Header Banner */}
      <div className="bg-[#1b4d3e] text-white p-4 sm:p-6 rounded-2xl border border-[#003629] shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-[#a0f399]/20 text-[#a0f399] flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#a0f399]">
            {t.navGuide}
          </span>
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-extrabold text-white mb-1">
          {t.cropGuideTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#baeed9] leading-relaxed max-w-xl">
          {t.cropGuideSubtitle}
        </p>

        {/* Search Input with comfortable mobile height */}
        <div className="mt-3.5 relative w-full max-w-md">
          <Search className="w-4 h-4 text-white/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t.searchCropPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/25 focus:border-[#a0f399] transition-all"
          />
        </div>
      </div>

      {/* Horizontal Crop Selector with Touch-Friendly Chips */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#707974] mb-2 px-1">
          {t.selectCropLabel || 'Select Crop'} ({filteredCrops.length})
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 px-0.5 scrollbar-thin">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrop.id === crop.id;
            const localName = crop.vernacular[currentLang] || crop.name;
            const isMyCrop = farmerProfile?.primaryCrops.some(c => 
              c.toLowerCase().includes(crop.name.toLowerCase()) || 
              crop.name.toLowerCase().includes(c.split('(')[0].trim().toLowerCase())
            );

            return (
              <button
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border whitespace-nowrap transition-all flex-shrink-0 min-h-[42px] ${
                  isSelected
                    ? 'bg-[#003629] text-white border-[#003629] shadow-sm ring-2 ring-[#a0f399] scale-[1.02]'
                    : isMyCrop
                      ? 'bg-emerald-50 text-[#003629] border-emerald-300 hover:bg-emerald-100'
                      : 'bg-white text-[#161d19] border-[#c0c9c3] hover:bg-[#eef5ef] active:bg-[#e8f0e9]'
                }`}
              >
                <img
                  src={crop.image}
                  alt={localName}
                  className="w-6 h-6 rounded-full object-cover border border-white/30"
                />
                <span>{localName}</span>
                {isMyCrop && !isSelected && (
                  <span className="text-[9px] px-1 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-extrabold">
                    My Crop
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Crop Detail Card */}
      <div className="bg-white rounded-2xl border border-[#c0c9c3] p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-[#dde4de]">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={selectedCrop.image}
              alt={selectedCrop.vernacular[currentLang] || selectedCrop.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#c0c9c3] flex-shrink-0 shadow-xs"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#003629] truncate">
                  {selectedCrop.vernacular[currentLang] || selectedCrop.name}
                </h2>
                <span className="text-xs text-[#707974] italic">
                  ({selectedCrop.botanical})
                </span>
              </div>
              <p className="text-xs font-medium text-[#1b6d24] mt-1 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 flex-shrink-0 text-[#1b6d24]" />
                <span>{t.criticalStage}: <strong>{selectedCrop.criticalPeriod[currentLang] || selectedCrop.criticalPeriod.en}</strong></span>
              </p>
            </div>
          </div>

          {onSelectCropForScan && (
            <button
              onClick={() => onSelectCropForScan(selectedCrop.vernacular[currentLang] || selectedCrop.name)}
              className="w-full sm:w-auto min-h-[42px] px-4 py-2.5 rounded-xl bg-[#1b6d24] hover:bg-[#165a1e] active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#a0f399]" />
              <span>{t.scanThisCrop}</span>
            </button>
          )}
        </div>

        {/* Diseases & Pests List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[#ffeed3] text-[#7d2800] flex items-center justify-center">
              <Bug className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-[#003629]">
              {t.majorPestsTitle}
            </h3>
            <span className="text-[11px] font-bold text-[#707974] ml-auto">
              {selectedCrop.commonDiseases.length} {t.pathologiesLabel || 'Pathologies'}
            </span>
          </div>

          <div className="space-y-3.5">
            {selectedCrop.commonDiseases.map((dis, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl border border-[#dde4de] bg-[#f9fbf9] hover:border-[#1b6d24] transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-sm sm:text-base font-bold text-[#003629]">
                    {dis.name[currentLang] || dis.name.en}
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex-shrink-0">
                    {t.highThreat}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#2a342e] leading-relaxed">
                  <strong className="text-[#404945] font-semibold">{t.visualSymptomsTitle}:</strong> {dis.symptoms[currentLang] || dis.symptoms.en}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b6d24]">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{t.culturalPractice}</span>
                    </div>
                    <p className="text-xs text-[#27382d] leading-relaxed">
                      {dis.management[currentLang] || dis.management.en}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#7d2800]">
                      <Droplets className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{t.recommendedSpray}</span>
                    </div>
                    <p className="text-xs font-medium text-[#4a2e12] leading-relaxed">
                      {dis.chemical[currentLang] || dis.chemical.en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
