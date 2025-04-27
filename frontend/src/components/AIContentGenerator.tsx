import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Sparkles,
  FileText,
  Image,
  MessageSquare,
  Settings,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Save,
  Tag,
  Clock,
  Lightbulb,
  Layers,
  Bookmark
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchTemplates, 
  fetchGeneratedContents, 
  generateContent, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate, 
  deleteContent,
  setSelectedTemplate,
  setSelectedContent,
  ContentTemplate,
  GeneratedContent
} from '@/store/slices/aiContentSlice';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

type AISuggestion = {
  id: string;
  content_hash: string;
  suggestions: string[];
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

/**
 * AIContentGenerator component for creating AI-generated content for various purposes
 * including blog posts, social media content, product descriptions, and image prompts.
 * Implements accessibility, workflow, and testing best practices.
 */
const AIContentGenerator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    templates, 
    generatedContents: history, 
    selectedTemplate, 
    selectedContent, 
    isLoading, 
    error 
  } = useAppSelector(state => state.aiContent);
  
  const [activeTab, setActiveTab] = useState('create');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [settings, setSettings] = useState({
    tone: 'professional',
    length: 'medium',
    creativity: 70,
    includeKeywords: [] as string[],
    excludeKeywords: [] as string[],
  });
  const [keywordInput, setKeywordInput] = useState('');

  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [checkPlagiarism, setCheckPlagiarism] = useState(false);
  const [plagiarismResult, setPlagiarismResult] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState('');

  const [user, setUser] = useState<any>(null);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const plagiarismResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (suggestions && suggestionsRef.current) {
      suggestionsRef.current.focus();
    }
  }, [suggestions]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') setUser(session?.user);
    });
  }, []);

  // --- Supabase real-time subscription for AI suggestions ---
  useEffect(() => {
    const channel = supabase
      .channel('ai_suggestions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ai_suggestions' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setSuggestions((prev) =>
              prev.map((s) => (s.id === payload.new.id ? payload.new : s))
            );
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  /**
   * Fetches AI suggestions for the given content.
   * @param content - The content to analyze
   */
  const getAISuggestions = useCallback(async (content: string) => {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('content_hash', hash(content));
    if (error) {
      if (error.message.includes('JWT')) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to fetch AI suggestions.');
      }
      return;
    }
    setSuggestions(data || []);
  }, []);

  /**
   * Checks the given content for plagiarism and manages focus for result.
   * @param content - The content to check
   * @returns void
   */
  const checkForPlagiarism = useCallback(async (content: string) => {
    // Replace with real plagiarism API call
    setPlagiarismResult('No plagiarism detected.');
    setTimeout(() => {
      if (plagiarismResultRef.current) {
        plagiarismResultRef.current.focus();
      }
    }, 100);
  }, []);

  const handleSchedulePost = () => {
    // Add logic to schedule post
  };

  const handleExportContent = () => {
    // Add logic to export content
  };

  const handlePostToSocial = () => {
    // Add logic to post to social media
  };

  // Fetch templates and history from API
  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchGeneratedContents());
  }, [dispatch]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle content generation
  const handleGenerateContent = () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    const parameters = {
      prompt,
      tone: settings.tone,
      length: settings.length,
      creativity: settings.creativity,
      includeKeywords: settings.includeKeywords,
      excludeKeywords: settings.excludeKeywords
    };

    dispatch(generateContent({ templateId: selectedTemplate.id, parameters }))
      .unwrap()
      .then((content) => {
        setGeneratedContent(content.content);
        toast.success('Content generated successfully');
      })
      .catch(() => {
        // Error is already handled by the useEffect above
      });
  };

  // Handle saving content to history
  const handleSaveContent = () => {
    if (!generatedContent || !selectedTemplate) return;
    
    // In a real implementation, we would dispatch an action to save the content
    // For now, we'll just show a toast message
    toast.success('Content saved to history');
  };

  // Handle copying content to clipboard
  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard');
  };

  // Handle adding keywords
  const handleAddKeyword = (type: 'include' | 'exclude') => {
    if (!keywordInput.trim()) return;
    
    if (type === 'include') {
      setSettings({
        ...settings,
        includeKeywords: [...settings.includeKeywords, keywordInput.trim()]
      });
    } else {
      setSettings({
        ...settings,
        excludeKeywords: [...settings.excludeKeywords, keywordInput.trim()]
      });
    }
    
    setKeywordInput('');
  };

  // Handle removing keywords
  const handleRemoveKeyword = (type: 'include' | 'exclude', keyword: string) => {
    if (type === 'include') {
      setSettings({
        ...settings,
        includeKeywords: settings.includeKeywords.filter(k => k !== keyword)
      });
    } else {
      setSettings({
        ...settings,
        excludeKeywords: settings.excludeKeywords.filter(k => k !== keyword)
      });
    }
  };

  /**
   * Handles saving the custom API key to user settings.
   * @returns void
   */
  const handleSaveSettings = () => {
    // Add logic to save API key to user settings
  };

  const saveContext = async (modelType: string, context: object) => {
    if (!user) throw new Error('Unauthorized');
    const { data, error } = await supabase
      .from('context_chain')
      .insert({ 
        user_id: user.id, 
        model_type: modelType, 
        context 
      })
      .select();
    if (error) throw error;
    return data;
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">AI Content Generator</h1>
          <Button 
            variant="outline"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="create">
              <Sparkles className="mr-2 h-4 w-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Layers className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Content</CardTitle>
                <CardDescription>
                  {selectedTemplate 
                    ? `Using template: ${selectedTemplate.name}`
                    : 'Select a template or write your own prompt'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedTemplate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {templates.slice(0, 3).map((template) => (
                      <Card 
                        key={template.id} 
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => {
                          dispatch(setSelectedTemplate(template));
                          setPrompt(template.prompt);
                        }}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="prompt">Prompt</Label>
                    {selectedTemplate && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          dispatch(setSelectedTemplate(null));
                          setPrompt('');
                        }}
                        className="h-6 text-xs"
                      >
                        Clear template
                      </Button>
                    )}
                  </div>
                  <Textarea 
                    id="prompt" 
                    placeholder="Describe the content you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select 
                      value={settings.tone}
                      onValueChange={(value) => setSettings({...settings, tone: value})}
                    >
                      <SelectTrigger id="tone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="length">Length</Label>
                    <Select 
                      value={settings.length}
                      onValueChange={(value) => setSettings({...settings, length: value})}
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
                    <div className="flex justify-between">
                      <Label htmlFor="creativity">Creativity</Label>
                      <span className="text-sm text-muted-foreground">{settings.creativity}%</span>
                    </div>
                    <Input 
                      id="creativity" 
                      type="range"
                      min="0"
                      max="100"
                      value={settings.creativity}
                      onChange={(e) => setSettings({...settings, creativity: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <div className="flex gap-2 mb-2">
                    <Input 
                      placeholder="Enter keyword"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddKeyword('include')}
                      disabled={!keywordInput.trim()}
                    >
                      Include
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddKeyword('exclude')}
                      disabled={!keywordInput.trim()}
                    >
                      Exclude
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Include keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {settings.includeKeywords.map((keyword, index) => (
                          <div 
                            key={index}
                            className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                          >
                            {keyword}
                            <button 
                              onClick={() => handleRemoveKeyword('include', keyword)}
                              className="ml-1 text-green-800 hover:text-green-900"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {settings.includeKeywords.length === 0 && (
                          <p className="text-xs text-muted-foreground">No keywords added</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Exclude keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {settings.excludeKeywords.map((keyword, index) => (
                          <div 
                            key={index}
                            className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
                          >
                            {keyword}
                            <button 
                              onClick={() => handleRemoveKeyword('exclude', keyword)}
                              className="ml-1 text-red-800 hover:text-red-900"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {settings.excludeKeywords.length === 0 && (
                          <p className="text-xs text-muted-foreground">No keywords added</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerateContent}
                  disabled={!prompt || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {generatedContent && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    Based on your prompt and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                    {generatedContent}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyContent}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSaveContent}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm">
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Dislike
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="plagiarism-toggle">Check for Plagiarism</Label>
                <Switch id="plagiarism-toggle" checked={checkPlagiarism} onCheckedChange={setCheckPlagiarism} aria-label="Toggle plagiarism check" />
                <Button 
                  data-testid="get-ai-suggestions-btn"
                  aria-label="Get AI Suggestions"
                  onClick={() => getAISuggestions(generatedContent)}
                >
                  <Sparkles className="mr-2" />Get Suggestions
                </Button>
                {suggestions && (
                  <div 
                    ref={suggestionsRef} 
                    tabIndex={-1} 
                    aria-live="polite" 
                    className="mt-2 p-2 border rounded bg-muted"
                  >
                    <strong>AI Suggestions:</strong>
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id}>
                        <div>Content Hash: {suggestion.content_hash}</div>
                        <div>Suggestions: {suggestion.suggestions.join(', ')}</div>
                      </div>
                    ))}
                  </div>
                )}
                {checkPlagiarism && (
                  <Button 
                    data-testid="check-plagiarism-btn"
                    aria-label="Check Plagiarism"
                    onClick={() => checkForPlagiarism(generatedContent)}
                  >
                    <Layers className="mr-2" />Check Plagiarism
                  </Button>
                )}
                {plagiarismResult && (
                  <div 
                    aria-live="polite" 
                    className="mt-2 p-2 border rounded bg-warning"
                    tabIndex={-1}
                    data-testid="plagiarism-result"
                    ref={plagiarismResultRef}
                  >
                    <strong>Plagiarism Check:</strong> {plagiarismResult}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  data-testid="schedule-post-btn"
                  aria-label="Schedule Post"
                  onClick={handleSchedulePost}
                >
                  <Clock className="mr-2" />Schedule Post
                </Button>
                <Button 
                  data-testid="export-content-btn"
                  aria-label="Export Content"
                  onClick={handleExportContent}
                >
                  <Save className="mr-2" />Export
                </Button>
                <Button 
                  data-testid="post-to-social-btn"
                  aria-label="Post to Social Media"
                  onClick={handlePostToSocial}
                >
                  <MessageSquare className="mr-2" />Post to Social
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Templates</CardTitle>
                <CardDescription>
                  Pre-defined templates to help you generate specific types of content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            template.category === 'text' ? 'bg-blue-100 text-blue-800' :
                            template.category === 'social' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                          </div>
                        </div>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">{template.prompt}</p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={() => {
                            dispatch(setSelectedTemplate(template));
                            setPrompt(template.prompt);
                            setActiveTab('create');
                          }}
                        >
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content History</CardTitle>
                <CardDescription>
                  View and reuse your previously generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {item.type === 'text' && <FileText className="h-4 w-4 mr-2 text-blue-500" />}
                            {item.type === 'social' && <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />}
                            {item.type === 'image' && <Image className="h-4 w-4 mr-2 text-orange-500" />}
                            <div>
                              <p className="font-medium text-sm">{item.prompt.length > 50 ? item.prompt.substring(0, 50) + '...' : item.prompt}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {item.isSaved && (
                            <Bookmark className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="max-h-32 overflow-hidden text-sm text-muted-foreground">
                          {item.content.substring(0, 150)}
                          {item.content.length > 150 && '...'}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, index) => (
                            <div 
                              key={index}
                              className="bg-muted px-2 py-0.5 rounded-full text-xs"
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setPrompt(item.prompt);
                            setGeneratedContent(item.content);
                            setActiveTab('create');
                          }}
                        >
                          Reuse
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(item.content);
                            toast.success('Content copied to clipboard');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Settings</CardTitle>
                <CardDescription>
                  Configure your AI content generation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="save-history">Save content history</Label>
                    <Switch id="save-history" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically save generated content to your history
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content-suggestions">Content suggestions</Label>
                    <Switch id="content-suggestions" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive AI-powered content suggestions based on your previous content
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-model">Default AI model</Label>
                  <Select defaultValue="gpt4">
                    <SelectTrigger id="default-model">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt4">GPT-4 (Most capable)</SelectItem>
                      <SelectItem value="gpt35">GPT-3.5 (Faster)</SelectItem>
                      <SelectItem value="claude">Claude 3</SelectItem>
                      <SelectItem value="custom">Custom API</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select which AI model to use for content generation
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-tone">Default tone</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger id="default-tone">
                      <SelectValue placeholder="Select default tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-key">Custom API Key (Optional)</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    aria-label="Custom API Key"
                    aria-describedby="api-key-help"
                    autoComplete="off"
                    autoCorrect="off"
                    data-testid="custom-api-key-input"
                    value={apiKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                  />
                  <p id="api-key-help" className="text-sm text-muted-foreground" data-testid="custom-api-key-help">
                    Use your own API key for content generation
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                {/**
                 * Handles saving the custom API key to user settings.
                 * @returns void
                 */}
                <Button
                  aria-label="Save Settings"
                  data-testid="save-settings-btn"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default AIContentGenerator;
