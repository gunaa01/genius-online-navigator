import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import type { RootState } from '@/store';
import authReducer from '@/store/slices/authSlice';
import adCampaignReducer from '@/store/slices/adCampaignSlice';
import socialMediaReducer from '@/store/slices/socialMediaSlice';
import aiContentReducer from '@/store/slices/aiContentSlice';
import analyticsReducer from '@/store/slices/analyticsSlice';
import uiReducer from '@/store/slices/uiSlice';

// This type interface extends the default options for render from RTL
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: any;
}

/**
 * Creates a testing store with imported reducers, middleware, and initial state
 * @param preloadedState - Initial state for the store
 * @returns A configured store for testing
 */
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      adCampaign: adCampaignReducer,
      socialMedia: socialMediaReducer,
      aiContent: aiContentReducer,
      analytics: analyticsReducer,
      ui: uiReducer,
    },
    preloadedState,
  });
}

/**
 * Testing utility function that wraps the component with necessary providers
 * @param ui - The component to render
 * @param options - Additional render options
 * @returns The rendered component with all the testing utilities
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
