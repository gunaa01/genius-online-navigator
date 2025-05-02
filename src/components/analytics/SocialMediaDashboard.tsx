
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reachData = [
  { name: 'Jan', facebook: 4000, twitter: 2400, instagram: 2400 },
  { name: 'Feb', facebook: 3000, twitter: 1398, instagram: 2210 },
  { name: 'Mar', facebook: 2000, twitter: 9800, instagram: 2290 },
  { name: 'Apr', facebook: 2780, twitter: 3908, instagram: 2000 },
  { name: 'May', facebook: 1890, twitter: 4800, instagram: 2181 },
  { name: 'Jun', facebook: 2390, twitter: 3800, instagram: 2500 },
  { name: 'Jul', facebook: 3490, twitter: 4300, instagram: 2100 },
];

const engagementData = [
  { name: 'Jan', likes: 4000, comments: 2400, shares: 2400 },
  { name: 'Feb', likes: 3000, comments: 1398, shares: 2210 },
  { name: 'Mar', likes: 2000, comments: 9800, shares: 2290 },
  { name: 'Apr', likes: 2780, comments: 3908, shares: 2000 },
  { name: 'May', likes: 1890, comments: 4800, shares: 2181 },
  { name: 'Jun', likes: 2390, comments: 3800, shares: 2500 },
  { name: 'Jul', likes: 3490, comments: 4300, shares: 2100 },
];

const platformColors = {
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
};

const engagementColors = {
  likes: "#10B981",
  comments: "#6366F1",
  shares: "#F59E0B",
};

const SocialMediaDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState("90days");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Social Media Performance</h2>
        
        <div className="flex items-center space-x-2">
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142.8K</div>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">+5.2%</Badge>
              <span className="text-xs text-muted-foreground ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Post Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28.6K</div>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">+12.3%</Badge>
              <span className="text-xs text-muted-foreground ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.2%</div>
            <div className="flex items-center mt-2">
              <Badge variant="destructive">-0.8%</Badge>
              <span className="text-xs text-muted-foreground ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Reach by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={reachData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="facebook" stroke={platformColors.facebook} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="twitter" stroke={platformColors.twitter} />
                    <Line type="monotone" dataKey="instagram" stroke={platformColors.instagram} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={engagementData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="likes" fill={engagementColors.likes} />
                    <Bar dataKey="comments" fill={engagementColors.comments} />
                    <Bar dataKey="shares" fill={engagementColors.shares} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Analysis of your most engaging content will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMediaDashboard;
