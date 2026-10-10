/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { ScannerHero } from './components/ScannerHero';
import { DiagnosisResult } from './components/DiagnosisResult';
import { CalculatorPage } from './components/CalculatorPage';
import { CropGuidePage } from './components/CropGuidePage';
import { HistoryPage } from './components/HistoryPage';
import { FlutterExportModal } from './components/FlutterExportModal';
import { AiEngineModal } from './components/AiEngineModal';
import { FarmerRegistrationModal } from './components/FarmerRegistrationModal';
import { CropSample, CropDiagnosis, HistoryItem, SupportedLanguage, AndroidAppTab, FarmerProfile } from './types/farm';
import { TRANSLATIONS } from './data/translations';
import { getLocalizedSamples } from './data/samples';
import { DEFAULT_FARMER_PROFILE } from './data/registrationData';
import { AlertCircle, Scan, Cpu } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'farm_crop_scan_history';
const STORAGE_KEY_LANG = 'farm_crop_preferred_lang';
const STORAGE_KEY_CONTRAST = 'farm_crop_high_contrast';
const STORAGE_KEY_FARMER_PROFILE = 'farm_farmer_profile';

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANG) as SupportedLanguage;
      if (saved && ['en', 'hi', 'te', 'kn', 'ta', 'gu'].includes(saved)) {
        return saved;
      }
    }
    return 'gu';
  });
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AndroidAppTab>('scan');

  const [samples, setSamples] = useState<CropSample[]>(() => getLocalizedSamples('gu'));
  const [selectedSample, setSelectedSample] = useState<CropSample | null>(null);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Farmer profile & one-time registration state
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_FARMER_PROFILE);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse farmer profile:', e);
        }
      }
    }
    return null;
  });

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_FARMER_PROFILE);
      // Auto-open on first time visit if no registered profile exists!
      return !saved;
    }
    return false;
  });

  const [isInitialOnboarding, setIsInitialOnboarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem(STORAGE_KEY_FARMER_PROFILE);
    }
    return true;
  });

  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as SupportedLanguage;
    if (savedLang && ['en', 'hi', 'te', 'kn', 'ta', 'gu'].includes(savedLang)) {
      setCurrentLang(savedLang);
      setSamples(getLocalizedSamples(savedLang));
    } else {
      setCurrentLang('gu');
      setSamples(getLocalizedSamples('gu'));
      localStorage.setItem(STORAGE_KEY_LANG, 'gu');
    }

    const savedContrast = localStorage.getItem(STORAGE_KEY_CONTRAST);
    if (savedContrast) setHighContrast(savedContrast === 'true');

    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }

    const savedProfile = localStorage.getItem(STORAGE_KEY_FARMER_PROFILE);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setFarmerProfile(parsed);
        setIsInitialOnboarding(false);
      } catch (e) {
        console.error('Failed to parse saved farmer profile:', e);
      }
    } else {
      setIsInitialOnboarding(true);
      setIsRegistrationModalOpen(true);
    }
  }, []);

  const handleSaveProfile = (profile: FarmerProfile) => {
    setFarmerProfile(profile);
    localStorage.setItem(STORAGE_KEY_FARMER_PROFILE, JSON.stringify(profile));
    setIsInitialOnboarding(false);

    if (profile.preferredLanguage && profile.preferredLanguage !== currentLang) {
      handleLanguageChange(profile.preferredLanguage);
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    setSamples(getLocalizedSamples(lang));

    if (selectedSample) {
      const updatedSample = getLocalizedSamples(lang).find(s => s.id === selectedSample.id);
      if (updatedSample) {
        setSelectedSample(updatedSample);
        executeDiagnosis(updatedSample.id, null, updatedSample.cropName, '', lang);
      }
    }
  };

  const handleToggleHighContrast = () => {
    const nextVal = !highContrast;
    setHighContrast(nextVal);
    localStorage.setItem(STORAGE_KEY_CONTRAST, String(nextVal));
  };

  const handleSelectSample = (sample: CropSample) => {
    setSelectedSample(sample);
    setCustomImageBase64(null);
    setCustomFile(null);
    setPreviewImage(sample.thumbnail);
    setErrorMessage(null);

    executeDiagnosis(sample.id, null, sample.cropName, '', currentLang);
  };

  const handleCustomImageSelected = (base64: string, file: File) => {
    setSelectedSample(null);
    setCustomImageBase64(base64);
    setCustomFile(file);
    setPreviewImage(base64);
    setErrorMessage(null);
  };

  const executeDiagnosis = async (
    sampleId?: string, 
    base64?: string | null, 
    cropHint?: string, 
    notes?: string,
    langToUse: SupportedLanguage = currentLang
  ) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const targetBase64 = base64 || customImageBase64;
      const targetSampleId = sampleId || selectedSample?.id;

      if (!targetBase64 && !targetSampleId) {
        throw new Error("No image data available for analysis. Please capture or select an image.");
      }

      const mimeType = customFile ? customFile.type : 'image/jpeg';

      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleId: targetSampleId,
          imageBase64: targetBase64 || undefined,
          mimeType,
          cropHint: cropHint || undefined,
          additionalNotes: notes || undefined,
          lang: langToUse,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.diagnosis) {
        throw new Error(data.error || 'Diagnostic error occurred while analyzing specimen.');
      }

      const result: CropDiagnosis = data.diagnosis;
      setDiagnosis(result);

      const newHistoryItem: HistoryItem = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        cropName: result.cropName,
        diagnosisName: result.diagnosisName,
        severityLevel: result.severityLevel,
        healthScore: result.healthScore,
        imageUrl: previewImage || (selectedSample ? selectedSample.thumbnail : undefined),
        diagnosis: result
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));

      setActiveTab('diagnosis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setErrorMessage(err.message || 'Diagnostic error occurred while connecting to server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setDiagnosis(item.diagnosis);
    if (item.imageUrl) {
      setPreviewImage(item.imageUrl);
    }
    setActiveTab('diagnosis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetScan = () => {
    setDiagnosis(null);
    setSelectedSample(null);
    setCustomImageBase64(null);
    setCustomFile(null);
    setPreviewImage(null);
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCropFromGuide = (_cropName: string) => {
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = TRANSLATIONS[currentLang];

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      highContrast 
        ? 'bg-[#001710] text-white' 
        : 'bg-[#f4fbf4] text-[#161d19]'
    }`}>
      <AndroidTopBar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleHighContrast}
        onOpenFlutterExport={() => setIsFlutterModalOpen(true)}
        onOpenAiSetup={() => setIsAiModalOpen(true)}
        farmerProfile={farmerProfile}
        onOpenProfileModal={() => setIsRegistrationModalOpen(true)}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-3.5 sm:py-6 pb-28 sm:pb-32 space-y-4 sm:space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="font-extrabold underline"
            >
              {t.dismiss}
            </button>
          </div>
        )}

        {activeTab === 'scan' && (
          <ScannerHero
            currentLang={currentLang}
            highContrast={highContrast}
            samples={samples}
            selectedSample={selectedSample}
            onSelectSample={handleSelectSample}
            onCustomImageSelected={handleCustomImageSelected}
            onStartDiagnosis={(cropHint, notes) => executeDiagnosis(undefined, customImageBase64, cropHint, notes, currentLang)}
            isAnalyzing={isAnalyzing}
            previewImage={previewImage}
            farmerProfile={farmerProfile}
            onOpenProfileModal={() => setIsRegistrationModalOpen(true)}
          />
        )}

        {activeTab === 'diagnosis' && (
          diagnosis ? (
            <DiagnosisResult
              diagnosis={diagnosis}
              imageUrl={previewImage}
              currentLang={currentLang}
              highContrast={highContrast}
              onReset={handleResetScan}
              onOpenDosageCalculator={() => setActiveTab('calculator')}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-[#c0c9c3] p-10 text-center max-w-md mx-auto shadow-sm my-8">
              <div className="w-14 h-14 rounded-2xl bg-[#e8f0e9] text-[#1b6d24] flex items-center justify-center mx-auto mb-3">
                <Scan className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#161d19] mb-1">
                {t.noActiveDiagnosis}
              </h3>
              <p className="text-xs text-[#707974] mb-6">
                {t.noActiveDiagnosisDesc}
              </p>
              <button
                onClick={() => setActiveTab('scan')}
                className="w-full py-3 px-5 rounded-xl bg-[#003629] text-white font-display text-xs font-bold hover:bg-[#1b4d3e] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <Scan className="w-4 h-4 text-[#a0f399]" />
                {t.goToScanner}
              </button>
            </div>
          )
        )}

        {activeTab === 'calculator' && (
          <CalculatorPage currentLang={currentLang} farmerProfile={farmerProfile} />
        )}

        {activeTab === 'guide' && (
          <CropGuidePage
            currentLang={currentLang}
            onSelectCropForScan={handleSelectCropFromGuide}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            history={history}
            onSelectHistory={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            currentLang={currentLang}
            onStartNewScan={() => setActiveTab('scan')}
          />
        )}

        {/* Discreet footer information link */}
        <footer className="pt-8 pb-3 border-t border-[#c0c9c3]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#707974]">
          <span className="opacity-75">{t.appName} • {t.tagline}</span>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="text-[11px] text-[#56605b] hover:text-[#003629] hover:underline flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity"
            title="Inspect diagnostic engine architecture"
          >
            <Cpu className="w-3.5 h-3.5 text-[#1b6d24]" />
            <span>{t.aiEngine}</span>
          </button>
        </footer>
      </main>

      <AndroidNavBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
        hasDiagnosis={!!diagnosis}
        historyCount={history.length}
      />

      <FlutterExportModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />

      <AiEngineModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentLang={currentLang}
      />

      <FarmerRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        farmerProfile={farmerProfile}
        onSaveProfile={handleSaveProfile}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        isInitialOnboarding={isInitialOnboarding}
      />
    </div>
  );
}
