import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Wand2, Copy, Check, RefreshCw, Zap, AlertTriangle, ThumbsUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import * as socialMediaService from '@/services/social-media/socialMediaService';
import * as aiContentService from '@/services/social-media/aiContentService';

/**
 * Content Optimizer Page
 * 
 * AI-powered tool to analyze and optimize social media content
 * Includes readability, sentiment, engagement, and SEO analysis
 */
export default function ContentOptimizerPage({ platforms }: {
  platforms: socialMediaService.SocialMediaPlatform[];
}) {
  const router = useRouter();
  const { preferences } = useAccessibility();
  
  // Form state
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('');
  const [optimizationGoals, setOptimizationGoals] = useState<('engagement' | 'conversion' | 'reach' | 'clarity')[]>(['engagement']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Analysis results
  const [analysisResult, setAnalysisResult] = useState<aiContentService.ContentAnalysisResult | null>(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<aiContentService.ContentOptimizationSuggestion[]>([]);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<aiContentService.HashtagSuggestion[]>([]);
  const [performancePrediction, setPerformancePrediction] = useState<any>(null);
  
  // Copied state
  const [copiedOptimization, setCopiedOptimization] = useState<string | null>(null);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  
  // Handle content analysis
  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter content to analyze.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Analyze content
      const result = await aiContentService.analyzeContent(content, platform || undefined);
      setAnalysisResult(result);
      
      // Get hashtag suggestions
      const hashtags = await aiContentService.getHashtagSuggestions(content, platform || undefined);
      setHashtagSuggestions(hashtags);
      
      // Predict performance
      const prediction = await aiContentService.predictContentPerformance(content, platform || undefined);
      setPerformancePrediction(prediction);
      
      toast({
        title: 'Analysis Complete',
        description: 'Your content has been analyzed successfully.',
      });
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle content optimization
  const handleOptimizeContent = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter content to optimize.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsOptimizing(true);
      
      // Get optimization suggestions
      const suggestions = await aiContentService.getOptimizationSuggestions(
        content,
        platform || undefined,
        optimizationGoals
      );
      setOptimizationSuggestions(suggestions);
      
      toast({
        title: 'Optimization Complete',
        description: 'Your content has been optimized successfully.',
      });
    } catch (error) {
      console.error('Error optimizing content:', error);
      toast({
        title: 'Error',
        description: 'Failed to optimize content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Copy optimization to clipboard
  const copyOptimization = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOptimization(text);
    
    setTimeout(() => {
      setCopiedOptimization(null);
    }, 2000);
    
    toast({
      title: 'Copied',
      description: 'Optimized content copied to clipboard.',
    });
  };
  
  // Copy hashtags to clipboard
  const copyHashtags = () => {
    const hashtagText = hashtagSuggestions.map(h => `#${h.tag}`).join(' ');
    navigator.clipboard.writeText(hashtagText);
    setCopiedHashtags(true);
    
    setTimeout(() => {
      setCopiedHashtags(false);
    }, 2000);
    
    toast({
      title: 'Copied',
      description: 'Hashtags copied to clipboard.',
    });
  };
  
  // Apply optimization to content
  const applyOptimization = (optimizedContent: string) => {
    setContent(optimizedContent);
    
    toast({
      title: 'Applied',
      description: 'Optimized content applied to editor.',
    });
  };
  
  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Get progress color
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <>
      <Head>
        <title>Content Optimizer | Genius Online Navigator</title>
        <meta name="description" content="AI-powered tool to analyze and optimize your social media content. Improve engagement, readability, and performance." />
        <meta name="keywords" content="content optimization, AI, social media, engagement, analytics" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Content Optimizer | Genius Online Navigator" />
        <meta property="og:description" content="AI-powered tool to analyze and optimize your social media content." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/social-media/content-optimizer`} />
      </Head>
      
      <AdminLayout
        title="Content Optimizer"
        description="AI-powered tool to analyze and optimize your social media content"
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
              variant="default"
              size="sm"
              onClick={handleAnalyzeContent}
              disabled={isAnalyzing || !content.trim()}
              aria-label="Analyze content"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleOptimizeContent}
              disabled={isOptimizing || !content.trim()}
              aria-label="Optimize content"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Optimize
                </>
              )}
            </Button>
          </div>
        }
      >
        <div 
          id="main-content"
          className={`space-y-8 ${preferences.largeText ? 'text-lg' : ''}`}
          role="main"
          aria-label="Content Optimizer"
          tabIndex={-1}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Editor</CardTitle>
                  <CardDescription>
                    Enter your social media content to analyze and optimize
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Platforms</SelectItem>
                        {platforms.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter your social media content here..."
                      className="min-h-[200px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{content.length} characters</span>
                      <span>
                        {platform === 'twitter' && (
                          <>
                            {280 - content.length} characters remaining
                            {content.length > 280 && (
                              <span className="text-red-500 ml-2">
                                (Exceeds limit)
                              </span>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Optimization Goals</Label>
                    <div className="flex flex-wrap gap-2">
                      {(['engagement', 'conversion', 'reach', 'clarity'] as const).map((goal) => (
                        <Badge
                          key={goal}
                          variant={optimizationGoals.includes(goal) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            setOptimizationGoals((prev) =>
                              prev.includes(goal)
                                ? prev.filter((g) => g !== goal)
                                : [...prev, goal]
                            );
                          }}
                        >
                          {goal.charAt(0).toUpperCase() + goal.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {optimizationSuggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Suggestions</CardTitle>
                    <CardDescription>
                      AI-generated improvements for your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {optimizationSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border rounded-md p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Optimized Version</h4>
                            <p className="text-sm text-muted-foreground">
                              Confidence Score: {suggestion.confidenceScore * 100}%
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyOptimization(suggestion.optimized)}
                              aria-label="Copy optimized content"
                            >
                              {copiedOptimization === suggestion.optimized ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => applyOptimization(suggestion.optimized)}
                              aria-label="Apply optimized content"
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded-md">
                          {suggestion.optimized}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm">Improvements</h4>
                          <ul className="mt-1 space-y-1">
                            {suggestion.improvementAreas.map((area, index) => (
                              <li key={index} className="text-sm flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-2 text-green-500" />
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {hashtagSuggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Hashtag Suggestions</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyHashtags}
                        aria-label="Copy all hashtags"
                      >
                        {copiedHashtags ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        Copy All
                      </Button>
                    </div>
                    <CardDescription>
                      Recommended hashtags for your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {hashtagSuggestions.map((hashtag) => (
                        <Badge
                          key={hashtag.tag}
                          variant="outline"
                          className={`text-sm ${
                            hashtag.recentTrend === 'rising'
                              ? 'border-green-500'
                              : hashtag.recentTrend === 'falling'
                              ? 'border-red-500'
                              : ''
                          }`}
                        >
                          #{hashtag.tag}
                          {hashtag.recentTrend === 'rising' && (
                            <span className="ml-1 text-green-500">↑</span>
                          )}
                          {hashtag.recentTrend === 'falling' && (
                            <span className="ml-1 text-red-500">↓</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-6">
              {analysisResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Content Analysis</CardTitle>
                    <CardDescription>
                      AI analysis of your content quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Overall Score</h4>
                        <span className={`font-bold text-xl ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score}/100
                        </span>
                      </div>
                      <Progress value={analysisResult.score} className={getProgressColor(analysisResult.score)} />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">Readability</h4>
                          <span className={`font-medium ${getScoreColor(analysisResult.readability.score)}`}>
                            {analysisResult.readability.score}/100
                          </span>
                        </div>
                        <div className="text-sm">
                          Level: <span className="font-medium">{analysisResult.readability.level}</span>
                        </div>
                        {analysisResult.readability.suggestions.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {analysisResult.readability.suggestions.map((suggestion, index) => (
                              <p key={index} className="text-xs flex items-start">
                                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>{suggestion}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">Sentiment</h4>
                          <span className={`font-medium ${getScoreColor(analysisResult.sentiment.score)}`}>
                            {analysisResult.sentiment.score}/100
                          </span>
                        </div>
                        <div className="text-sm">
                          Type: <span className="font-medium">{analysisResult.sentiment.type}</span>
                        </div>
                        {analysisResult.sentiment.suggestions.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {analysisResult.sentiment.suggestions.map((suggestion, index) => (
                              <p key={index} className="text-xs flex items-start">
                                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>{suggestion}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">Engagement</h4>
                          <span className={`font-medium ${getScoreColor(analysisResult.engagement.score)}`}>
                            {analysisResult.engagement.score}/100
                          </span>
                        </div>
                        {analysisResult.engagement.suggestions.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {analysisResult.engagement.suggestions.map((suggestion, index) => (
                              <p key={index} className="text-xs flex items-start">
                                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>{suggestion}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">SEO</h4>
                          <span className={`font-medium ${getScoreColor(analysisResult.seo.score)}`}>
                            {analysisResult.seo.score}/100
                          </span>
                        </div>
                        {analysisResult.seo.suggestions.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {analysisResult.seo.suggestions.map((suggestion, index) => (
                              <p key={index} className="text-xs flex items-start">
                                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>{suggestion}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {analysisResult.grammar.issues.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm">Grammar & Spelling</h4>
                            <span className={`font-medium ${getScoreColor(analysisResult.grammar.score)}`}>
                              {analysisResult.grammar.score}/100
                            </span>
                          </div>
                          <div className="mt-1 space-y-1">
                            {analysisResult.grammar.issues.map((issue, index) => (
                              <p key={index} className="text-xs flex items-start">
                                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>
                                  Replace "{issue.text}" with "{issue.suggestion}"
                                </span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {performancePrediction && (
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Prediction</CardTitle>
                    <CardDescription>
                      Expected performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Engagement Score</h4>
                        <span className={`font-medium ${getScoreColor(performancePrediction.engagementScore)}`}>
                          {performancePrediction.engagementScore}/100
                        </span>
                      </div>
                      <Progress value={performancePrediction.engagementScore} className={getProgressColor(performancePrediction.engagementScore)} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Reach Score</h4>
                        <span className={`font-medium ${getScoreColor(performancePrediction.reachScore)}`}>
                          {performancePrediction.reachScore}/100
                        </span>
                      </div>
                      <Progress value={performancePrediction.reachScore} className={getProgressColor(performancePrediction.reachScore)} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Conversion Score</h4>
                        <span className={`font-medium ${getScoreColor(performancePrediction.conversionScore)}`}>
                          {performancePrediction.conversionScore}/100
                        </span>
                      </div>
                      <Progress value={performancePrediction.conversionScore} className={getProgressColor(performancePrediction.conversionScore)} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Audience Match</h4>
                        <span className={`font-medium ${getScoreColor(performancePrediction.audienceMatch)}`}>
                          {performancePrediction.audienceMatch}/100
                        </span>
                      </div>
                      <Progress value={performancePrediction.audienceMatch} className={getProgressColor(performancePrediction.audienceMatch)} />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Best Time to Post</h4>
                      <p className="text-sm">
                        {performancePrediction.bestTimeToPost.day} at {performancePrediction.bestTimeToPost.hour}:00
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Keep your content concise and engaging</li>
                    <li>• Use questions to encourage comments</li>
                    <li>• Include a clear call-to-action</li>
                    <li>• Add relevant hashtags to increase reach</li>
                    <li>• Use emojis to add personality</li>
                    <li>• Include visuals when possible</li>
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
    // Fetch platforms
    const platforms = await socialMediaService.getPlatforms();
    
    return {
      props: {
        platforms,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty data on error
    return {
      props: {
        platforms: [],
      },
    };
  }
};
