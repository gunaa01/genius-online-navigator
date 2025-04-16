
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ads" element={<AdCampaigns />} />
            <Route path="/social" element={<SocialMedia />} />
            <Route path="/content" element={<AiContent />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upgrade" element={<Upgrade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
