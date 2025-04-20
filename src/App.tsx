
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
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

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/landing" element={<Index />} />
                <Route path="/offline-to-online" element={<OfflineToOnline />} />
                <Route path="/hire" element={<Hire />} />
                <Route path="/hiring" element={<Hiring />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Set Index as new home page */}
                <Route path="/" element={<Index />} />

                {/* Make dashboard and community PUBLIC for testing */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/community" element={<Community />} />

                {/* Move dashboard to /dashboard, protected */}
                {/* <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } /> */}
                {/* <Route path="/community" element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } /> */}
                
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } />
                
                <Route path="/ads" element={
                  <ProtectedRoute>
                    <AdCampaigns />
                  </ProtectedRoute>
                } />
                
                <Route path="/social" element={
                  <ProtectedRoute>
                    <SocialMedia />
                  </ProtectedRoute>
                } />
                
                <Route path="/content" element={
                  <ProtectedRoute>
                    <AiContent />
                  </ProtectedRoute>
                } />
                
                <Route path="/integrations" element={
                  <ProtectedRoute>
                    <Integrations />
                  </ProtectedRoute>
                } />
                
                <Route path="/team" element={
                  <ProtectedRoute>
                    <TeamManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                <Route path="/upgrade" element={
                  <ProtectedRoute>
                    <Upgrade />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                {/* Custom pages for button navigation */}
                <Route path="/admin/create" element={<AdminCreate />} />
                <Route path="/team/invite" element={<TeamInvite />} />
                <Route path="/integrations/connect" element={<IntegrationsConnect />} />
                
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/docs" element={<Docs />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

export default App;
