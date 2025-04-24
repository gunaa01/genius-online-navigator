import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Loader2,
  BarChart3,
  LineChart,
  PieChart,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Share2,
  ThumbsUp,
  Users,
  Eye,
  ArrowUpRight
} from "lucide-react";
import RealTimeMetricsCard from './RealTimeMetricsCard';

// Mock social media platform data
const socialPlatforms = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: <Instagram className="h-4 w-4" />, 
    color: 'text-pink-500',
    followers: 12480,
    previousFollowers: 11950,
    engagement: 3.8,
    previousEngagement: 3.4,
    posts: 87,
    avgLikes: 342,
    avgComments: 28,
    topPost: {
      image: 'https://source.unsplash.com/random/800x800?sig=1',
      likes: 872,
      comments: 64,
      shares: 32
    }
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: <Facebook className="h-4 w-4" />, 
    color: 'text-blue-600',
    followers: 28750,
    previousFollowers: 28340,
    engagement: 1.6,
    previousEngagement: 1.5,
    posts: 65,
    avgLikes: 178,
    avgComments: 14,
    topPost: {
      image: 'https://source.unsplash.com/random/800x600?sig=2',
      likes: 543,
      comments: 37,
      shares: 128
    }
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: <Twitter className="h-4 w-4" />, 
    color: 'text-blue-400',
    followers: 9240,
    previousFollowers: 8760,
    engagement: 2.2,
    previousEngagement: 2.0,
    posts: 124,
    avgLikes: 56,
    avgComments: 8,
    topPost: {
      image: 'https://source.unsplash.com/random/800x450?sig=3',
      likes: 267,
      comments: 34,
      shares: 178
    }
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: <Linkedin className="h-4 w-4" />, 
    color: 'text-blue-700',
    followers: 16450,
    previousFollowers: 15780,
    engagement: 1.9,
    previousEngagement: 1.7,
    posts: 42,
    avgLikes: 124,
    avgComments: 18,
    topPost: {
      image: 'https://source.unsplash.com/random/800x500?sig=4',
      likes: 312,
      comments: 47,
      shares: 86
    }
  }
];

// Mock post performance data
const postPerformance = [
  { 
    id: 1, 
    platform: 'instagram',
    date: '2023-06-15',
    content: 'Our new feature launch is just around the corner! #excited #innovation',
    image: 'https://source.unsplash.com/random/800x800?sig=5',
    likes: 872,
    comments: 64,
    shares: 32,
    impressions: 12540,
    engagement: 7.7
  },
  { 
    id: 2, 
    platform: 'facebook',
    date: '2023-06-10',
    content: 'We're thrilled to announce our partnership with XYZ Corp to bring you even better service!',
    image: 'https://source.unsplash.com/random/800x600?sig=6',
    likes: 543,
    comments: 37,
    shares: 128,
    impressions: 8760,
    engagement: 8.1
  },
  { 
    id: 3, 
    platform: 'twitter',
    date: '2023-06-05',
    content: 'What features would you like to see in our next update? Reply with your suggestions!',
    image: null,
    likes: 267,
    comments: 56,
    shares: 178,
    impressions: 15420,
    engagement: 3.3
  },
  { 
    id: 4, 
    platform: 'linkedin',
    date: '2023-05-28',
    content: 'We're hiring! Check out our latest job openings and join our growing team of professionals.',
    image: 'https://source.unsplash.com/random/800x500?sig=7',
    likes: 312,
    comments: 47,
    shares: 86,
    impressions: 6240,
    engagement: 7.1
  },
  { 
    id: 5, 
    platform: 'instagram',
    date: '2023-05-22',
    content: 'Behind the scenes at our company retreat. Building team spirit and having fun! #teambuilding',
    image: 'https://source.unsplash.com/random/800x800?sig=8',
    likes: 654,
    comments: 42,
    shares: 18,
    impressions: 8920,
    engagement: 8.0
  }
];

interface SocialMediaDashboardProps {
  enableRealTime?: boolean;
}

