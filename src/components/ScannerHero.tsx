import React, { useRef, useState } from 'react';
import { Camera, Upload, Scan, CheckCircle2, ChevronRight, HelpCircle, Mic, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CropSample, SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';
import { VoiceTranscriberModal } from './VoiceTranscriberModal';
import { QuickFarmingTips } from './QuickFarmingTips';

interface ScannerHeroProps {
  currentLang: SupportedLanguage;
  highContrast: boolean;
  samples: CropSample[];
  selectedSample: CropSample | null;
  onSelectSample: (sample: CropSample) => void;
  onCustomImageSelected: (base64: string, file: File) => void;
  onStartDiagnosis: (cropHint: string, notes: string) => void;
  isAnalyzing: boolean;
  previewImage: string | null;
}

// Client-side image compressor for high-speed, reliable field uploads
function resizeImageFile(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const ScannerHero: React.FC<ScannerHeroProps> = ({
  currentLang,
  highContrast,
  samples,
  selectedSample,
  onSelectSample,
  onCustomImageSelected,
  onStartDiagnosis,
  isAnalyzing,
  previewImage,
}) => {
  const t = TRANSLATIONS[currentLang];
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropHint, setCropHint] = useState<string>('');
  const [fieldNotes, setFieldNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [voiceTarget, setVoiceTarget] = useState<'cropHint' | 'notes'>('notes');

  const handleProcessFile = async (file: File) => {
    try {
      const optimizedBase64 = await resizeImageFile(file);
      onCustomImageSelected(optimizedBase64, file);
    } catch (_err) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onCustomImageSelected(reader.result, file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleProcessFile(file);
    }
  };

  return (
    <section className="w-full space-y-4">
      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Left Side: Upload & Camera Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 transition-all p-3.5 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] sm:min-h-[360px] ${
              isDragOver 
                ? 'border-[#1b6d24] bg-[#eef5ef]' 
                : highContrast
                  ? 'border-white/40 bg-[#001710]'
                  : 'border-dashed border-[#707974]/40 bg-white shadow-sm'
            }`}
          >
            {/* Hidden native inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewImage ? (
              <div className="w-full flex flex-col items-center">
                {/* Image Inspection viewport */}
                <div className="relative w-full max-h-[320px] rounded-xl overflow-hidden bg-black/5 flex items-center justify-center border border-[#c0c9c3]">
                  <img
                    src={previewImage}
                    alt="Inspected crop leaf specimen"
                    className="max-h-[320px] w-full object-contain"
                  />

                  {/* Scanning HUD Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-[#003629]/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white px-4">
                      <div className="w-full absolute top-0 h-1 bg-gradient-to-r from-transparent via-[#a0f399] to-transparent animate-pulse" />
                      <div className="w-14 h-14 rounded-full border-4 border-[#a0f399] border-t-transparent animate-spin mb-3" />
                      <p className="font-display text-base sm:text-lg font-bold tracking-wide text-center">
                        {t.analyzingLeaf}
                      </p>
                      <p className="text-xs text-[#a0f399] max-w-xs text-center mt-1">
                        {t.analyzingSub}
                      </p>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#003629]/85 text-[#a0f399] text-[11px] font-bold backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a0f399]" />
                    {t.specimenReady}
                  </div>
                </div>

                {/* Retake & Change Controls */}
                <div className="flex items-center gap-2 sm:gap-3 mt-3 w-full">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="flex-1 min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl bg-white border border-[#707974] text-[#003629] hover:bg-[#eef5ef] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    {t.retakePhoto}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="flex-1 min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl bg-white border border-[#707974] text-[#003629] hover:bg-[#eef5ef] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    {t.changeFile}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center text-center py-4 sm:py-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#e8f0e9] text-[#1b6d24] flex items-center justify-center mb-3">
                  <Scan className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#161d19] mb-1">
                  {t.captureOrUpload}
                </h3>
                <p className="text-xs text-[#56605b] max-w-sm mb-5 px-2">
                  {t.captureGuide}
                </p>

                {/* Responsive Touch-Friendly Camera & Upload Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="min-h-[50px] px-4 py-3 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <Camera className="w-5 h-5 text-[#a0f399]" />
                    {t.takePhoto}
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[50px] px-4 py-3 rounded-xl bg-[#eef5ef] text-[#003629] border border-[#a0f399] hover:bg-[#e0ede2] font-display text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <Upload className="w-5 h-5 text-[#1b6d24]" />
                    {t.uploadLeaf}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Optional Crop & Voice Notes Input */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#c0c9c3] shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#404945]">
                    {t.cropTypeOptional}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceTarget('cropHint');
                      setIsVoiceModalOpen(true);
                    }}
                    title="Speak crop type"
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1b6d24] hover:text-[#165a1e] px-1.5 py-0.5 rounded hover:bg-[#eef5ef] transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#1b6d24]" />
                    <span>{t.micRecord}</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Tomato, Paddy, Cotton"
                  value={cropHint}
                  onChange={(e) => setCropHint(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#404945]">
                    {t.fieldNotesOptional}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceTarget('notes');
                      setIsVoiceModalOpen(true);
                    }}
                    title="Speak field notes"
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1b6d24] hover:text-[#165a1e] px-2 py-1 rounded-lg hover:bg-[#eef5ef] active:bg-[#e0ede2] transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#1b6d24]" />
                    <span>{t.micRecord}</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Yellowing spots, curled margins"
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4]"
                />
              </div>
            </div>

            {/* Run Diagnosis Action Button */}
            {previewImage && (
              <button
                onClick={() => onStartDiagnosis(cropHint, fieldNotes)}
                disabled={isAnalyzing}
                className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#1b6d24] hover:bg-[#165a1e] text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Scan className="w-5 h-5 text-[#a0f399]" />
                <span>{isAnalyzing ? t.analyzingLeaf : t.runDiagnosis}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Quick-Test Demo Samples Library */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-[#c0c9c3] p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-[#161d19] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1b6d24]" />
                  {t.instantDemoSamples}
                </h3>
                <p className="text-[11px] text-[#56605b]">
                  {t.tapToTest}
                </p>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#e8f0e9] text-[#1b4d3e]">
                {samples.length} Ready
              </span>
            </div>

            {/* Grid layout on mobile for cleaner browsing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[480px] overflow-y-auto pr-0.5">
              {samples.map((sample) => {
                const isSelected = selectedSample?.id === sample.id;
                const isHealthy = sample.category === 'Healthy';

                return (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    disabled={isAnalyzing}
                    className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#1b6d24] bg-[#eef5ef] ring-2 ring-[#a0f399]'
                        : 'border-[#dde4de] hover:border-[#1b4d3e] hover:bg-[#f4fbf4]'
                    }`}
                  >
                    <img
                      src={sample.thumbnail}
                      alt={sample.leafIssue}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0 border border-[#c0c9c3]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-[#003629] truncate">
                          {sample.cropName}
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                          isHealthy
                            ? 'bg-[#a0f399] text-[#003629]'
                            : sample.severity === 'Critical'
                              ? 'bg-[#ffdad6] text-[#ba1a1a]'
                              : 'bg-[#ffdbcf] text-[#7d2800]'
                        }`}>
                          {sample.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#404945] truncate font-medium">
                        {sample.leafIssue}
                      </p>
                      <p className="text-[10px] text-[#707974] line-clamp-1 italic">
                        {sample.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#dde4de] text-[11px] text-[#404945] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#1b6d24] flex-shrink-0" />
              <span>{t.worksOffline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Farming Tips with Offline Caching */}
      <QuickFarmingTips currentLang={currentLang} />

      {/* Audio speech-to-text transcription modal */}
      <VoiceTranscriberModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLang={currentLang}
        targetField={voiceTarget}
        onTranscriptionComplete={(text) => {
          if (voiceTarget === 'cropHint') {
            setCropHint((prev) => (prev ? `${prev}, ${text}` : text));
          } else {
            setFieldNotes((prev) => (prev ? `${prev} ${text}` : text));
          }
        }}
      />
    </section>
  );
};
