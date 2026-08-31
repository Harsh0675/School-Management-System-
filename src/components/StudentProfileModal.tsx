import React from 'react';
import { 
  X, 
  Printer, 
  IdCard, 
  GraduationCap, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Bus, 
  ShieldCheck, 
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onPrintIdCard: (student: Student) => void;
  onPrintReportCard: (student: Student) => void;
  onCollectFee: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onPrintIdCard,
  onPrintReportCard,
  onCollectFee
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Student Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-24 h-24 rounded-2xl object-cover border-3 border-white/20 shadow-xl"
            />
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold font-outfit text-white">{student.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono">
                  {student.admissionNo}
                </span>
              </div>

              <div className="text-xs text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span>Class <strong className="text-white">{student.grade} - {student.section}</strong></span>
                <span>•</span>
                <span>Roll No: <strong className="text-white">{student.rollNo}</strong></span>
                <span>•</span>
                <span>House: <strong className="text-white">{student.house}</strong></span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => onPrintReportCard(student)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>CBSE Report Card</span>
                </button>
                <button
                  onClick={() => onPrintIdCard(student)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <IdCard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Student ID Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Attendance Rate</div>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{student.attendanceRate}%</div>
              <div className="text-[10px] text-emerald-600 font-medium">Regular (CBSE Norm)</div>
            </div>
            <div className="border-x border-slate-200 px-2">
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Fee Balance Due</div>
              <div className="text-lg font-bold font-mono mt-0.5 text-slate-900">
                ₹{student.totalFeeDue.toLocaleString('en-IN')}
              </div>
              <div className={`text-[10px] font-bold uppercase ${
                student.feeStatus === 'paid' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                Status: {student.feeStatus}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Admission Date</div>
              <div className="text-sm font-bold text-slate-800 font-mono mt-1">{student.admissionDate}</div>
              <div className="text-[10px] text-slate-500">Academic Reg.</div>
            </div>
          </div>

          {/* Section 1: Personal & Demographic Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Demographic & Personal Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400">Date of Birth:</span>
                <span className="font-semibold text-slate-800 ml-2">{student.dob}</span>
              </div>
              <div>
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-semibold text-slate-800 ml-2">{student.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-400">Gender:</span>
                <span className="font-semibold text-slate-800 ml-2">{student.gender}</span>
              </div>
              <div>
                <span className="text-slate-400">Aadhaar (Ref):</span>
                <span className="font-mono text-slate-700 ml-2">{student.aadhaarNumber || 'Verified on file'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400">Residential Address:</span>
                <p className="font-medium text-slate-800 mt-0.5">{student.address}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Parent & Guardian Contacts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Parent & Guardian Directory
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Father */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold text-indigo-900 uppercase">Father / Guardian</div>
                <div className="font-bold text-slate-900 text-sm">{student.fatherName}</div>
                <div className="text-slate-500">{student.fatherOccupation}</div>
                <div className="pt-2 flex items-center gap-1.5 text-indigo-600 font-mono font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  <a href={`tel:${student.fatherPhone}`} className="hover:underline">{student.fatherPhone}</a>
                </div>
              </div>

              {/* Mother */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold text-indigo-900 uppercase">Mother</div>
                <div className="font-bold text-slate-900 text-sm">{student.motherName}</div>
                <div className="text-slate-500">{student.motherOccupation}</div>
                <div className="pt-2 flex items-center gap-1.5 text-indigo-600 font-mono font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  <a href={`tel:${student.motherPhone}`} className="hover:underline">{student.motherPhone}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Bhopal Transport Route Allocation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Bhopal Bus Transport Allocation
            </h3>
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{student.bhopalZone} Transport Zone</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    Designated Stop: <strong className="text-slate-800">{student.busStop || 'Direct Parent Drop'}</strong>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Route Active
              </span>
            </div>
          </div>

          {/* Section 4: Academic Records / CBSE Examination */}
          {student.exams && student.exams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Recent CBSE Examination Performance
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-3 flex items-center justify-between font-semibold">
                  <span>{student.exams[0].examName} ({student.exams[0].academicYear})</span>
                  <span className="font-mono text-indigo-700">
                    Overall: {student.exams[0].percentage}% (Grade: {student.exams[0].overallGrade})
                  </span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5 text-center">Theory</th>
                      <th className="p-2.5 text-center">Practical</th>
                      <th className="p-2.5 text-center">Total (100)</th>
                      <th className="p-2.5 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.exams[0].grades.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-medium text-slate-800">{g.subject}</td>
                        <td className="p-2.5 text-center font-mono">{g.theoryMarks ?? '-'}</td>
                        <td className="p-2.5 text-center font-mono">{g.practicalMarks ?? '-'}</td>
                        <td className="p-2.5 text-center font-bold font-mono text-slate-900">{g.marksObtained}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700 text-[10px]">
                            {g.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Student Record ID: <span className="font-mono">{student.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {student.totalFeeDue > 0 && (
              <button
                onClick={() => onCollectFee(student)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Collect Fee (₹{student.totalFeeDue})</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
