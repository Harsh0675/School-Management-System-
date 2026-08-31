import React, { useState, useEffect } from 'react';
import { UserSession, PortalRole } from './types';
import { MOCK_STUDENTS } from './data/mockData';
import { LoginView } from './components/LoginView';
import { MpBoardHeader, MpBoardTab } from './components/MpBoardHeader';
import { MpBoardAttendanceView } from './components/MpBoardAttendanceView';
import { MpBoardFeesView } from './components/MpBoardFeesView';
import { MpBoardNoticesView } from './components/MpBoardNoticesView';

const DEFAULT_ADMIN_SESSION: UserSession = {
  role: 'admin',
  name: 'Dr. Rameshwar Pandey',
  username: 'admin',
  designation: 'Principal & Head Administrator',
  email: 'principal@educationvalleybhopal.edu.in',
  phone: '+91 (0755) 2894100'
};

export default function App() {
  // Session State: defaults to Admin for immediate live preview, can be logged out to test login screens
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('mpboard_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ADMIN_SESSION;
      }
    }
    return DEFAULT_ADMIN_SESSION;
  });

  // Active Tab: 'attendance' | 'fee' | 'notice'
  const [activeTab, setActiveTab] = useState<MpBoardTab>('attendance');

  // Keep local storage synchronized
  useEffect(() => {
    if (session) {
      localStorage.setItem('mpboard_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('mpboard_session');
    }
  }, [session]);

  // Login handler
  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
  };

  // Logout handler
  const handleLogout = () => {
    setSession(null);
  };

  // Quick switch role handler
  const handleSwitchRole = (role: PortalRole, studentId?: string) => {
    if (role === 'admin') {
      setSession(DEFAULT_ADMIN_SESSION);
    } else if (role === 'teacher') {
      setSession({
        role: 'teacher',
        name: 'Mrs. Neha Verma',
        username: 'teacher.neha',
        designation: 'Senior PGT & Class Teacher (10th-A)',
        teacherClass: 'Class 10th-A',
        email: 'neha.verma@educationvalleybhopal.edu.in',
        phone: '+91 94250 33490'
      });
    } else {
      const student = MOCK_STUDENTS.find(s => s.id === (studentId || 'std-1')) || MOCK_STUDENTS[0];
      setSession({
        role: 'parent',
        name: student.fatherName,
        username: 'parent',
        designation: `Parent / Guardian of ${student.name}`,
        studentId: student.id,
        studentName: student.name,
        phone: student.fatherPhone
      });
    }
  };

  // If logged out, render the clean MP Board Login View
  if (!session) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Sticky MP Board Navigation Header */}
      <MpBoardHeader
        session={session}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        unreadNoticeCount={4}
      />

      {/* Role Context Bar */}
      <div className="bg-slate-200/80 border-b border-slate-300/80 px-4 sm:px-6 py-2 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Current Login Portal:</span>
            {session.role === 'admin' && (
              <span className="px-2 py-0.5 rounded font-bold bg-amber-500 text-slate-950">
                Admin Portal (प्रशासक लॉगिन)
              </span>
            )}
            {session.role === 'teacher' && (
              <span className="px-2 py-0.5 rounded font-bold bg-emerald-600 text-white">
                Teacher Portal (शिक्षक लॉगिन - Class 10th-A)
              </span>
            )}
            {session.role === 'parent' && (
              <span className="px-2 py-0.5 rounded font-bold bg-sky-600 text-white">
                Parent Portal (अभिभावक लॉगिन - {session.studentName})
              </span>
            )}
            <span className="text-slate-500 hidden md:inline">• {session.designation}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">Quick Portal Test:</span>
            <button
              type="button"
              onClick={() => handleSwitchRole('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                session.role === 'admin' 
                  ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleSwitchRole('teacher')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                session.role === 'teacher' 
                  ? 'bg-emerald-600 text-white border-emerald-700 font-bold' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => handleSwitchRole('parent', 'std-1')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                session.role === 'parent' 
                  ? 'bg-sky-600 text-white border-sky-700 font-bold' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
              }`}
            >
              Parent
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-2 py-0.5 rounded text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 ml-1"
            >
              Show Login Page
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Attendance, Fee, or Notice */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'attendance' && (
          <MpBoardAttendanceView session={session} />
        )}

        {activeTab === 'fee' && (
          <MpBoardFeesView session={session} />
        )}

        {activeTab === 'notice' && (
          <MpBoardNoticesView session={session} />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Education Valley Higher Secondary School, Bhopal • Affiliated to MP Board of Secondary Education (MPBSE, Bhopal)
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            School Code: MPBSE-231450 | DISE: 23340501248
          </div>
        </div>
      </footer>
    </div>
  );
}
