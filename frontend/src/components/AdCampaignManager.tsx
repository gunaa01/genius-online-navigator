import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { 
  BarChart, 
  LineChart, 
  PieChart,
  Calendar, 
  CreditCard, 
  DollarSign, 
  Users, 
  BarChart3, 
  TrendingUp,
  Target,
  Megaphone,
  Settings
} from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

// Types for campaign data
interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  platforms: string[];
  audience: {
    age: [number, number];
    locations: string[];
    interests: string[];
  };
  creatives: {
    id: string;
    type: 'image' | 'video' | 'text';
    content: string;
    title?: string;
    description?: string;
  }[];
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
}

// Mock data for demonstration
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2025',
    status: 'active',
    budget: 5000,
    spent: 2340,
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    platforms: ['facebook', 'instagram'],
    audience: {
      age: [18, 35],
      locations: ['New York', 'Los Angeles', 'Chicago'],
      interests: ['Fashion', 'Shopping', 'Summer'],
    },
    creatives: [
      {
        id: 'c1',
        type: 'image',
        content: 'https://example.com/summer-sale.jpg',
        title: 'Summer Sale 50% Off',
        description: 'Get your summer essentials at half price!',
      },
    ],
    performance: {
      impressions: 45000,
      clicks: 3200,
      conversions: 120,
      ctr: 7.11,
      cpc: 0.73,
      roas: 3.2,
    },
  },
  {
    id: '2',
    name: 'Product Launch',
    status: 'draft',
    budget: 10000,
    spent: 0,
    startDate: '2025-07-15',
    endDate: '2025-08-15',
    platforms: ['facebook', 'google', 'twitter'],
    audience: {
      age: [25, 45],
      locations: ['Global'],
      interests: ['Technology', 'Innovation', 'Gadgets'],
    },
    creatives: [
      {
        id: 'c2',
        type: 'video',
        content: 'https://example.com/product-launch.mp4',
        title: 'Introducing Our New Product',
        description: 'The next generation of innovation is here.',
      },
    ],
  },
];

/**
 * AdCampaignManager component for creating, managing, and analyzing ad campaigns
 * across multiple platforms with performance tracking and optimization suggestions.
 */
const AdCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: '',
    status: 'draft',
    budget: 1000,
    platforms: [],
    audience: {
      age: [18, 65],
      locations: [],
      interests: [],
    },
    creatives: [],
  });

  // Fetch campaigns data from API
  useEffect(() => {
    // In a real application, this would be an API call
    // Example: fetchCampaigns().then(data => setCampaigns(data));
    console.log('Campaigns loaded');
  }, []);

  // Calculate total budget and spent
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  
  // Calculate total performance metrics
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + (campaign.performance?.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + (campaign.performance?.clicks || 0), 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + (campaign.performance?.conversions || 0), 0);
  
  // Average CTR and CPC
  const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPC = totalClicks > 0 ? totalSpent / totalClicks : 0;

  const handleCreateCampaign = () => {
    // In a real application, this would be an API call
    const newCampaignWithId = {
      ...newCampaign,
      id: `campaign-${Date.now()}`,
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    } as Campaign;
    
    setCampaigns([...campaigns, newCampaignWithId]);
    setIsCreatingCampaign(false);
    setNewCampaign({
      name: '',
      status: 'draft',
      budget: 1000,
      platforms: [],
      audience: {
        age: [18, 65],
        locations: [],
        interests: [],
      },
      creatives: [],
    });
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Ad Campaign Manager</h1>
          <Button 
            onClick={() => setIsCreatingCampaign(true)}
            disabled={isCreatingCampaign}
          >
            <Megaphone className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <Target className="mr-2 h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    ${totalSpent.toLocaleString()} spent ({Math.round((totalSpent / totalBudget) * 100)}%)
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{campaigns.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {campaigns.filter(c => c.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalClicks.toLocaleString()} clicks ({avgCTR.toFixed(2)}% CTR)
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    ${avgCPC.toFixed(2)} avg. CPC
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  View performance metrics across all campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Performance chart will be displayed here</p>
                  {/* In a real implementation, this would be a chart component */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            {isCreatingCampaign ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Campaign</CardTitle>
                  <CardDescription>
                    Fill in the details to create a new advertising campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input 
                        id="campaign-name" 
                        placeholder="Enter campaign name"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-budget">Budget ($)</Label>
                      <Input 
                        id="campaign-budget" 
                        type="number"
                        placeholder="1000"
                        value={newCampaign.budget}
                        onChange={(e) => setNewCampaign({...newCampaign, budget: Number(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-platform">Platforms</Label>
                      <Select 
                        onValueChange={(value) => setNewCampaign({
                          ...newCampaign, 
                          platforms: [...(newCampaign.platforms || []), value]
                        })}
                      >
                        <SelectTrigger id="campaign-platform">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="google">Google Ads</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Target Age Range</Label>
                      <div className="pt-4">
                        <Slider 
                          defaultValue={[18, 65]} 
                          max={80} 
                          min={13} 
                          step={1}
                          onValueChange={(value) => setNewCampaign({
                            ...newCampaign, 
                            audience: {...(newCampaign.audience || {}), age: value as [number, number]}
                          })}
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-sm">{newCampaign.audience?.age?.[0] || 18}</span>
                          <span className="text-sm">{newCampaign.audience?.age?.[1] || 65}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="campaign-interests">Interests (comma separated)</Label>
                    <Textarea 
                      id="campaign-interests" 
                      placeholder="Fashion, Technology, Sports..."
                      onChange={(e) => setNewCampaign({
                        ...newCampaign, 
                        audience: {
                          ...(newCampaign.audience || {}), 
                          interests: e.target.value.split(',').map(i => i.trim())
                        }
                      })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsCreatingCampaign(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCampaign} disabled={!newCampaign.name}>
                    Create Campaign
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{campaign.name}</CardTitle>
                          <CardDescription>
                            {campaign.startDate} to {campaign.endDate}
                          </CardDescription>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium">Budget</p>
                          <p className="text-lg">${campaign.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Spent</p>
                          <p className="text-lg">${campaign.spent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Platforms</p>
                          <p className="text-lg">{campaign.platforms.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Performance</p>
                          <p className="text-lg">
                            {campaign.performance ? 
                              `${campaign.performance.ctr.toFixed(2)}% CTR` : 
                              'No data yet'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCampaign(campaign)}
                        >
                          View Details
                        </Button>
                        {campaign.status === 'active' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setCampaigns(campaigns.map(c => 
                                c.id === campaign.id ? {...c, status: 'paused'} : c
                              ));
                            }}
                          >
                            Pause
                          </Button>
                        ) : campaign.status === 'paused' || campaign.status === 'draft' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setCampaigns(campaigns.map(c => 
                                c.id === campaign.id ? {...c, status: 'active'} : c
                              ));
                            }}
                          >
                            Activate
                          </Button>
                        ) : null}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed metrics and insights across all campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Performance by Platform</h3>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Platform performance chart will be displayed here</p>
                      {/* In a real implementation, this would be a chart component */}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Audience Insights</h3>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Audience insights chart will be displayed here</p>
                      {/* In a real implementation, this would be a chart component */}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Conversion Funnel</h3>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Conversion funnel chart will be displayed here</p>
                      {/* In a real implementation, this would be a chart component */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ad Campaign Settings</CardTitle>
                <CardDescription>
                  Configure global settings for all campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-optimization">Automatic Campaign Optimization</Label>
                    <Switch id="auto-optimization" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically adjust bids and targeting based on performance
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="budget-alerts">Budget Alerts</Label>
                    <Switch id="budget-alerts" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when campaigns reach budget thresholds
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="performance-reports">Weekly Performance Reports</Label>
                    <Switch id="performance-reports" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly email reports with campaign performance metrics
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-budget">Default Campaign Budget</Label>
                  <Input id="default-budget" type="number" defaultValue={1000} />
                  <p className="text-sm text-muted-foreground">
                    Default budget for new campaigns in USD
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-integration">API Integrations</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="api-integration">
                      <SelectValue placeholder="Select platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="facebook">Facebook Only</SelectItem>
                      <SelectItem value="google">Google Only</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Configure which platforms to integrate with
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Campaign Detail Modal would be implemented here */}
      </div>
    </ErrorBoundary>
  );
};

export default AdCampaignManager;
