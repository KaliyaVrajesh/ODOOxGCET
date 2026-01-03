/**
 * Authentication API
 */

import apiClient, { tokenManager } from './client';

export interface SignUpData {
  company_name: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface SignInData {
  login_identifier: string; // email or login_id
  password: string;
}

export interface User {
  id: string;
  login_id: string;
  company_name: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'HR' | 'EMPLOYEE';
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export const authApi = {
  /**
   * Admin signup
   */
  signup: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/admin/signup/', data);
    
    // Store tokens
    tokenManager.setTokens(response.data.access, response.data.refresh);
    
    return response.data;
  },

  /**
   * Sign in
   */
  signin: async (data: SignInData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signin/', data);
    
    // Store tokens
    tokenManager.setTokens(response.data.access, response.data.refresh);
    
    return response.data;
  },

  /**
   * Sign out
   */
  signout: (): void => {
    tokenManager.clearTokens();
  },

  /**
   * Get current user from token
   */
  getCurrentUser: (): User | null => {
    const token = tokenManager.getAccessToken();
    if (!token) return null;

    try {
      // Decode JWT token (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.user_id,
        login_id: payload.login_id || '',
        company_name: payload.company_name || '',
        full_name: payload.full_name || '',
        email: payload.email || '',
        phone: payload.phone || '',
        role: payload.role || 'EMPLOYEE',
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  },
};

export default authApi;
