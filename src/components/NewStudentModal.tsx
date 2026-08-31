import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Bus, 
  GraduationCap, 
  ShieldCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types';
import { BHOPAL_ZONES, HOUSES } from '../data/mockData';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Student) => void;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('10th');
  const [section, setSection] = useState('A');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('2010-04-15');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [bhopalZone, setBhopalZone] = useState(BHOPAL_ZONES[0]);
  const [address, setAddress] = useState('');
  const [busStop, setBusStop] = useState('');
  const [house, setHouse] = useState(HOUSES[0]);

  // Parents
  const [fatherName, setFatherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [fatherPhone, setFatherPhone] = useState('+91 98');
  const [motherName, setMotherName] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [motherPhone, setMotherPhone] = useState('+91 98');
  const [email, setEmail] = useState('');
  const [initialDeposit, setInitialDeposit] = useState<number>(45000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const admissionNo = `EVSB-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const rollNo = `${Math.floor(10 + Math.random() * 80)}`;
    const feeStatus = initialDeposit >= 45000 ? 'paid' : initialDeposit > 0 ? 'partial' : 'overdue';

    const newStudent: Student = {
      id: `std_${Date.now()}`,
      admissionNo,
      rollNo,
      name,
      grade,
      section,
      gender,
      dob,
      bloodGroup,
      address: address || `${bhopalZone}, Bhopal (M.P.)`,
      bhopalZone,
      busStop: busStop || `${bhopalZone} Main Chowk`,
      house,
      fatherName: fatherName || 'Guardian',
      fatherOccupation: fatherOccupation || 'Professional',
      fatherPhone: fatherPhone || '+91 98260 00000',
      motherName: motherName || 'Mother',
      motherOccupation: motherOccupation || 'Homemaker',
      motherPhone: motherPhone || '+91 98260 00001',
      phone: fatherPhone || '+91 98260 00000',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      attendanceRate: 98.0,
      feeStatus,
      totalFeeDue: Math.max(0, 45000 - initialDeposit),
      totalFeePaid: initialDeposit,
      admissionDate: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-${gender === 'Male' ? '1539571696357-5a69c17a67c6' : '1534528741775-53994a69daeb'}?w=150&auto=format&fit=crop&q=80`,
      exams: [
        {
          id: `ex_${Date.now()}`,
          examName: 'Periodic Test 1 (Baseline)',
          term: 'Term 1',
          academicYear: '2025-26',
          totalMaxMarks: 500,
          totalObtainedMarks: 450,
          percentage: 90.0,
          overallGrade: 'A1',
          rankInClass: 5,
          remarks: 'Strong initial baseline evaluation.',
          grades: [
            { subject: 'English Communicative', marksObtained: 90, maxMarks: 100, grade: 'A1' },
            { subject: 'Mathematics (Standard)', marksObtained: 92, maxMarks: 100, grade: 'A1' },
            { subject: 'Science (Theory + Lab)', marksObtained: 88, maxMarks: 100, grade: 'A2' },
            { subject: 'Social Science', marksObtained: 86, maxMarks: 100, grade: 'A2' },
            { subject: 'Artificial Intelligence & CS', marksObtained: 94, maxMarks: 100, grade: 'A1' }
          ]
        }
      ]
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-outfit">New Student Admission Intake</h2>
              <p className="text-[11px] text-slate-300">Education Valley School Bhopal • Session 2025-26</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Section 1: Academic Enrollment */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              1. Student Identity & Class Enrollment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Yashvardhan Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class / Grade *</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="5th">Class 5th</option>
                  <option value="8th">Class 8th</option>
                  <option value="10th">Class 10th</option>
                  <option value="12th">Class 12th</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Section *</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">House Allocation</label>
              <select
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {HOUSES.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Parent & Guardian Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              2. Parent & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Father's Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Occupation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Engineer, BHEL"
                  value={fatherOccupation}
                  onChange={(e) => setFatherOccupation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Father's Phone *</label>
                <input
                  type="text"
                  value={fatherPhone}
                  onChange={(e) => setFatherPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mother's Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunita Sharma"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Occupation</label>
                <input
                  type="text"
                  placeholder="e.g. Professor, BU Bhopal"
                  value={motherOccupation}
                  onChange={(e) => setMotherOccupation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mother's Phone</label>
                <input
                  type="text"
                  value={motherPhone}
                  onChange={(e) => setMotherPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bhopal Address & Transport Allocation */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              3. Bhopal Residential Zone & Bus Stop
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bhopal Zone *</label>
                <select
                  value={bhopalZone}
                  onChange={(e) => setBhopalZone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {BHOPAL_ZONES.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Designated Bus Stop</label>
                <input
                  type="text"
                  placeholder="e.g. Sarvdharm Chowk / Chunabhatti"
                  value={busStop}
                  onChange={(e) => setBusStop(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Complete Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. House No. 42, A-Sector, Sarvdharm Colony, Kolar Road, Bhopal"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Initial Admission Fee */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              4. Admission & Term Fee Settlement
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard Term Fee (₹)</label>
                <input
                  type="text"
                  value="₹45,000 (Q1 Full)"
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold font-mono text-slate-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Deposit Amount (₹)</label>
                <input
                  type="number"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Admission & Generate ID</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
