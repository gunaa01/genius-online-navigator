import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import OfflineToOnline from "./pages/OfflineToOnline";
import Hire from "./pages/Hire";
import Hiring from "./pages/Hiring";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import AdCampaigns from "./pages/AdCampaigns";
import SocialMedia from "./pages/SocialMedia";
import AiContent from "./pages/AiContent";
import Integrations from "./pages/Integrations";
import TeamManagement from "./pages/TeamManagement";
import Settings from "./pages/Settings";
import Upgrade from "./pages/Upgrade";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "@/components/ThemeProvider";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Docs from "./pages/Docs";
import AdminCreate from "./pages/AdminCreate";
import TeamInvite from "./pages/TeamInvite";
import IntegrationsConnect from "./pages/IntegrationsConnect";
import SEOHead from "./components/SEOHead";
import LocalDiscovery from "./pages/LocalDiscovery";
import { FeatureFlagProvider, FeatureFlagged } from '@/contexts/FeatureFlagContext';
import FeedbackWidget from '@/components/common/FeedbackWidget';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingScreen from '@/components/common/LoadingScreen';

const queryClient = new QueryClient();

// Mock user for feature flags
const mockUser = {
  id: 'user-001',
  email: 'admin@example.com',
  role: 'admin' as const,
  teams: ['development', 'management']
};

// Eagerly load critical components
const IndexPage = Index;
const NotFoundPage = NotFound;

// Lazy load other components
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));
const OfflineToOnlinePage = React.lazy(() => import('./pages/OfflineToOnline'));
const HirePage = React.lazy(() => import('./pages/Hire'));
const HiringPage = React.lazy(() => import('./pages/Hiring'));
const OnboardingPage = React.lazy(() => import('./pages/Onboarding'));
const AnalyticsPage = React.lazy(() => import('./pages/Analytics'));
const ReportsPage = React.lazy(() => import('./pages/Reports'));
const AdCampaignsPage = React.lazy(() => import('./pages/AdCampaigns'));
const SocialMediaPage = React.lazy(() => import('./pages/SocialMedia'));
const AiContentPage = React.lazy(() => import('./pages/AiContent'));
const IntegrationsPage = React.lazy(() => import('./pages/Integrations'));
const TeamManagementPage = React.lazy(() => import('./pages/TeamManagement'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const UpgradePage = React.lazy(() => import('./pages/Upgrade'));
const AuthPage = React.lazy(() => import('./pages/Auth'));
const CommunityPage = React.lazy(() => import('./pages/Community'));
const AdminPage = React.lazy(() => import('./pages/Admin'));
const AboutUsPage = React.lazy(() => import('./pages/AboutUs'));
const ContactPage = React.lazy(() => import('./pages/Contact'));
const BlogPage = React.lazy(() => import('./pages/Blog'));
const CareersPage = React.lazy(() => import('./pages/Careers'));
const PricingPage = React.lazy(() => import('./pages/Pricing'));
const FAQPage = React.lazy(() => import('./pages/FAQ'));
const DocsPage = React.lazy(() => import('./pages/Docs'));
const AdminCreatePage = React.lazy(() => import('./pages/AdminCreate'));
const TeamInvitePage = React.lazy(() => import('./pages/TeamInvite'));
const IntegrationsConnectPage = React.lazy(() => import('./pages/IntegrationsConnect'));
const LocalDiscoveryPage = React.lazy(() => import('./pages/LocalDiscovery'));

const App = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <FeatureFlagProvider initialUser={mockUser}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <SEOHead />
                  <React.Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/landing" element={<IndexPage />} />
                      <Route path="/offline-to-online" element={<OfflineToOnlinePage />} />
                      <Route path="/hire" element={<HirePage />} />
                      <Route path="/hiring" element={<HiringPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/local-discovery" element={<LocalDiscoveryPage />} />
                      
                      {/* Set Index as new home page */}
                      <Route path="/" element={<IndexPage />} />

                      {/* Move dashboard to /dashboard, protected */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/onboarding" element={
                        <ProtectedRoute>
                          <OnboardingPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/analytics" element={
                        <ProtectedRoute>
                          <AnalyticsPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/reports" element={
                        <ProtectedRoute>
                          <ReportsPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/ads" element={
                        <ProtectedRoute>
                          <AdCampaignsPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/social" element={
                        <ProtectedRoute>
                          <SocialMediaPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/content" element={
                        <ProtectedRoute>
                          <AiContentPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/integrations" element={
                        <ProtectedRoute>
                          <IntegrationsPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/team" element={
                        <ProtectedRoute>
                          <TeamManagementPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/community" element={
                        <ProtectedRoute>
                          <CommunityPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/upgrade" element={
                        <ProtectedRoute>
                          <UpgradePage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin" element={
                        <ProtectedRoute>
                          <AdminPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/about-us" element={<AboutUsPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/careers" element={<CareersPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/docs" element={<DocsPage />} />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    
                    {/* Global Components */}
                    <Toaster />
                    
                    {/* Feature Flagged Components */}
                    <FeatureFlagged flagId="feedback-widget">
                      <FeedbackWidget position="bottom-right" />
                    </FeatureFlagged>
                  </React.Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </QueryClientProvider>
        </FeatureFlagProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

export default App;