export default function SocialMediaDashboard({
  enableRealTime = false
}: SocialMediaDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState("30days");
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };
  
  // Calculate totals
  const totalFollowers = socialPlatforms.reduce((sum, platform) => sum + platform.followers, 0);
  const totalPreviousFollowers = socialPlatforms.reduce((sum, platform) => sum + platform.previousFollowers, 0);
  
  const filteredPosts = activePlatform 
    ? postPerformance.filter(post => post.platform === activePlatform)
    : postPerformance;
    
  // Calculate averages for all platforms
  const avgEngagement = socialPlatforms.reduce((sum, platform) => sum + platform.engagement, 0) / socialPlatforms.length;
  const avgPreviousEngagement = socialPlatforms.reduce((sum, platform) => sum + platform.previousEngagement, 0) / socialPlatforms.length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Media Analytics</h2>
          <p className="text-muted-foreground">
            Track performance and engagement across your social networks
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealTimeMetricsCard
          title="Total Followers"
          metric={totalFollowers}
          previousMetric={totalPreviousFollowers}
          isLive={enableRealTime}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return totalFollowers * (0.998 + Math.random() * 0.005);
          }}
        />
        
        <RealTimeMetricsCard
          title="Avg. Engagement Rate"
          metric={avgEngagement}
          previousMetric={avgPreviousEngagement}
          format="percentage"
          precision={1}
          suffix="%"
          isLive={enableRealTime}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return avgEngagement * (0.97 + Math.random() * 0.06);
          }}
        />
        
        <RealTimeMetricsCard
          title="Posts This Month"
          metric={42}
          previousMetric={38}
          isLive={enableRealTime}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 42 + Math.floor(Math.random() * 3);
          }}
        />
        
        <RealTimeMetricsCard
          title="Total Reach"
          metric={238450}
          previousMetric={215680}
          isLive={enableRealTime}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 238450 * (0.98 + Math.random() * 0.04);
          }}
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center">
            <Share2 className="mr-2 h-4 w-4" />
            Platforms
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Audience
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance Comparison</CardTitle>
              <CardDescription>
                Key metrics across all social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th className="px-4 py-3">Platform</th>
                      <th className="px-4 py-3 text-right">Followers</th>
                      <th className="px-4 py-3 text-right">Growth</th>
                      <th className="px-4 py-3 text-right">Engagement</th>
                      <th className="px-4 py-3 text-right">Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialPlatforms.map((platform) => {
                      const followerGrowth = ((platform.followers - platform.previousFollowers) / platform.previousFollowers) * 100;
                      
                      return (
                        <tr key={platform.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium flex items-center">
                            <span className={`mr-2 ${platform.color}`}>
                              {platform.icon}
                            </span>
                            {platform.name}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {platform.followers.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-green-500">
                              +{followerGrowth.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {platform.engagement.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-right">
                            {platform.posts}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Follower Distribution</h3>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Chart coming soon</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Engagement Trends</h3>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Chart coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platforms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform) => (
              <Card key={platform.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <span className={`mr-2 ${platform.color}`}>
                      {platform.icon}
                    </span>
                    {platform.name}
                  </CardTitle>
                  <CardDescription>
                    {platform.followers.toLocaleString()} followers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="text-sm font-medium">{platform.engagement.toFixed(1)}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Posts</p>
                      <p className="text-sm font-medium">{platform.posts}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Avg. Likes</p>
                      <p className="text-sm font-medium">{platform.avgLikes}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Top Performing Post</p>
                    <div className="flex space-x-3">
                      <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={platform.topPost.image} 
                          alt="Top post" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <ThumbsUp className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm font-medium">{platform.topPost.likes}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Likes</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm font-medium">{platform.topPost.comments}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Comments</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <Share2 className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm font-medium">{platform.topPost.shares}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Shares</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Post Performance</CardTitle>
              <CardDescription>
                Track engagement metrics for your social media posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={activePlatform === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActivePlatform(null)}
                  className="flex items-center"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  All Platforms
                </Button>
                
                {socialPlatforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant={activePlatform === platform.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePlatform(platform.id)}
                    className="flex items-center"
                  >
                    <span className={`mr-2 ${platform.color}`}>
                      {platform.icon}
                    </span>
                    {platform.name}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-4">
                {filteredPosts.map((post) => {
                  const platform = socialPlatforms.find(p => p.id === post.platform);
                  
                  return (
                    <div key={post.id} className="flex border rounded-md overflow-hidden">
                      {post.image && (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted flex-shrink-0">
                          <img 
                            src={post.image} 
                            alt="Post" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 p-4">
                        <div className="flex items-center mb-2">
                          <span className={`mr-2 ${platform?.color}`}>
                            {platform?.icon}
                          </span>
                          <span className="text-sm text-muted-foreground">{platform?.name} • {post.date}</span>
                        </div>
                        
                        <p className="text-sm line-clamp-2 mb-3">{post.content}</p>
                        
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div>
                            <div className="flex items-center justify-center">
                              <Eye className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm font-medium">{post.impressions.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Impressions</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-center">
                              <ThumbsUp className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm font-medium">{post.likes}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Likes</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-center">
                              <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm font-medium">{post.comments}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Comments</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-center">
                              <Share2 className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm font-medium">{post.shares}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Shares</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex flex-col justify-center items-center border-l p-4">
                        <div className="text-2xl font-bold">{post.engagement.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                        <Button variant="ghost" size="sm" className="mt-2">
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="sr-only">View post</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>
                Understand who follows and engages with your social accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Audience Insights Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're working on detailed audience demographics, geographic distribution,
                    age groups, and interests across all your social platforms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 