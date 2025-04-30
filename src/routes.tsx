
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound';

// Import any other pages here
// import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Genius</h1>
        <p className="text-lg text-muted-foreground mb-6">Your AI-powered business growth platform</p>
      </div>
    </div>,
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
