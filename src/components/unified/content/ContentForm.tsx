import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Save, FileText, Image, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Support both Redux implementations
import { useDispatch } from 'react-redux';
import { addContent as addContentLegacy } from '../../../redux/contentSlice';
import { useAppDispatch } from '@/store/hooks';
import { addContent as addContentNew } from '@/store/slices/contentSlice';

export interface ContentFormProps {
  // Basic props from original ContentForm
  onSuccess?: () => void;
  initialData?: {
    title?: string;
    body?: string;
    status?: string;
  };
}

export interface StyledContentFormProps extends ContentFormProps {
  // Additional props from StyledContentForm
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

export interface UnifiedContentFormProps extends StyledContentFormProps {
  // Combined props with additional control
  variant?: 'basic' | 'styled';
}

export const UnifiedContentForm: React.FC<UnifiedContentFormProps> = ({
  variant = 'styled',
  onSuccess,
  initialData = {},
  title = "Create Content",
  description = "Create and publish new content for your blog or website"
}) => {
  // State management for all possible fields
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
  
  // Support both dispatch methods
  const legacyDispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const supabase = useSupabaseClient();

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
        
        // Dispatch to Redux store - support both implementations
        try {
          appDispatch(addContentNew(newContent));
        } catch (e) {
          // Fall back to legacy dispatch if the new one fails
          legacyDispatch(addContentLegacy(newContent));
        }
        
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
    } catch (e) {
      setError('Error saving content');
      setLoading(false);
    }
  };

  // Basic variant (original ContentForm style)
  if (variant === 'basic') {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={contentTitle}
          onChange={e => setContentTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
        />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" disabled={loading} data-testid="save-context-btn">
          {loading ? 'Saving...' : 'Save Content'}
        </button>
        {error && <div>{error}</div>}
      </form>
    );
  }

  // Styled variant (enhanced UI with shadcn components)
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="meta">
                <Tag className="h-4 w-4 mr-2" />
                Meta
              </TabsTrigger>
              <TabsTrigger value="media">
                <Image className="h-4 w-4 mr-2" />
                Media
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="pt-6">
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter content title"
                  value={contentTitle}
                  onChange={e => setContentTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Content</Label>
                <Textarea
                  id="body"
                  placeholder="Enter your content here"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="min-h-[200px]"
                  required
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

            <TabsContent value="meta" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of your content"
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
                <p className="text-sm text-muted-foreground">
                  Separate tags with commas (e.g., news, technology, update)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  placeholder="https://example.com/image.jpg"
                  value={featuredImage}
                  onChange={e => setFeaturedImage(e.target.value)}
                />
              </div>
              {featuredImage && (
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={featuredImage} 
                    alt="Featured preview" 
                    className="w-full h-auto max-h-[200px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </TabsContent>
          </CardContent>

          <CardFooter className="flex justify-between">
            {(error || success) && (
              <Alert variant={error ? "destructive" : "default"} className="mr-4 flex-1">
                {error && <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{error ? "Error" : "Success"}</AlertTitle>
                <AlertDescription>
                  {error || success}
                </AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Content'}
            </Button>
          </CardFooter>
        </Tabs>
      </form>
    </Card>
  );
};

// Export named components for backward compatibility
export const ContentForm: React.FC = () => {
  return <UnifiedContentForm variant="basic" />;
};

export const StyledContentForm: React.FC<StyledContentFormProps> = (props) => {
  return <UnifiedContentForm variant="styled" {...props} />;
};

// Default export is the unified component
export default UnifiedContentForm;