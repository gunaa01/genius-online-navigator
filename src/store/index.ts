import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// Import reducers from slices
import authReducer from './slices/authSlice';
import adCampaignReducer from './slices/adCampaignSlice';
import socialMediaReducer from './slices/socialMediaSlice';
import aiContentReducer from './slices/aiContentSlice';
import analyticsReducer from './slices/analyticsSlice';
import uiReducer from './slices/uiSlice';
import messageReducer from './slices/messageSlice';

// Import middleware
import { loggerMiddleware } from './middleware/logger';
import { analyticsMiddleware } from './middleware/analytics';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist these reducers
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  adCampaign: adCampaignReducer,
  socialMedia: socialMediaReducer,
  aiContent: aiContentReducer,
  analytics: analyticsReducer,
  ui: uiReducer,
  messages: messageReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk, loggerMiddleware, analyticsMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
