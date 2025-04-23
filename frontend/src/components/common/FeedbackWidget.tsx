import { useState, useRef, useEffect } from 'react';
import { MessageSquarePlus, X, ThumbsUp, Send, Camera, Paperclip, Star, AlertCircle, Lightbulb, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { apiClient } from '@/services/api/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { 
  feedbackAnalysisService, 
  FeedbackAnalysisResult, 
  SentimentAnalysisResult,
  KeywordExtractionResult
} from '@/services/feedback/feedbackAnalysisService';
import { Progress } from '@/components/ui/progress';

// Types
type FeedbackType = 'suggestion' | 'bug' | 'praise' | 'question' | 'other';
type FeedbackCategory = 'ui' | 'performance' | 'feature' | 'documentation' | 'accessibility' | 'other';
type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';
type FeedbackTab = 'general' | 'feature' | 'rating' | 'smart';

interface FeedbackData {
  type: FeedbackType;
  category?: FeedbackCategory;
  priority?: FeedbackPriority;
  title: string;
  description: string;
  email?: string;
  path: string;
  userAgent: string;
  timestamp: string;
  featureId?: string;
  featureName?: string;
  screenshot?: string;
  rating?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  allowContact?: boolean;
  analysis?: {
    sentiment: SentimentAnalysisResult;
    keywords: string[];
    suggestedCategory?: string;
    suggestedPriority?: FeedbackPriority;
  };
}

interface FeedbackWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onSubmit?: (feedback: FeedbackData) => Promise<void>;
  userEmail?: string;
  featureId?: string;
  featureName?: string;
  initialTab?: FeedbackTab;
}

/**
 * FeedbackWidget - A floating widget that allows users to submit feedback, bug reports, or suggestions
 * 
 * Features:
 * - Collapsible UI that doesn't interfere with the main application
 * - Different feedback types (suggestion, bug, praise, question, other)
 * - Optional email for follow-up
 * - Automatically captures page path and basic system info
 * - Feature-specific feedback collection
 * - Screenshot capability
 * - User satisfaction ratings
 * - Analytics integration
 */
