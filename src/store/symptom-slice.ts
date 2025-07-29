import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SymptomEntry {
  id: string;
  date: string;
  painLevel: number;
  location: string;
  description: string;
  medications: string;
  timestamp: string;
}

interface SymptomState {
  entries: SymptomEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: SymptomState = {
  entries: [],
  loading: false,
  error: null,
};

const symptomSlice = createSlice({
  name: 'symptom',
  initialState,
  reducers: {
    addSymptomEntry: (state, action: PayloadAction<SymptomEntry>) => {
      state.entries.unshift(action.payload); // Add to beginning
    },
    updateSymptomEntry: (
      state,
      action: PayloadAction<{ id: string; entry: Partial<SymptomEntry> }>
    ) => {
      const { id, entry } = action.payload;
      const index = state.entries.findIndex(e => e.id === id);
      if (index !== -1) {
        state.entries[index] = { ...state.entries[index], ...entry };
      }
    },
    deleteSymptomEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(e => e.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSymptoms: state => {
      state.entries = [];
    },
  },
});

export const {
  addSymptomEntry,
  updateSymptomEntry,
  deleteSymptomEntry,
  setLoading,
  setError,
  clearSymptoms,
} = symptomSlice.actions;

export default symptomSlice.reducer;
