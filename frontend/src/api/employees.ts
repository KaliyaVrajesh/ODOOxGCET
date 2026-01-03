/**
 * Employees API
 */

import apiClient from './client';

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  login_id: string;
  job_title: string;
  department: string;
  profile_picture: string | null;
  status_icon: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
}

export interface EmployeeDetail extends Employee {
  phone: string;
  role: string;
  date_joined: string;
}

export interface EmployeesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Employee[];
}

export const employeesApi = {
  /**
   * Get list of employees
   */
  list: async (params?: { search?: string; page?: number }): Promise<Employee[]> => {
    const response = await apiClient.get<Employee[]>('/employees/', { params });
    return response.data;
  },

  /**
   * Get employee detail
   */
  get: async (id: string): Promise<EmployeeDetail> => {
    const response = await apiClient.get<EmployeeDetail>(`/employees/${id}/`);
    return response.data;
  },
};

export default employeesApi;
