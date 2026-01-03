/**
 * Time Off API
 */

import apiClient from './client';

export interface TimeOffBalance {
  id: string; // Balance ID
  type_id: string; // UUID of the time off type
  type_code: string;
  type_name: string;
  year: number;
  allocated_days: number;
  used_days: number;
  available_days: number;
}

export interface TimeOffRequest {
  id: string;
  employee_id?: string;
  employee_name?: string; // For admin view
  timeoff_type_name: string;
  timeoff_type_code: string;
  start_date: string;
  end_date: string;
  allocation_days: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface MyTimeOffResponse {
  balances: TimeOffBalance[];
  requests: TimeOffRequest[];
}

export interface CreateTimeOffData {
  timeoff_type: string; // UUID
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  attachment?: File | null;
}

export interface AdminTimeOffListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: TimeOffRequest[];
}

export const timeoffApi = {
  /**
   * Employee - Get my time off requests and balances
   */
  getMyTimeOff: async (): Promise<MyTimeOffResponse> => {
    const response = await apiClient.get<MyTimeOffResponse>('/timeoff/me/');
    return response.data;
  },

  /**
   * Employee - Create time off request
   */
  createRequest: async (data: CreateTimeOffData): Promise<{ request: TimeOffRequest; balances: TimeOffBalance[]; message: string }> => {
    const formData = new FormData();
    formData.append('timeoff_type', data.timeoff_type);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }

    const response = await apiClient.post<{ request: TimeOffRequest; balances: TimeOffBalance[]; message: string }>('/timeoff/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Admin - Get all time off requests
   */
  getAdminTimeOffList: async (params?: {
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    search?: string;
    page?: number;
  }): Promise<TimeOffRequest[]> => {
    const response = await apiClient.get<TimeOffRequest[]>('/timeoff/admin/', { params });
    return response.data;
  },

  /**
   * Admin - Approve request
   */
  approveRequest: async (id: string): Promise<{ message: string; request: TimeOffRequest }> => {
    const response = await apiClient.post<{ message: string; request: TimeOffRequest }>(
      `/timeoff/admin/${id}/approve/`
    );
    return response.data;
  },

  /**
   * Admin - Reject request
   */
  rejectRequest: async (
    id: string,
    rejection_reason: string
  ): Promise<{ message: string; request: TimeOffRequest }> => {
    const response = await apiClient.post<{ message: string; request: TimeOffRequest }>(
      `/timeoff/admin/${id}/reject/`,
      { rejection_reason }
    );
    return response.data;
  },
};

export default timeoffApi;
