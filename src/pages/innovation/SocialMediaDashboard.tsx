import { useState } from 'react';
import { 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Zap, 
  Share2, 
  Clock, 
  TrendingUp,
  Filter,
  Search,
  Plus,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Info,
  MoreHorizontal
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for social accounts
const socialAccounts = [
  { 
    id: 'account-1', 
    platform: 'instagram', 
    name: '@geniusnavigator', 
    followers: 5280, 
    engagement: 3.2, 
    connected: true,
    icon: <Instagram className="h-5 w-5" />,
    color: 'text-pink-500'
  },
  { 
    id: 'account-2', 
    platform: 'facebook', 
    name: 'Genius Navigator', 
    followers: 12450, 
    engagement: 1.8, 
    connected: true,
    icon: <Facebook className="h-5 w-5" />,
    color: 'text-blue-600'
  },
  { 
    id: 'account-3', 
    platform: 'twitter', 
    name: '@GeniusNav', 
    followers: 8320, 
    engagement: 2.5, 
    connected: true,
    icon: <Twitter className="h-5 w-5" />,
    color: 'text-blue-400'
  },
  { 
    id: 'account-4', 
    platform: 'linkedin', 
    name: 'Genius Online Navigator', 
    followers: 3450, 
    engagement: 4.1, 
    connected: true,
    icon: <Linkedin className="h-5 w-5" />,
    color: 'text-blue-700'
  },
  { 
    id: 'account-5', 
    platform: 'youtube', 
    name: 'Genius Navigator', 
    followers: 2200, 
    engagement: 5.3, 
    connected: false,
    icon: <Youtube className="h-5 w-5" />,
    color: 'text-red-600'
  }
];

// Mock data for scheduled posts
const scheduledPosts = [
  {
    id: 'post-1',
    title: 'New Feature Announcement',
    content: "We're excited to announce our new AI-powered project management features! Check out how it can save you hours of work every week.",
    platforms: ['instagram', 'facebook', 'twitter', 'linkedin'],
    scheduledFor: '2025-04-23T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop',
    status: 'scheduled'
  },
  {
    id: 'post-2',
    title: 'Client Success Story',
    content: 'See how @TechInnovators increased their project delivery speed by 40% using our platform! Full case study in bio.',
    platforms: ['instagram', 'linkedin'],
    scheduledFor: '2025-04-24T14:30:00Z',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop',
    status: 'scheduled'
  },
  {
    id: 'post-3',
    title: 'Weekly Tips & Tricks',
    content: 'Pro tip: Use our new template feature to save time on repetitive projects. Here\'s how to set it up in 3 easy steps...',
    platforms: ['facebook', 'twitter'],
    scheduledFor: '2025-04-25T09:15:00Z',
    status: 'draft'
  }
];

// Mock analytics data
const analyticsData = {
  followers: {
    total: 31700,
    growth: 5.2,
    platforms: {
      instagram: { count: 5280, growth: 3.8 },
      facebook: { count: 12450, growth: 2.1 },
      twitter: { count: 8320, growth: 6.5 },
      linkedin: { count: 3450, growth: 8.2 },
      youtube: { count: 2200, growth: 12.4 }
    }
  },
  engagement: {
    rate: 3.2,
    change: 0.7,
    byPlatform: {
      instagram: 3.2,
      facebook: 1.8,
      twitter: 2.5,
      linkedin: 4.1,
      youtube: 5.3
    }
  },
  posts: {
    total: 128,
    performance: [
      { platform: 'instagram', reach: 4200, engagement: 420, clicks: 85 },
      { platform: 'facebook', reach: 3800, engagement: 280, clicks: 62 },
      { platform: 'twitter', reach: 2900, engagement: 310, clicks: 48 },
      { platform: 'linkedin', reach: 1800, engagement: 220, clicks: 95 },
      { platform: 'youtube', reach: 1200, engagement: 180, clicks: 32 }
    ]
  }
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

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const SocialMediaDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Social Media Dashboard | Genius Online Navigator</title>
        <meta name="description" content="Manage all your social media accounts, schedule posts, and analyze performance." />
      </Helmet>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Social Media Dashboard</h1>
          <p className="text-muted-foreground">Manage all your social accounts, content, and analytics in one place</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Content Calendar
          </Button>
        </div>
      </div>
      
      {/* Alert */}
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>AI-Powered Insights Available</AlertTitle>
        <AlertDescription>
          Our AI has analyzed your social media performance and has 3 recommendations to improve engagement.
          <Button variant="link" className="p-0 h-auto">View Insights</Button>
        </AlertDescription>
      </Alert>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="schedule">Content Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Platform Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {socialAccounts.map(account => (
              <Card key={account.id} className={`${!account.connected && 'opacity-60'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className={`${account.color}`}>
                      {account.icon}
                    </div>
                    <Badge variant={account.connected ? "default" : "outline"}>
                      {account.connected ? "Connected" : "Connect"}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{account.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Followers</p>
                      <p className="text-xl font-bold">{formatNumber(account.followers)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Engagement</p>
                      <p className="text-xl font-bold">{account.engagement}%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="ghost" size="sm" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <p className="text-3xl font-bold">{formatNumber(analyticsData.followers.total)}</p>
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    +{analyticsData.followers.growth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Avg. Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <p className="text-3xl font-bold">{analyticsData.engagement.rate}%</p>
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    +{analyticsData.engagement.change}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <p className="text-3xl font-bold">{analyticsData.posts.total}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Posts */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Posts</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <CardDescription>Your next scheduled social media posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map(post => (
                  <div key={post.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    {post.image && (
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{post.title}</h4>
                        <Badge variant={post.status === 'scheduled' ? 'default' : 'outline'}>
                          {post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {post.platforms.map(platform => {
                            const accountInfo = socialAccounts.find(acc => acc.platform === platform);
                            return accountInfo ? (
                              <div key={platform} className={`${accountInfo.color}`}>
                                {accountInfo.icon}
                              </div>
                            ) : null;
                          })}
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(post.scheduledFor)}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Post
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={platformFilter}
                onValueChange={setPlatformFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>Manage your scheduled and draft posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                Calendar view will be implemented in the next phase
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map(post => (
                  <div key={post.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    {post.image && (
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{post.title}</h4>
                        <Badge variant={post.status === 'scheduled' ? 'default' : 'outline'}>
                          {post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {post.platforms.map(platform => {
                            const accountInfo = socialAccounts.find(acc => acc.platform === platform);
                            return accountInfo ? (
                              <div key={platform} className={`${accountInfo.color}`}>
                                {accountInfo.icon}
                              </div>
                            ) : null;
                          })}
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(post.scheduledFor)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Track your social media performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                Detailed analytics charts will be implemented in the next phase
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.followers.platforms).map(([platform, data]) => {
                    const accountInfo = socialAccounts.find(acc => acc.platform === platform);
                    return accountInfo ? (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`${accountInfo.color}`}>
                            {accountInfo.icon}
                          </div>
                          <span>{accountInfo.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formatNumber(data.count)}</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            +{data.growth}%
                          </Badge>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.engagement.byPlatform).map(([platform, rate]) => {
                    const accountInfo = socialAccounts.find(acc => acc.platform === platform);
                    return accountInfo ? (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`${accountInfo.color}`}>
                            {accountInfo.icon}
                          </div>
                          <span>{accountInfo.name}</span>
                        </div>
                        
                        <div>
                          <span className="font-medium">{rate}%</span>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Post Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="pb-2">Platform</th>
                      <th className="pb-2">Reach</th>
                      <th className="pb-2">Engagement</th>
                      <th className="pb-2">Clicks</th>
                      <th className="pb-2">Eng. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.posts.performance.map((data, index) => {
                      const accountInfo = socialAccounts.find(acc => acc.platform === data.platform);
                      const engRate = ((data.engagement / data.reach) * 100).toFixed(1);
                      
                      return accountInfo ? (
                        <tr key={index} className="border-t">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className={`${accountInfo.color}`}>
                                {accountInfo.icon}
                              </div>
                              <span>{accountInfo.name}</span>
                            </div>
                          </td>
                          <td className="py-3">{formatNumber(data.reach)}</td>
                          <td className="py-3">{formatNumber(data.engagement)}</td>
                          <td className="py-3">{formatNumber(data.clicks)}</td>
                          <td className="py-3">{engRate}%</td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your social media account connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialAccounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`${account.color} p-2 rounded-full bg-muted`}>
                        {account.icon}
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{account.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(account.followers)} followers
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={account.connected ? "default" : "outline"}>
                        {account.connected ? "Connected" : "Not Connected"}
                      </Badge>
                      
                      <Button variant="outline" size="sm">
                        {account.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Connect New Account
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Configure your social media preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                Account settings will be implemented in the next phase
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMediaDashboard;
