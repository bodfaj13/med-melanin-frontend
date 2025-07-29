import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SectionItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

interface ContentBlock {
  id: string;
  title: string;
  items: SectionItem[];
}

interface Section {
  id: string;
  title: string;
  icon: string;
  color: string;
  content: ContentBlock[];
  notes?: string;
}

interface BrochureState {
  sections: Section[];
  loading: boolean;
  error: string | null;
}

const initialState: BrochureState = {
  sections: [],
  loading: false,
  error: null,
};

const brochureSlice = createSlice({
  name: 'brochure',
  initialState,
  reducers: {
    toggleItemCompleted: (
      state,
      action: PayloadAction<{ sectionId: string; contentBlockId: string; itemId: string }>
    ) => {
      const { sectionId, contentBlockId, itemId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        const contentBlock = section.content.find(c => c.id === contentBlockId);
        if (contentBlock) {
          const item = contentBlock.items.find(i => i.id === itemId);
          if (item) {
            item.completed = !item.completed;
            // Note: API call will be handled in the component
          }
        }
      }
    },
    updateSectionNotes: (state, action: PayloadAction<{ sectionId: string; notes: string }>) => {
      const { sectionId, notes } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        section.notes = notes;
      }
    },
    updateItemNotes: (
      state,
      action: PayloadAction<{
        sectionId: string;
        contentBlockId: string;
        itemId: string;
        notes: string;
      }>
    ) => {
      const { sectionId, contentBlockId, itemId, notes } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        const contentBlock = section.content.find(c => c.id === contentBlockId);
        if (contentBlock) {
          const item = contentBlock.items.find(i => i.id === itemId);
          if (item) {
            item.notes = notes;
          }
        }
      }
    },
    resetProgress: state => {
      state.sections.forEach(section => {
        section.notes = '';
        section.content.forEach(contentBlock => {
          contentBlock.items.forEach(item => {
            item.completed = false;
            item.notes = '';
          });
        });
      });
    },
    setBrochureData: (state, action: PayloadAction<{ sections: Section[] }>) => {
      state.sections = action.payload.sections;
      state.loading = false;
      state.error = null;
    },
    toggleSectionCompleted: (state, action: PayloadAction<{ sectionId: string }>) => {
      const { sectionId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        // Toggle the completed state of all items in the section
        section.content.forEach(contentBlock => {
          contentBlock.items.forEach(item => {
            item.completed = !item.completed;
          });
        });
      }
    },
  },
});

export const {
  toggleItemCompleted,
  updateSectionNotes,
  updateItemNotes,
  resetProgress,
  setBrochureData,
  toggleSectionCompleted,
} = brochureSlice.actions;

export default brochureSlice.reducer;
