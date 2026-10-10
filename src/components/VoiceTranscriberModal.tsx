import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Sparkles, AlertCircle, Languages, Check, X } from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';

interface VoiceTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  targetField: 'cropHint' | 'notes';
  onTranscriptionComplete: (text: string) => void;
}

const INDIAN_LANG_NAMES: Record<SupportedLanguage, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  te: { label: 'Telugu', native: 'తెలుగు' },
  kn: { label: 'Kannada', native: 'ಕನ್ನಡ' },
  ta: { label: 'Tamil', native: 'தமிழ்' },
  gu: { label: 'Gujarati', native: 'ગુજરાતી' }
};

export const VoiceTranscriberModal: React.FC<VoiceTranscriberModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  targetField,
  onTranscriptionComplete,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(currentLang);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setSelectedLang(currentLang);
  }, [currentLang, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      stopRecordingCleanup();
      setTranscribedText('');
      setErrorMessage(null);
      setRecordingSeconds(0);
    }
  }, [isOpen]);

  const stopRecordingCleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_e) {
        // Ignored
      }
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setTranscribedText('');
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Turn off stream tracks
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        await handleSendAudioForTranscription(audioBlob, recorder.mimeType || 'audio/webm');
      };

      recorder.start(250);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage(err.message || 'Microphone access denied. Please allow microphone permissions.');
      setIsRecording(false);
    }
  };

  const stopAndTranscribe = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleSendAudioForTranscription = async (blob: Blob, mimeType: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          // Strip data:audio/xxx;base64, prefix
          const base64Data = res.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);

      const base64Audio = await base64Promise;
      const storedCustomKey = localStorage.getItem('farm_custom_api_key') || undefined;

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: mimeType || 'audio/webm',
          lang: selectedLang,
          targetField: targetField === 'cropHint' ? 'crop type' : 'field pathology observations',
          customApiKey: storedCustomKey
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to transcribe audio speech');
      }

      setTranscribedText(data.text);
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMessage(err.message || 'Failed to transcribe audio. Please retry speaking clearly.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (transcribedText.trim()) {
      onTranscriptionComplete(transcribedText.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#c0c9c3] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#003629] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1b4d3e] text-[#a0f399] flex items-center justify-center border border-[#a0f399]/30">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <span>{t.micRecord}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a0f399] text-[#003629] font-black uppercase">
                  gemini-3.5-transcribe
                </span>
              </h3>
              <p className="text-[11px] text-[#baeed9]">
                {targetField === 'cropHint' ? t.cropTypeOptional : t.fieldNotesOptional}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopRecordingCleanup();
              onClose();
            }}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Language Selection Selector Bar */}
          <div className="bg-[#f4fbf4] p-3 rounded-xl border border-[#c0c9c3]/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#003629] flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-[#1b6d24]" />
                {t.audioLanguageHint}
              </span>
              <span className="text-[10px] font-extrabold text-[#1b6d24] uppercase">
                {INDIAN_LANG_NAMES[selectedLang].native}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(INDIAN_LANG_NAMES) as SupportedLanguage[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLang(l)}
                  disabled={isRecording || isProcessing}
                  className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center ${
                    selectedLang === l
                      ? 'bg-[#1b6d24] text-white shadow-sm'
                      : 'bg-white text-[#161d19] border border-[#c0c9c3] hover:bg-[#eef5ef]'
                  }`}
                >
                  <span className="text-[11px] leading-tight">{INDIAN_LANG_NAMES[l].native}</span>
                  <span className="text-[9px] opacity-80 uppercase">{l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recording Visualizer Centerpiece */}
          <div className="py-6 flex flex-col items-center justify-center text-center">
            {isRecording ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 animate-ping absolute inset-0" />
                  <div className="w-20 h-20 rounded-full bg-[#ba1a1a] flex items-center justify-center text-white relative shadow-lg">
                    <Mic className="w-8 h-8 animate-pulse" />
                  </div>
                </div>
                <div className="text-lg font-black text-[#ba1a1a] font-mono">
                  00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </div>
                <p className="text-xs font-semibold text-[#161d19] mt-1">
                  {t.micListening}
                </p>
                <p className="text-[11px] text-[#707974] max-w-xs mt-0.5">
                  {t.micSpeakNow}
                </p>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center py-3">
                <div className="w-16 h-16 rounded-2xl bg-[#eef5ef] text-[#1b6d24] flex items-center justify-center mb-3 border border-[#a0f399]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1b6d24]" />
                </div>
                <p className="font-display text-sm font-bold text-[#003629]">
                  {t.micTranscribing}
                </p>
                <p className="text-xs text-[#707974] mt-1">
                  Using gemini-3.5-transcribe in {INDIAN_LANG_NAMES[selectedLang].native}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={startRecording}
                  className="w-20 h-20 rounded-full bg-[#1b6d24] hover:bg-[#165a1e] flex items-center justify-center text-white shadow-xl transition-all active:scale-95 group mb-3"
                  title="Click to start microphone audio recording"
                >
                  <Mic className="w-8 h-8 text-[#a0f399] group-hover:scale-110 transition-transform" />
                </button>
                <p className="font-display text-sm font-bold text-[#161d19]">
                  {transcribedText ? 'Tap microphone to re-record' : 'Tap to start speaking'}
                </p>
                <p className="text-xs text-[#707974] max-w-xs mt-0.5">
                  {t.micSpeakNow}
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Transcribed Text Preview Editor */}
          {transcribedText && (
            <div className="bg-[#f4fbf4] rounded-xl p-3 border border-[#a0f399]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#1b6d24] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Transcribed Result:
                </span>
                <span className="text-[10px] font-mono text-[#707974] uppercase">
                  {selectedLang}
                </span>
              </div>
              <textarea
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-[#c0c9c3] bg-white focus:outline-none focus:border-[#1b6d24] text-[#161d19] font-medium resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f8faf8] border-t border-[#dde4de] flex items-center justify-end gap-2.5">
          {isRecording ? (
            <button
              onClick={stopAndTranscribe}
              className="px-5 py-2.5 rounded-xl bg-[#ba1a1a] text-white hover:bg-[#93000a] text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{t.micDone}</span>
            </button>
          ) : transcribedText ? (
            <>
              <button
                onClick={() => {
                  setTranscribedText('');
                  startRecording();
                }}
                className="px-3.5 py-2 rounded-xl border border-[#707974] text-xs font-bold text-[#003629] hover:bg-white"
              >
                Re-record
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2 rounded-xl bg-[#1b6d24] text-white hover:bg-[#165a1e] text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Apply to Field Notes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                stopRecordingCleanup();
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-[#707974] text-xs font-bold text-[#003629] hover:bg-white"
            >
              {t.dismiss}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
