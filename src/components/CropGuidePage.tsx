import React, { useState } from 'react';
import { BookOpen, Search, Bug, Sparkles } from 'lucide-react';
import { GuideCrop, SupportedLanguage } from '../types/farm';
import { CROP_GUIDE_DATA } from '../data/cropGuide';
import { TRANSLATIONS } from '../data/translations';

interface CropGuidePageProps {
  currentLang: SupportedLanguage;
  onSelectCropForScan?: (cropName: string) => void;
}

export const CropGuidePage: React.FC<CropGuidePageProps> = ({
  currentLang,
  onSelectCropForScan,
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
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="bg-[#1b4d3e] text-white p-6 rounded-2xl border border-[#003629] shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a0f399] text-[#003629] text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          {t.navGuide}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-1">
          {t.cropGuideTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#baeed9]">
          {t.cropGuideSubtitle}
        </p>

        {/* Search Input */}
        <div className="mt-4 relative max-w-md">
          <Search className="w-4 h-4 text-white/60 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={t.searchCropPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
          />
        </div>
      </div>

      {/* Horizontal Crop Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredCrops.map((crop) => {
          const isSelected = selectedCrop.id === crop.id;
          const localName = crop.vernacular[currentLang] || crop.name;

          return (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#003629] text-white border-[#003629] shadow-sm ring-2 ring-[#a0f399]'
                  : 'bg-white text-[#161d19] border-[#c0c9c3] hover:bg-[#eef5ef]'
              }`}
            >
              <img
                src={crop.image}
                alt={localName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{localName}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Crop Detail Card */}
      <div className="bg-white rounded-2xl border border-[#c0c9c3] p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dde4de]">
          <div className="flex items-center gap-3">
            <img
              src={selectedCrop.image}
              alt={selectedCrop.vernacular[currentLang] || selectedCrop.name}
              className="w-16 h-16 rounded-xl object-cover border border-[#c0c9c3]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-[#003629]">
                  {selectedCrop.vernacular[currentLang] || selectedCrop.name}
                </h2>
                <span className="text-xs text-[#707974] italic">
                  ({selectedCrop.botanical})
                </span>
              </div>
              <p className="text-xs font-medium text-[#1b6d24] mt-0.5">
                {t.criticalStage}: <strong>{selectedCrop.criticalPeriod[currentLang] || selectedCrop.criticalPeriod.en}</strong>
              </p>
            </div>
          </div>

          {onSelectCropForScan && (
            <button
              onClick={() => onSelectCropForScan(selectedCrop.vernacular[currentLang] || selectedCrop.name)}
              className="px-4 py-2 rounded-xl bg-[#1b6d24] text-white text-xs font-bold hover:bg-[#165a1e] flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#a0f399]" />
              {t.scanThisCrop}
            </button>
          )}
        </div>

        {/* Diseases & Pests List */}
        <div>
          <h3 className="font-display text-sm font-bold text-[#003629] mb-3 flex items-center gap-2">
            <Bug className="w-4 h-4 text-[#7d2800]" />
            {t.majorPestsTitle}
          </h3>

          <div className="space-y-4">
            {selectedCrop.commonDiseases.map((dis, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#dde4de] bg-[#f4fbf4] hover:border-[#1b6d24] transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-display text-sm font-bold text-[#003629]">
                    {dis.name[currentLang] || dis.name.en}
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a]">
                    {t.highThreat}
                  </span>
                </div>

                <p className="text-xs text-[#161d19] mb-2 leading-relaxed">
                  <strong className="text-[#404945]">{t.visualSymptomsTitle}:</strong> {dis.symptoms[currentLang] || dis.symptoms.en}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[#dde4de]">
                  <div className="p-2 rounded bg-white border border-[#dde4de]/80">
                    <strong className="text-[#1b6d24] block mb-0.5">{t.culturalPractice}:</strong>
                    <span className="text-[#404945]">{dis.management[currentLang] || dis.management.en}</span>
                  </div>

                  <div className="p-2 rounded bg-white border border-[#dde4de]/80">
                    <strong className="text-[#7d2800] block mb-0.5">{t.recommendedSpray}:</strong>
                    <span className="text-[#161d19] font-medium">{dis.chemical[currentLang] || dis.chemical.en}</span>
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
