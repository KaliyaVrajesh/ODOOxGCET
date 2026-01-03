/**
 * Attendance API
 */

import apiClient from './client';

export interface AttendanceRecord {
  id: string;
  employee_name?: string; // For admin view
  date?: string; // DD/MM/YYYY
  check_in: string; // HH:MM
  check_out: string; // HH:MM
  work_hours: string; // HH:MM
  extra_hours: string; // HH:MM
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
}

export interface CheckInResponse {
  message: string;
  since_time: string;
  status: string;
}

export interface CheckOutResponse {
  message: string;
  duration: string;
  check_in: string;
  check_out: string;
}

export interface CurrentStatusResponse {
  is_checked_in: boolean;
  since_time: string | null;
  status_icon: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
  check_in_time: string | null;
  check_out_time: string | null;
}

export interface AdminDayAttendanceResponse {
  date: string;
  total_present: number;
  total_absent: number;
  total_on_leave: number;
  employees: AttendanceRecord[];
}

export interface EmployeeMonthAttendanceResponse {
  month: string;
  year: number;
  days_present: number;
  days_on_leave: number;
  total_days: number;
  records: AttendanceRecord[];
}

export const attendanceApi = {
  /**
   * Check in
   */
  checkIn: async (): Promise<CheckInResponse> => {
    const response = await apiClient.post<CheckInResponse>('/attendance/check-in/');
    return response.data;
  },

  /**
   * Check out
   */
  checkOut: async (): Promise<CheckOutResponse> => {
    const response = await apiClient.post<CheckOutResponse>('/attendance/check-out/');
    return response.data;
  },

  /**
   * Get current status
   */
  getCurrentStatus: async (): Promise<CurrentStatusResponse> => {
    const response = await apiClient.get<CurrentStatusResponse>('/attendance/current/');
    return response.data;
  },

  /**
   * Admin - Get day attendance
   */
  getAdminDayAttendance: async (date?: string): Promise<AdminDayAttendanceResponse> => {
    const params = date ? { date } : {};
    const response = await apiClient.get<AdminDayAttendanceResponse>('/attendance/admin/day/', { params });
    return response.data;
  },

  /**
   * Employee - Get month attendance
   */
  getEmployeeMonthAttendance: async (month?: number, year?: number): Promise<EmployeeMonthAttendanceResponse> => {
    const params: { month?: number; year?: number } = {};
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await apiClient.get<EmployeeMonthAttendanceResponse>('/attendance/me/month/', { params });
    return response.data;
  },
};

export default attendanceApi;
