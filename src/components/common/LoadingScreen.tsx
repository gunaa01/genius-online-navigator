/**
 * Loading Screen Component
 * 
 * This component provides a loading skeleton UI that is shown while
 * lazy-loaded components are being fetched. It improves perceived
 * performance by showing a meaningful placeholder instead of a blank screen.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  fullScreen = true,
}) => {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-background z-50'
    : 'w-full h-full min-h-[400px] flex flex-col items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse"></div>
          <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
        
        {/* Skeleton content */}
        <div className="w-full max-w-md space-y-4 px-4">
          <div className="h-8 w-3/4 mx-auto bg-muted rounded-md animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded-md animate-pulse"></div>
            <div className="h-4 w-5/6 bg-muted rounded-md animate-pulse"></div>
            <div className="h-4 w-4/6 bg-muted rounded-md animate-pulse"></div>
          </div>
          <div className="flex space-x-4">
            <div className="h-10 w-1/2 bg-muted rounded-md animate-pulse"></div>
            <div className="h-10 w-1/2 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Card Skeleton Component
 * 
 * A reusable skeleton for card-like components
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 w-1/3 bg-muted rounded-md"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded-md"></div>
          <div className="h-4 w-5/6 bg-muted rounded-md"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-10 w-1/4 bg-muted rounded-md"></div>
          <div className="h-10 w-1/4 bg-muted rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Table Skeleton Component
 * 
 * A reusable skeleton for table components
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border animate-pulse">
      <div className="bg-muted/50 p-4">
        <div className="h-6 w-1/4 bg-muted rounded-md"></div>
      </div>
      <div className="bg-card">
        <div className="grid grid-cols-1 divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`h-4 bg-muted rounded-md ${
                    colIndex === 0 ? 'w-3/4' : 'w-full'
                  }`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Form Skeleton Component
 * 
 * A reusable skeleton for form components
 */
export const FormSkeleton: React.FC<{ fields?: number }> = ({
  fields = 4,
}) => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 w-1/4 bg-muted rounded-md"></div>
          <div className="h-10 w-full bg-muted rounded-md"></div>
        </div>
      ))}
      <div className="h-10 w-1/3 bg-primary/30 rounded-md"></div>
    </div>
  );
};

/**
 * Dashboard Skeleton Component
 * 
 * A skeleton specifically for dashboard layouts
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-1/4 bg-muted rounded-md"></div>
        <div className="h-10 w-1/6 bg-muted rounded-md"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="h-6 w-1/2 bg-muted rounded-md"></div>
              <div className="h-10 w-1/2 bg-muted rounded-md"></div>
              <div className="h-4 w-full bg-muted rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-muted rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded-md"></div>
              <div className="h-4 w-5/6 bg-muted rounded-md"></div>
              <div className="h-4 w-4/6 bg-muted rounded-md"></div>
            </div>
            <div className="h-40 bg-muted rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
