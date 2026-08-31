export type PortalRole = 'admin' | 'teacher' | 'parent';

export interface UserSession {
  role: PortalRole;
  name: string;
  username: string;
  designation?: string;
  email?: string;
  phone?: string;
  teacherClass?: string; // e.g. "10th-A"
  studentId?: string; // for parent
  studentName?: string;
}

export type Role = 'principal' | 'teacher' | 'accountant' | 'transport_manager' | 'student';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'half-day';

export interface SubjectGrade {
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'D' | 'E';
  theoryMarks?: number;
  practicalMarks?: number;
  remarks?: string;
}

export interface ExamRecord {
  id: string;
  examName: string;
  term: string;
  academicYear: string;
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  overallGrade: string;
  rankInClass?: number;
  grades: SubjectGrade[];
  remarks: string;
}

export interface Student {
  id: string;
  admissionNo: string; // S.R. No / Scholar No
  rollNo: string;
  samagraId?: string; // Madhya Pradesh Samagra 9-digit ID
  name: string;
  grade: string; // e.g. "10th", "12th"
  section: string; // e.g. "A", "B"
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  house: 'Tagore (Red)' | 'Raman (Blue)' | 'Ashoka (Green)' | 'Shivaji (Gold)';
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  phone: string;
  email: string;
  address: string;
  bhopalZone: string; // "Arera Colony", "Kolar Road", "MP Nagar", "BHEL", etc.
  busRouteId?: string;
  busStop?: string;
  admissionDate: string;
  attendanceRate: number; // e.g. 94.5
  totalFeeDue: number;
  totalFeePaid: number;
  feeStatus: 'paid' | 'partial' | 'overdue';
  avatarUrl: string;
  aadhaarNumber?: string;
  notes?: string;
  exams?: ExamRecord[];
}

export interface StaffMember {
  id: string;
  employeeCode: string;
  name: string;
  role: 'Principal' | 'PGT' | 'TGT' | 'PRT' | 'Admin Officer' | 'Accountant' | 'Sports Coach' | 'Lab Assistant';
  department: 'Administration' | 'Mathematics' | 'Science' | 'English' | 'Social Science' | 'Computer Science' | 'Hindi' | 'Physical Education';
  subjectTaught?: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  email: string;
  address: string;
  bhopalArea: string;
  joiningDate: string;
  status: 'active' | 'on_leave';
  avatarUrl: string;
  classesAssigned?: string[];
}

export interface FeeItem {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  grade: string;
  section: string;
  term: string; // "Q1 (Apr-Jun)", "Q2 (Jul-Sep)", etc.
  tuitionFee: number;
  transportFee: number;
  labAndComputerFee: number;
  activityAndSportsFee: number;
  examinationFee: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'partial' | 'overdue';
  paymentMode?: 'UPI / QR' | 'Cash at Counter' | 'Net Banking' | 'Debit Card' | 'Cheque';
  transactionRef?: string;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  grade: string;
  section: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  status: AttendanceStatus;
  inTime?: string;
  remarks?: string;
}

export interface BusStop {
  stopName: string;
  pickupTime: string;
  dropTime: string;
  landmark: string;
}

export interface BusRoute {
  id: string;
  routeNo: string;
  routeName: string; // e.g. "Route 01: BHEL - MP Nagar - Kolar"
  busRegistrationNo: string; // e.g. "MP 04 PA 8821"
  driverName: string;
  driverPhone: string;
  conductorName: string;
  conductorPhone: string;
  inchargeTeacher: string;
  capacity: number;
  assignedStudentsCount: number;
  stops: BusStop[];
  currentLiveStatus: 'On Time' | 'Delayed by 10m' | 'At School Campus' | 'Completed Morning Route';
  currentLocationName: string;
  gpsSpeedKmH: number;
}

export interface SchoolNotice {
  id: string;
  noticeNo: string;
  title: string;
  category: 'academic' | 'holiday' | 'event' | 'exam' | 'fee' | 'urgent';
  date: string;
  targetAudience: 'All' | 'Students' | 'Parents' | 'Teachers';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  content: string;
  signedBy: string;
  attachmentName?: string;
  isPinned?: boolean;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  room: string;
  isBreak?: boolean;
}
