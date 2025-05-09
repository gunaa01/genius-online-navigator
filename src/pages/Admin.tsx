import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, PlusCircle, UserPlus, Link as LinkIcon } from "lucide-react";
import AdminContent from "@/components/admin/AdminContent";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import TeamInvite from "./TeamInvite";
import IntegrationsConnect from "./IntegrationsConnect";
import AdminCreate from "./AdminCreate";

const Admin = () => {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // This should be replaced with proper role checking
  // For now, we're assuming the admin has a specific email
  const isAdmin = user?.email === "admin@genius.com";
  
  useEffect(() => {
    document.title = "Admin Dashboard | Genius";
  }, []);

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin area.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  // Modal dialogs for previously unused components
  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-background p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {activeModal === 'team-invite' && 'Invite Team Member'}
              {activeModal === 'connect-integration' && 'Connect Integration'}
              {activeModal === 'create-admin' && 'Create Admin Content'}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </div>
          <div className="p-6">
            {activeModal === 'team-invite' && <TeamInvite />}
            {activeModal === 'connect-integration' && <IntegrationsConnect />}
            {activeModal === 'create-admin' && <AdminCreate />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage content, users, and settings for the Genius platform.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setActiveModal('create-admin')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Content
              </Button>
              <Button variant="outline" onClick={() => setActiveModal('team-invite')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Team
              </Button>
              <Button variant="outline" onClick={() => setActiveModal('connect-integration')}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="content">
              <AdminContent />
            </TabsContent>
            
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
            
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Render modal dialogs */}
      {renderModal()}
    </DashboardLayout>
  );
};

export default Admin;
