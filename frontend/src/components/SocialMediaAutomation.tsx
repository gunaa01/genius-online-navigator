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
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import ErrorBoundary from './ErrorBoundary';
import { 
  Calendar,
  Clock,
  Share2,
  BarChart2,
  Settings,
  Plus,
  Trash2,
  Edit,
  Image,
  FileText,
  Video,
  Link,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Check,
  X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchPosts, 
  fetchAccounts, 
  createPost, 
  updatePost, 
  deletePost, 
  schedulePost, 
  publishPost, 
  connectAccount, 
  disconnectAccount,
  setSelectedPost,
  SocialPost,
  SocialAccount
} from '@/store/slices/socialMediaSlice';
import { toast } from 'sonner';

/**
 * SocialMediaAutomation component for scheduling, posting, and analyzing social media content
 * across multiple platforms with performance tracking and content suggestions.
 */
const SocialMediaAutomation: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    posts, 
    accounts: platforms, 
    selectedPost, 
    isLoading, 
    error 
  } = useAppSelector(state => state.socialMedia);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState<Partial<SocialPost>>({
    content: '',
    platforms: [],
    media: [],
    status: 'draft',
    scheduledDate: null,
    publishedDate: null,
    tags: []
  });

  // Fetch posts and platforms from API
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchAccounts());
  }, [dispatch]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle post creation
  const handleCreatePost = () => {
    if (!newPost.content || !newPost.platforms || newPost.platforms.length === 0) {
      toast.error('Please enter content and select at least one platform');
      return;
    }

    dispatch(createPost({
      content: newPost.content || '',
      platforms: newPost.platforms || [],
      media: newPost.media || [],
      scheduledDate: newPost.scheduledDate,
      publishedDate: null,
      status: newPost.scheduledDate ? 'scheduled' : 'draft',
      tags: newPost.tags || []
    } as any))
      .unwrap()
      .then(() => {
        setIsCreatingPost(false);
        setNewPost({
          content: '',
          platforms: [],
          media: [],
          status: 'draft',
          scheduledDate: null,
          publishedDate: null,
          tags: []
        });
        toast.success('Post created successfully');
      })
      .catch(() => {
        // Error is already handled by the useEffect above
      });
  };

  // Handle post deletion
  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id))
        .unwrap()
        .then(() => {
          toast.success('Post deleted successfully');
        });
    }
  };

  // Handle platform connection
  const handleTogglePlatform = (id: string, isConnected: boolean) => {
    if (isConnected) {
      dispatch(disconnectAccount(id))
        .unwrap()
        .then(() => {
          toast.success('Account disconnected successfully');
        });
    } else {
      const platform = platforms.find(p => p.id === id)?.platform;
      if (platform) {
        dispatch(connectAccount(platform))
          .unwrap()
          .then(() => {
            toast.success('Account connected successfully');
          });
      }
    }
  };

  // Handle scheduling a post
  const handleSchedulePost = (id: string, scheduledDate: string) => {
    dispatch(schedulePost({ id, scheduledDate }))
      .unwrap()
      .then(() => {
        toast.success('Post scheduled successfully');
      });
  };

  // Handle publishing a post immediately
  const handlePublishNow = (id: string) => {
    dispatch(publishPost(id))
      .unwrap()
      .then(() => {
        toast.success('Post published successfully');
      });
  };

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Social Media Automation</h1>
          <Button 
            onClick={() => setIsCreatingPost(true)}
            disabled={isCreatingPost}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="posts">
              <FileText className="mr-2 h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {isCreatingPost ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                  <CardDescription>
                    Compose your post and schedule it across multiple platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-content">Post Content</Label>
                    <Textarea 
                      id="post-content" 
                      placeholder="What would you like to share?"
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {newPost.content?.length || 0}/280 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Platforms</Label>
                    <div className="flex flex-wrap gap-2">
                      {platforms.filter(p => p.connected).map((platform) => (
                        <Button
                          key={platform.id}
                          variant={newPost.platforms?.includes(platform.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const currentPlatforms = newPost.platforms || [];
                            if (currentPlatforms.includes(platform.id)) {
                              setNewPost({
                                ...newPost,
                                platforms: currentPlatforms.filter(p => p !== platform.id)
                              });
                            } else {
                              setNewPost({
                                ...newPost,
                                platforms: [...currentPlatforms, platform.id]
                              });
                            }
                          }}
                        >
                          {platform.icon}
                          <span className="ml-2">{platform.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Media</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Image className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="mr-2 h-4 w-4" />
                        Add Video
                      </Button>
                      <Button variant="outline" size="sm">
                        <Link className="mr-2 h-4 w-4" />
                        Add Link
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="schedule-post">Schedule Post</Label>
                      <Switch 
                        id="schedule-post"
                        checked={!!newPost.scheduledDate}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Set default time to tomorrow at 9 AM
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            tomorrow.setHours(9, 0, 0, 0);
                            setNewPost({
                              ...newPost,
                              scheduledDate: tomorrow.toISOString()
                            });
                          } else {
                            setNewPost({
                              ...newPost,
                              scheduledDate: null
                            });
                          }
                        }}
                      />
                    </div>
                    
                    {newPost.scheduledDate && (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="schedule-date">Date</Label>
                          <Input 
                            id="schedule-date" 
                            type="date"
                            value={newPost.scheduledDate?.split('T')[0]}
                            onChange={(e) => {
                              const [_, time] = (newPost.scheduledDate || '').split('T');
                              setNewPost({
                                ...newPost,
                                scheduledDate: `${e.target.value}T${time || '09:00:00'}`
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="schedule-time">Time</Label>
                          <Input 
                            id="schedule-time" 
                            type="time"
                            value={newPost.scheduledDate?.split('T')[1]?.substring(0, 5) || '09:00'}
                            onChange={(e) => {
                              const [date, _] = (newPost.scheduledDate || '').split('T');
                              setNewPost({
                                ...newPost,
                                scheduledDate: `${date || new Date().toISOString().split('T')[0]}T${e.target.value}:00`
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsCreatingPost(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!newPost.content || !newPost.platforms?.length}
                  >
                    {newPost.scheduledDate ? 'Schedule Post' : 'Save Draft'}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                          {post.platforms.map(platformId => {
                            const platform = platforms.find(p => p.id === platformId);
                            return platform ? (
                              <div key={platformId} className="text-muted-foreground">
                                {platform.icon}
                              </div>
                            ) : null;
                          })}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          post.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm mb-2">{post.content}</p>
                      {post.media && post.media.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {post.media.map((url, index) => (
                            <div 
                              key={index}
                              className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden"
                            >
                              <Image className="h-6 w-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center mt-3 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(post.scheduledDate)}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => dispatch(setSelectedPost(post))}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {post.status !== 'published' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                        {post.status === 'published' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <BarChart2 className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>
                  View and manage your scheduled social media posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Calendar view will be displayed here</p>
                  {/* In a real implementation, this would be a calendar component */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Analytics</CardTitle>
                <CardDescription>
                  Track performance across all your social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
                    <p className="text-2xl font-bold">24.5K</p>
                    <p className="text-xs text-green-600">↑ 12% from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Engagements</p>
                    <p className="text-2xl font-bold">1.8K</p>
                    <p className="text-xs text-green-600">↑ 8% from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Link Clicks</p>
                    <p className="text-2xl font-bold">3.2K</p>
                    <p className="text-xs text-green-600">↑ 15% from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Followers</p>
                    <p className="text-2xl font-bold">12.4K</p>
                    <p className="text-xs text-green-600">↑ 5% from last month</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Performance by Platform</h3>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Platform performance chart will be displayed here</p>
                      {/* In a real implementation, this would be a chart component */}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Content Performance</h3>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Content performance chart will be displayed here</p>
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
                <CardTitle>Platform Connections</CardTitle>
                <CardDescription>
                  Connect and manage your social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <div className="mr-4 text-primary">
                          {platform.icon}
                        </div>
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {platform.connected 
                              ? `Connected as ${platform.accountName}` 
                              : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <div>
                        {platform.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTogglePlatform(platform.id, platform.connected)}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleTogglePlatform(platform.id, platform.connected)}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Posting Preferences</CardTitle>
                <CardDescription>
                  Configure your default posting settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-schedule">Auto-schedule posts</Label>
                    <Switch id="auto-schedule" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically schedule posts at optimal times for engagement
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content-suggestions">AI content suggestions</Label>
                    <Switch id="content-suggestions" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered content suggestions based on your audience and trends
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-platforms">Default platforms</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="default-platforms">
                      <SelectValue placeholder="Select platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All connected platforms</SelectItem>
                      <SelectItem value="twitter">Twitter only</SelectItem>
                      <SelectItem value="facebook">Facebook only</SelectItem>
                      <SelectItem value="linkedin">LinkedIn only</SelectItem>
                      <SelectItem value="custom">Custom selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="posting-frequency">Posting frequency</Label>
                  <Select defaultValue="moderate">
                    <SelectTrigger id="posting-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (1-2 posts per week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 posts per week)</SelectItem>
                      <SelectItem value="high">High (daily posts)</SelectItem>
                      <SelectItem value="custom">Custom schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Post Detail Modal would be implemented here */}
      </div>
    </ErrorBoundary>
  );
};

export default SocialMediaAutomation;
