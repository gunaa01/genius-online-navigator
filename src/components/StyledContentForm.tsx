import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAppDispatch } from '@/store/hooks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Save, FileText, Image, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the content slice actions
// Note: Path may need to be updated based on actual location of contentSlice
import { addContent } from '@/store/slices/contentSlice';

export interface ContentFormProps {
  onSuccess?: () => void;
  initialData?: {
    title?: string;
    body?: string;
    status?: string;
    tags?: string[];
    excerpt?: string;
    featuredImage?: string;
  };
  title?: string;
  description?: string;
}

const StyledContentForm: React.FC<ContentFormProps> = ({ 
  onSuccess, 
  initialData = {}, 
  title = "Create Content",
  description = "Create and publish new content for your blog or website"
}) => {
  const [contentTitle, setContentTitle] = useState(initialData.title || '');
  const [body, setBody] = useState(initialData.body || '');
  const [status, setStatus] = useState(initialData.status || 'draft');
  const [tags, setTags] = useState(initialData.tags?.join(', ') || '');
  const [excerpt, setExcerpt] = useState(initialData.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(initialData.featuredImage || '');
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const supabase = useSupabaseClient();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        setError('You must be authenticated to create content');
        setLoading(false);
        return;
      }
      
      const token = session.data.session.access_token;
      const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // In a real implementation, this would call an API
      // For now, we'll simulate a successful API call
      setTimeout(() => {
        const newContent = {
          id: Math.random().toString(36).substring(2, 15),
          title: contentTitle,
          body,
          status,
          tags: parsedTags,
          excerpt,
          featuredImage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: session.data.session?.user?.id || 'unknown'
        };
        
        // Dispatch to Redux store
        dispatch(addContent(newContent));
        
        // Reset form if not editing
        if (!initialData.title) {
          setContentTitle('');
          setBody('');
          setStatus('draft');
          setTags('');
          setExcerpt('');
          setFeaturedImage('');
        }
        
        setSuccess('Content saved successfully!');
        setLoading(false);
        
        if (onSuccess) {
          onSuccess();
        }
      }, 1000);
    } catch (err) {
      console.error('Error creating content:', err);
      setError('Error creating content. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="content" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="metadata" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Metadata
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Media
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title"
                  value={contentTitle}
                  onChange={e => setContentTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Content</Label>
                <Textarea
                  id="body"
                  placeholder="Write your content here..."
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A brief summary of your content"
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  placeholder="Enter image URL"
                  value={featuredImage}
                  onChange={e => setFeaturedImage(e.target.value)}
                />
              </div>
              
              {featuredImage && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 border rounded-md overflow-hidden">
                    <img 
                      src={featuredImage} 
                      alt="Featured" 
                      className="w-full h-auto max-h-[200px] object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            {status === 'draft' ? 'Draft will be saved but not published' : 
             status === 'published' ? 'Content will be published immediately' :
             'Content will be archived'}
          </div>
          <Button type="submit" disabled={loading} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Content'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StyledContentForm;
