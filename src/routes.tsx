
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SocialMedia from './pages/SocialMedia';
import AdCampaigns from './pages/AdCampaigns';
import AiContent from './pages/AiContent';
import Settings from './pages/Settings';
import TeamManagement from './pages/TeamManagement';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import ContentAnalytics from './pages/ContentAnalytics';
import Auth from './pages/Auth';
import Blog from './pages/Blog';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
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
    path: "/ads",
    element: <AdCampaigns />,
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
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/team",
    element: <TeamManagement />,
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
