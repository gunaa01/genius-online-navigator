import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AdCampaignManager from "@/components/AdCampaignManager";

const AdCampaigns = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Ad Campaigns</h1>
        <AdCampaignManager />
      </div>
    </DashboardLayout>
  );
};

export default AdCampaigns;
