import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * Analytics page component that integrates the AnalyticsDashboard component
 * This serves as a container page for the analytics dashboard functionality
 */
const Analytics: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="container mx-auto py-6">
        <AnalyticsDashboard />
      </div>
    </ErrorBoundary>
  );
};

export default Analytics;
