import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';

interface CalculatorPageProps {
  currentLang: SupportedLanguage;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  const [tankSize, setTankSize] = useState<number>(16);
  const [plotAcres, setPlotAcres] = useState<number>(1);
  const [dosageRate, setDosageRate] = useState<number>(2.5); // g/ml per liter
  const [productType, setProductType] = useState<'powder' | 'liquid'>('powder');

  // Calculations
  const dosePerTank = (tankSize * dosageRate).toFixed(1);
  const estimatedTanksPerAcre = Math.ceil(200 / tankSize); // standard 200L water per acre
  const totalTanksForPlot = Math.ceil(estimatedTanksPerAcre * plotAcres);
  const totalChemicalForPlot = (tankSize * dosageRate * totalTanksForPlot).toFixed(0);
  const totalWaterNeeded = totalTanksForPlot * tankSize;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#1b4d3e] text-white p-6 rounded-2xl border border-[#003629] shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a0f399] text-[#003629] text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5" />
          {t.navCalculator}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-1">
          {t.calculatorTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#baeed9]">
          {t.calibrationSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm space-y-5">
          {/* Tank Size Presets */}
          <div>
            <label className="block text-xs font-bold text-[#404945] mb-2">
              {t.selectTankSize}:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[12, 15, 16, 20, 25, 200].map((size) => (
                <button
                  key={size}
                  onClick={() => setTankSize(size)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                    tankSize === size
                      ? 'bg-[#003629] text-white border-[#003629] ring-2 ring-[#a0f399]'
                      : 'bg-[#f4fbf4] text-[#161d19] border-[#c0c9c3] hover:bg-[#e8f0e9]'
                  }`}
                >
                  {size}L
                </button>
              ))}
            </div>
          </div>

          {/* Product Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-[#404945] mb-2">
              {t.formulationType}:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProductType('powder')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  productType === 'powder'
                    ? 'bg-[#1b6d24] text-white border-[#1b6d24]'
                    : 'bg-white text-[#161d19] border-[#c0c9c3]'
                }`}
              >
                {t.powderForm}
              </button>
              <button
                onClick={() => setProductType('liquid')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  productType === 'liquid'
                    ? 'bg-[#1b6d24] text-white border-[#1b6d24]'
                    : 'bg-white text-[#161d19] border-[#c0c9c3]'
                }`}
              >
                {t.liquidForm}
              </button>
            </div>
          </div>

          {/* Dosage rate & Farm Acreage Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#404945] mb-1">
                {t.dosageOnPack} ({productType === 'powder' ? 'g' : 'ml'} / L):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={dosageRate}
                onChange={(e) => setDosageRate(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404945] mb-1">
                {t.plotArea}:
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="100"
                value={plotAcres}
                onChange={(e) => setPlotAcres(Math.max(0.25, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
              />
            </div>
          </div>
        </div>

        {/* Right Output Prescription Tank Batch Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1b6d24] block mb-1">
              {t.tankFormulation}:
            </span>
            <h3 className="font-display text-xl font-extrabold text-[#003629] mb-4">
              {t.forOneTank} ({tankSize}L)
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#eef5ef] border border-[#a0f399]">
                <div className="text-xs text-[#1b4d3e] font-bold">
                  {t.calculateDosage}:
                </div>
                <div className="font-display text-2xl font-black text-[#003629] mt-0.5">
                  {dosePerTank} {productType === 'powder' ? 'g' : 'ml'}
                </div>
                <div className="text-[11px] text-[#404945] mt-1">
                  {tankSize}L water
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-[#f4fbf4] border border-[#dde4de]">
                  <strong className="block text-[#404945]">{t.totalTanksNeeded}:</strong>
                  <span className="font-bold text-[#003629] text-sm">~{totalTanksForPlot}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#f4fbf4] border border-[#dde4de]">
                  <strong className="block text-[#404945]">Chemical:</strong>
                  <span className="font-bold text-[#1b6d24] text-sm">~{totalChemicalForPlot} {productType === 'powder' ? 'g' : 'ml'}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#f4fbf4] border border-[#dde4de] text-xs">
                <strong className="block text-[#404945]">Water:</strong>
                <span className="text-[#161d19] font-medium">~{totalWaterNeeded} L ({plotAcres} ac)</span>
              </div>
            </div>
          </div>

          {/* Mixing Warning & Nozzle Tip */}
          <div className="p-3.5 rounded-xl bg-[#ffeed3] border border-[#c47c00] text-xs text-[#805000] flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{t.slurryTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
