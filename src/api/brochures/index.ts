import api from '../axios';
import type { BaseResponse } from '../types';
import type { BrochureSection, BrochureSectionResponse } from './types';

export const brochuresApi = {
  // Get full brochure content
  getBrochureContent: async (): Promise<BaseResponse<BrochureSection[]>> => {
    const response = await api.get('/brochures/myomectomy');
    return response.data;
  },

  // Get specific brochure section
  getBrochureSection: async (sectionId: string): Promise<BaseResponse<BrochureSectionResponse>> => {
    const response = await api.get(`/brochures/sections/${sectionId}`);
    return response.data;
  },

  // Update progress
  updateProgress: async (data: {
    sectionId: string;
    itemId: string;
    completed: boolean;
    notes?: string;
  }): Promise<BaseResponse<{ message: string }>> => {
    const response = await api.post('/brochures/progress', data);
    return response.data;
  },

  // Get user progress
  getUserProgress: async (): Promise<
    BaseResponse<
      Array<{
        sectionId: string;
        itemId: string;
        completed: boolean;
        notes?: string;
      }>
    >
  > => {
    const response = await api.get('/brochures/progress');
    return response.data;
  },

  // Reset progress
  resetProgress: async (): Promise<BaseResponse<{ message: string }>> => {
    const response = await api.delete('/brochures/progress/reset');
    return response.data;
  },
};
