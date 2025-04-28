import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/apiFetch';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalGigs: number;
  totalJobs: number;
  totalRevenue?: number;
  engagementScore?: number;
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/admin/analytics')
      .then(async res => {
        if (!res.ok) {
          setError('Failed to fetch analytics');
          return;
        }
        setData(await res.json());
      });
  }, []);

  return (
    <div>
      <h3>Platform Analytics</h3>
      {error && <div className="error">{error}</div>}
      {data ? (
        <ul>
          <li><b>Total Users:</b> {data.totalUsers}</li>
          <li><b>Active Users:</b> {data.activeUsers}</li>
          <li><b>Total Gigs:</b> {data.totalGigs}</li>
          <li><b>Total Jobs:</b> {data.totalJobs}</li>
          {data.totalRevenue !== undefined && <li><b>Total Revenue:</b> ${data.totalRevenue}</li>}
          {data.engagementScore !== undefined && <li><b>Engagement Score:</b> {data.engagementScore}</li>}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Analytics;
