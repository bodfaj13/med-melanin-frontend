import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setBrochureData } from '@/store/brochure-slice';
import { brochuresApi } from '@/api/brochures';
import { useGetUserProgress } from '@/api/brochures/use-brochures';

export const useBrochure = () => {
  const dispatch = useDispatch();
  const { sections, loading, error } = useSelector((state: RootState) => state.brochure);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const lastAppliedProgressRef = useRef<string | null>(null);

  // Get user progress
  const { data: userProgress, isLoading: progressLoading } = useGetUserProgress();

  const fetchContent = useCallback(async () => {
    if (hasFetched) return; // Prevent multiple calls

    setIsLoading(true);
    setApiError(null);
    setHasFetched(true);

    try {
      const response = await brochuresApi.getBrochureContent();

      if (response.data) {
        // Transform the data to add frontend-specific properties
        let transformedSections = response.data?.map(section => ({
          ...section,
          icon: getSectionIcon(section.id),
          color: getSectionColor(section.id),
        }));

        // Apply user progress if available
        if (userProgress?.data) {
          transformedSections = transformedSections.map(section => ({
            ...section,
            content: section.content.map(contentBlock => ({
              ...contentBlock,
              items: contentBlock.items.map(item => {
                const progressItem = userProgress.data?.find(
                  p => p.sectionId === section.id && p.itemId === item.id
                );
                return {
                  ...item,
                  completed: progressItem?.completed || false,
                  notes: progressItem?.notes || item.notes,
                };
              }),
            })),
          }));
        }

        dispatch(setBrochureData({ sections: transformedSections }));
      } else {
        console.error('Invalid response structure:', response);
        setApiError('Invalid response structure from API');
      }
    } catch (error) {
      console.error('API Error:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to fetch brochure content');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, hasFetched, userProgress?.data]);

  // Helper functions to add frontend-specific properties
  const getSectionIcon = (sectionId: string): string => {
    switch (sectionId) {
      case 'activity-restrictions':
        return '🚫';
      case 'pain-management':
        return '💊';
      case 'warning-signs':
        return '⚠️';
      case 'follow-up-schedule':
        return '📅';
      case 'healing-timeline':
        return '📈';
      case 'incision-care':
        return '🩹';
      case 'diet-medications':
        return '🍽️';
      default:
        return '📋';
    }
  };

  const getSectionColor = (sectionId: string): string => {
    switch (sectionId) {
      case 'warning-signs':
        return 'red';
      case 'healing-timeline':
        return 'blue';
      case 'activity-restrictions':
      case 'pain-management':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Auto-fetch content on mount if not already loaded
  useEffect(() => {
    if (sections.length === 0 && !isLoading && !hasFetched) {
      fetchContent();
    }
  }, [sections.length, isLoading, hasFetched, fetchContent]);

  // Apply progress when it becomes available
  useEffect(() => {
    if (userProgress?.data && sections.length > 0) {
      // Create a hash of the current progress data to avoid infinite loops
      const progressHash = JSON.stringify(userProgress.data);

      // Only apply if progress has changed
      if (lastAppliedProgressRef.current !== progressHash) {
        const updatedSections = sections.map(section => ({
          ...section,
          content: section.content.map(contentBlock => ({
            ...contentBlock,
            items: contentBlock.items.map(item => {
              const progressItem = userProgress.data?.find(
                p => p.sectionId === section.id && p.itemId === item.id
              );
              return {
                ...item,
                completed: progressItem?.completed || item.completed,
                notes: progressItem?.notes || item.notes,
              };
            }),
          })),
        }));

        dispatch(setBrochureData({ sections: updatedSections }));
        lastAppliedProgressRef.current = progressHash;
      }
    }
  }, [userProgress?.data, sections, dispatch]);

  return {
    sections,
    loading: loading || isLoading || progressLoading,
    error: error || apiError,
    fetchContent,
  };
};
