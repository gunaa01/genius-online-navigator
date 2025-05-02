import React, { useState } from 'react';
import { Calendar, Clock, Image, Link, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface SocialMediaPublisherProps {
  connectedAccounts: Array<{
    id: string;
    platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'pinterest';
    name: string;
    profileImage?: string;
    isConnected: boolean;
  }>;
  onPublish?: (data: SocialPostData) => Promise<boolean>;
  onSchedule?: (data: SocialPostData) => Promise<boolean>;
}

export interface SocialPostData {
  content: string;
  media?: File[];
  link?: string;
  platforms: string[];
  scheduledTime?: Date;
  hashtags: string[];
  mentions: string[];
  isScheduled: boolean;
}

/**
 * Social Media Publisher Component
 * Allows publishing and scheduling posts to multiple social media platforms
 */
const SocialMediaPublisher: React.FC<SocialMediaPublisherProps> = ({
  connectedAccounts,
  onPublish,
  onSchedule
}) => {
  const [content, setContent] = useState<string>('');
  const [media, setMedia] = useState<File[]>([]);
  const [link, setLink] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [hashtags, setHashtags] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [previewPlatform, setPreviewPlatform] = useState<string>('facebook');

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setMedia([...media, ...fileArray]);
    }
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    const newMedia = [...media];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  // Toggle platform selection
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (!content && media.length === 0) {
      toast.error('Please add content or media to your post');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform to publish to');
      return;
    }

    setIsPublishing(true);

    // Prepare post data
    const postData: SocialPostData = {
      content,
      media,
      link: link || undefined,
      platforms: selectedPlatforms,
      hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
      mentions: content.split(' ').filter(word => word.startsWith('@')),
      isScheduled
    };

    // Add scheduled time if applicable
    if (isScheduled && scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      postData.scheduledTime = scheduledDateTime;
    }

    try {
      let success = false;

      // Call appropriate handler based on whether post is scheduled
      if (isScheduled && onSchedule) {
        success = await onSchedule(postData);
      } else if (onPublish) {
        success = await onPublish(postData);
      }

      if (success) {
        toast.success(isScheduled ? 'Post scheduled successfully' : 'Post published successfully');
        // Reset form
        setContent('');
        setMedia([]);
        setLink('');
        setHashtags('');
      } else {
        toast.error('Failed to publish post. Please try again.');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('An error occurred while publishing your post');
    } finally {
      setIsPublishing(false);
    }
  };

  // Generate preview based on selected platform
  const renderPreview = () => {
    const platform = previewPlatform;
    const account = connectedAccounts.find(acc => acc.platform === platform);

    return (
      <div className="border rounded-md p-4 bg-card">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden mr-3">
            {account?.profileImage ? (
              <img src={account.profileImage} alt={account.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                {account?.name.charAt(0) || '?'}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{account?.name || 'Account Name'}</p>
            <p className="text-xs text-muted-foreground">
              {isScheduled ? `Scheduled for ${scheduledDate} at ${scheduledTime}` : 'Now'}
            </p>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="whitespace-pre-wrap">{content}</p>
          {hashtags && (
            <p className="text-primary text-sm mt-1">{hashtags}</p>
          )}
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 block mt-2 text-sm overflow-hidden text-ellipsis">
              {link}
            </a>
          )}
        </div>
        
        {media.length > 0 && (
          <div className={`grid ${media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mt-3`}>
            {media.map((file, index) => (
              <div key={index} className="aspect-video bg-muted rounded-md overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Upload ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Media Preview</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Social Media Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compose">
          <TabsList className="mb-4">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compose">
            <div className="space-y-4">
              <div>
                <Textarea 
                  placeholder="What would you like to share?" 
                  className="min-h-[120px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {content.length} characters
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {platform => platform === 'twitter' ? '280 max' : '2,200 max'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input 
                  id="hashtags"
                  placeholder="#marketing #socialmedia" 
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="link">Link</Label>
                <Input 
                  id="link"
                  placeholder="https://example.com" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="media">Media</Label>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {media.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="w-20 h-20 rounded-md bg-muted overflow-hidden">
                          {file.type.startsWith('image/') ? (
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Upload ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-center text-muted-foreground px-2">
                                {file.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    <label className="w-20 h-20 rounded-md border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Image className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Add Media</span>
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        multiple 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Platforms</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {connectedAccounts.map((account) => (
                    <div 
                      key={account.id}
                      className={`p-3 rounded-md border cursor-pointer flex items-center ${
                        selectedPlatforms.includes(account.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                      onClick={() => togglePlatform(account.id)}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        {account.profileImage ? (
                          <img src={account.profileImage} alt={account.name} className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-primary font-bold">{account.platform.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{account.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{account.platform}</p>
                      </div>
                      {!account.isConnected && (
                        <AlertCircle className="h-4 w-4 text-destructive ml-2" title="Not connected" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="schedule" 
                  checked={isScheduled}
                  onCheckedChange={setIsScheduled}
                />
                <Label htmlFor="schedule">Schedule for later</Label>
              </div>
              
              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="date"
                        type="date"
                        className="pl-10"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="time"
                        type="time"
                        className="pl-10"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="space-y-4">
              <div>
                <Label htmlFor="preview-platform">Preview Platform</Label>
                <Select 
                  value={previewPlatform} 
                  onValueChange={setPreviewPlatform}
                >
                  <SelectTrigger id="preview-platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="pinterest">Pinterest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {renderPreview()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Save Draft</Button>
        <Button 
          onClick={handleSubmit}
          disabled={isPublishing || selectedPlatforms.length === 0}
        >
          {isPublishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isScheduled ? 'Scheduling...' : 'Publishing...'}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {isScheduled ? 'Schedule Post' : 'Publish Now'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SocialMediaPublisher;
