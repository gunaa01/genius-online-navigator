import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './contentSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
    // add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
