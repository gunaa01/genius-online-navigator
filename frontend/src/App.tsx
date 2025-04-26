import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from 'react';
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAppDispatch } from '@/store/hooks';
import { checkAuthStatus } from '@/store/slices/authSlice';
import { ReduxProvider } from "@/components/ReduxProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

// Lazy-loaded components for better performance
const AboutUs = React.lazy(() => import("@/pages/AboutUs"));
const AdCampaigns = React.lazy(() => import("@/pages/AdCampaigns"));
const Admin = React.lazy(() => import("@/pages/Admin"));
const AdminCreate = React.lazy(() => import("@/pages/AdminCreate"));
const AiContent = React.lazy(() => import("@/pages/AiContent"));
const Analytics = React.lazy(() => import("@/pages/Analytics"));
const Auth = React.lazy(() => import("@/pages/Auth"));
const Blog = React.lazy(() => import("@/pages/Blog"));
const Careers = React.lazy(() => import("@/pages/Careers"));
const Community = React.lazy(() => import("@/pages/Community"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Docs = React.lazy(() => import("@/pages/Docs"));
const FAQ = React.lazy(() => import("@/pages/FAQ"));
const Hire = React.lazy(() => import("@/pages/Hire"));
const Hiring = React.lazy(() => import("@/pages/Hiring"));
const Index = React.lazy(() => import("@/pages/Index"));
const Integrations = React.lazy(() => import("@/pages/Integrations"));
const IntegrationsConnect = React.lazy(() => import("@/pages/IntegrationsConnect"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const Offline = React.lazy(() => import("@/pages/OfflineToOnline"));
const Onboarding = React.lazy(() => import("@/pages/Onboarding"));
const Pricing = React.lazy(() => import("@/pages/Pricing"));
const Reports = React.lazy(() => import("@/pages/Reports"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const SocialMedia = React.lazy(() => import("@/pages/SocialMedia"));
const TeamInvite = React.lazy(() => import("@/pages/TeamInvite"));
const TeamManagement = React.lazy(() => import("@/pages/TeamManagement"));
const Upgrade = React.lazy(() => import("@/pages/Upgrade"));

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    <span className="ml-2 text-lg font-medium">Loading...</span>
  </div>
);

const queryClient = new QueryClient();

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  React.useEffect(() => {
    // Check authentication status when app loads
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  return <>{children}</>;
};

const App = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <ReduxProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppInitializer>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        {/* Public routes */}
                        <Route path="/auth" element={<Auth />} />
                        
                        {/* Protected routes */}
                        <Route path="/" element={
                          <ProtectedRoute>
                            <Layout />
                          </ProtectedRoute>
                        }>
                          <Route index element={<Navigate to="/dashboard" replace />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="ad-campaigns" element={<AdCampaigns />} />
                          <Route path="social-media" element={<SocialMedia />} />
                          <Route path="ai-content" element={<AiContent />} />
                          <Route path="analytics" element={<Analytics />} />
                          <Route path="settings" element={<Settings />} />
                          <Route path="onboarding" element={<Onboarding />} />
                          <Route path="reports" element={<Reports />} />
                          <Route path="integrations" element={<Integrations />} />
                          <Route path="team" element={<TeamManagement />} />
                          <Route path="community" element={<Community />} />
                          <Route path="admin" element={<Admin />} />
                          <Route path="admin/create" element={<AdminCreate />} />
                          <Route path="team/invite" element={<TeamInvite />} />
                          <Route path="integrations/connect" element={<IntegrationsConnect />} />
                          <Route path="upgrade" element={<Upgrade />} />
                        </Route>
                        
                        {/* Other routes */}
                        <Route path="/landing" element={<Index />} />
                        <Route path="/offline-to-online" element={<Offline />} />
                        <Route path="/hire" element={<Hire />} />
                        <Route path="/hiring" element={<Hiring />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/docs" element={<Docs />} />
                        
                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </AppInitializer>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ReduxProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

export default App;
