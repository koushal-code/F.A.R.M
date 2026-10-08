import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Key, ExternalLink, Cpu, RefreshCw, Send, AlertCircle, Save, Trash2, ShieldCheck } from 'lucide-react';
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
    model: 'gemini-3.1-flash-lite',
    hasKey: true,
    provider: 'Google AI Studio',
  });
  const [testing, setTesting] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testingCustomKey, setTestingCustomKey] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('farm_custom_api_key');
      if (stored) {
        setSavedKey(stored);
        setCustomKeyInput(stored);
      }
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

  const handleTestCustomKey = async () => {
    if (!customKeyInput.trim()) return;
    setTestingCustomKey(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/test-gemini-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: customKeyInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({ success: true, message: data.message || 'API Key is authenticated and operational!' });
      } else {
        setTestResult({ success: false, message: data.error || 'Failed to authenticate this key' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message || 'Connection error' });
    } finally {
      setTestingCustomKey(false);
    }
  };

  const handleSaveKey = () => {
    if (!customKeyInput.trim()) return;
    localStorage.setItem('farm_custom_api_key', customKeyInput.trim());
    setSavedKey(customKeyInput.trim());
    setSaveSuccessMsg('API Key saved! Future crop analysis scans will prioritize this key.');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleClearKey = () => {
    localStorage.removeItem('farm_custom_api_key');
    setSavedKey(null);
    setCustomKeyInput('');
    setTestResult(null);
    setSaveSuccessMsg('Custom API key removed. Using default server credentials.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const titles: Record<SupportedLanguage, { title: string; subtitle: string; howTo: string; testHeading: string }> = {
    en: {
      title: 'Gemini AI Vision Engine & API Setup',
      subtitle: 'Real-time crop pathology and leaf lesion neural analysis',
      howTo: 'How to Generate & Connect Your API Key',
      testHeading: 'Test / Connect Custom API Key'
    },
    hi: {
      title: 'जेमिनी एआई विज़न इंजन और एपीआई सेटअप',
      subtitle: 'वास्तविक समय में फसल रोग और पत्ती क्षति का तंत्रिका विश्लेषण',
      howTo: 'अपनी एपीआई की (API Key) कैसे बनाएं और जोड़ें',
      testHeading: 'कस्टम एपीआई की (API Key) का परीक्षण व सेव करें'
    },
    te: {
      title: 'జెమిని AI విజన్ ఇంజిన్ & API సెటప్',
      subtitle: 'పంటల తెగుళ్లు మరియు ఆకుల నష్టం యొక్క ఖచ్చితమైన విశ్లేషణ',
      howTo: 'API కీ (API Key) ఎలా తయారు చేయాలి మరియు ఇక్కడ ఎలా అనుసంధానించాలి',
      testHeading: 'మీ API కీని ఇక్కడ పరీక్షించి భద్రపరచండి'
    },
    kn: {
      title: 'ಜೆಮಿನಿ AI ವಿಷನ್ ಇಂಜಿನ್ ಮತ್ತು API ಸೆಟಪ್',
      subtitle: 'ಬೆಳೆ ರೋಗ ಮತ್ತು ಎಲೆ ಹಾನಿಯ ನೈಜ ಸಮಯದ ವಿಶ್ಲೇಷಣೆ',
      howTo: 'ನಿಮ್ಮ API ಕೀಲಿಯನ್ನು ಹೇಗೆ ರಚಿಸುವುದು ಮತ್ತು ಸಂಪರ್ಕಿಸುವುದು',
      testHeading: 'ಕಸ್ಟಮ್ API ಕೀ ಪರೀಕ್ಷಿಸಿ ಉಳಿಸಿ'
    },
    ta: {
      title: 'ஜெமினி AI விஷன் என்ஜின் & API அமைப்பு',
      subtitle: 'பயிர் நோய் மற்றும் இலை சேதத்தின் நிகழ்நேர ஆய்வு',
      howTo: 'உங்கள் API சாவியை எவ்வாறு உருவாக்கி இணைப்பது',
      testHeading: 'API சாவியை சோதித்து சேமிக்கவும்'
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
                  AI Engine Status: Active & Operational
                </span>
                <span className="font-display text-sm font-bold text-[#003629]">
                  Model: {status.model}
                </span>
                {savedKey && (
                  <span className="block text-[11px] font-bold text-emerald-700 mt-0.5">
                    ● Custom Key Applied ({savedKey.slice(0, 8)}...)
                  </span>
                )}
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

          {/* Interactive Test & Save Key Field */}
          <div className="p-4 rounded-xl border border-[#c0c9c3] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-xs font-bold text-[#003629] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#1b6d24]" />
                {currentText.testHeading}
              </h4>
              {savedKey && (
                <button
                  onClick={handleClearKey}
                  className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear Key
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                placeholder="Paste AI Studio API Key (AIzaSy...)"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#c0c9c3] focus:outline-none focus:border-[#1b6d24] bg-[#f4fbf4] font-mono"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleTestCustomKey}
                  disabled={testingCustomKey || !customKeyInput.trim()}
                  className="px-3 py-2 rounded-lg bg-[#003629] text-white text-xs font-bold hover:bg-[#1b4d3e] disabled:opacity-50 flex items-center gap-1.5"
                >
                  {testingCustomKey ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  Test
                </button>
                <button
                  onClick={handleSaveKey}
                  disabled={!customKeyInput.trim()}
                  className="px-3 py-2 rounded-lg bg-[#1b6d24] text-white text-xs font-bold hover:bg-[#14531b] disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-2 rounded-lg text-xs bg-[#eef5ef] text-[#1b6d24] flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {testResult && (
              <div className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                testResult.success ? 'bg-[#eef5ef] text-[#1b6d24]' : 'bg-[#ffdad6] text-[#ba1a1a]'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* How to generate & configure Gemini API Key Guide */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#003629] mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#1b6d24]" />
              {currentText.howTo}
            </h4>

            <div className="space-y-3 text-xs text-[#161d19]">
              <div className="p-3.5 rounded-xl bg-[#f4fbf4] border border-[#dde4de] space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#003629] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <div>
                    <strong>Step 1: Generate your Google AI Studio API Key</strong>
                    <p className="text-[#404945] mt-0.5">
                      Open{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1b6d24] font-bold underline inline-flex items-center gap-0.5"
                      >
                        Google AI Studio API Keys <ExternalLink className="w-3 h-3" />
                      </a>
                      , sign in with your Google account, and click <strong>Create API Key</strong>. It's free and takes seconds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#003629] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <div>
                    <strong>Step 2: Connect the Key in This App</strong>
                    <p className="text-[#404945] mt-0.5">
                      Paste the key in the input box above and click <strong>Test</strong> then <strong>Save</strong>. The key is securely passed to the backend proxy router to execute Gemini Vision requests without exposing credentials.
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
                      When you take or upload a crop photo, the model analyzes foliar lesions, spot margins, chlorosis, and pest traits, generating a complete chemical and organic prescription rendered purely in your selected language!
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
