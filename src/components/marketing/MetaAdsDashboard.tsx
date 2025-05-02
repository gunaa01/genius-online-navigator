
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  BarChart3, 
  PieChart, 
  DollarSign, 
  Users, 
  MousePointer, 
  TrendingUp, 
  ChevronDown, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2,
  Calendar
} from 'lucide-react';

import { MetaAdsService, MetaCampaign, CampaignStatus } from '@/services/metaAdsService';

const MetaAdsDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<MetaCampaign | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  useEffect(() => {
    // Initialize the Meta Ads Service
    const metaAdsService = MetaAdsService.getInstance();
    
    // In a real app, we'd get these from environment variables or user input
    metaAdsService.init('mock_access_token', 'act_12345678');
    
    // Fetch campaigns
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const metaAdsService = MetaAdsService.getInstance();
      const campaignData = await metaAdsService.getCampaigns();
      setCampaigns(campaignData);
    } catch (error) {
      console.error('Error fetching Meta campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = statusFilter === 'ALL' || campaign.status === statusFilter;
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const calculateTotalSpend = () => {
    return campaigns.reduce((total, campaign) => {
      return total + (campaign.insights?.spend || 0);
    }, 0);
  };

  const calculateTotalImpressions = () => {
    return campaigns.reduce((total, campaign) => {
      return total + (campaign.insights?.impressions || 0);
    }, 0);
  };

  const calculateTotalClicks = () => {
    return campaigns.reduce((total, campaign) => {
      return total + (campaign.insights?.clicks || 0);
    }, 0);
  };

  const calculateAverageCTR = () => {
    const activeCampaigns = campaigns.filter(c => c.insights?.impressions && c.insights.clicks);
    if (activeCampaigns.length === 0) return 0;
    
    const totalClicks = activeCampaigns.reduce((sum, c) => sum + (c.insights?.clicks || 0), 0);
    const totalImpressions = activeCampaigns.reduce((sum, c) => sum + (c.insights?.impressions || 0), 0);
    
    return totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Meta Ads Manager</h1>
          <p className="text-muted-foreground">
            Manage and monitor your Facebook and Instagram ad campaigns
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
          <Button variant="outline" onClick={fetchCampaigns}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <TrendingUp className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <PieChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Ad Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${calculateTotalSpend().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Across all campaigns</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateTotalImpressions().toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Views of your ads</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateTotalClicks().toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Ad interactions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateAverageCTR().toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">Click-through rate</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Spend and results across all active campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Campaign performance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search campaigns..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as CampaignStatus | 'ALL')}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Campaigns</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">{campaign.name}</CardTitle>
                        <CardDescription>
                          ID: {campaign.id} • {campaign.objective}
                        </CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                        campaign.status === 'ARCHIVED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Budget</p>
                        <p className="text-lg">
                          {campaign.dailyBudget ? `$${campaign.dailyBudget}/day` : 
                           campaign.lifetimeBudget ? `$${campaign.lifetimeBudget} total` : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-lg">
                          {campaign.startDate} 
                          {campaign.endDate ? ` - ${campaign.endDate}` : ' (ongoing)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Results</p>
                        <p className="text-lg">{campaign.insights?.clicks.toLocaleString() || '0'} clicks</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Spend</p>
                        <p className="text-lg">${campaign.insights?.spend.toFixed(2) || '0.00'}</p>
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
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No campaigns found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics for your Meta ads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Performance Trends</h3>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Performance trends chart will be displayed here</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Audience Demographics</h3>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <PieChart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Audience demographics chart will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetaAdsDashboard;
