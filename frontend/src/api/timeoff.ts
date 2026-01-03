/**
 * Time Off API
 */

import apiClient from './client';

export interface TimeOffBalance {
  type_name: string;
  days_available: number;
}

export interface TimeOffRequest {
  id: string;
  employee_name?: string; // For admin view
  type_name: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  rejection_reason?: string;
  created_at: string;
}

export interface MyTimeOffResponse {
  balances: TimeOffBalance[];
  requests: TimeOffRequest[];
}

export interface CreateTimeOffData {
  timeoff_type: string; // UUID
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  reason: string;
  attachment?: File | null;
}

export interface AdminTimeOffListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TimeOffRequest[];
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
  createRequest: async (data: CreateTimeOffData): Promise<TimeOffRequest> => {
    const formData = new FormData();
    formData.append('timeoff_type', data.timeoff_type);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('reason', data.reason);
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }

    const response = await apiClient.post<TimeOffRequest>('/timeoff/me/', formData, {
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
  }): Promise<AdminTimeOffListResponse> => {
    const response = await apiClient.get<AdminTimeOffListResponse>('/timeoff/admin/', { params });
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
