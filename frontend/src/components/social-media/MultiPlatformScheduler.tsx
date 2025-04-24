import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarHeadCell,
  CalendarHeader,
  CalendarMonthSelectTrigger,
  CalendarRoot,
  CalendarYearSelectTrigger,
} from "@/components/ui/calendar";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  Clock, 
  Image as ImageIcon, 
  Link, 
  Plus, 
  Trash, 
  Sparkles, 
  AlertCircle,
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Send,
  Hash,
  Loader2,
  FileImage,
  Columns2,
  BarChart,
  ChevronDown
} from 'lucide-react';
import { format, addHours, setHours, setMinutes } from 'date-fns';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  characterLimit?: number;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface Post {
  id: string;
  content: string;
  scheduledDate: Date;
  platforms: string[];
  media: MediaItem[];
  hashtags: string[];
  links: string[];
  aiEnhanced: boolean;
}

interface MultiPlatformSchedulerProps {
  platforms?: Platform[];
  initialPosts?: Post[];
  onSchedule?: (post: Post) => void;
  onSaveDraft?: (post: Post) => void;
}

const defaultPlatforms: Platform[] = [
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: <Facebook className="h-4 w-4" />, 
    color: 'bg-blue-500', 
    connected: true 
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: <Instagram className="h-4 w-4" />, 
    color: 'bg-pink-500', 
    connected: true,
    characterLimit: 2200
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: <Twitter className="h-4 w-4" />, 
    color: 'bg-blue-400', 
    connected: true,
    characterLimit: 280
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: <Linkedin className="h-4 w-4" />, 
    color: 'bg-blue-700', 
    connected: true,
    characterLimit: 3000
  },
];

const defaultHashtags = [
  '#marketing', 
  '#digitalmarketing', 
  '#socialmediatips', 
  '#contentcreation', 
  '#branding',
  '#growthhacking',
  '#business',
  '#entrepreneur',
  '#startup',
  '#innovation'
];

