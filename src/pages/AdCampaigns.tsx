import React from 'react';
import AdCampaignManager from '../components/AdCampaignManager';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * AdCampaigns page component that integrates the AdCampaignManager
 * This serves as a container page for the ad campaign management functionality
 */
const AdCampaigns: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="container mx-auto py-6">
        <AdCampaignManager />
      </div>
    </ErrorBoundary>
  );
};

export default AdCampaigns;
