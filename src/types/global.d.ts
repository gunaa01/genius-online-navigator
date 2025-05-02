// Global type declarations for the project

// Add Vite environment variable types
interface ImportMeta {
  env: {
    MODE: string;
    BASE_URL: string;
    PROD: boolean;
    DEV: boolean;
    // Add any other environment variables you use
  };
}

// Extend Window interface for analytics integrations
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  trackGAEvent?: (name: string, params?: Record<string, any>) => void;
  [key: string]: any; // Allow indexing with string
}

// Declare global utility types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Utility type for React components with children
type ReactChildren = {
  children?: React.ReactNode;
};
