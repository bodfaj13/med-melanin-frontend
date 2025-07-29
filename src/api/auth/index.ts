import api from '../axios';
import type { BaseResponse } from '../types';
import type { SignUpRequest, SignInRequest, AuthResponse, User } from './types';

export const authApi = {
  // Sign up
  signUp: async (data: SignUpRequest): Promise<BaseResponse<AuthResponse>> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Sign in
  signIn: async (data: SignInRequest): Promise<BaseResponse<AuthResponse>> => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await api.post('/auth/signout');
  },

  // Get current user
  getCurrentUser: async (): Promise<BaseResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Update surgery date
  updateSurgeryDate: async (surgeryDate: string): Promise<BaseResponse<{ user: User }>> => {
    const response = await api.patch('/auth/surgery-date', { surgeryDate });
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<BaseResponse<{ user: User }>> => {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<BaseResponse<{ message: string }>> => {
    const response = await api.patch('/auth/change-password', data);
    return response.data;
  },
};
