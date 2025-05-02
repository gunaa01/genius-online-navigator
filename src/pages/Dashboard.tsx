
import React from 'react';
import { Helmet } from 'react-helmet';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Share2,
  DollarSign,
  Calendar,
  ChevronRight,
  Bell,
  FileText,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard | Genius Online Navigator</title>
        <meta name="description" content="Marketing dashboard with key metrics and insights" />
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your marketing performance</p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Website Traffic</CardTitle>
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="ml-1 text-xs text-muted-foreground">Daily average</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,679</div>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-green-600 text-xs font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>12.5%</span>
              </div>
              <span className="text-xs text-muted-foreground ml-2">vs. previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="ml-1 text-xs text-muted-foreground">Form submissions</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-green-600 text-xs font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>8.2%</span>
              </div>
              <span className="text-xs text-muted-foreground ml-2">vs. previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Social Engagement</CardTitle>
            <div className="flex items-center">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="ml-1 text-xs text-muted-foreground">Likes, shares, comments</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,742</div>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-green-600 text-xs font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>16.8%</span>
              </div>
              <span className="text-xs text-muted-foreground ml-2">vs. previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ad Revenue</CardTitle>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="ml-1 text-xs text-muted-foreground">ROAS: 3.8x</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-red-600 text-xs font-medium">
                <TrendingDown className="h-3 w-3 mr-1" />
                <span>3.2%</span>
              </div>
              <span className="text-xs text-muted-foreground ml-2">vs. previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Marketing Performance</CardTitle>
            <CardDescription>
              Traffic and conversion trends over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border rounded-md">
            <div className="text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Performance chart will be displayed here</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Detailed Analytics</Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>
                Your marketing tasks due soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-medium">Social media posts</p>
                    <p className="text-xs text-muted-foreground">Due in 2 days</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </li>
                <li className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-medium">Email newsletter</p>
                    <p className="text-xs text-muted-foreground">Due tomorrow</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </li>
                <li className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-medium">Campaign report</p>
                    <p className="text-xs text-muted-foreground">Due in 5 days</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full">View All Tasks</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Recent alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-2 rounded-md">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ad campaign completed</p>
                    <p className="text-xs text-muted-foreground">Summer Sale campaign has ended</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-md">
                  <div className="bg-green-100 p-1 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Traffic spike detected</p>
                    <p className="text-xs text-muted-foreground">50% increase in the last hour</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-md">
                  <div className="bg-yellow-100 p-1 rounded-full">
                    <Users className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New leads generated</p>
                    <p className="text-xs text-muted-foreground">15 new leads from contact form</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full">View All Notifications</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>
              Your best performing blog posts and pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                <div>
                  <p className="font-medium">10 Digital Marketing Trends for 2025</p>
                  <div className="flex items-center mt-1">
                    <Eye className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">8,542 views</span>
                    <span className="text-xs text-muted-foreground mx-2">•</span>
                    <span className="text-xs text-green-600">4.8% conversion rate</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                <div>
                  <p className="font-medium">Guide to Social Media Marketing</p>
                  <div className="flex items-center mt-1">
                    <Eye className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">6,128 views</span>
                    <span className="text-xs text-muted-foreground mx-2">•</span>
                    <span className="text-xs text-green-600">3.9% conversion rate</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                <div>
                  <p className="font-medium">SEO Best Practices for 2025</p>
                  <div className="flex items-center mt-1">
                    <Eye className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">5,890 views</span>
                    <span className="text-xs text-muted-foreground mx-2">•</span>
                    <span className="text-xs text-green-600">5.2% conversion rate</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full">View Content Analytics</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Perform common marketing tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Create Blog Post
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Schedule Social Post
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Create Ad Campaign
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View Audience Insights
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Analytics Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
