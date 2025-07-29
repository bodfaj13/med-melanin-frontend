import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { SymptomEntryRequest } from './types';
import { symptomsApi } from './index';

export const useGetUserSymptomEntries = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return useQuery({
    queryKey: ['symptoms', 'entries'],
    queryFn: symptomsApi.getUserEntries,
    enabled: isAuthenticated,
  });
};

export const useCreateSymptomEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: symptomsApi.createEntry,
    onSuccess: () => {
      // Invalidate and refetch symptom entries
      queryClient.invalidateQueries({ queryKey: ['symptoms', 'entries'] });
    },
  });
};

export const useUpdateSymptomEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SymptomEntryRequest> }) =>
      symptomsApi.updateEntry(id, data),
    onSuccess: () => {
      // Invalidate and refetch symptom entries
      queryClient.invalidateQueries({ queryKey: ['symptoms', 'entries'] });
    },
  });
};

export const useDeleteSymptomEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: symptomsApi.deleteEntry,
    onSuccess: () => {
      // Invalidate and refetch symptom entries
      queryClient.invalidateQueries({ queryKey: ['symptoms', 'entries'] });
    },
  });
};

export const useClearSymptomEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: symptomsApi.clearEntries,
    onSuccess: () => {
      // Invalidate and refetch symptom entries
      queryClient.invalidateQueries({ queryKey: ['symptoms', 'entries'] });
    },
  });
};
