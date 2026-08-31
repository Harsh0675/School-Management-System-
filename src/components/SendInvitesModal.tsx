import React, { useState } from 'react';
import { MeetingAgenda } from '../types/agenda';
import { X, Send, CheckCircle2, Video, Calendar, Mail, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SendInvitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  agenda: MeetingAgenda;
}

export const SendInvitesModal: React.FC<SendInvitesModalProps> = ({
  isOpen,
  onClose,
  agenda
}) => {
  const [selectedStakeholderIds, setSelectedStakeholderIds] = useState<string[]>(
    agenda.stakeholders.map(s => s.id)
  );
  const [meetingLink, setMeetingLink] = useState(agenda.locationOrLink || 'https://meet.google.com/evs-q4-strat');
  const [personalNote, setPersonalNote] = useState('Please review the attached document prior to the sync. We will adhere strictly to our topic timeline.');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const toggleStakeholder = (id: string) => {
    if (selectedStakeholderIds.includes(id)) {
      setSelectedStakeholderIds(selectedStakeholderIds.filter(sId => sId !== id));
    } else {
      setSelectedStakeholderIds([...selectedStakeholderIds, id]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
              Send Meeting Invites
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispatch calendar invites & agenda link to stakeholders
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

        {isSent ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Invites Dispatched!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Meeting invites with agenda timeline and calendar payload sent to {selectedStakeholderIds.length} stakeholders.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-5 space-y-4">
            {/* Stakeholder Selection List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Select Recipients ({selectedStakeholderIds.length})
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedStakeholderIds(
                    selectedStakeholderIds.length === agenda.stakeholders.length 
                      ? [] 
                      : agenda.stakeholders.map(s => s.id)
                  )}
                  className="text-[11px] text-indigo-600 font-semibold hover:underline"
                >
                  {selectedStakeholderIds.length === agenda.stakeholders.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {agenda.stakeholders.map((s) => {
                  const isChecked = selectedStakeholderIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleStakeholder(s.id)}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-indigo-50/50 border-indigo-200 text-indigo-950 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full ${s.avatarBg} flex items-center justify-center text-[9px] font-bold ${s.avatarText}`}>
                          {s.initials}
                        </div>
                        <span>{s.name}</span>
                        <span className="text-[10px] text-slate-400">({s.email})</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Video Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-indigo-600" />
                <span>Conference Meeting Link</span>
              </label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Context Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personalized Note to Attendees
              </label>
              <textarea
                rows={3}
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedStakeholderIds.length === 0}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 active:scale-95 disabled:opacity-50 shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send {selectedStakeholderIds.length} Invites</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
