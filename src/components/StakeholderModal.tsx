import React, { useState } from 'react';
import { Stakeholder } from '../types/agenda';
import { X, UserPlus, Check, Trash2, Mail, Shield, Sparkles } from 'lucide-react';

interface StakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stakeholders: Stakeholder[];
  onAddStakeholder: (newStakeholder: Omit<Stakeholder, 'id'>) => void;
  onRemoveStakeholder: (id: string) => void;
  onToggleConfirmed: (id: string) => void;
}

const COLOR_OPTIONS = [
  { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Indigo' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Emerald' },
  { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Amber' },
  { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Rose' },
  { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Purple' },
  { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Blue' }
];

export const StakeholderModal: React.FC<StakeholderModalProps> = ({
  isOpen,
  onClose,
  stakeholders,
  onAddStakeholder,
  onRemoveStakeholder,
  onToggleConfirmed
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [colorIndex, setColorIndex] = useState(0);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';
    const color = COLOR_OPTIONS[colorIndex];

    onAddStakeholder({
      name: name.trim(),
      role: role.trim() || 'Contributor',
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@company.com`,
      avatarBg: color.bg,
      avatarText: color.text,
      initials,
      confirmed: true
    });

    setName('');
    setRole('');
    setEmail('');
    setColorIndex((colorIndex + 1) % COLOR_OPTIONS.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
              Meeting Stakeholders & Attendees
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned leads and participants extracted from document
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

        {/* Stakeholder List */}
        <div className="p-5 max-h-72 overflow-y-auto space-y-2.5">
          {stakeholders.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${s.avatarBg} flex items-center justify-center text-xs font-bold ${s.avatarText} shadow-xs`}>
                  {s.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {s.name}
                    {s.confirmed && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                        Confirmed
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500">{s.role} • {s.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onToggleConfirmed(s.id)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    s.confirmed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.confirmed ? 'Invited' : 'Pending'}
                </button>
                {stakeholders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveStakeholder(s.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Stakeholder Form */}
        <form onSubmit={handleAdd} className="p-5 bg-slate-50/70 border-t border-slate-100 space-y-3">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Add New Stakeholder</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Full Name (e.g. Rachel Green)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Role / Title (e.g. Lead Architect)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 flex-1"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
