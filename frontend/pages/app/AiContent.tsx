import React from 'react';
import AIContentGenerator from '../components/AIContentGenerator';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * AiContent page component that integrates the AIContentGenerator component
 * This serves as a container page for the AI content generation functionality
 */
const AiContent: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="container mx-auto py-6">
        <AIContentGenerator />
      </div>
    </ErrorBoundary>
  );
};

export default AiContent;
