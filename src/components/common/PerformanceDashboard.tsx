import React, { useState, useEffect } from 'react';
import {
  BarChart,
  RefreshCw,
  Clock,
  Zap,
  ArrowDown,
  HardDrive,
  Layers,
  Activity,
  FileText,
  Image,
  Code,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Import our performance monitoring utilities
import performanceMonitor, { PerformanceMetrics } from '@/utils/performance';

interface PerformanceDashboardProps {
  onRefresh?: () => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  onRefresh
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  // Load performance metrics
  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    setIsLoading(true);
    
    // Get metrics from the performance monitor
    const currentMetrics = performanceMonitor.getMetrics();
    setMetrics(currentMetrics);
    
    // Simulate API delay for the refresh animation
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadMetrics();
    
    if (onRefresh) {
      onRefresh();
    }
  };

  // Format bytes to human-readable format
  const formatBytes = (bytes?: number): string => {
    if (bytes === undefined) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format time in milliseconds to human-readable format
  const formatTime = (ms?: number): string => {
    if (ms === undefined) return 'N/A';
    
    if (ms < 1) {
      return `${(ms * 1000).toFixed(2)} µs`;
    } else if (ms < 1000) {
      return `${ms.toFixed(2)} ms`;
    } else {
      return `${(ms / 1000).toFixed(2)} s`;
    }
  };

  // Calculate average from array
  const calculateAverage = (array?: number[]): number => {
    if (!array || array.length === 0) return 0;
    return array.reduce((a, b) => a + b, 0) / array.length;
  };

  // Get performance score based on metrics
  const getPerformanceScore = (): number => {
    let score = 100;
    
    // Deduct points for slow LCP
    if (metrics.largestContentfulPaint) {
      if (metrics.largestContentfulPaint > 2500) {
        score -= 10;
      }
      if (metrics.largestContentfulPaint > 4000) {
        score -= 15;
      }
    }
    
    // Deduct points for CLS
    if (metrics.cumulativeLayoutShift) {
      if (metrics.cumulativeLayoutShift > 0.1) {
        score -= 10;
      }
      if (metrics.cumulativeLayoutShift > 0.25) {
        score -= 15;
      }
    }
    
    // Deduct points for FID
    if (metrics.firstInputDelay) {
      if (metrics.firstInputDelay > 100) {
        score -= 10;
      }
      if (metrics.firstInputDelay > 300) {
        score -= 15;
      }
    }
    
    // Deduct points for slow API responses
    const apiResponseTimes = metrics.apiResponseTime || {};
    const avgApiTime = Object.values(apiResponseTimes).reduce((acc, times) => {
      return acc + calculateAverage(times);
    }, 0) / Math.max(Object.keys(apiResponseTimes).length, 1);
    
    if (avgApiTime > 500) {
      score -= 10;
    }
    if (avgApiTime > 1000) {
      score -= 15;
    }
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };

  // Get score color
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  // Get top slow components
  const getSlowComponents = (): { name: string, time: number }[] => {
    const componentTimes = metrics.componentRenderTime || {};
    
    return Object.entries(componentTimes)
      .map(([name, times]) => ({
        name,
        time: calculateAverage(times)
      }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
  };

  // Get top slow API calls
  const getSlowApiCalls = (): { endpoint: string, time: number }[] => {
    const apiTimes = metrics.apiResponseTime || {};
    
    return Object.entries(apiTimes)
      .map(([endpoint, times]) => ({
        endpoint,
        time: calculateAverage(times)
      }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
  };

  // Get resource breakdown
  const getResourceBreakdown = (): { type: string, size: number, icon: React.ReactNode }[] => {
    return [
      { 
        type: 'JavaScript', 
        size: metrics.jsSize || 0,
        icon: <Code className="h-4 w-4 text-amber-500" />
      },
      { 
        type: 'CSS', 
        size: metrics.cssSize || 0,
        icon: <FileText className="h-4 w-4 text-blue-500" />
      },
      { 
        type: 'Images', 
        size: metrics.imageSize || 0,
        icon: <Image className="h-4 w-4 text-green-500" />
      },
      { 
        type: 'Fonts', 
        size: metrics.fontSize || 0,
        icon: <FileText className="h-4 w-4 text-purple-500" />
      },
      { 
        type: 'Other', 
        size: metrics.otherSize || 0,
        icon: <HardDrive className="h-4 w-4 text-gray-500" />
      }
    ].sort((a, b) => b.size - a.size);
  };

  const performanceScore = getPerformanceScore();
  const scoreColor = getScoreColor(performanceScore);
  const slowComponents = getSlowComponents();
  const slowApiCalls = getSlowApiCalls();
  const resourceBreakdown = getResourceBreakdown();
  const totalResourceSize = metrics.totalResourceSize || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Monitoring</h2>
          <p className="text-muted-foreground">
            Monitor application performance metrics and resource usage
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[120px]">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Performance Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${scoreColor}`}>
                {performanceScore}
              </div>
              <Activity className={`h-5 w-5 ${scoreColor}`} />
            </div>
            <div className="mt-2">
              <Progress value={performanceScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Largest Contentful Paint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {formatTime(metrics.largestContentfulPaint)}
              </div>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Target: &lt; 2.5s
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">First Input Delay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {formatTime(metrics.firstInputDelay)}
              </div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Target: &lt; 100ms
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cumulative Layout Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {metrics.cumulativeLayoutShift?.toFixed(3) || 'N/A'}
              </div>
              <ArrowDown className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Target: &lt; 0.1
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="api">API Calls</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Core Web Vitals</CardTitle>
                <CardDescription>
                  Key metrics that affect user experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Time to First Byte</TableCell>
                      <TableCell>{formatTime(metrics.timeToFirstByte)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">First Contentful Paint</TableCell>
                      <TableCell>{formatTime(metrics.firstContentfulPaint)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Largest Contentful Paint</TableCell>
                      <TableCell>{formatTime(metrics.largestContentfulPaint)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">First Input Delay</TableCell>
                      <TableCell>{formatTime(metrics.firstInputDelay)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Cumulative Layout Shift</TableCell>
                      <TableCell>{metrics.cumulativeLayoutShift?.toFixed(3) || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">DOM Content Loaded</TableCell>
                      <TableCell>{formatTime(metrics.domContentLoaded)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Window Loaded</TableCell>
                      <TableCell>{formatTime(metrics.windowLoaded)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resource Summary</CardTitle>
                <CardDescription>
                  Overview of loaded resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Total Size</span>
                      <span className="text-sm font-medium">{formatBytes(totalResourceSize)}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  {resourceBreakdown.map(resource => (
                    <div key={resource.type}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm flex items-center">
                          {resource.icon}
                          <span className="ml-2">{resource.type}</span>
                        </span>
                        <span className="text-sm">{formatBytes(resource.size)}</span>
                      </div>
                      <Progress 
                        value={totalResourceSize ? (resource.size / totalResourceSize) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Slowest Components</CardTitle>
                <CardDescription>
                  Components with the longest render times
                </CardDescription>
              </CardHeader>
              <CardContent>
                {slowComponents.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No component render data available
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead className="text-right">Avg. Render Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slowComponents.map(component => (
                        <TableRow key={component.name}>
                          <TableCell className="font-medium">{component.name}</TableCell>
                          <TableCell className="text-right">{formatTime(component.time)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Slowest API Calls</CardTitle>
                <CardDescription>
                  API endpoints with the longest response times
                </CardDescription>
              </CardHeader>
              <CardContent>
                {slowApiCalls.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No API call data available
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Endpoint</TableHead>
                        <TableHead className="text-right">Avg. Response Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slowApiCalls.map(api => (
                        <TableRow key={api.endpoint}>
                          <TableCell className="font-medium">{api.endpoint}</TableCell>
                          <TableCell className="text-right">{formatTime(api.time)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of loaded resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Resource Size by Type</h3>
                  {resourceBreakdown.map(resource => (
                    <div key={resource.type} className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          {resource.icon}
                          <span className="ml-2 font-medium">{resource.type}</span>
                        </span>
                        <span>{formatBytes(resource.size)}</span>
                      </div>
                      <Progress 
                        value={totalResourceSize ? (resource.size / totalResourceSize) * 100 : 0} 
                        className="h-3" 
                      />
                      <div className="text-xs text-right mt-1 text-muted-foreground">
                        {totalResourceSize ? ((resource.size / totalResourceSize) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Resource Statistics</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Total Resources</TableCell>
                        <TableCell>{metrics.resourceCount || 0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Size</TableCell>
                        <TableCell>{formatBytes(totalResourceSize)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">JavaScript Size</TableCell>
                        <TableCell>{formatBytes(metrics.jsSize)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">CSS Size</TableCell>
                        <TableCell>{formatBytes(metrics.cssSize)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Images Size</TableCell>
                        <TableCell>{formatBytes(metrics.imageSize)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Fonts Size</TableCell>
                        <TableCell>{formatBytes(metrics.fontSize)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Other Resources Size</TableCell>
                        <TableCell>{formatBytes(metrics.otherSize)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Components Tab */}
        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Performance</CardTitle>
              <CardDescription>
                Render times for React components
              </CardDescription>
            </CardHeader>
            <CardContent>
              {slowComponents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Layers className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Component Data Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    Component performance data will appear here once the application has been used.
                    Try navigating through the application to generate component render data.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Renders</TableHead>
                      <TableHead>Avg. Render Time</TableHead>
                      <TableHead>Max Render Time</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slowComponents.map(component => {
                      const times = metrics.componentRenderTime?.[component.name] || [];
                      const maxTime = times.length ? Math.max(...times) : 0;
                      
                      let status = 'Good';
                      let statusColor = 'bg-green-500';
                      
                      if (component.time > 50) {
                        status = 'Slow';
                        statusColor = 'bg-amber-500';
                      }
                      
                      if (component.time > 100) {
                        status = 'Very Slow';
                        statusColor = 'bg-red-500';
                      }
                      
                      return (
                        <TableRow key={component.name}>
                          <TableCell className="font-medium">{component.name}</TableCell>
                          <TableCell>{times.length}</TableCell>
                          <TableCell>{formatTime(component.time)}</TableCell>
                          <TableCell>{formatTime(maxTime)}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={statusColor}>{status}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* API Calls Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Performance</CardTitle>
              <CardDescription>
                Response times for API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              {slowApiCalls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Download className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No API Data Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    API performance data will appear here once API calls have been made.
                    Try using features that make API requests to generate data.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Calls</TableHead>
                      <TableHead>Avg. Response Time</TableHead>
                      <TableHead>Max Response Time</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slowApiCalls.map(api => {
                      const times = metrics.apiResponseTime?.[api.endpoint] || [];
                      const maxTime = times.length ? Math.max(...times) : 0;
                      
                      let status = 'Good';
                      let statusColor = 'bg-green-500';
                      
                      if (api.time > 300) {
                        status = 'Slow';
                        statusColor = 'bg-amber-500';
                      }
                      
                      if (api.time > 1000) {
                        status = 'Very Slow';
                        statusColor = 'bg-red-500';
                      }
                      
                      return (
                        <TableRow key={api.endpoint}>
                          <TableCell className="font-medium">{api.endpoint}</TableCell>
                          <TableCell>{times.length}</TableCell>
                          <TableCell>{formatTime(api.time)}</TableCell>
                          <TableCell>{formatTime(maxTime)}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={statusColor}>{status}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
