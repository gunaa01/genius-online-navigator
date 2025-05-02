
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import Dashboard from './pages/Dashboard';
import SEOPage from './pages/SEOPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
  },
  {
    path: "/seo",
    element: <SEOPage />,
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
