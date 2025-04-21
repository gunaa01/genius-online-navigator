
import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Megaphone, 
  Search,
  Facebook,
  Instagram,
  Image,
  PenSquare,
  BarChart2,
  Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const adCampaigns = [
  {
    id: 1,
    name: "Summer Sale Promotion",
    status: "active",
    platform: "facebook",
    budget: 500,
    spent: 213.45,
    impressions: 15420,
    clicks: 382,
    ctr: 2.48,
    startDate: "2025-04-01",
    endDate: "2025-04-30"
  },
  {
    id: 2,
    name: "New Product Launch",
    status: "active",
    platform: "instagram",
    budget: 1000,
    spent: 456.78,
    impressions: 23150,
    clicks: 578,
    ctr: 2.5,
    startDate: "2025-04-05",
    endDate: "2025-05-05"
  },
  {
    id: 3,
    name: "Brand Awareness",
    status: "paused",
    platform: "facebook",
    budget: 300,
    spent: 120.55,
    impressions: 8720,
    clicks: 145,
    ctr: 1.66,
    startDate: "2025-03-15",
    endDate: "2025-04-15"
  },
  {
    id: 4,
    name: "Retargeting Campaign",
    status: "completed",
    platform: "instagram",
    budget: 250,
    spent: 250,
    impressions: 12350,
    clicks: 325,
    ctr: 2.63,
    startDate: "2025-03-01",
    endDate: "2025-03-31"
  }
];

const performanceData = [
  { name: 'Apr 1', clicks: 45, impressions: 1200, cost: 32 },
  { name: 'Apr 2', clicks: 52, impressions: 1350, cost: 38 },
  { name: 'Apr 3', clicks: 48, impressions: 1280, cost: 35 },
  { name: 'Apr 4', clicks: 61, impressions: 1450, cost: 42 },
  { name: 'Apr 5', clicks: 55, impressions: 1400, cost: 40 },
  { name: 'Apr 6', clicks: 67, impressions: 1500, cost: 45 },
  { name: 'Apr 7', clicks: 70, impressions: 1550, cost: 48 },
];

const AdCampaigns = () => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />;
      default:
        return <Megaphone className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "paused":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Paused</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Ad Campaigns</h1>
            <p className="text-muted-foreground">Manage and monitor your advertising campaigns</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-primary/10 p-2 rounded-md">
                  <Megaphone className="h-5 w-5 text-primary" />
                </span>
                <div className="flex items-center text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Active Campaigns
                </h3>
                <p className="text-2xl font-bold">2</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-primary/10 p-2 rounded-md">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </span>
                <div className="flex items-center text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+8%</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Impressions
                </h3>
                <p className="text-2xl font-bold">59,640</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-primary/10 p-2 rounded-md">
                  <PenSquare className="h-5 w-5 text-primary" />
                </span>
                <div className="flex items-center text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+15%</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Clicks
                </h3>
                <p className="text-2xl font-bold">1,430</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-primary/10 p-2 rounded-md">
                  <Image className="h-5 w-5 text-primary" />
                </span>
                <div className="flex items-center text-red-500">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">-3%</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Average CTR
                </h3>
                <p className="text-2xl font-bold">2.4%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="creative">Creative Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Ad Campaigns</CardTitle>
                <CardDescription>
                  Manage your current advertising campaigns across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-10 bg-secondary/50 p-3 font-medium text-sm">
                    <div className="col-span-3">Campaign Name</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1">Platform</div>
                    <div className="col-span-2">Budget</div>
                    <div className="col-span-2">Performance</div>
                    <div className="col-span-1"></div>
                  </div>
                  {adCampaigns.map((campaign) => (
                    <div key={campaign.id} className="grid grid-cols-10 py-4 px-3 border-t items-center">
                      <div className="col-span-3">
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-span-1 text-center">{getStatusBadge(campaign.status)}</div>
                      <div className="col-span-1">{getPlatformIcon(campaign.platform)}</div>
                      <div className="col-span-2">
                        <p className="font-medium">${campaign.budget}</p>
                        <div className="flex items-center mt-1">
                          <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                          <span className="ml-2 text-xs text-muted-foreground">
                            ${campaign.spent.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>CTR: {campaign.ctr}%</span>
                          <span className="text-muted-foreground">{campaign.clicks} clicks</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.impressions.toLocaleString()} impressions
                        </div>
                      </div>
                      <div className="col-span-1 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-6">
                <Button variant="outline">View All Campaigns</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Campaign Performance</CardTitle>
                <CardDescription>
                  Track the performance of your advertising campaigns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line yAxisId="left" type="monotone" dataKey="cost" stroke="#82ca9d" />
                      <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#8884d8] mr-2"></div>
                    <span className="text-sm">Clicks</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#82ca9d] mr-2"></div>
                    <span className="text-sm">Cost ($)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#ff7300] mr-2"></div>
                    <span className="text-sm">Impressions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Audience Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Audience demographics and targeting information will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creative">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Creative Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Ad creative assets and management will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdCampaigns;
