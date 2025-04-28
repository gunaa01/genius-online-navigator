import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Import our modular components
import ClientPortalHeader from '@/components/innovation/client-portal/ClientPortalHeader';
import ClientDashboardSummary from '@/components/innovation/client-portal/ClientDashboardSummary';
import ClientProjectList from '@/components/innovation/client-portal/ClientProjectList';
import ClientApprovals from '@/components/innovation/client-portal/ClientApprovals';
import ClientDocuments from '@/components/innovation/client-portal/ClientDocuments';

// Import API services and hooks
import { clientService } from '@/services/api/clientService';
import useApi from '@/hooks/useApi';
import { FeatureFlagged } from '@/contexts/FeatureFlagContext';

// Define a constant for mock mode
const USE_MOCK_DATA = false; // Toggle this to switch between mock and real data

const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Use our API hook to fetch client data
  const { 
    data: client, 
    loading: clientLoading, 
    error: clientError 
  } = useApi(
    clientService.getClient,
    { 
      immediate: !USE_MOCK_DATA, // Only fetch if not using mock data
      initialData: USE_MOCK_DATA ? mockClient : undefined
    }
  );

  // Use our API hook to fetch client portal summary
  const { 
    data: portalSummary, 
    loading: summaryLoading, 
    error: summaryError 
  } = useApi(
    (clientId) => clientService.getClientPortalSummary(clientId),
    { 
      immediate: false, // We'll call this manually after getting the client
      initialData: USE_MOCK_DATA ? {
        activeProjects: mockProjects.filter(p => p.status === 'active').length,
        pendingApprovals: mockProjects.reduce((sum, p) => sum + p.pendingApprovals, 0),
        unreadMessages: mockProjects.reduce((sum, p) => sum + p.unreadMessages, 0),
        upcomingDeadlines: 2,
        recentDocuments: []
      } : undefined
    }
  );

  // Use our API hook to fetch client projects
  const { 
    data: projects, 
    loading: projectsLoading, 
    error: projectsError 
  } = useApi(
    (clientId) => clientService.getClientProjects(clientId),
    { 
      immediate: false, // We'll call this manually after getting the client
      initialData: USE_MOCK_DATA ? mockProjects : undefined
    }
  );

  // Fetch data when client ID is available
  useEffect(() => {
    if (!USE_MOCK_DATA && client?.id) {
      portalSummary.execute(client.id);
      projects.execute(client.id);
    }
  }, [client?.id]);

  // Loading state
  const isLoading = clientLoading || summaryLoading || projectsLoading;

  // Error state
  const hasError = clientError || summaryError || projectsError;
  const errorMessage = clientError?.message || summaryError?.message || projectsError?.message;

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Client Portal | Genius Online Navigator</title>
          <meta name="description" content="Access your projects, approve deliverables, and communicate with your team." />
        </Helmet>
        
        {isLoading && !USE_MOCK_DATA && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading client data...</p>
            </div>
          </div>
        )}
        
        {hasError && !USE_MOCK_DATA && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorMessage || 'Failed to load client data. Please try again later.'}
            </AlertDescription>
          </Alert>
        )}
        
        {(!isLoading || USE_MOCK_DATA) && !hasError && (
          <>
            {/* Client Header */}
            <ClientPortalHeader client={client} />
            
            {/* Dashboard Summary */}
            <ClientDashboardSummary projects={projects || []} />
            
            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 md:w-[600px]">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="approvals">Approvals</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4">
                <ClientProjectList projects={projects || []} />
              </TabsContent>
              
              {/* Approvals Tab */}
              <TabsContent value="approvals" className="space-y-4">
                <ClientApprovals />
              </TabsContent>
              
              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-4">
                <FeatureFlagged 
                  flagId="client-portal-chat"
                  fallback={
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Messages</CardTitle>
                        <CardDescription>Communicate with your project team</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 text-muted-foreground">
                          Messages component will be implemented in the next phase
                        </div>
                      </CardContent>
                    </Card>
                  }
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Messages</CardTitle>
                      <CardDescription>Communicate with your project team</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <p>Real-time chat is now available!</p>
                        <p className="text-xs mt-2">This feature is currently in beta testing.</p>
                      </div>
                    </CardContent>
                  </Card>
                </FeatureFlagged>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                <ClientDocuments />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

// Mock data (will be used when USE_MOCK_DATA is true)
const mockClient = {
  id: 'client-1',
  name: 'John Smith',
  company: 'Acme Corporation',
  email: 'john.smith@acme.com',
  phone: '(555) 123-4567',
  avatar: '/avatars/john.jpg'
};

const mockProjects = [
  {
    id: 'cp-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of corporate website with new branding',
    status: 'active',
    progress: 65,
    startDate: '2025-02-15',
    endDate: '2025-05-30',
    pendingApprovals: 2,
    unreadMessages: 3
  },
  {
    id: 'cp-2',
    name: 'Marketing Campaign',
    description: 'Q2 digital marketing campaign for product launch',
    status: 'active',
    progress: 40,
    startDate: '2025-03-01',
    endDate: '2025-06-15',
    pendingApprovals: 1,
    unreadMessages: 0
  },
  {
    id: 'cp-3',
    name: 'Brand Identity Update',
    description: 'Refresh of brand guidelines and visual identity',
    status: 'completed',
    progress: 100,
    startDate: '2025-01-10',
    endDate: '2025-03-15',
    pendingApprovals: 0,
    unreadMessages: 0
  }
];

export default ClientPortal;
