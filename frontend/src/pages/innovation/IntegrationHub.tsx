import { useState } from 'react';
import { 
  Link2, 
  Plus, 
  Check, 
  X, 
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Settings,
  MoreHorizontal
} from 'lucide-react';

import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types
interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'communication' | 'marketing' | 'development' | 'analytics';
  icon: string;
  status: 'connected' | 'disconnected' | 'pending';
  isPopular: boolean;
  lastSync?: string;
}

// Mock data
const mockIntegrations: Integration[] = [
  {
    id: 'int-1',
    name: 'Google Workspace',
    description: 'Connect your Google Drive, Calendar, and Gmail',
    category: 'productivity',
    icon: '/icons/google.svg',
    status: 'connected',
    isPopular: true,
    lastSync: '2025-04-22T15:30:00Z'
  },
  {
    id: 'int-2',
    name: 'Slack',
    description: 'Send notifications and updates to Slack channels',
    category: 'communication',
    icon: '/icons/slack.svg',
    status: 'connected',
    isPopular: true,
    lastSync: '2025-04-22T14:45:00Z'
  },
  {
    id: 'int-3',
    name: 'Microsoft 365',
    description: 'Connect with Microsoft Teams, OneDrive, and Outlook',
    category: 'productivity',
    icon: '/icons/microsoft.svg',
    status: 'disconnected',
    isPopular: true
  },
  {
    id: 'int-4',
    name: 'Trello',
    description: 'Sync tasks and boards with Trello',
    category: 'productivity',
    icon: '/icons/trello.svg',
    status: 'disconnected',
    isPopular: false
  },
  {
    id: 'int-5',
    name: 'GitHub',
    description: 'Connect repositories and track issues',
    category: 'development',
    icon: '/icons/github.svg',
    status: 'connected',
    isPopular: true,
    lastSync: '2025-04-21T18:20:00Z'
  },
  {
    id: 'int-6',
    name: 'HubSpot',
    description: 'Sync client data with HubSpot CRM',
    category: 'marketing',
    icon: '/icons/hubspot.svg',
    status: 'disconnected',
    isPopular: false
  },
  {
    id: 'int-7',
    name: 'Mailchimp',
    description: 'Connect email marketing campaigns',
    category: 'marketing',
    icon: '/icons/mailchimp.svg',
    status: 'pending',
    isPopular: false
  },
  {
    id: 'int-8',
    name: 'Google Analytics',
    description: 'Import analytics data for reporting',
    category: 'analytics',
    icon: '/icons/analytics.svg',
    status: 'connected',
    isPopular: true,
    lastSync: '2025-04-22T10:15:00Z'
  }
];

// Format date
const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }
};

const IntegrationHub = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter integrations
  const filteredIntegrations = mockIntegrations.filter(integration => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        integration.name.toLowerCase().includes(query) ||
        integration.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all' && integration.category !== categoryFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && integration.status !== statusFilter) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'connected' && integration.status !== 'connected') {
      return false;
    } else if (activeTab === 'popular' && !integration.isPopular) {
      return false;
    }
    
    return true;
  });
  
  // Toggle integration status
  const toggleIntegrationStatus = (id: string) => {
    // In a real app, this would connect to the API
    console.log(`Toggling integration status for ${id}`);
  };
  
  // Sync integration
  const syncIntegration = (id: string) => {
    // In a real app, this would trigger a sync
    console.log(`Syncing integration ${id}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Integration Hub | Genius Online Navigator</title>
        <meta name="description" content="Connect your favorite tools and services with the Genius Online Navigator platform." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Integration Hub</h1>
          <p className="text-muted-foreground">Connect your favorite tools and services with the platform</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Integration
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Integration Status</AlertTitle>
        <AlertDescription>
          4 of 8 integrations are currently connected and syncing data. Last sync check: {formatRelativeTime('2025-04-22T16:30:00Z')}
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search integrations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredIntegrations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Link2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No integrations found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? 
                    'No integrations match your search criteria. Try adjusting your filters.' : 
                    'No integrations available. Try adding a custom integration or check back later.'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Integration
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map(integration => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                          {/* In a real app, this would be an actual icon */}
                          <Link2 className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center">
                            {integration.name}
                            {integration.isPopular && (
                              <Badge variant="outline" className="ml-2 text-xs">Popular</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs">{integration.category}</CardDescription>
                        </div>
                      </div>
                      
                      <Switch 
                        checked={integration.status === 'connected'}
                        onCheckedChange={() => toggleIntegrationStatus(integration.id)}
                        disabled={integration.status === 'pending'}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Badge 
                        variant={
                          integration.status === 'connected' ? 'default' : 
                          integration.status === 'pending' ? 'outline' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {integration.status === 'connected' ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : integration.status === 'pending' ? (
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <X className="h-3 w-3 mr-1" />
                        )}
                        {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                      </Badge>
                      
                      {integration.status === 'connected' && (
                        <div className="text-xs text-muted-foreground">
                          Last sync: {formatRelativeTime(integration.lastSync)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2">
                    <div className="flex justify-between w-full">
                      {integration.status === 'connected' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => syncIntegration(integration.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync Now
                        </Button>
                      ) : integration.status === 'disconnected' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleIntegrationStatus(integration.id)}
                        >
                          <Link2 className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                        >
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Connecting...
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Website
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHub;
