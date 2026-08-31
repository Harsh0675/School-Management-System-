import React, { useState } from 'react';
import { 
  CreditCard, 
  IndianRupee, 
  Search, 
  Filter, 
  Plus, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode, 
  Download,
  Share2,
  X,
  Building2,
  Receipt
} from 'lucide-react';
import { FeeItem, Student, Role } from '../types';

interface FeesViewProps {
  fees: FeeItem[];
  students: Student[];
  onAddFeePayment: (fee: FeeItem) => void;
  onPrintFeeReceipt: (feeItem: FeeItem) => void;
  currentRole: Role;
}

export const FeesView: React.FC<FeesViewProps> = ({
  fees,
  students,
  onAddFeePayment,
  onPrintFeeReceipt,
  currentRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [selectedFeeForUpi, setSelectedFeeForUpi] = useState<FeeItem | null>(null);

  // New Payment Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [term, setTerm] = useState<string>('Q2 (Jul-Sep 2025)');
  const [tuitionFee, setTuitionFee] = useState<number>(24000);
  const [transportFee, setTransportFee] = useState<number>(9000);
  const [labFee, setLabFee] = useState<number>(6000);
  const [activityFee, setActivityFee] = useState<number>(3000);
  const [examFee, setExamFee] = useState<number>(3000);
  const [paidAmount, setPaidAmount] = useState<number>(45000);
  const [paymentMode, setPaymentMode] = useState<'UPI / QR' | 'Cash at Counter' | 'Net Banking' | 'Debit Card' | 'Cheque'>('UPI / QR');
  const [transactionRef, setTransactionRef] = useState<string>('UPI/EVSB/' + Math.floor(100000 + Math.random() * 900000));
  const [remarks, setRemarks] = useState<string>('Fee payment settled at counter');

  // Aggregations
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalDue = fees.reduce((sum, f) => sum + f.dueAmount, 0);
  const totalTarget = totalCollected + totalDue;
  const collectionRate = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  const filteredFees = fees.filter(item => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStudentSelectInForm = (stId: string) => {
    setSelectedStudentId(stId);
    const st = students.find(s => s.id === stId);
    if (st && st.totalFeeDue > 0) {
      setPaidAmount(st.totalFeeDue);
    } else {
      setPaidAmount(45000);
    }
  };

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return;

    const total = tuitionFee + transportFee + labFee + activityFee + examFee;
    const due = Math.max(0, total - paidAmount);
    const status = due === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'overdue';

    const newFeeItem: FeeItem = {
      id: `fee_${Date.now()}`,
      invoiceNo: `EVSB-INV-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: st.id,
      studentName: st.name,
      admissionNo: st.admissionNo,
      grade: st.grade,
      section: st.section,
      term,
      tuitionFee,
      transportFee,
      labAndComputerFee: labFee,
      activityAndSportsFee: activityFee,
      examinationFee: examFee,
      totalAmount: total,
      paidAmount,
      dueAmount: due,
      dueDate: '2025-07-15',
      paidDate: new Date().toISOString().split('T')[0],
      status,
      paymentMode,
      transactionRef,
      remarks
    };

    onAddFeePayment(newFeeItem);
    setIsCollectModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Accounts & Fee Collection Desk</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              Q2 Session 2025-26
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tuition, Bhopal transport dues, automated UPI QR generation & printed receipts
          </p>
        </div>

        <button
          onClick={() => setIsCollectModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Collect / Record Fee</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400">Total Collected (Q2)</div>
          <div className="text-2xl font-bold text-emerald-600 font-outfit mt-1">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Recovery Rate: <strong className="text-slate-800">{collectionRate}%</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-rose-500">Outstanding Dues</div>
          <div className="text-2xl font-bold text-rose-600 font-outfit mt-1">
            ₹{totalDue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {fees.filter(f => f.dueAmount > 0).length} student accounts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400">Quarterly Target</div>
          <div className="text-2xl font-bold text-slate-900 font-outfit mt-1">
            ₹{totalTarget.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-indigo-600 font-medium mt-1">
            Bank: SBI Kolar Branch (EVSB Current A/c)
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number, student name, or admission number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Invoices</option>
            <option value="paid">Settled (Paid)</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4">Term</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map(fee => (
                <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {fee.invoiceNo}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{fee.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {fee.admissionNo} • Class {fee.grade}-{fee.section}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {fee.term}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                    ₹{fee.totalAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">
                    ₹{fee.paidAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-rose-600 font-bold">
                    ₹{fee.dueAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      fee.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : fee.status === 'partial'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {fee.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* UPI QR Quick Pay Button */}
                      <button
                        onClick={() => {
                          setSelectedFeeForUpi(fee);
                          setIsUpiModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Display UPI QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {/* Print Receipt */}
                      <button
                        onClick={() => onPrintFeeReceipt(fee)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        title="Print Official Stamp Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 font-outfit text-base">Record School Fee Remittance</h3>
              </div>
              <button
                onClick={() => setIsCollectModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Select Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelectInForm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.admissionNo}) — Class {s.grade}-{s.section} [Due: ₹{s.totalFeeDue}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Quarter / Term
                  </label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    <option value="Q1 (Apr-Jun 2025)">Q1 (Apr-Jun 2025)</option>
                    <option value="Q2 (Jul-Sep 2025)">Q2 (Jul-Sep 2025)</option>
                    <option value="Q3 (Oct-Dec 2025)">Q3 (Oct-Dec 2025)</option>
                    <option value="Q4 (Jan-Mar 2026)">Q4 (Jan-Mar 2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    <option value="UPI / QR">UPI / BharatQR (Google Pay / PhonePe)</option>
                    <option value="Cash at Counter">Cash at Fee Counter</option>
                    <option value="Net Banking">Net Banking / NEFT</option>
                    <option value="Debit Card">Debit / POS Card</option>
                    <option value="Cheque">Banker Cheque / DD</option>
                  </select>
                </div>
              </div>

              {/* Fee Breakdown Inputs */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-[10px] uppercase text-slate-500">Component Breakdown (₹)</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Tuition:</span>
                    <input
                      type="number"
                      value={tuitionFee}
                      onChange={(e) => setTuitionFee(Number(e.target.value))}
                      className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500">Transport:</span>
                    <input
                      type="number"
                      value={transportFee}
                      onChange={(e) => setTransportFee(Number(e.target.value))}
                      className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500">Lab & AI:</span>
                    <input
                      type="number"
                      value={labFee}
                      onChange={(e) => setLabFee(Number(e.target.value))}
                      className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Amount Being Paid Now */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Amount Paid Now (₹)
                  </label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Transaction / Receipt Ref
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-md shadow-emerald-600/20"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPI QR Payment Modal */}
      {isUpiModalOpen && selectedFeeForUpi && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Bhopal Campus UPI Gateway</span>
              <button
                onClick={() => setIsUpiModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base font-outfit">
                Scan to Pay via UPI
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Education Valley School, Bhopal (SBI A/c)
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Student:</span>
                <strong className="text-slate-900">{selectedFeeForUpi.studentName}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Invoice:</span>
                <span className="font-mono">{selectedFeeForUpi.invoiceNo}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-indigo-700 pt-2 border-t border-slate-200">
                <span>Due Amount:</span>
                <span>₹{(selectedFeeForUpi.dueAmount || selectedFeeForUpi.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl text-[11px] text-indigo-900 font-mono">
              VPA: <strong className="font-bold">evsbhopal.fees@sbi</strong>
            </div>

            <button
              onClick={() => setIsUpiModalOpen(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
