import React, { useState } from 'react';
import { 
  Calculator, Info, Sparkles, CheckCircle2, ChevronRight, Sprout, 
  Layers, Package, Calendar, Coins, ArrowRight, ShieldCheck, HelpCircle,
  FlaskConical
} from 'lucide-react';
import { SupportedLanguage, FarmerProfile } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';
import { 
  CROP_NUTRIENT_PROFILES, 
  calculateFertilizerPlan, 
  CropNutrientProfile 
} from '../data/fertilizerData';

interface CalculatorPageProps {
  currentLang: SupportedLanguage;
  farmerProfile?: FarmerProfile | null;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ currentLang, farmerProfile }) => {
  const t = TRANSLATIONS[currentLang];

  // Active sub-module toggle: 'fertilizer' or 'sprayer'
  const [activeModule, setActiveModule] = useState<'fertilizer' | 'sprayer'>('fertilizer');

  // --- Fertilizer Planner State ---
  const [selectedCropId, setSelectedCropId] = useState<string>(() => {
    if (farmerProfile?.primaryCrops?.length) {
      const first = farmerProfile.primaryCrops[0].toLowerCase();
      const match = CROP_NUTRIENT_PROFILES.find((c) => 
        first.includes(c.id) || first.includes(c.name.en.toLowerCase())
      );
      if (match) return match.id;
    }
    return 'paddy';
  });

  const [fertilizerAcres, setFertilizerAcres] = useState<number>(farmerProfile?.landSizeAcres || 1);
  const [fertilityModifier, setFertilityModifier] = useState<'low' | 'normal' | 'high'>('normal');

  // Find active crop profile
  const activeCrop: CropNutrientProfile = 
    CROP_NUTRIENT_PROFILES.find((c) => c.id === selectedCropId) || CROP_NUTRIENT_PROFILES[0];

  // Calculated fertilizer plan
  const fertPlan = calculateFertilizerPlan(activeCrop, fertilizerAcres, fertilityModifier);

  // --- Sprayer Calibration State (preserved) ---
  const [tankSize, setTankSize] = useState<number>(16);
  const [plotAcres, setPlotAcres] = useState<number>(farmerProfile?.landSizeAcres || 1);
  const [dosageRate, setDosageRate] = useState<number>(2.5); // g/ml per liter
  const [productType, setProductType] = useState<'powder' | 'liquid'>('powder');

  // Sprayer Calculations
  const dosePerTank = (tankSize * dosageRate).toFixed(1);
  const estimatedTanksPerAcre = Math.ceil(200 / tankSize); // standard 200L water per acre
  const totalTanksForPlot = Math.ceil(estimatedTanksPerAcre * plotAcres);
  const totalChemicalForPlot = (tankSize * dosageRate * totalTanksForPlot).toFixed(0);
  const totalWaterNeeded = totalTanksForPlot * tankSize;

  // Localized module headings
  const moduleLabels: Record<SupportedLanguage, {
    fertTitle: string;
    fertSubtitle: string;
    sprayTitle: string;
    spraySubtitle: string;
    tabFertilizer: string;
    tabSprayer: string;
    selectCropLabel: string;
    fieldAreaLabel: string;
    soilFertilityLabel: string;
    fertilityNormal: string;
    fertilityLow: string;
    fertilityHigh: string;
    commercialBagsNeeded: string;
    splitDoseTitle: string;
    micronutrientsTitle: string;
    organicTitle: string;
    estimatedCostTitle: string;
    pureNpkTitle: string;
  }> = {
    en: {
      fertTitle: 'Field Fertilizer & NPK Planner',
      fertSubtitle: 'Calculate exact commercial fertilizer bags (Urea, DAP, MOP) & split doses based on crop and field acreage',
      sprayTitle: 'Sprayer & Knapsack Calibration',
      spraySubtitle: 'Calculate chemical & water volume per knapsack pump to avoid under/over dosage',
      tabFertilizer: '🌾 Fertilizer Planner',
      tabSprayer: '🧴 Sprayer Calibration',
      selectCropLabel: 'Select Target Crop:',
      fieldAreaLabel: 'Field Size (Acres):',
      soilFertilityLabel: 'Soil Fertility Level:',
      fertilityNormal: 'Normal (100% RDF)',
      fertilityLow: 'Low Fertility (+15% NPK)',
      fertilityHigh: 'Rich / Legume Residue (-15% N)',
      commercialBagsNeeded: 'Commercial Fertilizer Required for Your Field',
      splitDoseTitle: 'Application Schedule & Split-Dosing Timeline',
      micronutrientsTitle: 'Recommended Micronutrient Supplements',
      organicTitle: 'Organic Manure & Bio-Booster Base',
      estimatedCostTitle: 'Estimated Subsidized Fertilizer Budget',
      pureNpkTitle: 'Total Elemental Nutrient Requirement (N-P-K)'
    },
    hi: {
      fertTitle: 'खेत उर्वरक एवं एनपीके योजनाकार',
      fertSubtitle: 'फसल और खेत के क्षेत्रफल के आधार पर यूरिया, डीएपी और पोटाश की सही बोरियों और किश्तों की गणना करें',
      sprayTitle: 'स्प्रेयर एवं टंकी कैलिब्रेशन',
      spraySubtitle: 'अति-छिड़काव या कम छिड़काव से बचने के लिए प्रति पंप दवा और पानी की मात्रा निकालें',
      tabFertilizer: '🌾 उर्वरक योजनाकार',
      tabSprayer: '🧴 स्प्रेयर कैलिब्रेशन',
      selectCropLabel: 'फसल का चयन करें:',
      fieldAreaLabel: 'खेत का क्षेत्रफल (एकड़):',
      soilFertilityLabel: 'मिट्टी की उर्वरता स्तर:',
      fertilityNormal: 'सामान्य (100%)',
      fertilityLow: 'कम उपजाऊ (+15% NPK)',
      fertilityHigh: 'उच्च उपजाऊ (-15% N)',
      commercialBagsNeeded: 'आपके खेत के लिए आवश्यक रासायनिक उर्वरक',
      splitDoseTitle: 'उर्वरक देने का समय एवं किश्तें (टाइमलाइन)',
      micronutrientsTitle: 'आवश्यक सूक्ष्म पोषक तत्व',
      organicTitle: 'जैविक खाद एवं गोबर खाद आवश्यकता',
      estimatedCostTitle: 'अनुमानित उर्वरक लागत बजट',
      pureNpkTitle: 'कुल शुद्ध पोषक तत्व आवश्यकता (N-P-K)'
    },
    te: {
      fertTitle: 'పొలం ఎరువుల & NPK ప్రణాళిక',
      fertSubtitle: 'పంట మరియు విస్తీర్ణాన్ని బట్టి యూరియా, డీఏపీ, పొటాష్ బస్తాలు మరియు దశలవారీ మోతాదుల లెక్కింపు',
      sprayTitle: 'స్ప్రేయర్ & ట్యాంక్ మోతాదు కొలత',
      spraySubtitle: 'మందు మోతాదు ఎక్కువ లేదా తక్కువ కాకుండా పంపుకు సరిపడా రసాయనం మరియు నీటి లెక్కలు',
      tabFertilizer: '🌾 ఎరువుల ప్రణాళిక',
      tabSprayer: '🧴 స్ప్రేయర్ మోతాదు',
      selectCropLabel: 'పంటను ఎంచుకోండి:',
      fieldAreaLabel: 'పొలం విస్తీర్ణం (ఎకరాలు):',
      soilFertilityLabel: 'భూమి సారం స్థాయి:',
      fertilityNormal: 'సాధారణం (100%)',
      fertilityLow: 'తక్కువ సారం (+15% NPK)',
      fertilityHigh: 'ఎక్కువ సారం (-15% N)',
      commercialBagsNeeded: 'మీ పొలానికి కావలసిన ఎరువుల బస్తాల వివరాలు',
      splitDoseTitle: 'ఎరువులు వేయాల్సిన సమయాలు & దశలవారీ మోతాదు',
      micronutrientsTitle: 'సూక్ష్మ పోషకాల సిఫార్సులు',
      organicTitle: 'సేంద్రీయ ఎరువుల అవసరం',
      estimatedCostTitle: 'అంచనా ఎరువుల బడ్జెట్',
      pureNpkTitle: 'మొత్తం స్వచ్ఛమైన పోషకాల అవసరం (N-P-K)'
    },
    kn: {
      fertTitle: 'ರಸಗೊಬ್ಬರ ಮತ್ತು NPK ಯೋಜಕ',
      fertSubtitle: 'ಬೆಳೆ ಮತ್ತು ವಿಸ್ತೀರ್ಣಕ್ಕೆ ತಕ್ಕಂತೆ ಯೂರಿಯಾ, ಡಿಎಪಿ ಮತ್ತು ಪೊಟ್ಯಾಶ್ ಚೀಲಗಳ ನಿಖರ ಲೆಕ್ಕಾಚಾರ',
      sprayTitle: 'ಸಿಂಪಡಕ ಮತ್ತು ಟ್ಯಾಂಕ್ ಪ್ರಮಾಣ',
      spraySubtitle: 'ಪ್ರತಿ ಪಂಪ್‌ಗೆ ಅಗತ್ಯವಿರುವ ಔಷಧಿ ಮತ್ತು ನೀರಿನ ಪ್ರಮಾಣ',
      tabFertilizer: '🌾 ರಸಗೊಬ್ಬರ ಯೋಜಕ',
      tabSprayer: '🧴 ಸಿಂಪಡಕ ಪ್ರಮಾಣ',
      selectCropLabel: 'ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
      fieldAreaLabel: 'ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ):',
      soilFertilityLabel: 'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಮಟ್ಟ:',
      fertilityNormal: 'ಸಾಮಾನ್ಯ (100%)',
      fertilityLow: 'ಕಡಿಮೆ ಫಲವತ್ತತೆ (+15% NPK)',
      fertilityHigh: 'ಹೆಚ್ಚು ಫಲವತ್ತತೆ (-15% N)',
      commercialBagsNeeded: 'ನಿಮ್ಮ ಜಮೀನಿಗೆ ಬೇಕಾಗುವ ರಸಗೊಬ್ಬರ ಚೀಲಗಳು',
      splitDoseTitle: 'ಗೊಬ್ಬರ ಹಾಕುವ ಹಂತಗಳು ಮತ್ತು ವೇಳಾಪಟ್ಟಿ',
      micronutrientsTitle: 'ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳ ಶಿಫಾರಸು',
      organicTitle: 'ಸಾವಯವ ಗೊಬ್ಬರ ಅಗತ್ಯತೆ',
      estimatedCostTitle: 'ಅಂದಾಜು ಗೊಬ್ಬರ ಖರ್ಚು',
      pureNpkTitle: 'ಒಟ್ಟು ಶುದ್ಧ ಪೋಷಕಾಂಶಗಳ ಅಗತ್ಯತೆ (N-P-K)'
    },
    ta: {
      fertTitle: 'உரத் திட்டம் & NPK கால்குலேட்டர்',
      fertSubtitle: 'பயிர் மற்றும் பரப்பளவை அடிப்படையாகக் கொண்டு யூரியா, டிஏபி, பொட்டாஷ் மூட்டைகள் கணக்கீடு',
      sprayTitle: 'தெளிப்பான் மற்றும் தொட்டி அளவு',
      spraySubtitle: 'ஒவ்வொரு தெளிப்பான் பம்புக்கும் தேவையான மருந்து மற்றும் நீர் அளவு',
      tabFertilizer: '🌾 உரத் திட்டமிடுபவர்',
      tabSprayer: '🧴 தெளிப்பான் அளவு',
      selectCropLabel: 'பயிரைத் தேர்ந்தெடுக்கவும்:',
      fieldAreaLabel: 'நிலத்தின் பரப்பளவு (ஏக்கர்):',
      soilFertilityLabel: 'மண் வளம்:',
      fertilityNormal: 'சாதாரண வளம் (100%)',
      fertilityLow: 'குறைந்த வளம் (+15% NPK)',
      fertilityHigh: 'அதிக வளம் (-15% N)',
      commercialBagsNeeded: 'உங்கள் நிலத்திற்கு தேவையான உர மூட்டைகள்',
      splitDoseTitle: 'உரமிடும் கால அட்டவணை (தவணை உரம்)',
      micronutrientsTitle: 'நுண்ணூட்டச் சத்துக்கள்',
      organicTitle: 'இயற்கை உரம் தேவை',
      estimatedCostTitle: 'உரங்களுக்கான தோராய செலவு',
      pureNpkTitle: 'தேவையான சத்துக்கள் (N-P-K)'
    },
    gu: {
      fertTitle: 'ખેતર ખાતર અને NPK આયોજક',
      fertSubtitle: 'પાક અને જમીનના માપ મુજબ યુરિયા, ડીએપી અને પોટાશની થેલીઓની સચોટ ગણતરી અને હપ્તા',
      sprayTitle: 'સ્પ્રેયર અને પંપ કેલિબ્રેશન',
      spraySubtitle: 'પંપ દીઠ દવાનું સચોટ પ્રમાણ અને પાણીનું માપ',
      tabFertilizer: '🌾 ખાતર આયોજક',
      tabSprayer: '🧴 સ્પ્રેયર કેલિબ્રેશન',
      selectCropLabel: 'પાકની પસંદગી કરો:',
      fieldAreaLabel: 'જમીનનું ક્ષેત્રફળ (એકર):',
      soilFertilityLabel: 'જમીનની ફળદ્રુપતા:',
      fertilityNormal: 'સામાન્ય (100%)',
      fertilityLow: 'ઓછી ફળદ્રુપ (+15% NPK)',
      fertilityHigh: 'વધુ ફળદ્રુપ (-15% N)',
      commercialBagsNeeded: 'તમારા ખેતર માટે જરૂરી ખાતરની થેલીઓ',
      splitDoseTitle: 'ખાતર આપવાનો સમય અને હપ્તાવાર વિતરણ',
      micronutrientsTitle: 'જરૂરી સુક્ષ્મ તત્ત્વો',
      organicTitle: 'સેન્દ્રીય ખાતરની જરૂરિયાત',
      estimatedCostTitle: 'અંદાજિત ખાતર ખર્ચ બજેટ',
      pureNpkTitle: 'કુલ શુદ્ધ પોષક તત્વો (N-P-K)'
    }
  };

  const l = moduleLabels[currentLang] || moduleLabels.en;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-[#1b4d3e] text-white p-6 rounded-2xl border border-[#003629] shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#a0f399]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a0f399] text-[#003629] text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5" />
          {t.navCalculator}
        </div>
        
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-1">
          {activeModule === 'fertilizer' ? l.fertTitle : t.calculatorTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#baeed9] max-w-2xl">
          {activeModule === 'fertilizer' ? l.fertSubtitle : t.calibrationSubtitle}
        </p>

        {/* Sub-module Switcher Tabs */}
        <div className="mt-5 inline-flex p-1 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 gap-1">
          <button
            type="button"
            onClick={() => setActiveModule('fertilizer')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeModule === 'fertilizer'
                ? 'bg-[#a0f399] text-[#003629] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{l.tabFertilizer}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#003629] text-[#a0f399] font-black">
              NPK
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('sprayer')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeModule === 'sprayer'
                ? 'bg-[#a0f399] text-[#003629] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{l.tabSprayer}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: FERTILIZER PLANNER                                               */}
      {/* ========================================================================= */}
      {activeModule === 'fertilizer' && (
        <div className="space-y-6">
          {/* Top Inputs: Crop Selector, Acreage & Soil Modifier */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c0c9c3] shadow-sm space-y-5">
            {/* Crop Selector Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#404945]">
                  {l.selectCropLabel}
                </label>
                {farmerProfile && (
                  <span className="text-[11px] font-semibold text-[#1b6d24]">
                    Farm: {farmerProfile.district}, {farmerProfile.state}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {CROP_NUTRIENT_PROFILES.map((crop) => {
                  const isSelected = crop.id === selectedCropId;
                  const isFarmerCrop = farmerProfile?.primaryCrops?.some((c) =>
                    c.toLowerCase().includes(crop.id) || crop.name.en.toLowerCase().includes(c.split('(')[0].trim().toLowerCase())
                  );

                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => setSelectedCropId(crop.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-[#1b6d24] bg-[#eef5ef] ring-2 ring-[#a0f399] shadow-xs'
                          : 'border-[#dde4de] hover:border-[#1b4d3e] hover:bg-[#f4fbf4]'
                      }`}
                    >
                      {isFarmerCrop && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" title="Your registered crop" />
                      )}
                      <span className="text-xl mb-1">{crop.icon}</span>
                      <span className="font-display text-xs font-bold text-[#003629] leading-tight line-clamp-2">
                        {crop.name[currentLang] || crop.name.en}
                      </span>
                      <span className="text-[9px] text-[#707974] mt-1 font-mono">
                        {crop.rdf.n}:{crop.rdf.p}:{crop.rdf.k}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field Size & Soil Fertility Tuning */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-3 border-t border-[#dde4de]">
              {/* Field Size Input with quick buttons */}
              <div className="sm:col-span-6 space-y-2">
                <label className="block text-xs font-bold text-[#404945]">
                  {l.fieldAreaLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="100"
                    value={fertilizerAcres}
                    onChange={(e) => setFertilizerAcres(Math.max(0.25, parseFloat(e.target.value) || 1))}
                    className="flex-1 px-3.5 py-2.5 text-sm font-black rounded-xl border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
                  />
                  <div className="flex items-center gap-1">
                    {[1, 2, 5, 10].map((ac) => (
                      <button
                        key={ac}
                        type="button"
                        onClick={() => setFertilizerAcres(ac)}
                        className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-colors ${
                          fertilizerAcres === ac
                            ? 'bg-[#003629] text-white border-[#003629]'
                            : 'bg-white text-[#404945] border-[#c0c9c3] hover:bg-[#f4fbf4]'
                        }`}
                      >
                        {ac}ac
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Soil Fertility Modifier */}
              <div className="sm:col-span-6 space-y-2">
                <label className="block text-xs font-bold text-[#404945]">
                  {l.soilFertilityLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFertilityModifier('low')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                      fertilityModifier === 'low'
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-white text-[#404945] border-[#c0c9c3] hover:bg-[#f4fbf4]'
                    }`}
                  >
                    {l.fertilityLow}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFertilityModifier('normal')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                      fertilityModifier === 'normal'
                        ? 'bg-[#1b6d24] text-white border-[#1b6d24]'
                        : 'bg-white text-[#404945] border-[#c0c9c3] hover:bg-[#f4fbf4]'
                    }`}
                  >
                    {l.fertilityNormal}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFertilityModifier('high')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                      fertilityModifier === 'high'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-[#404945] border-[#c0c9c3] hover:bg-[#f4fbf4]'
                    }`}
                  >
                    {l.fertilityHigh}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results: Fertilizer Requirement Bags Dashboard */}
          <div className="bg-gradient-to-br from-[#003629] via-[#004838] to-[#1b4d3e] text-white p-5 sm:p-6 rounded-2xl border border-[#a0f399]/40 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#a0f399] block mb-0.5">
                  Recommendation for {fertilizerAcres} Acres • {activeCrop.name[currentLang] || activeCrop.name.en}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold">
                  {l.commercialBagsNeeded}
                </h3>
              </div>

              {/* Estimated Budget Badge */}
              <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#a0f399]" />
                <div>
                  <span className="text-[10px] text-[#baeed9] block font-bold uppercase">Estimated MRP Budget</span>
                  <span className="font-display text-base font-black text-white">
                    ₹{fertPlan.estimatedCostINR.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Main Commercial Bags Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Urea Card */}
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/30 text-[#a0f399] uppercase">
                    Nitrogen (46% N)
                  </span>
                  <Package className="w-4 h-4 text-[#a0f399]" />
                </div>
                <h4 className="font-display text-lg font-black text-white">
                  Neem-Coated Urea
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#a0f399]">
                    {fertPlan.ureaBags}
                  </span>
                  <span className="text-xs font-bold text-[#baeed9]">
                    Bags (45kg)
                  </span>
                </div>
                <p className="text-[11px] text-[#baeed9]">
                  Total: <strong>{fertPlan.ureaKg} kg</strong> • Split into {activeCrop.stages.length} doses
                </p>
              </div>

              {/* DAP Card */}
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/30 text-blue-200 uppercase">
                    Phosphorus (18:46:0)
                  </span>
                  <Package className="w-4 h-4 text-blue-300" />
                </div>
                <h4 className="font-display text-lg font-black text-white">
                  DAP (Di-Ammonium Phos.)
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl sm:text-3xl font-black text-white">
                    {fertPlan.dapBags}
                  </span>
                  <span className="text-xs font-bold text-[#baeed9]">
                    Bags (50kg)
                  </span>
                </div>
                <p className="text-[11px] text-[#baeed9]">
                  Total: <strong>{fertPlan.dapKg} kg</strong> • 100% applied at basal sowing
                </p>
              </div>

              {/* MOP (Potash) Card */}
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/30 text-amber-200 uppercase">
                    Potassium (60% K₂O)
                  </span>
                  <Package className="w-4 h-4 text-amber-300" />
                </div>
                <h4 className="font-display text-lg font-black text-white">
                  MOP (Muriate of Potash)
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl sm:text-3xl font-black text-white">
                    {fertPlan.mopBags}
                  </span>
                  <span className="text-xs font-bold text-[#baeed9]">
                    Bags (50kg)
                  </span>
                </div>
                <p className="text-[11px] text-[#baeed9]">
                  Total: <strong>{fertPlan.mopKg} kg</strong> • Split between basal and fruiting
                </p>
              </div>
            </div>

            {/* Pure Elemental NPK summary bar */}
            <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-[#baeed9]">
              <span className="font-semibold flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[#a0f399]" />
                {l.pureNpkTitle}:
              </span>
              <div className="flex items-center gap-4 font-mono font-bold text-white">
                <span>N: <span className="text-[#a0f399]">{fertPlan.totalPureN} kg</span></span>
                <span>P₂O₅: <span className="text-blue-300">{fertPlan.totalPureP} kg</span></span>
                <span>K₂O: <span className="text-amber-300">{fertPlan.totalPureK} kg</span></span>
              </div>
            </div>
          </div>

          {/* Split-Dosing Application Schedule & Stage Timeline */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c0c9c3] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#003629] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1b6d24]" />
                  {l.splitDoseTitle}
                </h3>
                <p className="text-xs text-[#56605b]">
                  Applying fertilizers in splits prevents nitrogen leaching and maximizes crop nutrient uptake efficiency.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {fertPlan.splitDoses.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl border border-[#dde4de] bg-[#f4fbf4] hover:bg-[#eef5ef] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#003629] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-display text-sm font-bold text-[#003629]">
                          {stage.stageName[currentLang] || stage.stageName.en}
                        </h4>
                        <span className="text-[11px] text-[#707974] font-medium">
                          🕒 {stage.timing[currentLang] || stage.timing.en}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {stage.dapKg > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                          DAP: {stage.dapKg} kg
                        </span>
                      )}
                      {stage.ureaKg > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                          Urea: {stage.ureaKg} kg
                        </span>
                      )}
                      {stage.mopKg > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          MOP: {stage.mopKg} kg
                        </span>
                      )}
                    </div>
                  </div>

                  {stage.notes && (
                    <p className="text-[11px] text-[#404945] italic pl-8">
                      💡 {stage.notes[currentLang] || stage.notes.en}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Micronutrient & Organic Advisory Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Micronutrients */}
            <div className="p-4 rounded-2xl bg-white border border-[#c0c9c3] shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                {l.micronutrientsTitle}
              </span>
              <h4 className="font-display text-sm font-bold text-[#003629]">
                Essential Trace Elements
              </h4>
              <p className="text-xs text-[#404945] leading-relaxed">
                {activeCrop.micronutrients 
                  ? (activeCrop.micronutrients[currentLang] || activeCrop.micronutrients.en)
                  : 'Soil test based application of Zinc Sulphate (10 kg/acre) and Boron (0.2% spray) recommended.'}
              </p>
              <div className="pt-2 border-t border-[#dde4de] text-[11px] text-[#707974]">
                ⚠️ <em>Never mix Zinc Sulphate directly with DAP in the same bucket (causes zinc phosphate precipitation).</em>
              </div>
            </div>

            {/* Organic Base */}
            <div className="p-4 rounded-2xl bg-white border border-[#c0c9c3] shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                {l.organicTitle}
              </span>
              <h4 className="font-display text-sm font-bold text-[#003629]">
                Soil Organic Carbon Booster
              </h4>
              <p className="text-xs text-[#404945] leading-relaxed">
                {activeCrop.organicRequirement
                  ? (activeCrop.organicRequirement[currentLang] || activeCrop.organicRequirement.en)
                  : 'Well-decomposed Farmyard Manure (FYM): 3-4 tonnes/acre or Vermicompost: 1 tonne/acre before final ploughing.'}
              </p>
              <div className="pt-2 border-t border-[#dde4de] text-[11px] text-[#707974]">
                🌿 <em>Mix bio-fertilizers (Azotobacter/PSB) with FYM 10 days before field incorporation.</em>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: SPRAYER & KNAPSACK CALIBRATION (Original module preserved)     */}
      {/* ========================================================================= */}
      {activeModule === 'sprayer' && (
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
                    type="button"
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
                  type="button"
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
                  type="button"
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4] font-bold"
                />
                {farmerProfile && (
                  <p className="text-[10px] text-[#1b6d24] font-semibold mt-1">
                    ✓ Calibrated to your registered farm in {farmerProfile.displayName} ({farmerProfile.landSizeAcres} Acres)
                  </p>
                )}
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
                    {tankSize}L {t.waterLabel}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#f4fbf4] border border-[#dde4de]">
                    <strong className="block text-[#404945]">{t.totalTanksNeeded}:</strong>
                    <span className="font-bold text-[#003629] text-sm">~{totalTanksForPlot}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#f4fbf4] border border-[#dde4de]">
                    <strong className="block text-[#404945]">{t.chemicalLabel || 'Chemical'}:</strong>
                    <span className="font-bold text-[#1b6d24] text-sm">~{totalChemicalForPlot} {productType === 'powder' ? 'g' : 'ml'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#f4fbf4] border border-[#dde4de] text-xs">
                  <strong className="block text-[#404945]">{t.waterLabel || 'Water'}:</strong>
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
      )}
    </div>
  );
};

