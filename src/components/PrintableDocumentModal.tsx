import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Award, 
  ShieldCheck, 
  School, 
  Calendar, 
  Phone, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Student, FeeItem, SchoolNotice } from '../types';
import { SCHOOL_INFO } from '../data/mockData';

export type PrintableDocumentType = 
  | { type: 'report_card'; student: Student }
  | { type: 'id_card'; student: Student }
  | { type: 'fee_receipt'; feeItem: FeeItem }
  | { type: 'notice'; notice: SchoolNotice };

interface PrintableDocumentModalProps {
  documentData: PrintableDocumentType | null;
  onClose: () => void;
}

export const PrintableDocumentModal: React.FC<PrintableDocumentModalProps> = ({
  documentData,
  onClose
}) => {
  if (!documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Floating Control Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-xs sm:text-sm font-outfit">
              MP Board Print Preview • {SCHOOL_INFO.name}, Bhopal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट करें (Print / PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-900 bg-white print:p-6 print:overflow-visible">
          
          {/* ========================================================================= */}
          {/* TYPE 1: MP BOARD OFFICIAL MARKSHEET (प्रगति पत्रक) */}
          {/* ========================================================================= */}
          {documentData.type === 'report_card' && (
            <div className="border-4 border-double border-slate-800 p-6 space-y-6 rounded-2xl bg-white">
              {/* Header Letterhead */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 border border-amber-400 flex items-center justify-center font-bold text-xl shadow-md">
                    MP
                  </div>
                  <div>
                    <h1 className="text-2xl font-black font-outfit uppercase tracking-tight text-slate-900">
                      {SCHOOL_INFO.name}
                    </h1>
                    <p className="text-[11px] font-semibold text-slate-700">
                      {SCHOOL_INFO.affiliationHindi} • School Code: {SCHOOL_INFO.schoolCode} • DISE: {SCHOOL_INFO.diseCode}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {SCHOOL_INFO.address} • Email: {SCHOOL_INFO.email}
                    </p>
                  </div>
                </div>
                <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-amber-300 font-bold text-xs uppercase tracking-widest rounded-full">
                  माध्यमिक शिक्षा मण्डल, म.प्र. भोपाल • वार्षिक प्रगति पत्रक (Marksheet) 2025-26
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">विद्यार्थी का नाम (Name)</span>
                  <strong className="text-sm font-outfit text-slate-900">{documentData.student.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">समग्र आईडी (Samagra ID)</span>
                  <span className="font-mono font-bold text-slate-800">{documentData.student.samagraId || '198234561'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">कक्षा एवं वर्ग (Class/Sec)</span>
                  <strong className="text-slate-900">कक्षा {documentData.student.grade} - {documentData.student.section}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">मण्डल अनुक्रमांक (Roll No)</span>
                  <strong className="font-mono text-slate-900">{documentData.student.rollNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">पिता का नाम (Father)</span>
                  <span className="font-medium text-slate-800">{documentData.student.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">माता का नाम (Mother)</span>
                  <span className="font-medium text-slate-800">{documentData.student.motherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">माध्यम (Medium)</span>
                  <span className="font-medium text-slate-800">{documentData.student.medium || 'Hindi Medium'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">उपस्थिति (Attendance)</span>
                  <span className="font-bold text-emerald-700 font-mono">{documentData.student.attendanceRate}%</span>
                </div>
              </div>

              {/* Scholastic Marks Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                  भाग 1: सैद्धांतिक एवं प्रायोगिक मूल्यांकन (Scholastic Evaluation)
                </h3>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2.5 border-r border-slate-300">विषय (Subject)</th>
                      <th className="p-2.5 text-center border-r border-slate-300">सैद्धांतिक (Theory 75/80)</th>
                      <th className="p-2.5 text-center border-r border-slate-300">प्रायोगिक/प्रोजेक्ट (25/20)</th>
                      <th className="p-2.5 text-center border-r border-slate-300">कुल प्राप्तांक (100)</th>
                      <th className="p-2.5 text-center">मण्डल ग्रेड</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {documentData.student.exams && documentData.student.exams[0] ? (
                      documentData.student.exams[0].grades.map((g, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-medium border-r border-slate-300">{g.subject}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-300">{g.theoryMarks || Math.round(g.marksObtained * 0.75)}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-300">{g.practicalMarks || Math.round(g.marksObtained * 0.25)}</td>
                          <td className="p-2.5 text-center font-bold font-mono border-r border-slate-300">{g.marksObtained}</td>
                          <td className="p-2.5 text-center font-bold text-slate-900">{g.grade}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} className="p-4 text-center">No examination records logged</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Co-Scholastic & Remarks */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-800 uppercase text-[10px]">भाग 2: सह-शैक्षणिक एवं व्यक्तिगत गुण मूल्यांकन (CCE)</h4>
                  <div className="flex justify-between"><span>नैतिक शिक्षा एवं पर्यावरण:</span> <strong>A+ (उत्कृष्ट)</strong></div>
                  <div className="flex justify-between"><span>कला एवं सांस्कृतिक गतिविधि:</span> <strong>A (श्रेष्ठ)</strong></div>
                  <div className="flex justify-between"><span>शारीरिक एवं योग शिक्षा:</span> <strong>A+ (उत्कृष्ट)</strong></div>
                  <div className="flex justify-between"><span>अनुशासन एवं नियमितता:</span> <strong>A+ (उत्कृष्ट)</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-800 uppercase text-[10px]">परीक्षा परिणाम एवं मण्डल श्रेणी</h4>
                  <div className="flex justify-between"><span>कुल प्राप्तांक प्रतिशत:</span> <strong className="text-slate-900 font-mono">{documentData.student.exams?.[0]?.percentage || '88'}%</strong></div>
                  <div className="flex justify-between"><span>मण्डल उत्तीर्ण श्रेणी:</span> <strong className="text-emerald-700">प्रथम श्रेणी विशेष योग्यता (1st Div Distinction)</strong></div>
                  <div className="text-[11px] text-slate-600 pt-1">
                    कक्षाध्यापक टिप्पणी: <em>अध्ययन में अत्यंत मेधावी एवं अनुशासित। आगामी वार्षिक बोर्ड परीक्षा हेतु अग्रिम शुभकामनाएं।</em>
                  </div>
                </div>
              </div>

              {/* Signatures & Stamp */}
              <div className="pt-10 flex items-end justify-between text-center text-xs">
                <div className="space-y-1">
                  <div className="w-32 border-b border-slate-900 mx-auto"></div>
                  <span className="font-bold text-slate-700">कक्षाध्यापक (Class Teacher)</span>
                </div>

                <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-700 flex flex-col items-center justify-center text-[9px] font-bold text-slate-800 uppercase">
                  <span>विद्यालय सील</span>
                  <span>MPBSE Bhopal</span>
                </div>

                <div className="space-y-1">
                  <div className="font-serif italic text-slate-900 font-bold">Dr. R. Pandey</div>
                  <div className="w-32 border-b border-slate-900 mx-auto"></div>
                  <span className="font-bold text-slate-700">प्राचार्य / प्रशासक (Principal)</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TYPE 2: STUDENT ID CARD */}
          {/* ========================================================================= */}
          {documentData.type === 'id_card' && (
            <div className="max-w-md mx-auto space-y-6">
              {/* Front Side */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 shadow-xl border-2 border-amber-500/40 relative overflow-hidden">
                <div className="flex items-center gap-3 pb-3 border-b border-amber-500/30">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                    MP
                  </div>
                  <div>
                    <h3 className="font-bold font-outfit text-sm tracking-tight">{SCHOOL_INFO.name}</h3>
                    <p className="text-[10px] text-amber-300">माध्यमिक शिक्षा मण्डल, म.प्र. भोपाल • छात्र परिचय पत्र</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={documentData.student.avatarUrl}
                    alt={documentData.student.name}
                    className="w-24 h-28 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <h4 className="text-base font-bold text-white font-outfit">{documentData.student.name}</h4>
                    <div className="text-amber-200">
                      कक्षा: <strong className="text-white">कक्षा {documentData.student.grade} - {documentData.student.section}</strong>
                    </div>
                    <div className="text-amber-200">
                      समग्र ID: <strong className="font-mono text-white">{documentData.student.samagraId || '198234561'}</strong>
                    </div>
                    <div className="text-amber-200">
                      दाखिला क्रमांक: <strong className="font-mono text-white">{documentData.student.admissionNo}</strong>
                    </div>
                    <div className="text-amber-200">
                      रक्त समूह: <strong className="text-white">{documentData.student.bloodGroup}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-between text-[10px] text-amber-300">
                  <span>School Code: {SCHOOL_INFO.schoolCode}</span>
                  <span className="font-bold text-white">सत्र: 2025-26</span>
                </div>
              </div>

              {/* Back Side */}
              <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-md border-2 border-slate-300 text-xs space-y-3">
                <div className="text-center font-bold text-slate-800 text-[11px] uppercase border-b pb-2">
                  आपातकालीन सम्पर्क एवं पता विवरण
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p><strong>अभिभावक/पिता:</strong> {documentData.student.fatherName} ({documentData.student.fatherPhone})</p>
                  <p><strong>निवास का पता:</strong> {documentData.student.address}</p>
                  <p><strong>विद्यालय हेल्पलाइन:</strong> 0755-2894100 / 9826012345</p>
                </div>
                <div className="pt-3 border-t flex items-center justify-between text-[10px]">
                  <span className="font-mono">MPBSE Code: 231450</span>
                  <span className="font-bold">प्राचार्य हस्ताक्षर</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TYPE 3: OFFICIAL MP ONLINE / SCHOOL FEE RECEIPT */}
          {/* ========================================================================= */}
          {documentData.type === 'fee_receipt' && (
            <div className="border-2 border-slate-400 p-6 rounded-2xl bg-white space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-outfit uppercase">{SCHOOL_INFO.name}</h2>
                  <p className="text-xs text-slate-600">{SCHOOL_INFO.address}</p>
                  <p className="text-[10px] text-slate-500">{SCHOOL_INFO.affiliationHindi} • School Code: {SCHOOL_INFO.schoolCode}</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-amber-700">{documentData.feeItem.invoiceNo}</div>
                  <div className="text-[11px] text-slate-500">दिनांक: {documentData.feeItem.paidDate || '2025-07-10'}</div>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">विद्यार्थी का नाम (Name)</span>
                  <strong className="text-slate-900">{documentData.feeItem.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">दाखिला क्रमांक / समग्र ID</span>
                  <strong className="font-mono text-slate-900">{documentData.feeItem.admissionNo}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">कक्षा व वर्ग</span>
                  <span>कक्षा {documentData.feeItem.grade} - {documentData.feeItem.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">शुल्क अवधि (Term)</span>
                  <span>{documentData.feeItem.term}</span>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2.5 border-r border-slate-300">शुल्क विवरण (Particulars)</th>
                    <th className="p-2.5 text-right">राशि (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 border-r border-slate-300">मासिक / त्रैमासिक शिक्षण शुल्क (Tuition Fee)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">₹{documentData.feeItem.tuitionFee.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border-r border-slate-300">विज्ञान प्रयोगशाला एवं प्रायोगिक शुल्क</td>
                    <td className="p-2.5 text-right font-mono font-semibold">₹{documentData.feeItem.labAndComputerFee.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border-r border-slate-300">खेलकूद, पुस्तकालय एवं विकास शुल्क</td>
                    <td className="p-2.5 text-right font-mono font-semibold">₹{documentData.feeItem.activityAndSportsFee.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border-r border-slate-300">MPBSE मण्डल परीक्षा एवं मूल्यांकन शुल्क</td>
                    <td className="p-2.5 text-right font-mono font-semibold">₹{documentData.feeItem.examinationFee.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2.5 border-r border-slate-300">कुल निर्धारित शुल्क (Total Fee)</td>
                    <td className="p-2.5 text-right font-mono">₹{documentData.feeItem.totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-900 font-bold text-sm">
                    <td className="p-2.5 border-r border-slate-300">जमा प्राप्त राशि (Paid Amount)</td>
                    <td className="p-2.5 text-right font-mono">₹{documentData.feeItem.paidAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              {/* Settlement Mode & Sign */}
              <div className="flex items-center justify-between text-xs pt-4 border-t">
                <div>
                  <p><strong>भुगतान माध्यम (Mode):</strong> {documentData.feeItem.paymentMode}</p>
                  <p className="font-mono text-slate-500 text-[11px]">Txn Ref: {documentData.feeItem.transactionRef}</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-slate-900 mx-auto"></div>
                  <span className="font-bold text-slate-700">लेखापाल / कैशियर (Accountant)</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TYPE 4: OFFICIAL NOTICE / CIRCULAR */}
          {/* ========================================================================= */}
          {documentData.type === 'notice' && (
            <div className="border-2 border-slate-800 p-8 rounded-2xl bg-white space-y-6">
              {/* Header Letterhead */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <h1 className="text-2xl font-black font-outfit uppercase tracking-tight text-slate-900">
                  {SCHOOL_INFO.name}
                </h1>
                <p className="text-xs text-slate-600">
                  कोलार रोड, भोपाल (म.प्र.) • {SCHOOL_INFO.affiliationHindi}
                </p>
                <div className="inline-block px-3 py-1 bg-slate-900 text-amber-300 font-bold text-[11px] uppercase tracking-widest mt-2">
                  विद्यालय कार्यालयीन सूचना पत्र (Official Order)
                </div>
              </div>

              <div className="flex justify-between text-xs text-slate-600 font-mono border-b pb-2">
                <span>क्रमांक: EVSB/सूचना/2025/{documentData.notice.id.slice(-4)}</span>
                <span>दिनांक: {documentData.notice.date}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold text-slate-900 underline">
                  विषय: {documentData.notice.title}
                </h2>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {documentData.notice.content}
                </div>
              </div>

              <div className="pt-12 text-right space-y-1 text-xs">
                <div className="font-serif italic font-bold text-slate-900">Dr. R. Pandey</div>
                <p className="font-bold text-slate-700">प्राचार्य / प्रशासक</p>
                <p className="text-[10px] text-slate-500">Education Valley School, Bhopal</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
