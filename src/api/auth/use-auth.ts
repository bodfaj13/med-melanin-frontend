import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from './index';
import type { SignUpRequest, SignInRequest, User } from './types';

export const useSignUp = () =>
  useMutation({
    mutationFn: (data: SignUpRequest) => authApi.signUp(data),
  });

export const useSignIn = () =>
  useMutation({
    mutationFn: (data: SignInRequest) => authApi.signIn(data),
  });

export const useSignOut = () =>
  useMutation({
    mutationFn: () => authApi.signOut(),
  });

export const useGetCurrentUser = () =>
  useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem('token'),
    retry: false,
  });

export const useUpdateSurgeryDate = () =>
  useMutation({
    mutationFn: (surgeryDate: string) => authApi.updateSurgeryDate(surgeryDate),
  });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (data: Partial<User>) => authApi.updateProfile(data),
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
  });

export const useRefreshToken = () =>
  useMutation({
    mutationFn: authApi.refreshToken,
  });
