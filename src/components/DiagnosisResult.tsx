import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Printer, 
  ShieldAlert, 
  Leaf, 
  Droplets, 
  Calendar, 
  Clock, 
  Share2, 
  Sparkles, 
  Check, 
  Info,
  Bug,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { CropDiagnosis, SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';

interface DiagnosisResultProps {
  diagnosis: CropDiagnosis;
  imageUrl?: string | null;
  currentLang: SupportedLanguage;
  highContrast: boolean;
  onReset: () => void;
  onOpenDosageCalculator: () => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  diagnosis,
  imageUrl,
  currentLang,
  highContrast,
  onReset,
  onOpenDosageCalculator,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'treatment' | 'damage' | 'timeline' | 'calculator'>('treatment');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedPrescription, setCopiedPrescription] = useState<boolean>(false);

  // Knapsack quick calc state within the result card
  const [tankLiters, setTankLiters] = useState<number>(16);
  const [farmAcres, setFarmAcres] = useState<number>(1);

  // Audio speech synthesis
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const narrationText = `${diagnosis.cropName}. ${diagnosis.diagnosisName}. ${diagnosis.farmerVernacularSummary}. ${diagnosis.treatmentPlan.immediateSteps.join('. ')}.`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    
    // Set appropriate Indian language code
    const langMap: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ta: 'ta-IN'
    };
    utterance.lang = langMap[currentLang] || 'en-US';
    utterance.rate = 0.95; // Slightly slower for clarity in field conditions

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPrescription = () => {
    const text = `${t.appName} ${t.navDiagnosis}:
${diagnosis.cropName} - ${diagnosis.diagnosisName} (${diagnosis.issueType})
${t.healthMeter}: ${diagnosis.healthScore}/100
${diagnosis.treatmentPlan.chemicalSolutions.map(c => `${c.activeIngredient} (${c.commercialNames}) @ ${c.dosagePerLiter}`).join(' / ')}
${diagnosis.treatmentPlan.organicSolutions.map(o => o.name).join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopiedPrescription(true);
    setTimeout(() => setCopiedPrescription(false), 3000);
  };

  const isHealthy = diagnosis.issueType === 'Healthy Crop';
  const isCritical = diagnosis.severityLevel === 'Critical';
  const isSevere = diagnosis.severityLevel === 'Severe';

  // Severity indicator color
  const statusBadgeColor = isHealthy
    ? 'bg-[#a0f399] text-[#003629] border-[#1b6d24]'
    : isCritical
      ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]'
      : isSevere
        ? 'bg-[#ffdbcf] text-[#7d2800] border-[#7d2800]'
        : 'bg-[#ffeed3] text-[#805000] border-[#c47c00]';

  return (
    <div className="w-full space-y-6 print:space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#c0c9c3] shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#707974] text-xs font-bold text-[#003629] hover:bg-[#eef5ef] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.scanAnother}
          </button>
          <span className="text-xs text-[#707974]">|</span>
          <span className="text-xs font-bold text-[#003629]">
            {t.confidence}: {diagnosis.confidenceScore}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio speech button */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              isPlayingAudio
                ? 'bg-[#ba1a1a] text-white animate-pulse'
                : 'bg-[#1b4d3e] text-white hover:bg-[#256653]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-white" />
                {t.stopAudio}
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#a0f399]" />
                {t.listenPrescription}
              </>
            )}
          </button>

          {/* Copy slip button */}
          <button
            onClick={handleCopyPrescription}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-[#c0c9c3] bg-white text-[#003629] hover:bg-[#eef5ef]"
          >
            {copiedPrescription ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copiedPrescription ? t.copied : t.share}
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-[#c0c9c3] bg-white text-[#003629] hover:bg-[#eef5ef]"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{t.printReport}</span>
          </button>
        </div>
      </div>

      {/* Main Diagnostic Header Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        highContrast
          ? 'bg-[#002117] border-white text-white'
          : 'bg-white border-[#c0c9c3] shadow-md'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Image Thumbnail preview if available */}
          {imageUrl && (
            <div className="md:col-span-3">
              <div className="relative rounded-xl overflow-hidden border border-[#c0c9c3] max-h-52 bg-black/5">
                <img
                  src={imageUrl}
                  alt={diagnosis.diagnosisName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                  {t.fieldSpecimen}
                </div>
              </div>
            </div>
          )}

          {/* Primary Diagnosis Details */}
          <div className={imageUrl ? 'md:col-span-9' : 'md:col-span-12'}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${statusBadgeColor}`}>
                {diagnosis.severityLevel}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#e8f0e9] text-[#1b4d3e]">
                {diagnosis.issueType}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#f4fbf4] text-[#003629] border border-[#c0c9c3]">
                {diagnosis.cropName}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#003629] mb-1">
              {diagnosis.diagnosisName}
            </h2>
            <p className="text-xs text-[#707974] italic mb-4">
              {t.pathogen}: {diagnosis.scientificPathogen}
            </p>

            {/* Farmer Vernacular Plain-Language Banner */}
            <div className="p-3.5 rounded-xl bg-[#eef5ef] border border-[#a0f399] flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-[#1b6d24] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1b6d24] block">
                  {t.prescriptionSummary}:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#161d19] leading-snug">
                  {diagnosis.farmerVernacularSummary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Gauges: Health Index, Affected Area, Potential Yield Loss */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#dde4de]">
          {/* Health Score */}
          <div className="p-4 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#404945]">
                {t.healthMeter}
              </span>
              <span className="text-xs font-extrabold text-[#003629]">
                {diagnosis.healthScore} / 100
              </span>
            </div>
            <div className="w-full bg-[#dde4de] h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  diagnosis.healthScore >= 80 
                    ? 'bg-[#1b6d24]' 
                    : diagnosis.healthScore >= 50 
                      ? 'bg-amber-500' 
                      : 'bg-[#ba1a1a]'
                }`}
                style={{ width: `${diagnosis.healthScore}%` }}
              />
            </div>
          </div>

          {/* Affected Canopy Area */}
          <div className="p-4 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#404945]">
                {t.affectedCanopy}
              </span>
              <span className="text-xs font-extrabold text-[#7d2800]">
                ~{diagnosis.affectedAreaPercentage}%
              </span>
            </div>
            <div className="w-full bg-[#dde4de] h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff976f] transition-all duration-1000"
                style={{ width: `${diagnosis.affectedAreaPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-[#707974] mt-1.5 font-medium">
              {diagnosis.damageAnalysis.spreadRate}
            </p>
          </div>

          {/* Yield Loss Risk */}
          <div className="p-4 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#404945]">
                {t.yieldRisk}
              </span>
              <span className="text-xs font-extrabold text-[#ba1a1a]">
                {diagnosis.damageAnalysis.potentialYieldLossPercent}%
              </span>
            </div>
            <div className="w-full bg-[#dde4de] h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ba1a1a] transition-all duration-1000"
                style={{ width: `${diagnosis.damageAnalysis.potentialYieldLossPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#c0c9c3] gap-2 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTab('treatment')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'treatment'
              ? 'border-[#003629] text-[#003629]'
              : 'border-transparent text-[#707974] hover:text-[#003629]'
          }`}
        >
          <Droplets className="w-4 h-4 text-[#1b6d24]" />
          {t.tabTreatments}
        </button>

        <button
          onClick={() => setActiveTab('damage')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'damage'
              ? 'border-[#003629] text-[#003629]'
              : 'border-transparent text-[#707974] hover:text-[#003629]'
          }`}
        >
          <Bug className="w-4 h-4 text-[#7d2800]" />
          {t.tabDamage}
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'border-[#003629] text-[#003629]'
              : 'border-transparent text-[#707974] hover:text-[#003629]'
          }`}
        >
          <Calendar className="w-4 h-4 text-teal-700" />
          {t.tabTimeline}
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'calculator'
              ? 'border-[#003629] text-[#003629]'
              : 'border-transparent text-[#707974] hover:text-[#003629]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          {t.tabCalculator}
        </button>
      </div>

      {/* Tab 1: Treatments & Prescriptions */}
      {activeTab === 'treatment' && (
        <div className="space-y-6">
          {/* Immediate Steps (First 24 Hours) */}
          <div className="bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm">
            <h3 className="font-display text-base font-bold text-[#003629] flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#ba1a1a]" />
              {t.immediateAction}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {diagnosis.treatmentPlan.immediateSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#eef5ef] border border-[#a0f399] flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1b6d24] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-semibold text-[#161d19] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chemical Treatment Options */}
          {diagnosis.treatmentPlan.chemicalSolutions.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-[#003629] flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-[#1b6d24]" />
                  {t.chemicalControl}
                </h3>
                <span className="text-[11px] font-bold text-[#707974]">
                  {t.approvedChemicals}
                </span>
              </div>

              <div className="space-y-3">
                {diagnosis.treatmentPlan.chemicalSolutions.map((chem, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#dde4de] hover:border-[#1b6d24] transition-all bg-[#f4fbf4]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="font-display text-sm font-bold text-[#003629]">
                          {chem.activeIngredient}
                        </span>
                        <span className="text-xs text-[#404945] block sm:inline sm:ml-2">
                          ({t.tradeNames}: <strong>{chem.commercialNames}</strong>)
                        </span>
                      </div>

                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#ffdbcf] text-[#7d2800] self-start sm:self-auto">
                        {t.waitingPeriod}: {chem.safetyWaitingPeriodDays} {t.days}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#161d19] pt-2 border-t border-[#dde4de]/60">
                      <div>
                        <strong className="text-[#1b4d3e]">{t.recommendedDosage}:</strong> {chem.dosagePerLiter}
                      </div>
                      <div>
                        <strong className="text-[#1b4d3e]">{t.acreDilution}:</strong> {chem.recommendedDilution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organic & Biological Solutions */}
          {diagnosis.treatmentPlan.organicSolutions.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm">
              <h3 className="font-display text-base font-bold text-[#003629] flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-[#1b6d24]" />
                {t.organicRemedies}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagnosis.treatmentPlan.organicSolutions.map((org, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#dde4de] bg-[#f4fbf4]">
                    <h4 className="font-display text-sm font-bold text-[#003629] mb-1">
                      {org.name}
                    </h4>
                    <p className="text-xs text-[#404945] mb-3">
                      <strong>{t.culturalPractice}:</strong> {org.preparation}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#1b6d24] font-medium pt-2 border-t border-[#dde4de]">
                      <span>{org.applicationRate}</span>
                      <span>{org.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spraying Guidelines & Weather Safety */}
          <div className="bg-[#1b4d3e] text-white p-6 rounded-2xl shadow-md">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#a0f399]" />
              {t.sprayGuidelines}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-black/20">
                <strong className="block text-[#a0f399] mb-1">{t.timingWindow}:</strong>
                <p>{diagnosis.treatmentPlan.sprayingGuidelines.bestTiming}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/20">
                <strong className="block text-[#a0f399] mb-1">{t.weatherDrift}:</strong>
                <p>{diagnosis.treatmentPlan.sprayingGuidelines.weatherPrecautions}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/20">
                <strong className="block text-[#a0f399] mb-1">{t.safetyGear}:</strong>
                <p>{diagnosis.treatmentPlan.sprayingGuidelines.ppeRequired.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Damage & Visual Symptoms */}
      {activeTab === 'damage' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm">
            <h3 className="font-display text-base font-bold text-[#003629] mb-3">
              {t.foliarPathology}
            </h3>
            <p className="text-sm text-[#161d19] leading-relaxed mb-6">
              {diagnosis.damageAnalysis.leafDamageDescription}
            </p>

            <h4 className="font-display text-sm font-bold text-[#003629] mb-3">
              {t.visualSymptomsTitle}:
            </h4>
            <div className="space-y-2.5">
              {diagnosis.visualSymptoms.map((sym, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
                  <CheckCircle className="w-5 h-5 text-[#1b6d24] flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-[#161d19]">
                    {sym}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#dde4de]">
              <span className="text-xs font-bold text-[#404945] block mb-2">
                {t.vulnerablePartsTitle}:
              </span>
              <div className="flex flex-wrap gap-2">
                {diagnosis.damageAnalysis.vulnerableParts.map((part, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg text-xs font-bold bg-[#ffdbcf] text-[#7d2800]">
                    {part}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Long term cultural preventative measures */}
          <div className="bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm">
            <h3 className="font-display text-base font-bold text-[#003629] mb-3">
              {t.prevention}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#404945]">
              {diagnosis.treatmentPlan.preventativeMeasures.map((prev, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1b6d24] font-bold">•</span>
                  <span>{prev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: 14-Day Recovery Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm">
          <h3 className="font-display text-base font-bold text-[#003629] mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1b6d24]" />
            {t.recoveryTimeline}
          </h3>

          <div className="relative border-l-2 border-[#1b6d24]/30 ml-4 space-y-6 mt-6">
            {diagnosis.recoveryTimeline.map((item, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#1b6d24] border-2 border-white" />
                <div className="p-4 rounded-xl bg-[#f4fbf4] border border-[#dde4de]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-extrabold text-[#1b6d24] uppercase tracking-wider">
                      {t.dayLabel} {item.day}
                    </span>
                    <span className="text-xs font-bold text-[#003629]">
                      {item.expectedMilestone}
                    </span>
                  </div>
                  <p className="text-xs text-[#161d19] font-medium leading-relaxed">
                    <strong>{t.farmerAction}:</strong> {item.actionRequired}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Sprayer Tank Calculator */}
      {activeTab === 'calculator' && (
        <div className="bg-white p-6 rounded-2xl border border-[#c0c9c3] shadow-sm">
          <h3 className="font-display text-base font-bold text-[#003629] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1b6d24]" />
            {t.calculatorTitle}
          </h3>
          <p className="text-xs text-[#404945] mb-6">
            {t.calibrationSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#404945] mb-1">
                  {t.tankSize}
                </label>
                <div className="flex gap-2">
                  {[15, 16, 20, 25, 200].map((size) => (
                    <button
                      key={size}
                      onClick={() => setTankLiters(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        tankLiters === size
                          ? 'bg-[#003629] text-white border-[#003629]'
                          : 'bg-white text-[#161d19] border-[#c0c9c3] hover:bg-[#eef5ef]'
                      }`}
                    >
                      {size}L
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#404945] mb-1">
                  {t.plotArea}
                </label>
                <input
                  type="number"
                  min="0.25"
                  max="50"
                  step="0.25"
                  value={farmAcres}
                  onChange={(e) => setFarmAcres(Math.max(0.25, parseFloat(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24]"
                />
              </div>
            </div>

            {/* Calculated Prescription Tank Card */}
            <div className="p-5 rounded-xl bg-[#eef5ef] border border-[#a0f399]">
              <span className="text-[11px] font-bold text-[#1b6d24] uppercase tracking-wider block mb-1">
                {t.tankFormulation}:
              </span>
              <h4 className="font-display text-lg font-bold text-[#003629] mb-3">
                {t.forOneTank} ({tankLiters}L)
              </h4>

              <div className="space-y-2 text-xs">
                {diagnosis.treatmentPlan.chemicalSolutions.slice(0, 1).map((chem, idx) => {
                  const match = chem.dosagePerLiter.match(/([\d\.]+)/);
                  const ratePerLiter = match ? parseFloat(match[1]) : 2.5;
                  const tankTotal = (ratePerLiter * tankLiters).toFixed(1);

                  return (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-[#dde4de]">
                      <div className="font-bold text-[#003629]">
                        {chem.activeIngredient}
                      </div>
                      <div className="text-sm font-extrabold text-[#1b6d24] mt-1">
                        {tankTotal} g/ml in {tankLiters}L
                      </div>
                      <p className="text-[11px] text-[#707974] mt-1">
                        {t.totalTanksNeeded} ({farmAcres} ac): ~{Math.ceil(farmAcres * (200 / tankLiters))}
                      </p>
                    </div>
                  );
                })}

                <div className="text-[11px] text-[#404945] pt-1">
                  {t.slurryTip}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
