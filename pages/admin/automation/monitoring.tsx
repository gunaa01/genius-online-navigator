import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { 
  workflowService, 
  Workflow,
  WorkflowStats,
  WorkflowRun
} from '@/services/automation/workflowService';
import SEOHead from '@/components/seo/SEOHead';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  X, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  BarChart2,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock8,
  Zap,
  Eye
} from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';

// Chart components
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface MonitoringDashboardProps {
  initialWorkflows: Workflow[];
  initialStats: {
    totalWorkflows: number;
    activeWorkflows: number;
    totalRuns: number;
    successRate: number;
    recentRuns: WorkflowRun[];
    runsByDay: { date: string; runs: number; successful: number; failed: number }[];
    runsByWorkflow: { name: string; runs: number; successful: number; failed: number }[];
    runsByTriggerType: { type: string; count: number }[];
    avgDuration: number;
    topWorkflows: { id: string; name: string; runs: number }[];
  };
}

/**
 * Monitoring Dashboard
 * 
 * Dashboard for monitoring workflow performance and statistics
 */
export default function MonitoringDashboard({
  initialWorkflows,
  initialStats
}: MonitoringDashboardProps) {
  // Router
  const router = useRouter();
  
  // Toast
  const { toast } = useToast();
  
  // State
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Load stats
  const loadStats = async () => {
    setLoading(true);
    try {
      // Convert time range to days
      let days = 7;
      switch (timeRange) {
        case '24h':
          days = 1;
          break;
        case '7d':
          days = 7;
          break;
        case '30d':
          days = 30;
          break;
        case '90d':
          days = 90;
          break;
      }
      
      const newStats = await workflowService.getWorkflowStats(days);
      setStats(newStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load monitoring statistics. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  // Effect to reload stats when time range changes
  useEffect(() => {
    loadStats();
  }, [timeRange]);
  
  // Format duration
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}m ${seconds}s`;
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success" className="flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Success</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'running':
        return <Badge variant="default" className="flex items-center"><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };
  
  // Get trend indicator
  const getTrendIndicator = (change: number) => {
    if (change > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    }
    return null;
  };
  
  // Chart colors
  const chartColors = {
    primary: '#0284c7',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    secondary: '#6b7280',
    background: '#f8fafc',
    pieColors: ['#0284c7', '#10b981', '#ef4444', '#f59e0b', '#6b7280', '#8b5cf6', '#ec4899']
  };
  
  return (
    <>
      <SEOHead
        metadata={{
          title: 'Workflow Monitoring | Genius Online Navigator',
          description: 'Monitor and analyze your automated workflow performance and statistics.',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Workflow Monitoring',
            description: 'Monitor and analyze your automated workflow performance and statistics.',
          },
        }}
        path="/admin/automation/monitoring"
      />
      
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workflow Monitoring</h1>
              <p className="text-muted-foreground">
                Monitor and analyze your automated workflow performance
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select
                value={timeRange}
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={loadStats} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="runs">Runs</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Workflows */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                          <h3 className="text-2xl font-bold mt-2">{stats.totalWorkflows}</h3>
                        </div>
                        <div className="rounded-full bg-primary/10 p-2">
                          <BarChart2 className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex items-center mt-4 text-sm">
                        <Badge variant="outline" className="mr-2">
                          {stats.activeWorkflows} Active
                        </Badge>
                        <span className="text-muted-foreground">
                          {Math.round((stats.activeWorkflows / stats.totalWorkflows) * 100)}% active rate
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Total Runs */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Runs</p>
                          <h3 className="text-2xl font-bold mt-2">{stats.totalRuns}</h3>
                        </div>
                        <div className="rounded-full bg-primary/10 p-2">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex items-center mt-4 text-sm">
                        <div className="flex items-center">
                          {getTrendIndicator(10)} {/* Placeholder for trend */}
                          <span className="text-sm ml-1">10% vs previous</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Success Rate */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                          <h3 className="text-2xl font-bold mt-2">{stats.successRate}%</h3>
                        </div>
                        <div className="rounded-full bg-green-100 p-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex items-center mt-4 text-sm">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${stats.successRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Average Duration */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                          <h3 className="text-2xl font-bold mt-2">{formatDuration(stats.avgDuration)}</h3>
                        </div>
                        <div className="rounded-full bg-primary/10 p-2">
                          <Clock8 className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex items-center mt-4 text-sm">
                        <div className="flex items-center">
                          {getTrendIndicator(-5)} {/* Placeholder for trend */}
                          <span className="text-sm ml-1">5% faster vs previous</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Runs by Day */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Runs by Day</CardTitle>
                      <CardDescription>
                        Number of workflow runs per day
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={stats.runsByDay}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => [value, name === 'runs' ? 'Total Runs' : name === 'successful' ? 'Successful' : 'Failed']}
                              labelFormatter={(date) => format(parseISO(date as string), 'PPP')}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="runs" 
                              stackId="1"
                              stroke={chartColors.primary} 
                              fill={chartColors.primary} 
                              fillOpacity={0.6}
                              name="Total Runs"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="successful" 
                              stackId="2"
                              stroke={chartColors.success} 
                              fill={chartColors.success} 
                              fillOpacity={0.6}
                              name="Successful"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="failed" 
                              stackId="2"
                              stroke={chartColors.error} 
                              fill={chartColors.error} 
                              fillOpacity={0.6}
                              name="Failed"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Runs by Trigger Type */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Runs by Trigger Type</CardTitle>
                      <CardDescription>
                        Distribution of runs by trigger type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={stats.runsByTriggerType}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="type"
                              label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {stats.runsByTriggerType.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={chartColors.pieColors[index % chartColors.pieColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [`${value} runs`, props.payload.type]} />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Runs by Workflow */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Runs by Workflow</CardTitle>
                      <CardDescription>
                        Number of runs per workflow
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={stats.runsByWorkflow}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="successful" stackId="a" name="Successful" fill={chartColors.success} />
                            <Bar dataKey="failed" stackId="a" name="Failed" fill={chartColors.error} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Top Workflows */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Workflows</CardTitle>
                      <CardDescription>
                        Most frequently executed workflows
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Workflow</TableHead>
                            <TableHead className="text-right">Runs</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.topWorkflows.map((workflow) => (
                            <TableRow key={workflow.id}>
                              <TableCell className="font-medium">{workflow.name}</TableCell>
                              <TableCell className="text-right">{workflow.runs}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => router.push(`/admin/automation?view=runs&id=${workflow.id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Workflows Tab */}
            <TabsContent value="workflows">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Performance</CardTitle>
                  <CardDescription>
                    Detailed performance metrics for each workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Trigger Type</TableHead>
                        <TableHead className="text-right">Runs</TableHead>
                        <TableHead className="text-right">Success Rate</TableHead>
                        <TableHead className="text-right">Avg. Duration</TableHead>
                        <TableHead className="text-right">Last Run</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workflows.map((workflow) => (
                        <TableRow key={workflow.id}>
                          <TableCell className="font-medium">{workflow.name}</TableCell>
                          <TableCell>
                            <Badge variant={workflow.isActive ? 'success' : 'secondary'}>
                              {workflow.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {workflow.triggers.map(trigger => trigger.type).join(', ')}
                          </TableCell>
                          <TableCell className="text-right">
                            {workflow.stats?.runsTotal || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {workflow.stats?.runsTotal ? 
                              `${Math.round((workflow.stats.runsSuccess / workflow.stats.runsTotal) * 100)}%` : 
                              'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {workflow.stats?.avgDuration ? 
                              formatDuration(workflow.stats.avgDuration) : 
                              'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {workflow.stats?.lastRun ? 
                              format(parseISO(workflow.stats.lastRun), 'PPP') : 
                              'Never'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => router.push(`/admin/automation?view=runs&id=${workflow.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Runs
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Runs Tab */}
            <TabsContent value="runs">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Workflow Runs</CardTitle>
                  <CardDescription>
                    Latest workflow executions across all workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Triggered By</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentRuns.map((run) => (
                        <TableRow key={run.id}>
                          <TableCell className="font-medium">{run.workflowName}</TableCell>
                          <TableCell>{getStatusBadge(run.status)}</TableCell>
                          <TableCell>{run.triggeredBy}</TableCell>
                          <TableCell>
                            {format(parseISO(run.startTime), 'PPP')}
                            <div className="text-sm text-muted-foreground">
                              {format(parseISO(run.startTime), 'p')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {run.endTime ? 
                              formatDuration(new Date(run.endTime).getTime() - new Date(run.startTime).getTime()) : 
                              'Running...'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => router.push(`/admin/automation?view=runs&id=${run.workflowId}&runId=${run.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="ml-auto"
                    onClick={() => router.push('/admin/automation')}
                  >
                    View All Runs
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Fetch initial data
    const initialWorkflows = await workflowService.getWorkflows();
    const initialStats = await workflowService.getWorkflowStats(7); // Default to 7 days
    
    return {
      props: {
        initialWorkflows,
        initialStats,
      },
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    
    // Return empty data on error
    return {
      props: {
        initialWorkflows: [],
        initialStats: {
          totalWorkflows: 0,
          activeWorkflows: 0,
          totalRuns: 0,
          successRate: 0,
          recentRuns: [],
          runsByDay: [],
          runsByWorkflow: [],
          runsByTriggerType: [],
          avgDuration: 0,
          topWorkflows: [],
        },
      },
    };
  }
}
