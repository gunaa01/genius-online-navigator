import React from 'react';
import SocialMediaAutomation from '../components/SocialMediaAutomation';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * SocialMedia page component that integrates the SocialMediaAutomation component
 * This serves as a container page for the social media automation functionality
 */
const SocialMedia: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="container mx-auto py-6">
        <SocialMediaAutomation />
      </div>
    </ErrorBoundary>
  );
};

export default SocialMedia;
