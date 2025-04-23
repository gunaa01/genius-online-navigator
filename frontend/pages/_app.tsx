import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Custom App component with providers
 * Follows our global rules for performance and accessibility
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccessibilityProvider>
          <Component {...pageProps} />
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
