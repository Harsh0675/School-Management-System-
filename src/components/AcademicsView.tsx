import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Calendar, 
  Clock, 
  Download, 
  Printer, 
  Search, 
  Star, 
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Student, Role } from '../types';
import { TIMETABLE_SLOTS, SCHOOL_INFO } from '../data/mockData';

interface AcademicsViewProps {
  students: Student[];
  onPrintReportCard: (student: Student) => void;
  onSelectStudent: (student: Student) => void;
  currentRole: Role;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  students,
  onPrintReportCard,
  onSelectStudent,
  currentRole
}) => {
  const [selectedTab, setSelectedTab] = useState<'gradebook' | 'timetable' | 'mp_board_criteria'>('gradebook');
  const [selectedClass, setSelectedClass] = useState<string>('10th');
  const [selectedTerm, setSelectedTerm] = useState<string>('Pre-Board');

  const classStudents = students.filter(s => s.grade === selectedClass);

  // MP Board (MPBSE) Division & Grading Scale Definition
  const mpBoardGradingScale = [
    { marks: '75% - 100%', division: 'प्रथम श्रेणी विशेष योग्यता (1st Div with Distinction)', grade: 'A+', remark: 'मण्डल मेरिट एवं विशेष प्रवीणता (Merit List Candidate)' },
    { marks: '60% - 74%', division: 'प्रथम श्रेणी (1st Division)', grade: 'A', remark: 'उत्कृष्ट प्रदर्शन (First Division Passed)' },
    { marks: '45% - 59%', division: 'द्वितीय श्रेणी (2nd Division)', grade: 'B', remark: 'संतोषजनक उत्तीर्ण (Second Division Passed)' },
    { marks: '33% - 44%', division: 'तृतीय श्रेणी (3rd Division)', grade: 'C', remark: 'सामान्य उत्तीर्ण (Pass Division)' },
    { marks: '1 विषय में < 33%', division: 'पूरक परीक्षा (Supplementary / Compartment)', grade: 'SUPPL', remark: 'मण्डल पूरक परीक्षा अवसर (Eligible for Supplementary)' },
    { marks: '2+ विषयों में < 33%', division: 'अनुत्तीर्ण (Fail / Essential Repeat)', grade: 'FAIL', remark: 'रुक जाना नहीं योजना / पुनः परीक्षा' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">MP Board परीक्षा एवं अंकसूची (Examination Suite)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              माध्यमिक शिक्षा मण्डल, म.प्र. भोपाल
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            हाई स्कूल (10वीं) एवं हायर सेकेण्डरी (12वीं) अंकसूची, समय-सारणी एवं आंतरिक मूल्यांकन (CCE/प्रायोगिक)
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedTab('gradebook')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'gradebook'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            अंक रजिस्टर (Gradebook)
          </button>
          <button
            onClick={() => setSelectedTab('timetable')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'timetable'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            समय सारणी (Timetable)
          </button>
          <button
            onClick={() => setSelectedTab('mp_board_criteria')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'mp_board_criteria'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मण्डल ग्रेडिंग नियम (Rules)
          </button>
        </div>
      </div>

      {/* Tab 1: Gradebook & Roster */}
      {selectedTab === 'gradebook' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  कक्षा चुनें (Class)
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="10th">कक्षा 10वीं (हाई स्कूल बोर्ड)</option>
                  <option value="12th">कक्षा 12वीं (हायर सेकेण्डरी बोर्ड)</option>
                  <option value="9th">कक्षा 9वीं (मण्डल पैटर्न)</option>
                  <option value="8th">कक्षा 8वीं (बोर्ड पैटर्न)</option>
                  <option value="5th">कक्षा 5वीं (प्राथमिक)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  परीक्षा का प्रकार (Exam)
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Pre-Board">प्री-बोर्ड परीक्षा 2025-26 (Pre-Board)</option>
                  <option value="Half-Yearly">अर्धवार्षिक परीक्षा (Half-Yearly)</option>
                  <option value="Quarterly">त्रैमासिक परीक्षा (Quarterly)</option>
                  <option value="Annual">वार्षिक मण्डल मुख्य परीक्षा (Annual)</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              कुल छात्र: <strong className="text-slate-900">{classStudents.length} विद्यार्थी</strong>
            </div>
          </div>

          {/* Marks Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">रैंक</th>
                    <th className="py-3 px-4">विद्यार्थी एवं समग्र ID</th>
                    <th className="py-3 px-4 text-center">हिंदी विशिष्ट (100)</th>
                    <th className="py-3 px-4 text-center">अंग्रेजी (100)</th>
                    <th className="py-3 px-4 text-center">संस्कृत / IT (100)</th>
                    <th className="py-3 px-4 text-center">गणित (100)</th>
                    <th className="py-3 px-4 text-center">विज्ञान (100)</th>
                    <th className="py-3 px-4 text-center">सामाजिक (100)</th>
                    <th className="py-3 px-4 text-center">कुल प्राप्तांक / %</th>
                    <th className="py-3 px-4 text-center">परिणाम</th>
                    <th className="py-3 px-4 text-right">अंकसूची</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((student, idx) => {
                    const exam = student.exams && student.exams.length > 0 ? student.exams[0] : null;
                    const rank = exam?.rankInClass || idx + 1;

                    return (
                      <tr 
                        key={student.id} 
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => onSelectStudent(student)}
                      >
                        <td className="py-3 px-4 text-center">
                          {rank === 1 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold inline-flex items-center justify-center text-xs shadow-xs">
                              1
                            </span>
                          ) : rank === 2 ? (
                            <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-bold inline-flex items-center justify-center text-xs shadow-xs">
                              2
                            </span>
                          ) : rank === 3 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-bold inline-flex items-center justify-center text-xs shadow-xs">
                              3
                            </span>
                          ) : (
                            <span className="font-mono text-slate-400 font-semibold">{rank}</span>
                          )}
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
                              <div className="text-[10px] text-slate-500 font-mono">
                                समग्र: <span className="font-semibold text-slate-700">{student.samagraId || student.admissionNo}</span> (रोल: {student.rollNo})
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Subject Marks Columns */}
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                          {exam?.grades.find(g => g.subject.includes('Hindi'))?.marksObtained ?? '88'}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                          {exam?.grades.find(g => g.subject.includes('English'))?.marksObtained ?? '82'}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                          {exam?.grades.find(g => g.subject.includes('Sanskrit') || g.subject.includes('IT'))?.marksObtained ?? '90'}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                          {exam?.grades.find(g => g.subject.includes('Math'))?.marksObtained ?? '92'}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                          {exam?.grades.find(g => g.subject.includes('Science'))?.marksObtained ?? '86'}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                          {exam?.grades.find(g => g.subject.includes('Social'))?.marksObtained ?? '84'}
                        </td>

                        {/* Aggregate Total */}
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-slate-900 font-mono">
                            {exam ? `${exam.percentage}%` : '87.0%'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {exam ? `${exam.totalObtainedMarks}/600` : '522/600'}
                          </div>
                        </td>

                        {/* Result / Division */}
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            1st Div (A+)
                          </span>
                        </td>

                        {/* Print Trigger */}
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onPrintReportCard(student)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                            title="MP Board अंकसूची प्रिंट करें"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>अंकसूची (Print)</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Class Timetable */}
      {selectedTab === 'timetable' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  दैनिक समय सारणी (Master Daily Timetable) • कक्षा {selectedClass}-A
                </h3>
                <p className="text-xs text-slate-500">
                  मण्डल दिशानिर्देशानुसार 8 कालखण्ड (प्रातः 08:00 से दोपहर 01:35 तक)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                सत्र 2025-26
              </span>
            </div>

            <div className="space-y-3">
              {TIMETABLE_SLOTS.map(slot => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    slot.isBreak
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${
                      slot.isBreak ? 'bg-amber-200 text-amber-900' : 'bg-slate-900 text-amber-400'
                    }`}>
                      <span className="text-[10px] uppercase">{slot.isBreak ? 'मध्यांतर' : 'कालखण्ड'}</span>
                      <span className="text-sm font-mono leading-none">{slot.period}</span>
                    </div>

                    <div>
                      <div className="font-bold text-sm text-slate-900">{slot.subject}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>शिक्षक: <strong className="text-slate-700">{slot.teacherName}</strong></span>
                        <span>•</span>
                        <span>कक्ष: <strong className="text-slate-700">{slot.room}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MP Board Grading Scale Reference */}
      {selectedTab === 'mp_board_criteria' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-outfit">
              माध्यमिक शिक्षा मण्डल, म.प्र. भोपाल (MPBSE) परीक्षा एवं श्रेणी नियम
            </h3>
            <p className="text-xs text-slate-500">
              हाई स्कूल (10वीं) एवं हायर सेकेण्डरी (12वीं) परीक्षा उत्तीर्ण प्राप्तांक एवं श्रेणी नियम
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">प्रतिशत दायरा (Marks %)</th>
                  <th className="py-3 px-4">श्रेणी (Division)</th>
                  <th className="py-3 px-4 text-center">ग्रेड</th>
                  <th className="py-3 px-4">मण्डल विवरण एवं टिप्पणी</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mpBoardGradingScale.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.marks}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.division}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 text-xs">
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
