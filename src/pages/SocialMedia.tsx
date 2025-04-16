
import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useDemoData } from "@/hooks/useDemoData";
import { 
  Twitter, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Calendar,
  Image,
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const SocialMedia = () => {
  const { socialAccounts, loading } = useDemoData();

  const scheduledPosts = [
    {
      id: 1,
      content: "Excited to announce our summer sale! Get 25% off all products until the end of the month. #summersale #discount",
      image: "/placeholder.svg",
      scheduledDate: "2025-04-20T14:00:00",
      platforms: ["twitter", "facebook", "instagram"]
    },
    {
      id: 2,
      content: "Check out our newest blog post on '10 Tips for Digital Marketing Success' - link in bio!",
      image: null,
      scheduledDate: "2025-04-22T10:00:00",
      platforms: ["twitter", "linkedin"]
    },
    {
      id: 3,
      content: "Meet our team! We're dedicated to providing the best service for your business growth needs.",
      image: "/placeholder.svg",
      scheduledDate: "2025-04-25T16:30:00",
      platforms: ["instagram", "facebook", "linkedin"]
    }
  ];

  const recentPosts = [
    {
      id: 1,
      content: "We've just updated our website with new features! Check it out and let us know what you think.",
      platform: "facebook",
      date: "2025-04-15T09:00:00",
      engagement: {
        likes: 45,
        comments: 12,
        shares: 8
      }
    },
    {
      id: 2,
      content: "Our team is growing! We're looking for talented individuals to join us. See open positions on our website.",
      platform: "linkedin",
      date: "2025-04-14T14:30:00",
      engagement: {
        likes: 62,
        comments: 8,
        shares: 15
      }
    },
    {
      id: 3,
      content: "Spring is here and so are our new products! #newcollection #spring2025",
      platform: "instagram",
      date: "2025-04-12T11:15:00",
      engagement: {
        likes: 128,
        comments: 24,
        shares: 5
      }
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700" />;
      default:
        return <Share2 className="h-5 w-5" />;
    }
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Social Media</h1>
            <p className="text-muted-foreground">Manage your social media accounts and content</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> View Calendar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {socialAccounts.map((account) => (
            <Card key={account.id} className="card-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-3">
                      {getPlatformIcon(account.platform)}
                    </div>
                    <div>
                      <p className="font-medium">{getPlatformName(account.platform)}</p>
                      <p className="text-xs text-muted-foreground">{account.username}</p>
                    </div>
                  </div>
                  <Switch checked={account.connected} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Followers</span>
                    <span className="text-sm font-medium">{account.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Posts This Month</span>
                    <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Engagement Rate</span>
                    <span className="text-sm font-medium">{(Math.random() * 5 + 1).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="ghost" size="sm" className="w-full">
                  View Analytics
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Card className="card-shadow border-dashed">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-3">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <p className="font-medium mb-1">Connect New Account</p>
              <p className="text-xs text-muted-foreground mb-4">Add more social platforms to your Genius dashboard</p>
              <Button variant="outline" size="sm">
                Connect Platform
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="analytics">Post Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="compose">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Write content to share across your social platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Textarea 
                    placeholder="What would you like to share?" 
                    className="resize-none min-h-28"
                  />
                  
                  <div className="flex flex-wrap gap-3 justify-start">
                    <Button variant="outline" className="flex gap-2">
                      <Image className="h-4 w-4" />
                      Add Image
                    </Button>
                    <Button variant="outline" className="flex gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </Button>
                    <Button variant="outline" className="flex gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Suggestions
                    </Button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Post to:</h4>
                    <div className="flex flex-wrap gap-3">
                      {socialAccounts
                        .filter(account => account.connected)
                        .map((account) => (
                          <div key={account.id} className="flex items-center gap-2 p-2 border rounded-md">
                            {getPlatformIcon(account.platform)}
                            <span className="text-sm">{getPlatformName(account.platform)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button>Publish Now</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Upcoming Posts</h3>
              
              {scheduledPosts.map((post) => (
                <Card key={post.id} className="card-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm font-medium">
                          Scheduled for {formatDate(post.scheduledDate)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {post.platforms.map((platform) => (
                          <div key={platform} className="h-6 w-6">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{post.content}</p>
                    {post.image && (
                      <div className="w-full h-48 bg-secondary/50 rounded-md flex items-center justify-center overflow-hidden">
                        <img src={post.image} alt="Post preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Cancel</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="published">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Recent Posts</h3>
              
              {recentPosts.map((post) => (
                <Card key={post.id} className="card-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {getPlatformIcon(post.platform)}
                        <span className="text-sm font-medium ml-2">
                          {getPlatformName(post.platform)}
                        </span>
                        <Badge variant="outline" className="ml-3 text-xs">
                          {formatDate(post.date)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{post.content}</p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.engagement.likes} Likes
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post.engagement.comments} Comments
                      </div>
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1" />
                        {post.engagement.shares} Shares
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="sm">View Post</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Post Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed post analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SocialMedia;
