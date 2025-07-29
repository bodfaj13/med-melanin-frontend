import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import brochureReducer from './brochure-slice';
import symptomReducer from './symptom-slice';
import authReducer from './auth-slice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['brochure', 'symptom', 'auth'], // Persist brochure, symptom, and auth data
};

const persistedBrochureReducer = persistReducer(persistConfig, brochureReducer);
const persistedSymptomReducer = persistReducer(persistConfig, symptomReducer);
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    brochure: persistedBrochureReducer,
    symptom: persistedSymptomReducer,
    auth: persistedAuthReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
