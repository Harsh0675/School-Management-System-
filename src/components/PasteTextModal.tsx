import React, { useState } from 'react';
import { X, FileText, Sparkles } from 'lucide-react';

interface PasteTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
}

export const PasteTextModal: React.FC<PasteTextModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [docTitle, setDocTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const title = docTitle.trim() || 'Pasted_Meeting_Notes.txt';
    onSubmit(title, content.trim());
    setDocTitle('');
    setContent('');
    onClose();
  };

  const handleInsertSample = () => {
    setDocTitle('Sprint_Planning_Notes.md');
    setContent(`# Sprint 24 Planning & Technical Debt Review
Attendees: Sarah Chen, Marcus Thorne, Elena Rodriguez

1. Sprint Goals:
- Deliver MVP for AI Timeline Agenda Synthesizer
- Fix Redis caching eviction bug affecting Europe cluster
- Finalize Dark/Light Mode Tailwind CSS v4 design token mapping

2. Capacity:
- Marcus: 35 hours (Architecture & backend workers)
- Elena: 40 hours (Figma prototypes & design review)
- David: 20 hours (Budget approvals)

3. Risks:
- Third party OAuth latency spikes during peak load.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
              Paste Notes / Raw Document Text
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Input meeting notes, product specs, or emails to build a timeline agenda
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              placeholder="e.g. Q4 Strategy Specs or Sprint Notes"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Document Content / Raw Text
              </label>
              <button
                type="button"
                onClick={handleInsertSample}
                className="text-[11px] text-indigo-600 hover:underline font-medium"
              >
                Insert Sample Notes
              </button>
            </div>
            <textarea
              rows={8}
              placeholder="Paste your document content, meeting agenda outline, transcript, or bullet points here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 active:scale-95 shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Agenda from Text</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
