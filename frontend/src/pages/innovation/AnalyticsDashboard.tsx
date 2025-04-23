import { useState } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Calendar, 
  Filter,
  RefreshCw,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Info,
  Settings
} from 'lucide-react';

import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for analytics
const overviewStats = [
  {
    title: 'Active Projects',
    value: 24,
    change: 12.5,
    trend: 'up',
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
  },
  {
    title: 'Team Utilization',
    value: '78%',
    change: 5.2,
    trend: 'up',
    icon: <Users className="h-5 w-5 text-blue-500" />
  },
  {
    title: 'Avg. Project Duration',
    value: '32 days',
    change: -8.3,
    trend: 'down',
    icon: <Clock className="h-5 w-5 text-amber-500" />
  },
  {
    title: 'Revenue',
    value: '$128.5K',
    change: 18.7,
    trend: 'up',
    icon: <DollarSign className="h-5 w-5 text-emerald-500" />
  }
];

// Project performance data
const projectPerformance = [
  { name: 'Website Redesign', progress: 78, status: 'on_track', budget: 92, team: 85 },
  { name: 'Mobile App Development', progress: 45, status: 'at_risk', budget: 65, team: 80 },
  { name: 'E-commerce Platform', progress: 92, status: 'on_track', budget: 88, team: 90 },
  { name: 'Brand Identity', progress: 100, status: 'completed', budget: 100, team: 95 },
  { name: 'Marketing Campaign', progress: 30, status: 'delayed', budget: 75, team: 60 }
];

// Team performance data
const teamPerformance = [
  { name: 'Design Team', utilization: 85, projects: 8, onTime: 92, satisfaction: 4.7 },
  { name: 'Development Team', utilization: 92, projects: 12, onTime: 88, satisfaction: 4.5 },
  { name: 'Marketing Team', utilization: 78, projects: 6, onTime: 95, satisfaction: 4.8 },
  { name: 'Content Team', utilization: 65, projects: 9, onTime: 82, satisfaction: 4.2 }
];

// Revenue data
const revenueData = {
  monthly: [
    { month: 'Jan', amount: 28500 },
    { month: 'Feb', amount: 32400 },
    { month: 'Mar', amount: 38200 },
    { month: 'Apr', amount: 42800 },
    { month: 'May', amount: 45600 },
    { month: 'Jun', amount: 52300 }
  ],
  categories: [
    { category: 'Web Development', amount: 85600, percentage: 42 },
    { category: 'Design Services', amount: 62400, percentage: 31 },
    { category: 'Marketing', amount: 34500, percentage: 17 },
    { category: 'Consulting', amount: 20000, percentage: 10 }
  ]
};

// Client satisfaction data
const clientSatisfaction = {
  overall: 4.6,
  responses: 128,
  categories: [
    { category: 'Communication', score: 4.8 },
    { category: 'Quality', score: 4.7 },
    { category: 'Timeliness', score: 4.3 },
    { category: 'Value', score: 4.5 }
  ]
};

