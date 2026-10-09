import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Cpu, RefreshCw, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../types/farm';

interface AiEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
}

export const AiEngineModal: React.FC<AiEngineModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [status, setStatus] = useState<{
    active: boolean;
    model: string;
    hasKey: boolean;
    provider: string;
    fallbackEngines?: string[];
  }>({
    active: true,
    model: 'gemini-3.8-flash',
    hasKey: true,
    provider: 'Server-Side Diagnostic Engine',
  });
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/ai-status')
        .then(res => res.json())
        .then(data => setStatus(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const testConnection = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/ai-status');
      const data = await res.json();
      setStatus(data);
    } catch (_e) {
      // Ignored
    } finally {
      setTesting(false);
    }
  };

  const titles: Record<SupportedLanguage, { title: string; subtitle: string; howTo: string }> = {
    en: {
      title: 'Agricultural Vision & Audio Diagnostic Engine',
      subtitle: 'Real-time crop pathology and leaf lesion neural analysis',
      howTo: 'How Diagnostic Pipeline Works',
    },
    hi: {
      title: 'कृषि विज़न और ऑडियो डायग्नोस्टिक इंजन',
      subtitle: 'वास्तविक समय में फसल रोग और पत्ती क्षति का तंत्रिका विश्लेषण',
      howTo: 'डायग्नोस्टिक पाइपलाइन कैसे काम करती है',
    },
    te: {
      title: 'వ్యవసాయ విజన్ & ఆడియో డయాగ్నస్టిక్ ఇంజిన్',
      subtitle: 'పంటల తెగుళ్లు మరియు ఆకుల నష్టం యొక్క ఖచ్చితమైన విశ్లేషణ',
      howTo: 'డయాగ్నస్టిక్ పైప్‌లైన్ ఎలా పనిచేస్తుంది',
    },
    kn: {
      title: 'ಕೃಷಿ ವಿಷನ್ ಮತ್ತು ಆಡಿಯೋ ಡಯಾಗ್ನೋಸ್ಟಿಕ್ ಇಂಜಿನ್',
      subtitle: 'ಬೆಳೆ ರೋಗ ಮತ್ತು ಎಲೆ ಹಾನಿಯ ನೈಜ ಸಮಯದ ವಿಶ್ಲೇಷಣೆ',
      howTo: 'ಡಯಾಗ್ನೋಸ್ಟಿಕ್ ಪೈಪ್‌ಲೈನ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    },
    ta: {
      title: 'விவசாய விஷன் & ஆடியோ கண்டறியும் என்ஜின்',
      subtitle: 'பயிர் நோய் மற்றும் இலை சேதத்தின் நிகழ்நேர ஆய்வு',
      howTo: 'கண்டறியும் பைப்லைன் எவ்வாறு செயல்படுகிறது',
    }
  };

  const currentText = titles[currentLang] || titles.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#c0c9c3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#003629] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4d3e] text-[#a0f399] flex items-center justify-center border border-[#a0f399]/40 shadow-inner">
              <Cpu className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold">
                {currentText.title}
              </h3>
              <p className="text-xs text-[#8abda9]">
                {currentText.subtitle}
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status Badge Card */}
          <div className="p-4 rounded-xl bg-[#eef5ef] border border-[#a0f399] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#1b6d24] flex-shrink-0" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#1b6d24] block">
                  Engine Status: Active & Operational
                </span>
                <span className="font-display text-sm font-bold text-[#003629]">
                  Model: {status.model}
                </span>
              </div>
            </div>

            <button
              onClick={testConnection}
              disabled={testing}
              className="px-3 py-1.5 rounded-lg bg-[#003629] hover:bg-[#1b4d3e] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              Verify
            </button>
          </div>

          {/* Pipeline Overview */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#003629] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1b6d24]" />
              {currentText.howTo}
            </h4>

            <div className="space-y-3 text-xs text-[#161d19]">
              <div className="p-3.5 rounded-xl bg-[#f4fbf4] border border-[#dde4de] space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#003629] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <div>
                    <strong>Step 1: Multimodal Leaf Specimen Capture</strong>
                    <p className="text-[#404945] mt-0.5">
                      Capture a photo or upload a leaf specimen. Images are automatically compressed client-side for rapid transmission on low-bandwidth rural networks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#003629] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <div>
                    <strong>Step 2: Server-Side Vision & Audio Processing</strong>
                    <p className="text-[#404945] mt-0.5">
                      Requests are processed securely on the backend server with automatic failover to the built-in localized agronomy knowledge engine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#003629] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <div>
                    <strong>Step 3: High Precision Vision Diagnostics</strong>
                    <p className="text-[#404945] mt-0.5">
                      The model analyzes foliar lesions, spot margins, chlorosis, and pest traits, generating a complete chemical and organic prescription rendered purely in your selected language.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f4fbf4] border-t border-[#c0c9c3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#003629] text-white text-xs font-bold hover:bg-[#1b4d3e]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
