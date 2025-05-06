
import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';
import SocialMediaAutomation from '@/components/SocialMediaAutomation';

const SocialMedia = () => {
  const { socialAccounts = [], loading } = useDemoData() || {};

  // Ensure socialAccounts is always an array
  const ensuredAccounts = Array.isArray(socialAccounts) ? socialAccounts : [];

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

  const [accounts, setAccounts] = React.useState(ensuredAccounts);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showCreatePost, setShowCreatePost] = React.useState(false);
  const [showConnect, setShowConnect] = React.useState(false);
  const [postContent, setPostContent] = React.useState('');
  const [postImage, setPostImage] = React.useState(null);
  const [postPlatforms, setPostPlatforms] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState('');

  // Update accounts if socialAccounts changes
  useEffect(() => {
    if (Array.isArray(socialAccounts)) {
      setAccounts(socialAccounts);
    }
  }, [socialAccounts]);

  function handleViewAnalytics(account: any) {
    // Replace with navigation or modal as needed
    alert(`Viewing analytics for @${account.username}`);
  }

  function handleCreatePost() {
    setMessage('');
    // Simulate API call
    setTimeout(() => {
      setShowCreatePost(false);
      setMessage('Post created and scheduled!');
      setPostContent('');
      setPostImage(null);
      setPostPlatforms([]);
    }, 1200);
  }

  function handleConnectAccount() {
    setMessage('');
    setTimeout(() => {
      setShowConnect(false);
      setMessage('Account connected!');
    }, 1000);
  }

  function handleToggleAccount(id: string) {
    // Find the account to toggle
    const updated = accounts.find(acc => acc.id === id);
    if (!updated) return;

    // Optimistically update UI
    setAccounts(prev =>
      prev.map(acc =>
        acc.id === id ? { ...acc, connected: !acc.connected } : acc
      )
    );
    setMessage('Account connection toggled!');

    // Safe error handling for API call
    try {
      // Send request to backend
      axios.post(`http://localhost:8000/api/social-accounts/${id}/toggle`, {
        connected: !updated.connected
      })
        .then(() => setMessage('Account connection updated on server!'))
        .catch(() => {
          setMessage('Failed to update account on server.');
          // Optionally revert UI
          setAccounts(prev =>
            prev.map(acc =>
              acc.id === id ? { ...acc, connected: updated.connected } : acc
            )
          );
        });
    } catch (error) {
      console.error('Error toggling account:', error);
      setMessage('Error connecting to server.');
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Social Media</h1>
            <p className="text-muted-foreground">Manage your social media accounts and content</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCalendar(true)}>
              <Calendar className="mr-2 h-4 w-4" /> View Calendar
            </Button>
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </div>
        </header>

        <Tabs defaultValue="automation" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="automation">
            <SocialMediaAutomation />
          </TabsContent>

          <TabsContent value="accounts">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
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
                      <Switch checked={account.connected} onCheckedChange={() => handleToggleAccount(account.id)} />
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
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleViewAnalytics(account)}>
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
                  <Button variant="outline" size="sm" onClick={() => setShowConnect(true)}>
                    Connect Platform
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="card-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.5K</div>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                    <span>12% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                    <span>0.5% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Link Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,245</div>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                    <span>18% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                    <span>4 more than last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

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
        </Tabs>
      </div>
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-8 min-w-[340px]">
            <h2 className="text-lg font-bold mb-4">Calendar</h2>
            <p className="mb-4">(Calendar view goes here)</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowCalendar(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-8 min-w-[340px]">
            <h2 className="text-lg font-bold mb-4">Create Social Post</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Content</label>
              <Textarea className="w-full mb-2" value={postContent} onChange={e => setPostContent(e.target.value)} />
              <label className="block text-sm font-medium mb-1">Image (optional)</label>
              <input type="file" className="w-full mb-2" onChange={e => setPostImage(e.target.files[0])} />
              <label className="block text-sm font-medium mb-1">Platforms</label>
              <div className="flex gap-2 mb-2">
                {['twitter','facebook','instagram','linkedin'].map(p => (
                  <label key={p} className="flex items-center gap-1">
                    <input type="checkbox" checked={postPlatforms.includes(p)} onChange={e => {
                      setPostPlatforms(prev => e.target.checked ? [...prev, p] : prev.filter(x => x !== p));
                    }} /> {getPlatformName(p)}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>Cancel</Button>
              <Button onClick={handleCreatePost}>Create & Schedule</Button>
            </div>
          </div>
        </div>
      )}
      {showConnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-8 min-w-[340px]">
            <h2 className="text-lg font-bold mb-4">Connect New Account</h2>
            <p className="mb-4">(Social account connection form goes here)</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConnect(false)}>Cancel</Button>
              <Button onClick={handleConnectAccount}>Connect</Button>
            </div>
          </div>
        </div>
      )}
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-900 p-3 rounded shadow">{message}</div>
      )}
    </DashboardLayout>
  );
};

export default SocialMedia;