// Format number with k/m for thousands/millions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Get status badge variant
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'on_track':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>;
    case 'at_risk':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">At Risk</Badge>;
    case 'delayed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Delayed</Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Analytics Dashboard | Genius Online Navigator</title>
        <meta name="description" content="Comprehensive analytics and insights for your projects, team, and business performance." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Insights and metrics to track your business performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onValueChange={setDateRange}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>AI-Powered Insights Available</AlertTitle>
        <AlertDescription>
          We've analyzed your data and found 3 opportunities to improve project efficiency.
          <Button variant="link" className="p-0 h-auto">View Insights</Button>
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                      {stat.change}%
                    </span>
                    <span className="text-muted-foreground ml-1">from previous period</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Project Status */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status Overview</CardTitle>
              <CardDescription>Current status of all active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col items-center p-3 bg-green-50 rounded-md">
                  <span className="text-xl font-bold text-green-700">18</span>
                  <span className="text-sm text-green-600">On Track</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-amber-50 rounded-md">
                  <span className="text-xl font-bold text-amber-700">4</span>
                  <span className="text-sm text-amber-600">At Risk</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-red-50 rounded-md">
                  <span className="text-xl font-bold text-red-700">2</span>
                  <span className="text-sm text-red-600">Delayed</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-blue-50 rounded-md">
                  <span className="text-xl font-bold text-blue-700">12</span>
                  <span className="text-sm text-blue-600">Completed</span>
                </div>
              </div>
              
              <div className="text-center py-12 text-muted-foreground">
                Project status chart will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Utilization</CardTitle>
                <CardDescription>Resource allocation across teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Team utilization chart will be implemented in the next phase
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Revenue trend chart will be implemented in the next phase
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Performance</CardTitle>
              <CardDescription>Metrics for all active and recently completed projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="pb-2">Project Name</th>
                      <th className="pb-2">Progress</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Budget</th>
                      <th className="pb-2">Team</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectPerformance.map((project, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3 font-medium">{project.name}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full ${
                                  project.status === 'on_track' ? 'bg-green-500' :
                                  project.status === 'at_risk' ? 'bg-amber-500' :
                                  project.status === 'delayed' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3">{getStatusBadge(project.status)}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full ${
                                  project.budget >= 90 ? 'bg-green-500' :
                                  project.budget >= 70 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${project.budget}%` }}
                              />
                            </div>
                            <span className="text-sm">{project.budget}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full ${
                                  project.team >= 90 ? 'bg-green-500' :
                                  project.team >= 70 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${project.team}%` }}
                              />
                            </div>
                            <span className="text-sm">{project.team}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline Adherence</CardTitle>
                <CardDescription>How well projects are staying on schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Project timeline chart will be implemented in the next phase
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Project Budget Variance</CardTitle>
                <CardDescription>Budget performance across projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Budget variance chart will be implemented in the next phase
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Metrics for all teams and departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="pb-2">Team</th>
                      <th className="pb-2">Utilization</th>
                      <th className="pb-2">Projects</th>
                      <th className="pb-2">On-Time Delivery</th>
                      <th className="pb-2">Client Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPerformance.map((team, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3 font-medium">{team.name}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full ${
                                  team.utilization >= 90 ? 'bg-green-500' :
                                  team.utilization >= 70 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${team.utilization}%` }}
                              />
                            </div>
                            <span className="text-sm">{team.utilization}%</span>
                          </div>
                        </td>
                        <td className="py-3">{team.projects}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full ${
                                  team.onTime >= 90 ? 'bg-green-500' :
                                  team.onTime >= 70 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${team.onTime}%` }}
                              />
                            </div>
                            <span className="text-sm">{team.onTime}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= Math.floor(team.satisfaction)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : star - Math.floor(team.satisfaction) <= 0.5
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300 fill-gray-300'
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm ml-2">{team.satisfaction}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
                <CardDescription>How work is distributed across team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Workload distribution chart will be implemented in the next phase
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skill Coverage</CardTitle>
                <CardDescription>Team skills and expertise coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Skill coverage chart will be implemented in the next phase
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Total revenue for selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$192,500</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">18.7%</span>
                  <span className="text-muted-foreground ml-1">from previous period</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>Total expenses for selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$84,320</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">12.4%</span>
                  <span className="text-muted-foreground ml-1">from previous period</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profit</CardTitle>
                <CardDescription>Net profit for selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$108,180</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">24.2%</span>
                  <span className="text-muted-foreground ml-1">from previous period</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by service category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Revenue breakdown chart will be implemented in the next phase
              </div>
              
              <div className="space-y-4 mt-4">
                {revenueData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{category.category}</h4>
                      <p className="text-sm text-muted-foreground">${formatNumber(category.amount)}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden mr-2">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm">{category.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Monthly revenue chart will be implemented in the next phase
                </div>
                
                <div className="space-y-2 mt-4">
                  {revenueData.monthly.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{month.month}</span>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden mr-2">
                          <div 
                            className="h-full bg-primary"
                            style={{ 
                              width: `${(month.amount / Math.max(...revenueData.monthly.map(m => m.amount))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm">${formatNumber(month.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Client Satisfaction</CardTitle>
                <CardDescription>Feedback scores from clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <div className="text-5xl font-bold mb-2">{clientSatisfaction.overall}</div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-6 w-6 ${
                          star <= Math.floor(clientSatisfaction.overall)
                            ? 'text-yellow-400 fill-yellow-400'
                            : star - Math.floor(clientSatisfaction.overall) <= 0.5
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 fill-gray-300'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {clientSatisfaction.responses} client responses
                  </p>
                </div>
                
                <div className="space-y-4">
                  {clientSatisfaction.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{category.category}</span>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.floor(category.score)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : star - Math.floor(category.score) <= 0.5
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 fill-gray-300'
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm">{category.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
