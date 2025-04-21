import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GigList from './pages/ForHire/GigList';
import GigDetail from './pages/ForHire/GigDetail';
import PostGig from './pages/ForHire/PostGig';
import FreelancerProfile from './pages/ForHire/FreelancerProfile';
import Orders from './pages/ForHire/Orders';
import MessagesForHire from './pages/ForHire/Messages';
import JobList from './pages/Hiring/JobList';
import JobDetail from './pages/Hiring/JobDetail';
import PostJob from './pages/Hiring/PostJob';
import RecruiterProfile from './pages/Hiring/RecruiterProfile';
import ApplicantProfile from './pages/Hiring/ApplicantProfile';
import Applications from './pages/Hiring/Applications';
import MessagesHiring from './pages/Hiring/Messages';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import GigModeration from './pages/Admin/GigModeration';
import JobModeration from './pages/Admin/JobModeration';
import Analytics from './pages/Admin/Analytics';
import CMS from './pages/Admin/CMS';
import GuideList from './pages/Guides/GuideList';
import GuideDetail from './pages/Guides/GuideDetail';
import CommunityList from './pages/Community/CommunityList';
import CommunityDetail from './pages/Community/CommunityDetail';
import PageDetail from './pages/Pages/PageDetail';

const RoutesComponent: React.FC = () => (
  <Router>
    <Routes>
      {/* For Hire */}
      <Route path="/for-hire" element={<GigList />} />
      <Route path="/for-hire/gig/:id" element={<GigDetail />} />
      <Route path="/for-hire/post" element={<PostGig />} />
      <Route path="/for-hire/profile/:userId" element={<FreelancerProfile />} />
      <Route path="/for-hire/orders" element={<Orders userId="me" />} />
      <Route path="/for-hire/messages/:orderId" element={<MessagesForHire />} />
      {/* Hiring */}
      <Route path="/hiring" element={<JobList />} />
      <Route path="/hiring/job/:id" element={<JobDetail />} />
      <Route path="/hiring/post" element={<PostJob />} />
      <Route path="/hiring/profile/:userId" element={<RecruiterProfile />} />
      <Route path="/hiring/applicant/:userId" element={<ApplicantProfile />} />
      <Route path="/hiring/applications/:userId" element={<Applications userId="me" />} />
      <Route path="/hiring/messages/:applicationId" element={<MessagesHiring />} />
      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/gigs" element={<GigModeration />} />
      <Route path="/admin/jobs" element={<JobModeration />} />
      <Route path="/admin/analytics" element={<Analytics />} />
      <Route path="/admin/cms" element={<CMS />} />
      {/* Guides & Community */}
      <Route path="/guides" element={<GuideList />} />
      <Route path="/guides/:slug" element={<GuideDetail />} />
      <Route path="/community" element={<CommunityList />} />
      <Route path="/community/:slug" element={<CommunityDetail />} />
      {/* Static CMS-managed pages */}
      <Route path="/pages/:slug" element={<PageDetail />} />
    </Routes>
  </Router>
);

export default RoutesComponent;
