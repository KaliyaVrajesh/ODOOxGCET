/**
 * Profile API
 */

import apiClient from './client';

export interface ProfileDetail {
  job_position: string;
  department: string;
  manager_name: string;
  location: string;
  about: string;
  what_i_love: string;
  interests_and_hobbies: string;
}

export interface ResumeDetail {
  address: string;
  personal_email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | '';
  marital_status: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | '';
  date_of_joining: string | null;
  date_of_birth: string | null;
}

export interface BankDetail {
  bank_account_number: string;
  bank_name: string;
  ifsc_code: string;
  upi_id: string;
}

export interface SalaryStructure {
  basic_salary: string;
  hra_percentage: string;
  hra_fixed: string;
  hra_calculated: string;
  standard_allowance_percentage: string;
  standard_allowance_calculated: string;
  performance_bonus: string;
  leave_travel_allowance: string;
  gross_salary: string;
  pf_percentage: string;
  pf_contribution: string;
  professional_tax: string;
  income_tax: string;
  total_deductions: string;
  net_salary: string;
  annual_salary: string;
  monthly_working_days: number;
  weeks_per_month: number;
  year: number;
}

export interface Skill {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issued_date: string | null;
}

export interface FullProfile {
  id: string;
  full_name: string;
  login_id: string;
  email: string;
  phone: string;
  company_name: string;
  role: string;
  profile: ProfileDetail;
  resume: ResumeDetail;
  bank: BankDetail;
  salary?: SalaryStructure | null;
  skills: Skill[];
  certifications: Certification[];
}

export interface UpdateProfileData {
  profile?: Partial<ProfileDetail>;
  resume?: Partial<ResumeDetail>;
  bank?: Partial<BankDetail>;
  salary?: Partial<SalaryStructure>;
}

export const profileApi = {
  /**
   * Get full profile
   */
  getFullProfile: async (): Promise<FullProfile> => {
    const response = await apiClient.get<FullProfile>('/profile/me/full/');
    return response.data;
  },

  /**
   * Update profile (partial)
   */
  updateProfile: async (data: UpdateProfileData): Promise<FullProfile> => {
    const response = await apiClient.patch<FullProfile>('/profile/me/full/', data);
    return response.data;
  },

  /**
   * Get skills
   */
  getSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get<Skill[]>('/profile/me/skills/');
    return response.data;
  },

  /**
   * Add skill
   */
  addSkill: async (data: { name: string; level?: string }): Promise<Skill> => {
    const response = await apiClient.post<Skill>('/profile/me/skills/', data);
    return response.data;
  },

  /**
   * Update skill
   */
  updateSkill: async (id: string, data: { name: string; level?: string }): Promise<Skill> => {
    const response = await apiClient.put<Skill>(`/profile/me/skills/${id}/`, data);
    return response.data;
  },

  /**
   * Delete skill
   */
  deleteSkill: async (id: string): Promise<void> => {
    await apiClient.delete(`/profile/me/skills/${id}/`);
  },

  /**
   * Get certifications
   */
  getCertifications: async (): Promise<Certification[]> => {
    const response = await apiClient.get<Certification[]>('/profile/me/certifications/');
    return response.data;
  },

  /**
   * Add certification
   */
  addCertification: async (data: {
    title: string;
    issuer?: string;
    issued_date?: string;
  }): Promise<Certification> => {
    const response = await apiClient.post<Certification>('/profile/me/certifications/', data);
    return response.data;
  },

  /**
   * Update certification
   */
  updateCertification: async (
    id: string,
    data: { title: string; issuer?: string; issued_date?: string }
  ): Promise<Certification> => {
    const response = await apiClient.put<Certification>(`/profile/me/certifications/${id}/`, data);
    return response.data;
  },

  /**
   * Delete certification
   */
  deleteCertification: async (id: string): Promise<void> => {
    await apiClient.delete(`/profile/me/certifications/${id}/`);
  },

  /**
   * Get salary (Admin/HR only)
   */
  getSalary: async (): Promise<SalaryStructure> => {
    const response = await apiClient.get<SalaryStructure>('/profile/me/salary/');
    return response.data;
  },

  /**
   * Update salary (Admin/HR only)
   */
  updateSalary: async (data: Partial<SalaryStructure>): Promise<SalaryStructure> => {
    const response = await apiClient.put<SalaryStructure>('/profile/me/salary/', data);
    return response.data;
  },
};

export default profileApi;
