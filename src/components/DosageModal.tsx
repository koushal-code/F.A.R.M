import React, { useState } from 'react';
import { X, Calculator, Droplets, Info, Check } from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';

interface DosageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
}

export const DosageModal: React.FC<DosageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [tankSize, setTankSize] = useState<number>(16);
  const [plotAcres, setPlotAcres] = useState<number>(1);
  const [chemicalType, setChemicalType] = useState<string>('fungicide');
  const [dosageRate, setDosageRate] = useState<number>(2.5); // g/ml per liter

  if (!isOpen) return null;

  const totalPerTank = (tankSize * dosageRate).toFixed(1);
  const estimatedTanksPerAcre = Math.ceil(200 / tankSize);
  const totalTanksForPlot = Math.ceil(estimatedTanksPerAcre * plotAcres);
  const totalChemicalForPlot = (tankSize * dosageRate * totalTanksForPlot).toFixed(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#c0c9c3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#003629] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#a0f399]" />
            <div>
              <h3 className="font-display text-base font-bold">
                {t.calculatorTitle}
              </h3>
              <p className="text-xs text-[#8abda9]">
                Accurate dilution prevents leaf scorch and ensures pest kill
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
        <div className="p-6 space-y-5">
          {/* Preset tank sizes */}
          <div>
            <label className="block text-xs font-bold text-[#404945] mb-2">
              Select Your Knapsack or Spray Tank Capacity:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[12, 16, 20, 25, 200].map((liters) => (
                <button
                  key={liters}
                  onClick={() => setTankSize(liters)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    tankSize === liters
                      ? 'bg-[#1b6d24] text-white border-[#1b6d24] shadow-sm'
                      : 'bg-[#f4fbf4] text-[#161d19] border-[#c0c9c3] hover:bg-[#e8f0e9]'
                  }`}
                >
                  {liters} Liters
                </button>
              ))}
            </div>
          </div>

          {/* Dosage rate & plot area inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#404945] mb-1">
                Dosage Rate (g or ml / L)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={dosageRate}
                onChange={(e) => setDosageRate(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
              />
              <span className="text-[10px] text-[#707974] mt-0.5 block">
                Standard: 2.0g - 3.0g / L
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404945] mb-1">
                Farm Area (Acres)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={plotAcres}
                onChange={(e) => setPlotAcres(Math.max(0.25, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
              />
              <span className="text-[10px] text-[#707974] mt-0.5 block">
                1 acre ≈ 4,046 m²
              </span>
            </div>
          </div>

          {/* Output Display */}
          <div className="p-4 rounded-xl bg-[#eef5ef] border border-[#a0f399] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#a0f399]/40">
              <span className="text-xs font-bold text-[#1b4d3e]">
                For 1 Full {tankSize}L Tank:
              </span>
              <span className="font-display text-base font-extrabold text-[#003629]">
                {totalPerTank} grams / ml
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#a0f399]/40">
              <span className="text-xs font-bold text-[#1b4d3e]">
                Tanks Needed for {plotAcres} Acre(s):
              </span>
              <span className="font-display text-base font-extrabold text-[#003629]">
                ~{totalTanksForPlot} Tanks
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1b4d3e]">
                Total Chemical Required:
              </span>
              <span className="font-display text-base font-extrabold text-[#1b6d24]">
                ~{totalChemicalForPlot} grams / ml
              </span>
            </div>
          </div>

          {/* Practical Safety Tips */}
          <div className="p-3 rounded-lg bg-[#f4fbf4] border border-[#dde4de] text-[11px] text-[#404945] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#1b6d24] flex-shrink-0 mt-0.5" />
            <p>
              Always add chemical into half a bucket of clean water first, stir thoroughly, then pour into the main tank and top up with clean water to avoid nozzle clogging.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f4fbf4] border-t border-[#c0c9c3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#003629] text-white text-xs font-bold hover:bg-[#1b4d3e] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
