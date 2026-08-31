import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  Printer, 
  GraduationCap, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Eye, 
  IdCard, 
  FileText,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List
} from 'lucide-react';
import { Student, Role } from '../types';
import { BHOPAL_ZONES } from '../data/mockData';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenNewAdmission: () => void;
  onPrintIdCard: (student: Student) => void;
  onPrintReportCard: (student: Student) => void;
  currentRole: Role;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  onOpenNewAdmission,
  onPrintIdCard,
  onPrintReportCard,
  currentRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const grades = ['5th', '8th', '10th', '12th'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.bhopalZone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesZone = selectedZone === 'all' || student.bhopalZone === selectedZone;
    const matchesFee = selectedFeeStatus === 'all' || student.feeStatus === selectedFeeStatus;

    return matchesSearch && matchesGrade && matchesZone && matchesFee;
  });

  const exportCSV = () => {
    const headers = 'Admission No,Roll No,Name,Grade,Section,Gender,Bhopal Zone,Father Name,Phone,Attendance Rate,Fee Status\n';
    const rows = filteredStudents.map(s => 
      `"${s.admissionNo}","${s.rollNo}","${s.name}","${s.grade}","${s.section}","${s.gender}","${s.bhopalZone}","${s.fatherName}","${s.phone}","${s.attendanceRate}%","${s.feeStatus}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVSB_Student_Register_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Student Enrollment Directory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access student profiles, CBSE marks rosters, fee clearance & ID card issuing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Download CSV Register"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewAdmission}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, admission no, parent name, or Bhopal zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end md:self-center">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>

          {/* Grade Selector */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Classes</option>
            {grades.map(g => (
              <option key={g} value={g}>Class {g}</option>
            ))}
          </select>

          {/* Bhopal Zone Selector */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 max-w-[180px]"
          >
            <option value="all">All Bhopal Zones</option>
            {BHOPAL_ZONES.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          {/* Fee Status Selector */}
          <select
            value={selectedFeeStatus}
            onChange={(e) => setSelectedFeeStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Fee Statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>

          {(selectedGrade !== 'all' || selectedZone !== 'all' || selectedFeeStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedGrade('all');
                setSelectedZone('all');
                setSelectedFeeStatus('all');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* View Output: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student & Admission</th>
                  <th className="py-3 px-4">Class & House</th>
                  <th className="py-3 px-4">Bhopal Zone & Stop</th>
                  <th className="py-3 px-4">Parent Contact</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4 text-center">Fee Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No student records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectStudent(student)}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                          />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {student.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {student.admissionNo} (Roll: {student.rollNo})
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Grade & House */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          Class {student.grade}-{student.section}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {student.house.split(' ')[0]}
                        </div>
                      </td>

                      {/* Bhopal Zone & Bus */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-slate-800 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{student.bhopalZone}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {student.busStop || 'Self Transport'}
                        </div>
                      </td>

                      {/* Parent Contact */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{student.fatherName}</div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-slate-400" />
                          {student.phone}
                        </div>
                      </td>

                      {/* Attendance % */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded-md text-[11px] ${
                          student.attendanceRate >= 90
                            ? 'bg-emerald-50 text-emerald-700'
                            : student.attendanceRate >= 75
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {student.attendanceRate}%
                        </span>
                      </td>

                      {/* Fee Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          student.feeStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : student.feeStatus === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {student.feeStatus}
                        </span>
                      </td>

                      {/* Action Menu */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onPrintReportCard(student)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Print CBSE Report Card"
                          >
                            <GraduationCap className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onPrintIdCard(student)}
                            className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                            title="Print School ID Card"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student)}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                  />
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    student.feeStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : student.feeStatus === 'partial'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {student.feeStatus}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {student.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="font-semibold text-slate-700">Class {student.grade}-{student.section}</span>
                    <span>•</span>
                    <span className="font-mono">{student.admissionNo}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{student.bhopalZone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{student.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-mono">
                  Attendance: <span className="font-bold text-slate-800">{student.attendanceRate}%</span>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onPrintReportCard(student)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50"
                    title="Report Card"
                  >
                    <GraduationCap className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onPrintIdCard(student)}
                    className="p-1.5 text-slate-400 hover:text-violet-600 rounded-lg hover:bg-violet-50"
                    title="ID Card"
                  >
                    <IdCard className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
