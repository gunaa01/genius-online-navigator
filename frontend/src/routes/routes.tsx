import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navigation from '../components/Navigation/Navigation';

// Lazy-loaded pages with code splitting
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage/AboutPage'));
const DocumentationPage = lazy(() => import('../pages/DocumentationPage/DocumentationPage'));
const TestBSTPage = lazy(() => import('../pages/TestBSTPage/TestBSTPage'));
const BSTVerificationPage = lazy(() => import('../pages/BSTVerificationPage/BSTVerificationPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigation />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AboutPage />
          </Suspense>
        )
      },
      {
        path: 'docs',
        element: (
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <DocumentationPage />
          </Suspense>
        )
      },
      {
        path: 'verify-bst',
        element: (
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <TestBSTPage />
          </Suspense>
        )
      },
      {
        path: 'bst-verification',
        element: (
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <BSTVerificationPage />
          </Suspense>
        )
      }
    ]
  }
]);
