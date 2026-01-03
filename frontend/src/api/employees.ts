/**
 * Employees API
 */

import apiClient from './client';

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  login_id: string;
  job_position: string;
  profile_picture: string | null;
  status_icon: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
}

export interface EmployeeDetail extends Employee {
  phone: string;
  department: string;
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
  list: async (params?: { search?: string; page?: number }): Promise<EmployeesListResponse> => {
    const response = await apiClient.get<EmployeesListResponse>('/employees/', { params });
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
