import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, RefreshCw, Plus, Minus, Save, Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';

interface GeneratorFormProps {
  template?: contentGenerationService.ContentTemplate;
  brandVoiceProfiles: contentGenerationService.BrandVoiceProfile[];
  onContentGenerated: (content: contentGenerationService.GeneratedContent) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

/**
 * AI Content Generator Form
 * 
 * Form for generating content with AI using templates and brand voice profiles
 */
export default function GeneratorForm({
  template,
  brandVoiceProfiles,
  onContentGenerated,
  isGenerating,
  setIsGenerating
}: GeneratorFormProps) {
  // Form state
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'enthusiastic' | 'informative' | 'persuasive'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [platform, setPlatform] = useState('');
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [brandVoiceId, setBrandVoiceId] = useState('');
  const [includeCta, setIncludeCta] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [seoOptimize, setSeoOptimize] = useState(false);
  
  // Set template values if provided
  useEffect(() => {
    if (template) {
      // Set default values based on template
      setTopic('');
      setKeywords([]);
      setKeywordInput('');
      setTone('professional');
      setLength('medium');
      setPlatform(template.platforms[0] === 'all' ? '' : template.platforms[0]);
    }
  }, [template]);
  
  // Add keyword
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };
  
  // Remove keyword
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic for your content.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Prepare request
      const request: contentGenerationService.ContentGenerationRequest = {
        topic,
        keywords: keywords.length > 0 ? keywords : undefined,
        tone,
        length,
        platform: platform || undefined,
        templateId: template?.id,
        industry: industry || undefined,
        audience: audience || undefined,
        includeCta,
        includeHashtags,
        seoOptimize,
      };
      
      // Add brand voice if selected
      if (brandVoiceId) {
        const selectedProfile = brandVoiceProfiles.find(p => p.id === brandVoiceId);
        if (selectedProfile) {
          request.brandVoice = {
            style: selectedProfile.style,
            values: selectedProfile.values,
            prohibitedWords: selectedProfile.prohibitedWords,
          };
        }
      }
      
      // Generate content
      const generatedContent = await contentGenerationService.generateContent(request);
      
      // Pass generated content to parent
      onContentGenerated(generatedContent);
      
      toast({
        title: 'Content Generated',
        description: 'Your content has been generated successfully.',
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Content Parameters</CardTitle>
          <CardDescription>
            Define parameters for your AI-generated content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or Title</Label>
            <Input
              id="topic"
              placeholder="Enter the main topic or title"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <div className="flex space-x-2">
              <Input
                id="keywords"
                placeholder="Enter keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addKeyword}
                aria-label="Add keyword"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {keyword}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => removeKeyword(keyword)}
                      aria-label={`Remove ${keyword}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={tone}
                onValueChange={(value) => setTone(value as any)}
              >
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Select
                value={length}
                onValueChange={(value) => setLength(value as any)}
              >
                <SelectTrigger id="length">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={platform}
                onValueChange={setPlatform}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Platform</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand-voice">Brand Voice</Label>
              <Select
                value={brandVoiceId}
                onValueChange={setBrandVoiceId}
              >
                <SelectTrigger id="brand-voice">
                  <SelectValue placeholder="Select brand voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Brand Voice</SelectItem>
                  {brandVoiceProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g., Technology, Healthcare"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Marketers, Executives"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-cta"
                  checked={includeCta}
                  onCheckedChange={setIncludeCta}
                />
                <Label htmlFor="include-cta">Include Call to Action</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-hashtags"
                  checked={includeHashtags}
                  onCheckedChange={setIncludeHashtags}
                />
                <Label htmlFor="include-hashtags">Include Hashtags</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="seo-optimize"
                checked={seoOptimize}
                onCheckedChange={setSeoOptimize}
              />
              <Label htmlFor="seo-optimize">Optimize for SEO</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
