import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li><a href="/admin/users">User Management</a></li>
        <li><a href="/admin/gigs">Gig Moderation</a></li>
        <li><a href="/admin/jobs">Job Moderation</a></li>
        <li><a href="/admin/analytics">Analytics</a></li>
        <li><a href="/admin/cms">CMS Content Management</a></li>
      </ul>
    </div>
  );
};

export default Dashboard;
