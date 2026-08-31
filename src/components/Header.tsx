import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  UserCheck, 
  Bell, 
  UserPlus, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  ChevronDown, 
  Phone, 
  MapPin, 
  Sparkles,
  School
} from 'lucide-react';
import { Role } from '../types';
import { SCHOOL_INFO } from '../data/mockData';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenNewAdmission: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenNewAdmission,
  searchQuery,
  onSearchChange
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles: { key: Role; label: string; tag: string }[] = [
    { key: 'principal', label: 'Dr. R. Pandey (Principal / प्रशासक)', tag: 'Director & Exam Center Head' },
    { key: 'teacher', label: 'Mrs. Neha Verma (Class 10th-A Teacher)', tag: 'Faculty & Roll Call In-charge' },
    { key: 'accountant', label: 'Accounts Desk (Fee & MP Online)', tag: 'Counter Receipts & Dues' },
    { key: 'student', label: 'Aarav Sharma (Class 10th)', tag: 'Student & Parent Portal' }
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shrink-0 z-30 shadow-md">
      {/* Top micro-bar for MP Board details & Bhopal live ticker */}
      <div className="bg-slate-950 px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            {SCHOOL_INFO.affiliation}
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="hidden sm:inline text-amber-300/90 font-medium">
            {SCHOOL_INFO.affiliationHindi}
          </span>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-400">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>Kolar Road, Bhopal (M.P.) • School Code: {SCHOOL_INFO.schoolCode} • DISE: {SCHOOL_INFO.diseCode}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="text-emerald-400">सत्र: 2025-26 (MPBSE)</span>
          <span className="hidden md:inline-block text-slate-400">🕒 {currentTime}</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Crest */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-slate-900 p-0.5 shadow-lg flex items-center justify-center ring-2 ring-amber-400/30">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <School className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight font-outfit text-white">
                Education Valley School
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                MP Board Bhopal
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              माध्यमिक शिक्षा मण्डल, म.प्र. भोपाल सम्बद्ध विद्यालय पोर्टल
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, Samagra ID, roll no, admission no..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Action Tools: Role Switcher & New Admission */}
        <div className="flex items-center gap-3 shrink-0">
          {/* New Admission Quick Action */}
          <button
            onClick={onOpenNewAdmission}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
            title="Register a new student admission"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">नया प्रवेश (Admission)</span>
          </button>

          {/* Persona / Role Selector */}
          <div className="relative group">
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs cursor-pointer hover:bg-slate-750 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-white font-semibold text-[11px] leading-tight">
                  {roles.find(r => r.key === currentRole)?.label.split('(')[0]}
                </div>
                <div className="text-slate-400 text-[10px]">
                  {roles.find(r => r.key === currentRole)?.tag}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Dropdown Options */}
            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                लॉगिन पोर्टल बदलें (Switch Role)
              </div>
              <div className="space-y-1 mt-1">
                {roles.map(r => (
                  <button
                    key={r.key}
                    onClick={() => onRoleChange(r.key)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex flex-col ${
                      currentRole === r.key 
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold">{r.label}</span>
                    <span className="text-[10px] text-slate-400">{r.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
