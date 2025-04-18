import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import OfflineToOnline from "./pages/OfflineToOnline";
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
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/offline-to-online" element={<OfflineToOnline />} />
              <Route path="/for-hire" element={<ForHire />} />
              <Route path="/auth" element={<Auth />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              
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
              
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
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
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
