import { Student, StaffMember, FeeItem, AttendanceRecord, SchoolNotice, BusRoute } from '../types';
import { MOCK_STUDENTS, MOCK_STAFF, MOCK_FEES, MOCK_NOTICES, MOCK_BUS_ROUTES } from '../data/mockData';

const STORAGE_KEYS = {
  STUDENTS: 'evsb_students_v1',
  STAFF: 'evsb_staff_v1',
  FEES: 'evsb_fees_v1',
  ATTENDANCE_PREFIX: 'evsb_att_',
  NOTICES: 'evsb_notices_v1',
  BUS_ROUTES: 'evsb_bus_routes_v1',
};

export const getStoredStudents = (): Student[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!item) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
      return MOCK_STUDENTS;
    }
    return JSON.parse(item);
  } catch {
    return MOCK_STUDENTS;
  }
};

export const saveStoredStudents = (students: Student[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students to localStorage', err);
  }
};

export const getStoredStaff = (): StaffMember[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (!item) {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(MOCK_STAFF));
      return MOCK_STAFF;
    }
    return JSON.parse(item);
  } catch {
    return MOCK_STAFF;
  }
};

export const saveStoredStaff = (staff: StaffMember[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  } catch (err) {
    console.error('Failed to save staff to localStorage', err);
  }
};

export const getStoredFees = (): FeeItem[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.FEES);
    if (!item) {
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(MOCK_FEES));
      return MOCK_FEES;
    }
    return JSON.parse(item);
  } catch {
    return MOCK_FEES;
  }
};

export const saveStoredFees = (fees: FeeItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
  } catch (err) {
    console.error('Failed to save fees to localStorage', err);
  }
};

export const getStoredNotices = (): SchoolNotice[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!item) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(MOCK_NOTICES));
      return MOCK_NOTICES;
    }
    return JSON.parse(item);
  } catch {
    return MOCK_NOTICES;
  }
};

export const saveStoredNotices = (notices: SchoolNotice[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  } catch (err) {
    console.error('Failed to save notices to localStorage', err);
  }
};

export const getStoredBusRoutes = (): BusRoute[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.BUS_ROUTES);
    if (!item) {
      localStorage.setItem(STORAGE_KEYS.BUS_ROUTES, JSON.stringify(MOCK_BUS_ROUTES));
      return MOCK_BUS_ROUTES;
    }
    return JSON.parse(item);
  } catch {
    return MOCK_BUS_ROUTES;
  }
};

export const saveStoredBusRoutes = (routes: BusRoute[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUS_ROUTES, JSON.stringify(routes));
  } catch (err) {
    console.error('Failed to save bus routes to localStorage', err);
  }
};

export const getStoredAttendance = (date: string, grade: string, section: string): AttendanceRecord[] => {
  try {
    const key = `${STORAGE_KEYS.ATTENDANCE_PREFIX}${date}_${grade}_${section}`;
    const item = localStorage.getItem(key);
    if (!item) return [];
    return JSON.parse(item);
  } catch {
    return [];
  }
};

export const saveStoredAttendance = (
  date: string,
  grade: string,
  section: string,
  records: AttendanceRecord[]
): void => {
  try {
    const key = `${STORAGE_KEYS.ATTENDANCE_PREFIX}${date}_${grade}_${section}`;
    localStorage.setItem(key, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save attendance to localStorage', err);
  }
};
