import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SocialMedia from './pages/SocialMedia';
import AdCampaigns from './pages/AdCampaigns';
import AiContent from './pages/AiContent';
import Settings from './pages/Settings';
import TeamManagementWithProvider from './pages/TeamManagement';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import ContentAnalytics from './pages/ContentAnalytics';
import Auth from './pages/Auth';
import Blog from './pages/Blog';
import SeoManagement from './pages/SeoManagement';
import MetaAdsPage from './pages/MetaAdsPage';
import Layout from './components/Layout';
import HomePage from './pages/HomePage/HomePage';
import DeveloperDashboard from './pages/developer/DeveloperDashboard';
import SocialMediaDashboard from './pages/innovation/SocialMediaDashboard';
import JobsExplorer from './pages/JobsExplorer';
import Hiring from './pages/Hiring';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/social",
        element: <SocialMedia />,
      },
      {
        path: "/social-dashboard",
        element: <SocialMediaDashboard />,
      },
      {
        path: "/ads",
        element: <AdCampaigns />,
      },
      {
        path: "/meta-ads",
        element: <MetaAdsPage />,
      },
      {
        path: "/content",
        element: <AiContent />,
      },
      {
        path: "/content-analytics",
        element: <ContentAnalytics />,
      },
      {
        path: "/seo",
        element: <SeoManagement />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/team",
        element: <TeamManagementWithProvider />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/integrations",
        element: <Integrations />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/developer",
        element: <DeveloperDashboard />,
      },
      {
        path: "/jobs",
        element: <JobsExplorer />,
      },
      {
        path: "/hiring",
        element: <Hiring />,
      },
    ]
  },
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const RoutesComponent = () => {
  return <RouterProvider router={router} />;
};

export default RoutesComponent;
