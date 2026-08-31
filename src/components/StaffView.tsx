import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Award,
  X,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { StaffMember, Role } from '../types';
import { BHOPAL_ZONES } from '../data/mockData';

interface StaffViewProps {
  staff: StaffMember[];
  onAddStaff: (newStaff: StaffMember) => void;
  currentRole: Role;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staff,
  onAddStaff,
  currentRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('PGT');
  const [department, setDepartment] = useState<StaffMember['department']>('Mathematics');
  const [subjectTaught, setSubjectTaught] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bhopalArea, setBhopalArea] = useState(BHOPAL_ZONES[0]);

  const departments = [
    'Administration',
    'Mathematics',
    'Science',
    'English',
    'Social Science',
    'Computer Science',
    'Hindi',
    'Physical Education'
  ];

  const filteredStaff = staff.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subjectTaught && item.subjectTaught.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bhopalArea.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'all' || item.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: StaffMember = {
      id: `stf_${Date.now()}`,
      employeeCode: `EVSB-FAC-0${Math.floor(50 + Math.random() * 50)}`,
      name,
      role,
      department,
      subjectTaught: subjectTaught || `${department} Faculty`,
      qualification: qualification || 'Post Graduate, B.Ed',
      experienceYears,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@educationvalleybhopal.edu.in`,
      address: address || `${bhopalArea}, Bhopal (M.P.)`,
      bhopalArea,
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active',
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`
    };

    onAddStaff(newMember);
    setIsAddModalOpen(false);
    // Reset
    setName('');
    setSubjectTaught('');
    setQualification('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Faculty & Academic Staff Roster</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {filteredStaff.length} Faculty Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified CBSE educators, administrative officers & Bhopal campus staff directory
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty name, subject taught, or Bhopal area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 mt-0.5">
                      {member.role} • {member.department}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700">
                  {member.status === 'active' ? 'Active' : 'On Leave'}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 text-[11px] block">Subject / Area:</span>
                  <p className="font-semibold text-slate-800">{member.subjectTaught || 'General Faculty'}</p>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block">Qualifications:</span>
                  <p className="font-medium text-slate-700 text-[11px]">{member.qualification}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {member.bhopalArea}
                  </span>
                  <span>{member.experienceYears}+ yrs exp</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">{member.employeeCode}</span>
              <a 
                href={`tel:${member.phone}`}
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
              >
                <Phone className="w-3 h-3" />
                <span>{member.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 font-outfit text-base">Register New Faculty / Staff Member</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Full Name & Salutation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Anita Deshpande"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Designation / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="PGT">PGT (Class 11-12)</option>
                    <option value="TGT">TGT (Class 6-10)</option>
                    <option value="PRT">PRT (Primary)</option>
                    <option value="Admin Officer">Admin Officer</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Sports Coach">Sports Coach</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Subject Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic Chemistry & Lab Practicals"
                  value={subjectTaught}
                  onChange={(e) => setSubjectTaught(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Qualifications & Degree
                  </label>
                  <input
                    type="text"
                    placeholder="M.Sc., B.Ed, NET"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Bhopal Residential Area
                  </label>
                  <select
                    value={bhopalArea}
                    onChange={(e) => setBhopalArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {BHOPAL_ZONES.map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
                >
                  Add to Faculty Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
