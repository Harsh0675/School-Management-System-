import React, { useRef, useState } from 'react';
import { DocumentUpload } from '../types/agenda';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Clock, 
  FileCode, 
  FileCheck, 
  PlusCircle, 
  Layers, 
  CheckCircle2,
  Trash2,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  documents: DocumentUpload[];
  selectedDocId?: string;
  onSelectDoc: (doc: DocumentUpload) => void;
  onFileUpload: (file: File) => void;
  onOpenPasteModal: () => void;
  onGenerateAgenda: () => void;
  isGenerating: boolean;
  targetDuration: number;
  onTargetDurationChange: (duration: number) => void;
  meetingStartTime: string;
  onMeetingStartTimeChange: (time: string) => void;
  meetingStyle: string;
  onMeetingStyleChange: (style: string) => void;
  onDeleteDoc?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  documents,
  selectedDocId,
  onSelectDoc,
  onFileUpload,
  onOpenPasteModal,
  onGenerateAgenda,
  isGenerating,
  targetDuration,
  onTargetDurationChange,
  meetingStartTime,
  onMeetingStartTimeChange,
  meetingStyle,
  onMeetingStyleChange,
  onDeleteDoc
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const getFileBadge = (type: string) => {
    switch (type) {
      case 'PDF':
        return <div className="w-8 h-8 rounded bg-rose-50 flex items-center justify-center text-rose-600 text-[10px] font-bold tracking-wider">PDF</div>;
      case 'DOCX':
        return <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-bold tracking-wider">DOC</div>;
      case 'MD':
      case 'TXT':
        return <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 text-[10px] font-bold tracking-wider">TXT</div>;
      default:
        return <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center text-amber-600 text-[10px] font-bold tracking-wider">DOC</div>;
    }
  };

  return (
    <aside className="w-72 md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 md:p-6 border-b border-slate-200 bg-slate-50/80 backdrop-blur">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 font-display">AgendaAI</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">PRO</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Doc to Timeline Agenda</p>
          </div>
        </div>

        {/* Drag and Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 border-2 border-dashed rounded-xl bg-white transition-all cursor-pointer group relative text-center ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60 shadow-xs'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md,.rtf,.csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center py-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors mb-2">
              <UploadCloud className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
              Drop documents here
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              PDF, DOCX, TXT up to 10MB
            </span>
          </div>
        </div>

        {/* Or Paste Raw Notes */}
        <button
          onClick={onOpenPasteModal}
          type="button"
          className="w-full mt-2 py-1.5 px-3 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100/80 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Or paste meeting notes / raw text</span>
        </button>
      </div>

      {/* Scrollable Content: Documents + Meeting Presets */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 custom-scrollbar">
        {/* Recent Uploads List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Documents ({documents.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Click to select</span>
          </div>

          <div className="space-y-2.5">
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm'
                      : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {getFileBadge(doc.type)}
                  <div className="flex-1 min-w-0 pr-1">
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                        doc.status === 'processed' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {doc.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{doc.size}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}

                  {onDeleteDoc && documents.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDoc(doc.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                      title="Remove document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Meeting Configuration Presets */}
        <div className="pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 hover:text-slate-600"
          >
            <span>Meeting Parameters</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>

          {showSettings && (
            <div className="space-y-4 text-xs">
              {/* Target Duration Selector */}
              <div>
                <div className="flex items-center justify-between text-slate-700 font-medium mb-1.5">
                  <span className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Target Duration
                  </span>
                  <span className="font-bold text-indigo-600">{targetDuration} Mins</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => onTargetDurationChange(mins)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        targetDuration === mins
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Meeting Start Time */}
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={meetingStartTime}
                  onChange={(e) => onMeetingStartTimeChange(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Meeting Style / Format */}
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Agenda Format
                </label>
                <select
                  value={meetingStyle}
                  onChange={(e) => onMeetingStyleChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Standard Executive">Executive Strategy Alignment</option>
                  <option value="Technical Sprint">Engineering Sprint & Tech Review</option>
                  <option value="Design & Product">Product Discovery & Design Sync</option>
                  <option value="Client Kickoff">Client Onboarding & Project Kickoff</option>
                  <option value="Fast Standup">Fast-Paced 15-30m Standup</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pinned Bottom CTA */}
      <div className="p-5 md:p-6 bg-slate-100/90 border-t border-slate-200">
        <button
          onClick={onGenerateAgenda}
          disabled={isGenerating}
          type="button"
          className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Synthesizing Agenda...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
              <span>Generate New Agenda</span>
            </>
          )}
        </button>
        <p className="text-[10px] text-center text-slate-500 font-medium mt-2">
          Powered by Gemini AI Multi-tenant Synthesizer
        </p>
      </div>
    </aside>
  );
};
