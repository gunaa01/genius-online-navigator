import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <AnalyticsDashboard />
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
