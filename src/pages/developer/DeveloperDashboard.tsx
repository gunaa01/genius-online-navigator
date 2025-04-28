import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  AlertTriangle, 
  Flag, 
  Users, 
  Settings, 
  Code,
  BarChart,
  RefreshCw
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ErrorReportingDashboard from '@/components/common/ErrorReportingDashboard';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { FeatureFlag, FeatureFlagType } from '@/lib/featureFlags';

/**
 * DeveloperDashboard - A dashboard for developers to monitor and manage the application
 * 
 * Features:
 * - Error reporting and monitoring
 * - Feature flag management
 * - Performance metrics
 * - System health status
 */
const DeveloperDashboard = () => {
  const [activeTab, setActiveTab] = useState('errors');
  const { allFlags, isEnabled, refreshFlags } = useFeatureFlags();
  
  // Group feature flags by type
  const flagsByType: Record<FeatureFlagType, FeatureFlag[]> = {
    'boolean': [],
    'userBased': [],
    'percentRollout': [],
    'environment': [],
    'timeBased': []
  };
  
  Object.values(allFlags).forEach(flag => {
    flagsByType[flag.type].push(flag);
  });
  
  // Toggle a boolean feature flag
  const toggleFeatureFlag = (flagId: string) => {
    console.log(`Toggling feature flag: ${flagId}`);
    // In a real app, this would call an API to update the flag
    // For demo purposes, we'll just refresh the flags
    setTimeout(refreshFlags, 500);
  };
  
  // Update a percentage rollout
  const updateRolloutPercentage = (flagId: string, percentage: string) => {
    console.log(`Updating rollout percentage for ${flagId} to ${percentage}%`);
    // In a real app, this would call an API to update the flag
  };
  
  // Get badge for feature flag type
  const getTypeBadge = (type: FeatureFlagType) => {
    switch (type) {
      case 'boolean':
        return <Badge variant="outline">Boolean</Badge>;
      case 'userBased':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">User Based</Badge>;
      case 'percentRollout':
        return <Badge variant="outline" className="border-green-500 text-green-500">% Rollout</Badge>;
      case 'environment':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Environment</Badge>;
      case 'timeBased':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Time Based</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Developer Dashboard | Genius Online Navigator</title>
          <meta name="description" content="Developer tools and monitoring for Genius Online Navigator" />
        </Helmet>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor application health, manage feature flags, and track errors
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
        
        {/* System Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">0.12%</div>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                -0.05% from last week
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Active Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">12</div>
                <Flag className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                3 new features this month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">1,254</div>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                +12% from last week
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">API Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">124ms</div>
                <BarChart className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                -15ms from last week
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 md:w-[600px]">
            <TabsTrigger value="errors">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Error Reporting
            </TabsTrigger>
            <TabsTrigger value="features">
              <Flag className="h-4 w-4 mr-2" />
              Feature Flags
            </TabsTrigger>
            <TabsTrigger value="performance">
              <BarChart className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>
          
          {/* Error Reporting Tab */}
          <TabsContent value="errors" className="space-y-4">
            <ErrorReportingDashboard />
          </TabsContent>
          
          {/* Feature Flags Tab */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Flag Management</CardTitle>
                <CardDescription>
                  Manage feature flags across the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Boolean Feature Flags */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Boolean Flags</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Feature</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flagsByType.boolean.map(flag => (
                          <TableRow key={flag.id}>
                            <TableCell>
                              <div className="font-medium">{flag.name}</div>
                              <div className="text-xs text-muted-foreground">{flag.description}</div>
                            </TableCell>
                            <TableCell>{getTypeBadge(flag.type)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Switch
                                  id={`flag-${flag.id}`}
                                  checked={isEnabled(flag.id)}
                                  onCheckedChange={() => toggleFeatureFlag(flag.id)}
                                />
                                <Label htmlFor={`flag-${flag.id}`} className="ml-2">
                                  {isEnabled(flag.id) ? 'Enabled' : 'Disabled'}
                                </Label>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Code className="h-4 w-4 mr-2" />
                                View Usage
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Percentage Rollout Feature Flags */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Percentage Rollout Flags</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Feature</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Rollout %</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flagsByType.percentRollout.map(flag => (
                          <TableRow key={flag.id}>
                            <TableCell>
                              <div className="font-medium">{flag.name}</div>
                              <div className="text-xs text-muted-foreground">{flag.description}</div>
                            </TableCell>
                            <TableCell>{getTypeBadge(flag.type)}</TableCell>
                            <TableCell>
                              <Select
                                defaultValue={flag.type === 'percentRollout' ? 
                                  flag.rolloutPercentage.toString() : '0'}
                                onValueChange={(value) => updateRolloutPercentage(flag.id, value)}
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="%" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">0%</SelectItem>
                                  <SelectItem value="10">10%</SelectItem>
                                  <SelectItem value="20">20%</SelectItem>
                                  <SelectItem value="50">50%</SelectItem>
                                  <SelectItem value="100">100%</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Code className="h-4 w-4 mr-2" />
                                View Usage
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Other Feature Flags */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Other Feature Flags</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Feature</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...flagsByType.userBased, ...flagsByType.environment, ...flagsByType.timeBased].map(flag => (
                          <TableRow key={flag.id}>
                            <TableCell>
                              <div className="font-medium">{flag.name}</div>
                              <div className="text-xs text-muted-foreground">{flag.description}</div>
                            </TableCell>
                            <TableCell>{getTypeBadge(flag.type)}</TableCell>
                            <TableCell>
                              <Badge variant={isEnabled(flag.id) ? 'default' : 'outline'}>
                                {isEnabled(flag.id) ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Monitor application performance and resource usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <BarChart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Performance Monitoring Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    We're working on comprehensive performance monitoring tools. Check back soon for detailed metrics and insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default DeveloperDashboard;
