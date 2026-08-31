import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Save, 
  Check, 
  Download, 
  Filter, 
  ShieldAlert,
  Users,
  Search
} from 'lucide-react';
import { Student, AttendanceStatus, Role, AttendanceRecord } from '../types';
import { getStoredAttendance, saveStoredAttendance } from '../services/storage';

interface AttendanceViewProps {
  students: Student[];
  onUpdateStudents: (updated: Student[]) => void;
  currentRole: Role;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  onUpdateStudents,
  currentRole
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedGrade, setSelectedGrade] = useState<string>('10th');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [attendanceMap, setAttendanceMap] = useState<{ [studentId: string]: AttendanceStatus }>({});
  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);

  // Filter students for selected grade & section
  const classStudents = students.filter(
    s => s.grade === selectedGrade && s.section === selectedSection
  );

  // Load existing records for this date/grade/section or initialize with 'present'
  useEffect(() => {
    const existing = getStoredAttendance(selectedDate, selectedGrade, selectedSection);
    const initialMap: { [id: string]: AttendanceStatus } = {};

    if (existing && existing.length > 0) {
      existing.forEach(rec => {
        initialMap[rec.studentId] = rec.status;
      });
    } else {
      classStudents.forEach(st => {
        initialMap[st.id] = 'present';
      });
    }
    setAttendanceMap(initialMap);
  }, [selectedDate, selectedGrade, selectedSection]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsSavedRecently(false);
  };

  const handleMarkAllPresent = () => {
    const newMap: { [id: string]: AttendanceStatus } = {};
    classStudents.forEach(st => {
      newMap[st.id] = 'present';
    });
    setAttendanceMap(newMap);
    setIsSavedRecently(false);
  };

  const handleSaveAttendance = () => {
    const records: AttendanceRecord[] = classStudents.map(st => ({
      id: `att_${selectedDate}_${st.id}`,
      date: selectedDate,
      grade: selectedGrade,
      section: selectedSection,
      studentId: st.id,
      studentName: st.name,
      rollNo: st.rollNo,
      status: attendanceMap[st.id] || 'present'
    }));

    saveStoredAttendance(selectedDate, selectedGrade, selectedSection, records);

    // Recalculate and update student attendance rates
    const updatedStudents = students.map(st => {
      if (st.grade === selectedGrade && st.section === selectedSection) {
        const stStatus = attendanceMap[st.id];
        // Minor dynamic adjustment for realism
        const adjustment = stStatus === 'present' ? 0.2 : stStatus === 'absent' ? -1.5 : 0;
        const newRate = Math.min(100, Math.max(50, +(st.attendanceRate + adjustment).toFixed(1)));
        return {
          ...st,
          attendanceRate: newRate
        };
      }
      return st;
    });

    onUpdateStudents(updatedStudents);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  // Stats calculation
  const totalClassCount = classStudents.length;
  const presentCount = classStudents.filter(s => attendanceMap[s.id] === 'present').length;
  const absentCount = classStudents.filter(s => attendanceMap[s.id] === 'absent').length;
  const lateCount = classStudents.filter(s => attendanceMap[s.id] === 'late').length;
  const leaveCount = classStudents.filter(s => attendanceMap[s.id] === 'leave').length;
  const presentPercentage = totalClassCount > 0 
    ? Math.round(((presentCount + lateCount) / totalClassCount) * 100)
    : 0;

  const filteredDisplayList = classStudents.filter(s => 
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.rollNo.includes(searchFilter)
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Daily Classroom Attendance</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              CBSE Register
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mark morning session attendance, track leaves, and monitor 75% CBSE Board exam eligibility
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 ${
              isSavedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {isSavedRecently ? (
              <>
                <Check className="w-4 h-4" />
                <span>Attendance Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Submit & Sync Register</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Class, Date & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Date Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Attendance Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Grade Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Class
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="5th">Class 5th (Primary)</option>
            <option value="8th">Class 8th (Middle)</option>
            <option value="10th">Class 10th (Secondary)</option>
            <option value="12th">Class 12th (Senior Secondary)</option>
          </select>
        </div>

        {/* Section Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        {/* Search within class */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Quick Filter
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or roll..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Counters for Today's Class */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Enrolled</div>
            <div className="text-xl font-bold font-outfit text-slate-900">{totalClassCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
            100%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-600">Present</div>
            <div className="text-xl font-bold font-outfit text-emerald-700">{presentCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-rose-600">Absent</div>
            <div className="text-xl font-bold font-outfit text-rose-700">{absentCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-600">Late / Leave</div>
            <div className="text-xl font-bold font-outfit text-amber-700">{lateCount + leaveCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="font-semibold text-xs text-slate-800 flex items-center gap-2">
            <span>Class {selectedGrade}-{selectedSection} Attendance Sheet</span>
            <span className="text-slate-400">({selectedDate})</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Today's Turnout: <strong className="text-slate-900">{presentPercentage}%</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Bhopal Stop</th>
                <th className="py-3 px-4 text-center">Overall %</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisplayList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No students found for Class {selectedGrade}-{selectedSection}.
                  </td>
                </tr>
              ) : (
                filteredDisplayList.map(student => {
                  const currentStatus = attendanceMap[student.id] || 'present';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {student.rollNo}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{student.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">#{student.admissionNo}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {student.busStop || 'Parent Drop'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded-md text-[11px] ${
                          student.attendanceRate >= 85
                            ? 'bg-emerald-50 text-emerald-700'
                            : student.attendanceRate >= 75
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {student.attendanceRate}%
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Present Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            Present (P)
                          </button>

                          {/* Absent Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            Absent (A)
                          </button>

                          {/* Late Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            Late (L)
                          </button>

                          {/* Medical / Leave Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'leave')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'leave'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                          >
                            Leave (ML)
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
