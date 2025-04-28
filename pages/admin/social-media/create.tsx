import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock, Image, Video, Link2, Smile, ArrowLeft, Save, Send } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import * as socialMediaService from '@/services/social-media/socialMediaService';

/**
 * Social Media Post Creation Page
 * 
 * Allows users to create and schedule posts across multiple platforms
 * Includes AI-powered content suggestions and best time to post
 */
export default function CreatePostPage({ platforms, bestTimes }: {
  platforms: socialMediaService.SocialMediaPlatform[];
  bestTimes: { day: string; hour: number; score: number }[];
}) {
  const router = useRouter();
  const { preferences } = useAccessibility();
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [schedule, setSchedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI suggestion state
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    'Check out our latest feature that helps you save time!',
    'We\'re excited to announce our newest product update!',
    'Learn how our platform helped customers increase productivity by 30%.',
  ]);
  
  // Handle form submission
  const handleSubmit = async (saveAsDraft: boolean = false) => {
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!title.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter a title for your post.',
          variant: 'destructive',
        });
        return;
      }
      
      if (!content.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter content for your post.',
          variant: 'destructive',
        });
        return;
      }
      
      if (selectedPlatforms.length === 0) {
        toast({
          title: 'Error',
          description: 'Please select at least one platform.',
          variant: 'destructive',
        });
        return;
      }
      
      // Create scheduled date if needed
      let scheduledFor: string | undefined;
      if (schedule && scheduledDate) {
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const date = new Date(scheduledDate);
        date.setHours(hours, minutes);
        scheduledFor = date.toISOString();
      }
      
      // Create posts for each selected platform
      for (const platform of selectedPlatforms) {
        await socialMediaService.createPost({
          title,
          content,
          platform,
          imageUrl: imageUrl || undefined,
          videoUrl: videoUrl || undefined,
          scheduledFor,
          status: saveAsDraft ? 'draft' : (schedule ? 'scheduled' : 'published'),
        });
      }
      
      toast({
        title: 'Success',
        description: saveAsDraft
          ? 'Post saved as draft.'
          : (schedule ? 'Post scheduled successfully.' : 'Post published successfully.'),
      });
      
      // Redirect to social media dashboard
      router.push('/admin/social-media');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get best time suggestion
  const getBestTimeText = () => {
    if (bestTimes.length === 0) return 'No data available';
    
    const topTime = bestTimes[0];
    return `${topTime.day} at ${topTime.hour}:00 (${topTime.score}% engagement)`;
  };
  
  // Apply AI suggestion
  const applyAiSuggestion = (suggestion: string) => {
    setContent(suggestion);
    setShowAiSuggestions(false);
  };
  
  return (
    <>
      <Head>
        <title>Create Social Media Post | Genius Online Navigator</title>
        <meta name="description" content="Create and schedule social media posts across multiple platforms. Use AI-powered suggestions to optimize your content." />
        <meta name="keywords" content="social media, post creation, scheduling, content optimization" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Create Social Media Post | Genius Online Navigator" />
        <meta property="og:description" content="Create and schedule social media posts across multiple platforms." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/social-media/create`} />
      </Head>
      
      <AdminLayout
        title="Create Social Media Post"
        description="Create and schedule posts across multiple platforms"
        actions={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              aria-label="Save as draft"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              aria-label={schedule ? 'Schedule post' : 'Publish post'}
            >
              <Send className="h-4 w-4 mr-2" />
              {schedule ? 'Schedule' : 'Publish'}
            </Button>
          </div>
        }
      >
        <div 
          id="main-content"
          className={`space-y-8 ${preferences.largeText ? 'text-lg' : ''}`}
          role="main"
          aria-label="Create Social Media Post"
          tabIndex={-1}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>
                    Create your social media post content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter post title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="content">Content</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                        aria-label="Get AI suggestions"
                      >
                        <Smile className="h-4 w-4 mr-2" />
                        AI Suggestions
                      </Button>
                    </div>
                    <Textarea
                      id="content"
                      placeholder="Enter post content"
                      className="min-h-[200px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    
                    {showAiSuggestions && (
                      <Card className="mt-2">
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">AI Content Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="space-y-2">
                            {aiSuggestions.map((suggestion, index) => (
                              <div key={index} className="p-2 border rounded-md hover:bg-muted cursor-pointer" onClick={() => applyAiSuggestion(suggestion)}>
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image-url">Image URL (optional)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="image-url"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                      <Button variant="outline" size="icon" aria-label="Upload image">
                        <Image className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="video-url">Video URL (optional)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="video-url"
                        placeholder="Enter video URL"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                      <Button variant="outline" size="icon" aria-label="Upload video">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="external-link">External Link (optional)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="external-link"
                        placeholder="Enter external link"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                      />
                      <Button variant="outline" size="icon" aria-label="Add link">
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {imageUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium text-lg mb-2">{title || 'Post Title'}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{content || 'Post content will appear here.'}</p>
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="rounded-md max-h-[300px] object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                  <CardDescription>
                    Configure platforms and scheduling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Platforms</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {platforms.map((platform) => (
                        <div
                          key={platform.id}
                          className={`border rounded-md p-3 cursor-pointer ${
                            selectedPlatforms.includes(platform.id)
                              ? 'border-primary bg-primary/10'
                              : 'border-muted'
                          }`}
                          onClick={() => {
                            setSelectedPlatforms((prev) =>
                              prev.includes(platform.id)
                                ? prev.filter((p) => p !== platform.id)
                                : [...prev, platform.id]
                            );
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-muted rounded-full"></div>
                            <span>{platform.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="schedule"
                      checked={schedule}
                      onCheckedChange={setSchedule}
                    />
                    <Label htmlFor="schedule">Schedule for later</Label>
                  </div>
                  
                  {schedule && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {scheduledDate ? (
                                  format(scheduledDate, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={scheduledDate}
                                onSelect={setScheduledDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={scheduledTime}
                              onValueChange={setScheduledTime}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }).map((_, hour) => (
                                  <React.Fragment key={hour}>
                                    <SelectItem value={`${hour}:00`}>
                                      {hour}:00
                                    </SelectItem>
                                    <SelectItem value={`${hour}:30`}>
                                      {hour}:30
                                    </SelectItem>
                                  </React.Fragment>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                              <Clock className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Card className="bg-muted/50">
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">AI Recommendation</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm">
                            Best time to post: <strong>{getBestTimeText()}</strong>
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              const [bestDay, bestHour] = getBestTimeText().split(' at ');
                              const today = new Date();
                              const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                              const targetDay = daysOfWeek.indexOf(bestDay);
                              const currentDay = today.getDay();
                              
                              // Calculate days to add
                              let daysToAdd = targetDay - currentDay;
                              if (daysToAdd <= 0) daysToAdd += 7; // Next week if today or past
                              
                              const targetDate = new Date();
                              targetDate.setDate(today.getDate() + daysToAdd);
                              
                              setScheduledDate(targetDate);
                              setScheduledTime(`${parseInt(bestHour)}:00`);
                            }}
                          >
                            Apply Recommendation
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                  >
                    {schedule ? 'Schedule' : 'Publish Now'}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Keep your content concise and engaging</li>
                    <li>• Use relevant hashtags to increase reach</li>
                    <li>• Include a clear call-to-action</li>
                    <li>• Add visuals to increase engagement</li>
                    <li>• Tailor content for each platform</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

/**
 * Server-side data fetching for improved performance
 */
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch platforms and best times to post
    const platforms = await socialMediaService.getPlatforms();
    const bestTimes = await socialMediaService.getBestTimeToPost();
    
    return {
      props: {
        platforms,
        bestTimes,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty data on error
    return {
      props: {
        platforms: [],
        bestTimes: [],
      },
    };
  }
};