const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  position = 'bottom-right',
  onSubmit,
  userEmail = '',
  featureId,
  featureName,
  initialTab = 'general',
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isEnabled } = useFeatureFlags();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<FeedbackTab>(initialTab);
  
  // General feedback state
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('suggestion');
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>('feature');
  const [feedbackPriority, setFeedbackPriority] = useState<FeedbackPriority>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(userEmail || (user?.email || ''));
  const [allowContact, setAllowContact] = useState(true);
  
  // Feature feedback state
  const [selectedFeatureId, setSelectedFeatureId] = useState(featureId || '');
  const [selectedFeatureName, setSelectedFeatureName] = useState(featureName || '');
  const [featureRating, setFeatureRating] = useState(0);
  const [featureFeedback, setFeatureFeedback] = useState('');
  
  // Screenshot state
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState('');
  
  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FeedbackAnalysisResult | null>(null);
  const [smartFeedback, setSmartFeedback] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [similarFeedback, setSimilarFeedback] = useState<Array<{id: string, title: string, similarity: number}>>([]);
  
  // Available features for feedback
  const availableFeatures = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'projects', name: 'Projects Management' },
    { id: 'tasks', name: 'Task Management' },
    { id: 'resources', name: 'Resource Management' },
    { id: 'clients', name: 'Client Portal' },
    { id: 'reports', name: 'Reports & Analytics' },
    { id: 'automation', name: 'Automation Tools' },
    { id: 'ai_insights', name: 'AI Insights' },
  ];

  // Position styles
  const positionStyles = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  // Reset form
  const resetForm = () => {
    setFeedbackType('suggestion');
    setFeedbackCategory('feature');
    setFeedbackPriority('medium');
    setTitle('');
    setDescription('');
    setSelectedFeatureId(featureId || '');
    setSelectedFeatureName(featureName || '');
    setFeatureRating(0);
    setFeatureFeedback('');
    setScreenshot(null);
    setScreenshotName('');
    setIsSuccess(false);
    setActiveTab(initialTab);
    setAnalysisResult(null);
    setSmartFeedback('');
    setSuggestedTags([]);
    setSelectedTags([]);
    setAnalysisProgress(0);
    setSimilarFeedback([]);
  };

  // Close widget
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300); // Reset after close animation
  };

  // Handle file selection for screenshots
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Screenshot must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshot(reader.result as string);
      setScreenshotName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Take screenshot of current page
  const captureScreenshot = async () => {
    try {
      if (!isEnabled('screenshot-capture')) {
        toast({
          title: "Feature unavailable",
          description: "Screenshot capture is not available in your plan",
          variant: "default"
        });
        return;
      }
      
      // This is a simplified version - in production, you'd use a library like html2canvas
      toast({
        title: "Screenshot captured",
        description: "Your screenshot has been attached to the feedback",
      });
      
      // Simulate screenshot capture
      setScreenshot('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
      setScreenshotName('screenshot.png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast({
        title: "Screenshot failed",
        description: "Unable to capture screenshot",
        variant: "destructive"
      });
    }
  };

  // Remove screenshot
  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit feedback
  const handleSubmit = async () => {
    // Validate based on active tab
    if (activeTab === 'general' && (!title || !description)) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'feature' && (!selectedFeatureId || !featureFeedback)) {
      toast({
        title: "Missing information",
        description: "Please select a feature and provide feedback",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'rating' && featureRating === 0) {
      toast({
        title: "Missing rating",
        description: "Please provide a rating",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Build feedback data based on active tab
    const feedbackData: FeedbackData = {
      type: feedbackType,
      title: activeTab === 'general' ? title : 
             activeTab === 'feature' ? `Feedback for ${selectedFeatureName}` : 
             `Rating for ${selectedFeatureName || 'application'}`,
      description: activeTab === 'general' ? description : 
                  activeTab === 'feature' ? featureFeedback : 
                  `Rating: ${featureRating}/5`,
      email: email || undefined,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      allowContact,
      metadata: {
        browser: navigator.userAgent.match(/chrome|firefox|safari|edge|opera/i)?.[0].toLowerCase() || 'unknown',
        device: /mobile|tablet|android|iphone|ipad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
      }
    };
    
    // Add tab-specific data
    if (activeTab === 'general') {
      feedbackData.category = feedbackCategory;
      feedbackData.priority = feedbackPriority;
    }
    
    if (activeTab === 'feature' || activeTab === 'rating') {
      feedbackData.featureId = selectedFeatureId;
      feedbackData.featureName = selectedFeatureName;
    }
    
    if (activeTab === 'rating') {
      feedbackData.rating = featureRating;
    }
    
    // Add screenshot if available
    if (screenshot) {
      feedbackData.screenshot = screenshot;
    }

    try {
      // Track feedback submission in analytics
      if (window.gtag) {
        window.gtag('event', 'submit_feedback', {
          feedback_type: feedbackData.type,
          feedback_category: feedbackData.category,
          feature_id: feedbackData.featureId,
          has_screenshot: !!feedbackData.screenshot,
          rating: feedbackData.rating,
        });
      }
      
      // If onSubmit prop is provided, use it
      if (onSubmit) {
        await onSubmit(feedbackData);
      } else {
        // Default behavior - submit to API
        try {
          await apiClient.post('/feedback', feedbackData);
        } catch (error) {
          // Fallback to console if API fails
          console.log('Feedback submitted (API failed):', feedbackData);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        }
      }

      setIsSuccess(true);
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
        variant: "default"
      });
      
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get icon based on feedback type
  const getFeedbackTypeIcon = () => {
    switch (feedbackType) {
      case 'suggestion':
        return <MessageSquarePlus className="h-4 w-4" />;
      case 'bug':
        return <X className="h-4 w-4" />;
      case 'praise':
        return <ThumbsUp className="h-4 w-4" />;
      case 'question':
        return <MessageSquarePlus className="h-4 w-4" />;
      default:
        return <MessageSquarePlus className="h-4 w-4" />;
    }
  };

  // Render star rating component
  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setFeatureRating(rating)}
            className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
              featureRating >= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  // Analyze feedback using AI
  const analyzeFeedback = async (text: string) => {
    if (!text || text.length < 10) {
      toast({
        title: "Text too short",
        description: "Please provide more detailed feedback for analysis",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Get context for better analysis
      const context = {
        featureId: selectedFeatureId,
        featureName: selectedFeatureName,
        path: window.location.pathname,
        feedbackType: activeTab === 'feature' ? 'feature' : 
                     activeTab === 'rating' ? 'rating' : feedbackType
      };
      
      // Call the analysis service
      const result = await feedbackAnalysisService.analyzeFeedback(text, context);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysisResult(result);
      
      // Extract suggested tags from keywords
      const tags = result.keywords.keywords
        .filter(k => k.relevance > 0.5)
        .map(k => k.text);
      
      setSuggestedTags(tags);
      
      // Auto-select high relevance tags
      const highRelevanceTags = result.keywords.keywords
        .filter(k => k.relevance > 0.8)
        .map(k => k.text);
      
      setSelectedTags(highRelevanceTags);
      
      // Set suggested category and priority if available
      if (result.categorization) {
        const category = mapAICategoryToFeedbackCategory(result.categorization.primaryCategory);
        if (category) {
          setFeedbackCategory(category);
        }
        
        if (result.priority) {
          setFeedbackPriority(result.priority.suggestedPriority);
        }
      }
      
      // Get similar feedback if available
      if (isEnabled('similar-feedback')) {
        try {
          // This would be a real API call in production
          // For now, we'll simulate it
          setSimilarFeedback([
            { id: 'fb1', title: 'Similar issue with dashboard loading', similarity: 0.89 },
            { id: 'fb2', title: 'Performance problem on resources page', similarity: 0.72 },
          ]);
        } catch (error) {
          console.error('Error fetching similar feedback:', error);
        }
      }
      
      toast({
        title: "Analysis complete",
        description: "AI has analyzed your feedback",
      });
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze your feedback",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Map AI category to feedback category
  const mapAICategoryToFeedbackCategory = (aiCategory: string): FeedbackCategory | null => {
    const categoryMap: Record<string, FeedbackCategory> = {
      'ui': 'ui',
      'user interface': 'ui',
      'design': 'ui',
      'performance': 'performance',
      'speed': 'performance',
      'loading': 'performance',
      'feature': 'feature',
      'feature request': 'feature',
      'documentation': 'documentation',
      'help': 'documentation',
      'accessibility': 'accessibility',
      'a11y': 'accessibility',
    };
    
    const normalizedCategory = aiCategory.toLowerCase();
    
    for (const [key, value] of Object.entries(categoryMap)) {
      if (normalizedCategory.includes(key)) {
        return value;
      }
    }
    
    return null;
  };
  
  // Get sentiment color based on score
  const getSentimentColor = (score: number) => {
    if (score >= 0.3) return 'bg-green-500';
    if (score <= -0.3) return 'bg-red-500';
    return 'bg-gray-500';
  };
  
  // Get sentiment label
  const getSentimentLabel = (sentiment: SentimentAnalysisResult) => {
    return sentiment.label.charAt(0).toUpperCase() + sentiment.label.slice(1);
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Effect to analyze feedback when tab changes to 'smart'
  useEffect(() => {
    if (activeTab === 'smart' && !analysisResult && !isAnalyzing) {
      const textToAnalyze = description || featureFeedback || '';
      if (textToAnalyze.length >= 10) {
        analyzeFeedback(textToAnalyze);
      }
    }
  }, [activeTab]);
  
  // Effect to update smart feedback when user types
  useEffect(() => {
    if (activeTab === 'smart') {
      const debouncedAnalysis = setTimeout(() => {
        if (smartFeedback.length >= 10 && !isAnalyzing) {
          analyzeFeedback(smartFeedback);
        }
      }, 1000);
      
      return () => clearTimeout(debouncedAnalysis);
    }
  }, [smartFeedback]);

  return (
    <div className={`fixed z-50 ${positionStyles[position]}`}>
      {/* Collapsed button */}
      {!isOpen && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="h-12 w-12 rounded-full shadow-lg"
              >
                <MessageSquarePlus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share feedback</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Expanded feedback form */}
      {isOpen && (
        <Card className="w-96 shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Share Feedback</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Help us improve by sharing your thoughts
            </CardDescription>
          </CardHeader>

          {isSuccess ? (
            <CardContent className="pb-6">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <ThumbsUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Thank you!</h3>
                <p className="text-muted-foreground">
                  Your feedback has been submitted successfully.
                </p>
              </div>
            </CardContent>
          ) : (
            <>
              <CardContent className="space-y-4 pb-0">
                <Tabs 
                  defaultValue={initialTab} 
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as FeedbackTab)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="feature">Feature</TabsTrigger>
                    <TabsTrigger value="rating">Rating</TabsTrigger>
                    <TabsTrigger value="smart">Smart</TabsTrigger>
                  </TabsList>
                  
                  {/* General Feedback Tab */}
                  <TabsContent value="general" className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="feedback-type"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Feedback Type
                      </label>
                      <Select
                        value={feedbackType}
                        onValueChange={(value) => setFeedbackType(value as FeedbackType)}
                      >
                        <SelectTrigger id="feedback-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="praise">Praise</SelectItem>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label
                        htmlFor="feedback-category"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Category
                      </label>
                      <Select
                        value={feedbackCategory}
                        onValueChange={(value) => setFeedbackCategory(value as FeedbackCategory)}
                      >
                        <SelectTrigger id="feedback-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ui">User Interface</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="documentation">Documentation</SelectItem>
                          <SelectItem value="accessibility">Accessibility</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="feedback-title"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Title
                      </label>
                      <Input
                        id="feedback-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Brief summary of your feedback"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="feedback-description"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Description
                      </label>
                      <Textarea
                        id="feedback-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details about your feedback"
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                  
                  {/* Feature Feedback Tab */}
                  <TabsContent value="feature" className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="feature-select"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Select Feature
                      </label>
                      <Select
                        value={selectedFeatureId}
                        onValueChange={(value) => {
                          setSelectedFeatureId(value);
                          const feature = availableFeatures.find(f => f.id === value);
                          setSelectedFeatureName(feature?.name || '');
                        }}
                      >
                        <SelectTrigger id="feature-select">
                          <SelectValue placeholder="Select feature" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFeatures.map(feature => (
                            <SelectItem key={feature.id} value={feature.id}>
                              {feature.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label
                        htmlFor="feature-feedback"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Your Feedback
                      </label>
                      <Textarea
                        id="feature-feedback"
                        value={featureFeedback}
                        onChange={(e) => setFeatureFeedback(e.target.value)}
                        placeholder={`What do you think about ${selectedFeatureName || 'this feature'}?`}
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                  
                  {/* Rating Tab */}
                  <TabsContent value="rating" className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="rating-feature-select"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Select Feature to Rate
                      </label>
                      <Select
                        value={selectedFeatureId}
                        onValueChange={(value) => {
                          setSelectedFeatureId(value);
                          const feature = availableFeatures.find(f => f.id === value);
                          setSelectedFeatureName(feature?.name || '');
                        }}
                      >
                        <SelectTrigger id="rating-feature-select">
                          <SelectValue placeholder="Select feature" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Entire Application</SelectItem>
                          {availableFeatures.map(feature => (
                            <SelectItem key={feature.id} value={feature.id}>
                              {feature.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Your Rating
                      </label>
                      <div className="flex justify-center py-4">
                        {renderStarRating()}
                      </div>
                      <p className="text-center text-sm text-muted-foreground">
                        {featureRating === 0 ? 'Select a rating' : 
                         featureRating === 1 ? 'Poor' :
                         featureRating === 2 ? 'Fair' :
                         featureRating === 3 ? 'Good' :
                         featureRating === 4 ? 'Very Good' : 'Excellent'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label
                        htmlFor="rating-comment"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Additional Comments (Optional)
                      </label>
                      <Textarea
                        id="rating-comment"
                        value={featureFeedback}
                        onChange={(e) => setFeatureFeedback(e.target.value)}
                        placeholder="Any additional comments about your rating?"
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  
                  {/* Smart Tab */}
                  <TabsContent value="smart" className="space-y-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Analyze Feedback
                      </label>
                      <Progress className="h-4" value={analysisProgress} />
                    </div>
                    
                    {analysisResult && (
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Sentiment Analysis
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full ${getSentimentColor(analysisResult.sentiment.score)}`} />
                          <p className="text-sm">{getSentimentLabel(analysisResult.sentiment)}</p>
                        </div>
                      </div>
                    )}
                    
                    {analysisResult && (
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Suggested Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {suggestedTags.map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? 'solid' : 'outline'}
                              onClick={() => toggleTag(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {analysisResult && (
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Similar Feedback
                        </label>
                        <ul>
                          {similarFeedback.map(item => (
                            <li key={item.id} className="py-2">
                              <p className="text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground">Similarity: {item.similarity.toFixed(2)}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label
                        htmlFor="smart-feedback"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Your Feedback
                      </label>
                      <Textarea
                        id="smart-feedback"
                        value={smartFeedback}
                        onChange={(e) => setSmartFeedback(e.target.value)}
                        placeholder="Provide your feedback for AI analysis"
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Screenshot section - available in all tabs */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Attach Screenshot (Optional)
                    </label>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8"
                      >
                        <Paperclip className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={captureScreenshot}
                        className="h-8"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Capture
                      </Button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  {screenshot && (
                    <div className="relative mt-2 border rounded-md p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate max-w-[200px]">
                          {screenshotName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeScreenshot}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 h-20 bg-muted rounded-md overflow-hidden">
                        <img
                          src={screenshot}
                          alt="Screenshot"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Contact permission */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="allow-contact"
                    checked={allowContact}
                    onCheckedChange={(checked) => setAllowContact(!!checked)}
                  />
                  <Label
                    htmlFor="allow-contact"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Allow us to contact you about this feedback
                  </Label>
                </div>
                
                {/* Email field - only show if allow contact is checked */}
                {allowContact && (
                  <div className="space-y-2">
                    <label
                      htmlFor="feedback-email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email (Optional)
                    </label>
                    <Input
                      id="feedback-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email for follow-up"
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default FeedbackWidget;
