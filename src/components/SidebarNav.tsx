import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  GraduationCap, 
  CreditCard, 
  Briefcase, 
  Bell, 
  Bus, 
  Sparkles,
  School,
  FileText
} from 'lucide-react';
import { Role } from '../types';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentRole: Role;
  badgeCounts: {
    students: number;
    attendance: number;
    fees: number;
    notices: number;
    transport: number;
    staff: number;
  };
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  badgeCounts
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Campus Overview (डैशबोर्ड)',
      icon: LayoutDashboard,
      roles: ['principal', 'teacher', 'accountant', 'student']
    },
    {
      id: 'students',
      label: 'Students Register (विद्यार्थी सूची)',
      icon: Users,
      badge: badgeCounts.students,
      roles: ['principal', 'teacher', 'accountant']
    },
    {
      id: 'attendance',
      label: 'Daily Attendance (उपस्थिति पंजी)',
      icon: UserCheck,
      badge: badgeCounts.attendance > 0 ? `${badgeCounts.attendance} <75%` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      roles: ['principal', 'teacher', 'student']
    },
    {
      id: 'academics',
      label: 'MP Board Exams & Marks (अंकसूची)',
      icon: GraduationCap,
      roles: ['principal', 'teacher', 'student']
    },
    {
      id: 'fees',
      label: 'Fee Counter & Receipts (शुल्क काउंटर)',
      icon: CreditCard,
      badge: badgeCounts.fees > 0 ? `${badgeCounts.fees} Due` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      roles: ['principal', 'accountant', 'student']
    },
    {
      id: 'notices',
      label: 'Circulars & Orders (सूचना पटल)',
      icon: Bell,
      badge: badgeCounts.notices > 0 ? `${badgeCounts.notices} New` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950',
      roles: ['principal', 'teacher', 'accountant', 'student']
    },
    {
      id: 'staff',
      label: 'Faculty Directory (शिक्षक पंजी)',
      icon: Briefcase,
      badge: badgeCounts.staff,
      roles: ['principal']
    }
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none">
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          MP Board Modules (मण्डल मॉड्यूल)
        </div>

        {visibleNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-400 group-hover:text-amber-400'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  item.badgeColor || (isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400')
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span>MPBSE Bhopal Code</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
              231450
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            माध्यमिक शिक्षा मण्डल, म.प्र. भोपाल
          </p>
          <div className="pt-1 text-[10px] text-amber-400/90 font-mono">
            DISE Code: 23340501248
          </div>
        </div>
      </div>
    </aside>
  );
};
