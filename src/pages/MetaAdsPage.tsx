
import React from 'react';
import { Helmet } from 'react-helmet';
import MetaAdsDashboard from '@/components/marketing/MetaAdsDashboard';

const MetaAdsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Meta Ads Manager | Genius Online Navigator</title>
        <meta name="description" content="Manage and optimize your Facebook and Instagram ad campaigns" />
      </Helmet>

      <MetaAdsDashboard />
    </div>
  );
};

export default MetaAdsPage;