export default function MultiPlatformScheduler({
  platforms = defaultPlatforms,
  initialPosts = [],
  onSchedule,
  onSaveDraft
}: MultiPlatformSchedulerProps) {
  const [content, setContent] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<Date>(addHours(new Date(), 1));
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram', 'twitter']);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState<string>('');
  const [hashtagInput, setHashtagInput] = useState<string>('');
  const [aiEnhancing, setAiEnhancing] = useState<boolean>(false);
  const [aiEnhanced, setAiEnhanced] = useState<boolean>(false);
  const [previewPlatform, setPreviewPlatform] = useState<string>('facebook');
  const [selectedTab, setSelectedTab] = useState<string>('compose');
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Character count and limit check
  const getCharacterCount = () => {
    return content.length 
      + hashtags.reduce((count, tag) => count + tag.length + 1, 0) 
      + links.reduce((count, link) => count + link.length + 1, 0);
  };
  
  const getCharacterLimit = () => {
    const selectedPlatform = platforms.find(p => p.id === previewPlatform);
    return selectedPlatform?.characterLimit || 0;
  };
  
  const isOverCharacterLimit = () => {
    const limit = getCharacterLimit();
    return limit > 0 && getCharacterCount() > limit;
  };
  
  // Preview with different link styles per platform
  const getFormattedPreview = () => {
    let formatted = content;
    
    // Add hashtags
    if (hashtags.length > 0) {
      formatted += '\n\n' + hashtags.join(' ');
    }
    
    // Add links based on platform
    if (links.length > 0) {
      formatted += '\n\n' + links.join('\n');
    }
    
    return formatted;
  };
  
  // Generate post object
  const createPostObject = (): Post => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      content,
      scheduledDate,
      platforms: selectedPlatforms,
      media,
      hashtags,
      links,
      aiEnhanced
    };
  };
  
  // Platform toggle handler
  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };
  
  // Add media handler (mock)
  const handleAddMedia = () => {
    const newMedia: MediaItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'image',
      url: `https://source.unsplash.com/random/800x600?sig=${Math.random()}`,
    };
    
    setMedia([...media, newMedia]);
  };
  
  // Remove media handler
  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter(item => item.id !== id));
  };
  
  // Add link handler
  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    
    // Basic URL validation
    let url = linkInput.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    if (!links.includes(url)) {
      setLinks([...links, url]);
      setLinkInput('');
    }
  };
  
  // Remove link handler
  const handleRemoveLink = (link: string) => {
    setLinks(links.filter(l => l !== link));
  };
  
  // Add hashtag handler
  const handleAddHashtag = () => {
    if (!hashtagInput.trim()) return;
    
    let tag = hashtagInput.trim().replace(/\s+/g, '');
    if (!tag.startsWith('#')) {
      tag = '#' + tag;
    }
    
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };
  
  // Remove hashtag handler
  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };
  
  // AI Enhancement handler (mock)
  const handleAIEnhance = async () => {
    setAiEnhancing(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI enhancement by improving the text
      const enhancedContent = content.trim() 
        ? `${content.trim()}\n\nOur team is excited to share this with you! What do you think? 💡`
        : "We're thrilled to announce our latest innovation! Our team has been working tirelessly to bring you the best experience possible. Check it out and let us know your thoughts! 🚀";
      
      setContent(enhancedContent);
      
      // Add relevant hashtags if few exist
      if (hashtags.length < 3) {
        const suggestedTags = defaultHashtags.slice(0, 3);
        setHashtags([...new Set([...hashtags, ...suggestedTags])]);
      }
      
      setAiEnhanced(true);
    } catch (err) {
      setError('Failed to enhance content. Please try again.');
    } finally {
      setAiEnhancing(false);
    }
  };
  
  // Schedule post handler
  const handleSchedulePost = async () => {
    if (!content.trim() && media.length === 0) {
      setError('Please add some content or media to your post');
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }
    
    if (isOverCharacterLimit()) {
      setError(`Your post exceeds the character limit for ${previewPlatform}`);
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Create post object
      const post = createPostObject();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call onSchedule callback
      if (onSchedule) {
        onSchedule(post);
      }
      
      // Reset form
      setContent('');
      setMedia([]);
      setHashtags([]);
      setLinks([]);
      setAiEnhanced(false);
      setScheduledDate(addHours(new Date(), 1));
      
      // Switch to calendar tab
      setSelectedTab('calendar');
    } catch (err) {
      setError('Failed to schedule post. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Save draft handler
  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Create post object
      const post = createPostObject();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Call onSaveDraft callback
      if (onSaveDraft) {
        onSaveDraft(post);
      }
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="compose" className="flex items-center">
            <Send className="mr-2 h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Platform Post</CardTitle>
              <CardDescription>
                Create and schedule content across multiple platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center ${
                        selectedPlatforms.includes(platform.id) 
                          ? `${platform.color} text-white hover:${platform.color}`
                          : ''
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                      disabled={!platform.connected}
                    >
                      {platform.icon}
                      <span className="ml-2">{platform.name}</span>
                      {!platform.connected && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Not Connected
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Content Input */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Content</Label>
                  {getCharacterLimit() > 0 && (
                    <span 
                      className={`text-xs ${
                        isOverCharacterLimit() ? 'text-red-500' : 'text-muted-foreground'
                      }`}
                    >
                      {getCharacterCount()}/{getCharacterLimit()}
                    </span>
                  )}
                </div>
                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-[120px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              
              {/* AI Enhancement */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 border rounded-md bg-muted/20">
                <div>
                  <h4 className="font-medium flex items-center">
                    <Sparkles className="h-4 w-4 text-primary mr-2" />
                    AI Content Enhancement
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Optimize your post with AI-powered suggestions
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap"
                  onClick={handleAIEnhance}
                  disabled={aiEnhancing}
                >
                  {aiEnhancing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {aiEnhanced ? 'Enhance Again' : 'Enhance Content'}
                    </>
                  )}
                </Button>
              </div>
              
              {/* Media Upload */}
              <div className="space-y-2">
                <Label>Media</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {media.map((item) => (
                    <div 
                      key={item.id} 
                      className="relative border rounded-md overflow-hidden aspect-video"
                    >
                      <img 
                        src={item.url} 
                        alt="Uploaded media" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={() => handleRemoveMedia(item.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-32 border-dashed"
                    onClick={handleAddMedia}
                  >
                    <FileImage className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span>Add Media</span>
                  </Button>
                </div>
              </div>
              
              {/* Hashtags */}
              <div className="space-y-2">
                <Label>Hashtags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 -mr-1 hover:bg-transparent"
                        onClick={() => handleRemoveHashtag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add hashtag..."
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHashtag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={handleAddHashtag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Hash className="h-3 w-3 mr-1" />
                        Suggested Hashtags
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <div className="p-3 border-b">
                        <h4 className="font-medium">Trending Hashtags</h4>
                      </div>
                      <div className="p-3 flex flex-wrap gap-2">
                        {defaultHashtags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => {
                              if (!hashtags.includes(tag)) {
                                setHashtags([...hashtags, tag]);
                              }
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Links */}
              <div className="space-y-2">
                <Label>Links</Label>
                <div className="flex flex-col gap-2 mb-2">
                  {links.map((link) => (
                    <div key={link} className="flex items-center">
                      <Link className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm truncate flex-1">{link}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => handleRemoveLink(link)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add link..."
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLink();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddLink}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Schedule */}
              <div className="space-y-2">
                <Label>Schedule</Label>
                <div className="flex gap-3">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarRoot mode="single">
                        <CalendarHeader>
                          <CalendarMonthSelectTrigger />
                          <CalendarYearSelectTrigger />
                        </CalendarHeader>
                        <CalendarGrid>
                          <CalendarHeadCell>S</CalendarHeadCell>
                          <CalendarHeadCell>M</CalendarHeadCell>
                          <CalendarHeadCell>T</CalendarHeadCell>
                          <CalendarHeadCell>W</CalendarHeadCell>
                          <CalendarHeadCell>T</CalendarHeadCell>
                          <CalendarHeadCell>F</CalendarHeadCell>
                          <CalendarHeadCell>S</CalendarHeadCell>
                          <CalendarCell />
                        </CalendarGrid>
                      </CalendarRoot>
                    </PopoverContent>
                  </Popover>
                  <Select
                    value={format(scheduledDate, 'HH:mm')}
                    onValueChange={(value) => {
                      const [hours, minutes] = value.split(':').map(Number);
                      const newDate = setMinutes(setHours(scheduledDate, hours), minutes);
                      setScheduledDate(newDate);
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <React.Fragment key={hour}>
                          <SelectItem value={`${hour.toString().padStart(2, '0')}:00`}>
                            {hour.toString().padStart(2, '0')}:00
                          </SelectItem>
                          <SelectItem value={`${hour.toString().padStart(2, '0')}:30`}>
                            {hour.toString().padStart(2, '0')}:30
                          </SelectItem>
                        </React.Fragment>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Preview */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <Label>Preview</Label>
                  <Select 
                    value={previewPlatform} 
                    onValueChange={setPreviewPlatform}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center">
                              {platform.icon}
                              <span className="ml-2">{platform.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {platforms.find(p => p.id === previewPlatform)?.icon}
                      </div>
                      <div>
                        <div className="font-semibold">Your Company</div>
                        <div className="text-xs text-muted-foreground">
                          {format(scheduledDate, 'PPP')} at {format(scheduledDate, 'p')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="whitespace-pre-wrap mb-3">
                      {getFormattedPreview()}
                    </div>
                    
                    {media.length > 0 && (
                      <div className={`grid ${
                        media.length === 1 ? 'grid-cols-1' : 
                        media.length === 2 ? 'grid-cols-2' : 
                        'grid-cols-2'
                      } gap-2 mt-3`}>
                        {media.map((item, index) => (
                          <div 
                            key={item.id} 
                            className={`rounded-md overflow-hidden ${
                              media.length > 2 && index === 0 ? 'col-span-2' : ''
                            }`}
                          >
                            <img 
                              src={item.url} 
                              alt="Preview media" 
                              className="w-full h-full object-cover aspect-video"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
                disabled={saving}
              >
                Save as Draft
              </Button>
              <Button 
                onClick={handleSchedulePost}
                disabled={saving || isOverCharacterLimit()}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Schedule Post
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                View and manage your scheduled posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 border rounded-md bg-muted/30">
                <div className="text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar View Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    We're working on a comprehensive calendar view to help you
                    visualize and manage your content schedule across all platforms.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedTab('compose')}
                  >
                    Back to Compose
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 