import React from 'react';
import { 
  Users, 
  UserCheck, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  GraduationCap, 
  IndianRupee,
  MapPin,
  FileSpreadsheet,
  BookOpen,
  Award
} from 'lucide-react';
import { Student, StaffMember, FeeItem, SchoolNotice, BusRoute, Role } from '../types';
import { SCHOOL_INFO } from '../data/mockData';

interface DashboardViewProps {
  students: Student[];
  staff: StaffMember[];
  fees: FeeItem[];
  notices: SchoolNotice[];
  busRoutes: BusRoute[];
  onNavigate: (tab: string) => void;
  onOpenAdmission: () => void;
  onSelectStudent: (student: Student) => void;
  currentRole: Role;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  staff,
  fees,
  notices,
  onNavigate,
  onOpenAdmission,
  onSelectStudent,
  currentRole
}) => {
  // Compute Key Metrics
  const totalStudents = students.length;
  const totalStaff = staff.length;
  
  const totalFeeCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalFeeDue = fees.reduce((sum, f) => sum + f.dueAmount, 0);
  const feeCollectionRate = totalFeeCollected + totalFeeDue > 0
    ? Math.round((totalFeeCollected / (totalFeeCollected + totalFeeDue)) * 100)
    : 0;

  const avgAttendance = students.length > 0
    ? (students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length).toFixed(1)
    : '0.0';

  const lowAttendanceCount = students.filter(s => s.attendanceRate < 75).length;
  const urgentNotices = notices.filter(n => n.priority === 'urgent' || n.priority === 'high');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner - MP Board Style */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              माध्यमिक शिक्षा मण्डल, म.प्र. भोपाल (MPBSE) • सत्र 2025-26
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-outfit text-white">
              {SCHOOL_INFO.name}, Bhopal
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {SCHOOL_INFO.affiliationHindi} (School Code: {SCHOOL_INFO.schoolCode} • DISE: {SCHOOL_INFO.diseCode}). 
              समग्र शिक्षा एवं मण्डल परीक्षा प्रबंधन प्रणाली (कक्षा 1 से 12वीं).
            </p>
          </div>

          {/* Quick Action Matrix */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={onOpenAdmission}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>नया छात्र प्रवेश (New Admission)</span>
            </button>
            <button
              onClick={() => onNavigate('academics')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>MP Board अंकसूची (Marksheets)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Enrolled Students */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-amber-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">कुल दर्ज छात्र (Students)</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-outfit">{totalStudents}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              सक्रिय छात्र
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Class 1st to 12th (Hindi & English Medium)</p>
        </div>

        {/* Card 2: Attendance Rate */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-amber-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">औसत उपस्थिति (Attendance)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-outfit">{avgAttendance}%</span>
            <span className="text-xs text-emerald-600 font-medium">मण्डल नियम: 75% अनिवार्य</span>
          </div>
          <p className="mt-1 text-xs text-amber-600 font-medium">
            {lowAttendanceCount} विद्यार्थी 75% से कम उपस्थिति पर
          </p>
        </div>

        {/* Card 3: Fee Recovery Status */}
        <div 
          onClick={() => onNavigate('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-amber-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">कुल शुल्क जमा (Fees)</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-outfit">
              ₹{(totalFeeCollected).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 font-medium">({feeCollectionRate}%)</span>
          </div>
          <p className="mt-1 text-xs text-rose-600 font-medium">
            ₹{totalFeeDue.toLocaleString('en-IN')} बकाया शुल्क (Pending)
          </p>
        </div>

        {/* Card 4: MP Board Exam Status */}
        <div 
          onClick={() => onNavigate('academics')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-amber-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">मण्डल परीक्षा (MPBSE 10/12)</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-outfit">Pre-Board</span>
            <span className="text-xs text-blue-600 font-medium">जारी है</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">MP Online परीक्षा फॉर्म सत्यापित</p>
        </div>
      </div>

      {/* Main Grid: Split Activity & Quick Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Student Spotlight & Fee Dues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Students / Academic Leaders */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  विद्यार्थी पंजी एवं समग्र विवरण (Student Directory & Samagra ID)
                </h3>
                <p className="text-xs text-slate-500">
                  समग्र आईडी (Samagra ID), मण्डल रोल नं, उपस्थिति एवं शुल्क स्थिति
                </p>
              </div>
              <button
                onClick={() => onNavigate('students')}
                className="text-xs text-amber-600 hover:text-amber-800 font-bold flex items-center gap-1"
              >
                <span>सभी देखें ({students.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {students.slice(0, 5).map(student => (
                <div 
                  key={student.id}
                  onClick={() => onSelectStudent(student)}
                  className="py-3 px-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {student.name}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                          कक्षा {student.grade}-{student.section}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          दाखिला: #{student.admissionNo}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-600">
                          समग्र ID: <span className="font-semibold text-slate-800">{student.samagraId || 'N/A'}</span>
                        </span>
                        <span>•</span>
                        <span className="text-[11px]">मध्यम: {student.medium || 'Hindi'}</span>
                        <span>•</span>
                        <span className="text-[11px]">पिता: {student.fatherName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        student.feeStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : student.feeStatus === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {student.feeStatus === 'paid' ? 'जमा (Paid)' : student.feeStatus === 'partial' ? 'आंशिक (Partial)' : 'बकाया (Due)'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                      उपस्थिति: <span className={`font-bold ${student.attendanceRate < 75 ? 'text-rose-600' : 'text-slate-800'}`}>{student.attendanceRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Academic Schedule / MP Board Calendar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  MP Board मण्डल परीक्षा एवं शैक्षणिक गतिविधि 2025-26
                </h3>
                <p className="text-xs text-slate-500">
                  माध्यमिक शिक्षा मण्डल, म.प्र. भोपाल द्वारा निर्धारित समय सारिणी
                </p>
              </div>
              <button
                onClick={() => onNavigate('academics')}
                className="text-xs text-amber-600 hover:text-amber-800 font-bold flex items-center gap-1"
              >
                <span>अंकसूची देखें</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>वार्षिक मुख्य परीक्षा (Annual Board Exam)</span>
                </div>
                <p className="text-xs text-slate-700">
                  कक्षा 10वीं एवं 12वीं वार्षिक बोर्ड परीक्षा: फरवरी - मार्च 2026
                </p>
                <div className="text-[11px] text-amber-700 font-mono mt-2">
                  प्रवेश पत्र (Admit Cards): 15 जनवरी 2026 से उपलब्ध
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                  <span>प्रायोगिक एवं आंतरिक मूल्यांकन (Practical & CCE)</span>
                </div>
                <p className="text-xs text-slate-700">
                  विज्ञान एवं भूगोल प्रायोगिक परीक्षा अंक मण्डल पोर्टल पर प्रविष्टि
                </p>
                <div className="text-[11px] text-slate-500 font-mono mt-2">
                  अंतिम तिथि: 25 जनवरी 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Notices & MPBSE Regulatory Card */}
        <div className="space-y-6">
          {/* Urgent Notices Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
                  नवीनतम सूचनाएँ (Notices)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('notices')}
                className="text-xs text-amber-600 font-bold hover:underline"
              >
                सभी सूचनाएँ
              </button>
            </div>

            <div className="space-y-3">
              {urgentNotices.map(notice => (
                <div
                  key={notice.id}
                  className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50/80 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-600 text-white font-mono">
                      {notice.priority}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{notice.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-500 italic">
                    — {notice.signedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Staff Roster Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
                शिक्षक सूची (Faculty)
              </h3>
              <button
                onClick={() => onNavigate('staff')}
                className="text-xs text-amber-600 font-bold hover:underline"
              >
                कुल शिक्षक ({staff.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {staff.slice(0, 3).map(stf => (
                <div key={stf.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={stf.avatarUrl}
                      alt={stf.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-800">{stf.name}</div>
                      <div className="text-[10px] text-slate-500">{stf.role} • {stf.department}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700">
                    उपस्थित
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MPBSE Board Compliance Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-4 shadow-md border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>MPBSE मण्डल सम्बद्धता विवरण</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              मध्य प्रदेश माध्यमिक शिक्षा मण्डल, भोपाल (MPBSE) के नवीन 75% अनिवार्य उपस्थिति एवं सतत् समग्र मूल्यांकन (CCE) नियमानुसार।
            </p>
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300 font-mono">
              <span>School Code: {SCHOOL_INFO.schoolCode}</span>
              <span className="text-amber-400 font-bold">DISE: {SCHOOL_INFO.diseCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
