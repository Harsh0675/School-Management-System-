import React from 'react';
import { MeetingAgenda } from '../types/agenda';
import { Clock, Users, Layers, Target, CheckCircle2 } from 'lucide-react';

interface MetricsBarProps {
  agenda: MeetingAgenda;
  onOpenStakeholdersModal: () => void;
  onAddTopic: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Opener': 'bg-slate-400',
  'Deep Dive': 'bg-emerald-500',
  'Planning': 'bg-blue-500',
  'Decision': 'bg-amber-500',
  'Brainstorm': 'bg-purple-500',
  'Review': 'bg-cyan-500',
  'Q&A': 'bg-rose-500',
  'Closing': 'bg-slate-600'
};

export const MetricsBar: React.FC<MetricsBarProps> = ({
  agenda,
  onOpenStakeholdersModal,
  onAddTopic
}) => {
  const totalMinutes = agenda.topics.reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
  const confirmedStakeholders = agenda.stakeholders.filter(s => s.confirmed).length;
  const totalActionItems = agenda.topics.reduce((acc, t) => acc + (t.actionItems?.length || 0), 0);
  const completedActionItems = agenda.topics.reduce((acc, t) => acc + (t.actionItems?.filter(a => a.completed)?.length || 0), 0);

  return (
    <div className="space-y-3 mb-8">
      {/* 3-Column Summary Cards */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-3 sm:gap-0">
        {/* Metric 1: Duration */}
        <div className="px-3 sm:px-4 py-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Total Duration
            </p>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight font-display">
              {totalMinutes} Minutes
            </p>
            <span className={`text-[11px] font-semibold ${
              totalMinutes > agenda.targetTotalMinutes ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              ({totalMinutes <= agenda.targetTotalMinutes ? 'On budget' : `+${totalMinutes - agenda.targetTotalMinutes}m buffer`})
            </span>
          </div>
        </div>

        {/* Metric 2: Stakeholders */}
        <div 
          onClick={onOpenStakeholdersModal}
          className="px-3 sm:px-4 py-1 cursor-pointer group hover:bg-slate-50/60 rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
              Stakeholders
            </p>
            <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight font-display group-hover:text-indigo-600 transition-colors">
              {agenda.stakeholders.length} Assigned
            </p>
            <span className="text-[11px] font-semibold text-slate-500">
              {confirmedStakeholders} confirmed
            </span>
          </div>
        </div>

        {/* Metric 3: Core Topics */}
        <div className="px-3 sm:px-4 py-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Core Topics
            </p>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight font-display">
              {agenda.topics.length} Key Sections
            </p>
            {totalActionItems > 0 && (
              <span className="text-[11px] font-semibold text-indigo-600">
                {completedActionItems}/{totalActionItems} actions
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Timeline Distribution Bar */}
      {totalMinutes > 0 && (
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
            <span>Time Distribution Flow</span>
            <span>{agenda.startTime} → {agenda.topics[agenda.topics.length - 1]?.endTime || ''}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
            {agenda.topics.map((t, idx) => {
              const widthPct = Math.max(4, (t.durationMinutes / totalMinutes) * 100);
              const colorClass = CATEGORY_COLORS[t.category] || 'bg-indigo-500';
              return (
                <div
                  key={t.id}
                  style={{ width: `${widthPct}%` }}
                  className={`${colorClass} h-full transition-all relative group cursor-pointer`}
                  title={`${t.startTime} - ${t.title} (${t.durationMinutes}m)`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 pt-1 text-[10px] text-slate-500">
            {Array.from(new Set(agenda.topics.map(t => t.category))).map((cat: string) => (
              <div key={cat} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat] || 'bg-indigo-500'}`}></div>
                <span className="font-medium text-slate-600">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
