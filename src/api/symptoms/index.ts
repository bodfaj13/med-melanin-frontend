import api from '../axios';
import type { BaseResponse } from '../types';
import type { SymptomEntry, SymptomEntryRequest } from './types';

export const symptomsApi = {
  // Create a new symptom entry
  createEntry: async (data: SymptomEntryRequest): Promise<BaseResponse<SymptomEntry>> => {
    const response = await api.post('/symptoms', data);
    return response.data;
  },

  // Get all symptom entries for the user
  getUserEntries: async (): Promise<BaseResponse<SymptomEntry[]>> => {
    const response = await api.get('/symptoms');
    return response.data;
  },

  // Update a specific symptom entry
  updateEntry: async (
    id: string,
    data: Partial<SymptomEntryRequest>
  ): Promise<BaseResponse<SymptomEntry>> => {
    const response = await api.put(`/symptoms/${id}`, data);
    return response.data;
  },

  // Delete a specific symptom entry
  deleteEntry: async (id: string): Promise<BaseResponse<{ message: string }>> => {
    const response = await api.delete(`/symptoms/${id}`);
    return response.data;
  },

  // Clear all symptom entries for the user
  clearEntries: async (): Promise<BaseResponse<{ message: string }>> => {
    const response = await api.delete('/symptoms/clear');
    return response.data;
  },
};
