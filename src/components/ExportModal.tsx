import React, { useState } from 'react';
import { MeetingAgenda } from '../types/agenda';
import { generateMarkdownAgenda, generateEmailInvite, downloadIcsFile } from '../lib/exportUtils';
import { X, Copy, Check, Download, Calendar, Mail, FileText, Printer } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  agenda: MeetingAgenda;
  defaultTab?: 'markdown' | 'ics' | 'email' | 'print';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  agenda,
  defaultTab = 'markdown'
}) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'ics' | 'email'>(
    defaultTab === 'email' ? 'email' : defaultTab === 'ics' ? 'ics' : 'markdown'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownText = generateMarkdownAgenda(agenda);
  const emailData = generateEmailInvite(agenda);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
              Export & Share Agenda
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribute to calendars, email clients, or project management tools
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 pt-3 gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('markdown')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'markdown'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown & Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'email'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Invite</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ics')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'ics'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar (.ICS)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === 'markdown' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Copy formatted Markdown agenda for Notion, Jira, Slack, or Docs:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(markdownText)}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 font-semibold flex items-center gap-1 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono max-h-72 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                {markdownText}
              </pre>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Subject & Body formatted for Outlook, Gmail, or Apple Mail:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(`Subject: ${emailData.subject}\n\n${emailData.body}`)}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 font-semibold flex items-center gap-1 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Email'}</span>
                </button>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 max-h-72 overflow-y-auto font-sans">
                <div className="font-semibold text-slate-900 pb-2 border-b border-slate-200">
                  <span className="text-slate-400 font-normal">Subject:</span> {emailData.subject}
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {emailData.body}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ics' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Download Universal Calendar File</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Imports directly into Google Calendar, Microsoft Outlook, and Apple Calendar with the complete timeline breakdown.
                </p>
              </div>
              <button
                type="button"
                onClick={() => downloadIcsFile(agenda)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 active:scale-95 shadow-sm inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download .ICS File</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-lg flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
