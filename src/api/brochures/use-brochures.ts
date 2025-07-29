import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { brochuresApi } from '.';

export const useGetBrochureContent = () =>
  useQuery({
    queryKey: ['brochures', 'content'],
    queryFn: brochuresApi.getBrochureContent,
  });

export const useGetBrochureSection = (sectionId: string) =>
  useQuery({
    queryKey: ['brochures', 'section', sectionId],
    queryFn: () => brochuresApi.getBrochureSection(sectionId),
    enabled: !!sectionId,
  });

export const useGetUserProgress = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return useQuery({
    queryKey: ['brochures', 'progress'],
    queryFn: brochuresApi.getUserProgress,
    enabled: isAuthenticated, // Only fetch if user is authenticated
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brochuresApi.updateProgress,
    onSuccess: () => {
      // Invalidate and refetch progress
      queryClient.invalidateQueries({ queryKey: ['brochures', 'progress'] });
    },
  });
};

export const useResetProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brochuresApi.resetProgress,
    onSuccess: () => {
      // Invalidate and refetch progress
      queryClient.invalidateQueries({ queryKey: ['brochures', 'progress'] });
    },
  });
};
