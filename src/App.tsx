import React, { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { FeesView } from './components/FeesView';
import { NoticesView } from './components/NoticesView';
import {
  MOCK_STUDENTS,
  MOCK_STAFF,
  MOCK_FEES,
  MOCK_NOTICES,
  MOCK_BUS_ROUTES,
} from './data/mockData';
import { FeeItem, Role, SchoolNotice, Student } from './types';

type TabId = 'dashboard' | 'students' | 'attendance' | 'fees' | 'notices' | 'staff';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('principal');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [fees, setFees] = useState<FeeItem[]>(MOCK_FEES);
  const [notices, setNotices] = useState<SchoolNotice[]>(MOCK_NOTICES);

  const badgeCounts = useMemo(
    () => ({
      students: students.length,
      attendance: students.filter((student) => student.attendanceRate < 75).length,
      fees: fees.filter((fee) => fee.dueAmount > 0).length,
      notices: notices.length,
      transport: MOCK_BUS_ROUTES.length,
      staff: MOCK_STAFF.length,
    }),
    [students, fees, notices],
  );

  const handleOpenNewAdmission = () => setActiveTab('students');

  const renderMainContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <StudentsView
            students={students}
            onSelectStudent={(student) => setActiveTab('dashboard')}
            onOpenNewAdmission={handleOpenNewAdmission}
            onPrintIdCard={(student) => window.print()}
            onPrintReportCard={(student) => window.print()}
            currentRole={currentRole}
          />
        );
      case 'attendance':
        return (
          <AttendanceView
            students={students}
            onUpdateStudents={setStudents}
            currentRole={currentRole}
          />
        );
      case 'fees':
        return (
          <FeesView
            fees={fees}
            students={students}
            onAddFeePayment={(fee) => setFees((prev) => [fee, ...prev])}
            onPrintFeeReceipt={(fee) => window.print()}
            currentRole={currentRole}
          />
        );
      case 'notices':
        return (
          <NoticesView
            notices={notices}
            onAddNotice={(notice) => setNotices((prev) => [notice, ...prev])}
            onPrintNotice={(notice) => window.print()}
            onOpenAiStudio={() => setActiveTab('notices')}
            currentRole={currentRole}
          />
        );
      case 'staff':
        return (
          <div className="p-8 text-center text-slate-600">
            <h2 className="text-2xl font-bold text-slate-900">Faculty Directory</h2>
            <p className="mt-3">The staff directory is available in the dataset and ready for expansion.</p>
          </div>
        );
      default:
        return (
          <DashboardView
            students={students}
            staff={MOCK_STAFF}
            fees={fees}
            notices={notices}
            busRoutes={MOCK_BUS_ROUTES}
            onNavigate={(tab) => setActiveTab(tab as TabId)}
            onOpenAdmission={handleOpenNewAdmission}
            onSelectStudent={(student) => setActiveTab('students')}
            currentRole={currentRole}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenNewAdmission={handleOpenNewAdmission}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex min-h-[calc(100vh-80px)]">
        <SidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentRole={currentRole}
          badgeCounts={badgeCounts}
        />

        <main className="flex-1 overflow-auto">{renderMainContent()}</main>
      </div>
    </div>
  );
}
