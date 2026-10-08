import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Smartphone, Download, ExternalLink } from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterCode';

interface FlutterExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterExportModal: React.FC<FlutterExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[1]); // main.dart default
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-[#c0c9c3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#003629] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4d3e] text-[#a0f399] flex items-center justify-center border border-[#a0f399]/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold">
                  Flutter Android & iOS App Source Code
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#a0f399] text-[#003629]">
                  Flutter 3.x / Material 3
                </span>
              </div>
              <p className="text-xs text-[#8abda9]">
                Why is Flutter included? In remote fields with zero internet connectivity, farmers can run this exported native Android APK with local TensorFlow Lite edge models.
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

        {/* Content Body: Left File Tree, Right Code Preview */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#dde4de]">
          {/* File Selector Sidebar */}
          <div className="md:col-span-4 p-3 bg-[#f4fbf4] overflow-y-auto space-y-1.5">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#707974]">
              Project Files
            </div>
            {FLUTTER_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-[#003629] text-white shadow-sm'
                      : 'hover:bg-[#e8f0e9] text-[#161d19]'
                  }`}
                >
                  <FileCode className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-[#a0f399]' : 'text-[#1b6d24]'}`} />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{file.filename}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-[#baeed9]' : 'text-[#707974]'}`}>
                      {file.path}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="mt-4 p-3 rounded-xl bg-white border border-[#dde4de] text-[11px] text-[#404945]">
              <strong>Quick Start:</strong>
              <ol className="list-decimal list-inside space-y-1 mt-1 text-[10px]">
                <li>Install Flutter SDK on your computer</li>
                <li>Run <code>flutter create farm_app</code></li>
                <li>Copy these files into your <code>lib/</code> folder</li>
                <li>Run <code>flutter run</code> on Android emulator/phone</li>
              </ol>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-8 flex flex-col min-h-0 bg-[#0d1310] text-[#baeed9]">
            {/* Top Toolbar */}
            <div className="px-4 py-2.5 bg-[#001710] border-b border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#a0f399] font-bold">
                  {selectedFile.path}
                </span>
                <span className="text-[10px] text-white/50 hidden sm:inline">
                  — {selectedFile.description}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadFile}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-[#1b6d24] hover:bg-[#217128] text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>

            {/* Code Content */}
            <pre className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed text-[#c0c9c3] selection:bg-[#1b6d24] selection:text-white">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f4fbf4] border-t border-[#c0c9c3] flex items-center justify-between text-xs text-[#707974]">
          <span>Compatible with Flutter 3.24+, Android 14, and iOS 17</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#003629] text-white font-bold hover:bg-[#1b4d3e]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
