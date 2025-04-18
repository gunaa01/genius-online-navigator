
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Calendar, Users, Target, TrendingUp, ArrowUpRight, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';

const CommunityMetrics = () => {
  const [timeframe, setTimeframe] = useState("month");

  // Sample data
  const engagementData = [
    { name: 'Week 1', posts: 25, comments: 45, events: 2 },
    { name: 'Week 2', posts: 35, comments: 52, events: 3 },
    { name: 'Week 3', posts: 45, comments: 70, events: 4 },
    { name: 'Week 4', posts: 60, comments: 95, events: 5 },
  ];

  const growthData = [
    { name: 'Jan', members: 120 },
    { name: 'Feb', members: 170 },
    { name: 'Mar', members: 210 },
    { name: 'Apr', members: 270 },
    { name: 'May', members: 350 },
    { name: 'Jun', members: 450 },
  ];

  const eventAttendanceData = [
    { name: 'Coffee Tasting', value: 35 },
    { name: 'Book Club', value: 20 },
    { name: 'Summer Festival', value: 125 },
    { name: 'Networking Mixer', value: 45 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const metricCards = [
    {
      title: "Active Members",
      value: "450",
      change: "+12%",
      period: "vs last month",
      icon: Users
    },
    {
      title: "Monthly Events",
      value: "24",
      change: "+8%",
      period: "vs last month",
      icon: Calendar
    },
    {
      title: "Engagement Rate",
      value: "28%",
      change: "+5%",
      period: "vs last month", 
      icon: Target
    },
    {
      title: "Conversion Rate",
      value: "18%",
      change: "+3%",
      period: "vs last month",
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Community Analytics</h2>
        <div className="flex items-center gap-3">
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                  {card.change}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="engagement" className="w-full">
        <TabsList>
          <TabsTrigger value="engagement">
            <BarChart className="h-4 w-4 mr-2" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="growth">
            <LineChart className="h-4 w-4 mr-2" />
            Growth
          </TabsTrigger>
          <TabsTrigger value="events">
            <PieChart className="h-4 w-4 mr-2" />
            Event Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Engagement</CardTitle>
              <CardDescription>
                Posts, comments, and events over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart
                    data={engagementData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" fill="#8884d8" name="Posts" />
                    <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
                    <Bar dataKey="events" fill="#ffc658" name="Events" />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Growth</CardTitle>
              <CardDescription>
                Community membership over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart
                    data={growthData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="members" stroke="#8884d8" activeDot={{ r: 8 }} name="Members" />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Attendance</CardTitle>
              <CardDescription>
                Attendance distribution by event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={eventAttendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {eventAttendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Success Metrics</CardTitle>
          <CardDescription>Track your community KPIs against targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pro-tier activations</span>
                  <span className="font-medium">18% / 30%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">60% of target: 30% of Pro-tier businesses</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>UGC posts</span>
                  <span className="font-medium">4.2 / 5</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '84%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">84% of target: 5+ posts per business monthly</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Event foot traffic</span>
                  <span className="font-medium">8% / 20%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">40% of target: 20% of foot traffic</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View Detailed Analytics</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CommunityMetrics;
