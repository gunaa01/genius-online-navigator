import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BarChart, 
  Sparkles, 
  Eye, 
  ThumbsUp, 
  Clock, 
  ArrowRight, 
  Search,
  MessageSquare,
  CheckCircle2,
  Target,
  EyeOff,
  RefreshCw,
  Layers,
  Loader2,
  Share2,
  Download
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Progress
} from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ContentIntelligenceProps {
  onApplyInsights?: (insights: ContentInsight[]) => void;
}

interface CompetitorContent {
  id: string;
  title: string;
  url: string;
  publishDate: string;
  readingTime: number;
  engagementScore: number;
  contentType: string;
  shareCount: number;
  commentCount: number;
  keywordDensity: {[key: string]: number};
  topics: string[];
  sentimentScore: number;
}

interface ContentInsight {
  id: string;
  type: 'opportunity' | 'gap' | 'improvement' | 'trend';
  title: string;
  description: string;
  relevanceScore: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  relatedCompetitorContent?: string[];
}

export default function ContentIntelligence({ onApplyInsights }: ContentIntelligenceProps) {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState('');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorInput, setCompetitorInput] = useState('');
  const [topicFocus, setTopicFocus] = useState('');
  const [competitorContent, setCompetitorContent] = useState<CompetitorContent[]>([]);
  const [insights, setInsights] = useState<ContentInsight[]>([]);
  const [activeInsightTab, setActiveInsightTab] = useState('all');
  const [selectedInsights, setSelectedInsights] = useState<Set<string>>(new Set());
  
  // Add a competitor
  const addCompetitor = () => {
    if (competitorInput && !competitors.includes(competitorInput)) {
      setCompetitors([...competitors, competitorInput]);
      setCompetitorInput('');
    }
  };
  
  // Remove a competitor
  const removeCompetitor = (competitor: string) => {
    setCompetitors(competitors.filter(c => c !== competitor));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeCompetitorContent();
  };
  
  // Mock function to analyze competitor content
  const analyzeCompetitorContent = async () => {
    if (!target || competitors.length === 0) {
      setError('Please enter your website URL and at least one competitor');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock data - in a real application, this would be returned from an API
      const mockCompetitorContent: CompetitorContent[] = [
        {
          id: '1',
          title: 'The Complete Guide to Marketing Automation in 2023',
          url: 'https://competitor1.com/marketing-automation-guide',
          publishDate: '2023-11-15',
          readingTime: 12,
          engagementScore: 87,
          contentType: 'guide',
          shareCount: 452,
          commentCount: 38,
          keywordDensity: {
            'marketing automation': 3.2,
            'automation platform': 1.8,
            'email automation': 2.5,
            'lead generation': 1.6
          },
          topics: ['Marketing Automation', 'Lead Generation', 'Email Marketing'],
          sentimentScore: 0.67
        },
        {
          id: '2',
          title: 'How AI is Transforming Content Creation for Marketers',
          url: 'https://competitor2.com/ai-content-creation',
          publishDate: '2023-09-22',
          readingTime: 8,
          engagementScore: 92,
          contentType: 'article',
          shareCount: 734,
          commentCount: 56,
          keywordDensity: {
            'ai content': 2.9,
            'content generation': 2.1,
            'ai marketing': 1.7,
            'content strategy': 1.5
          },
          topics: ['AI Content', 'Content Strategy', 'MarTech'],
          sentimentScore: 0.81
        },
        {
          id: '3',
          title: '10 Social Media Analytics Tools You Need in Your Stack',
          url: 'https://competitor1.com/social-media-analytics-tools',
          publishDate: '2023-10-05',
          readingTime: 6,
          engagementScore: 76,
          contentType: 'listicle',
          shareCount: 289,
          commentCount: 17,
          keywordDensity: {
            'social analytics': 2.7,
            'analytics tools': 2.3,
            'social media marketing': 1.9,
            'data visualization': 1.2
          },
          topics: ['Social Media Analytics', 'Marketing Tools', 'Data Analysis'],
          sentimentScore: 0.59
        },
        {
          id: '4',
          title: 'The ROI of Automation: Case Studies from Enterprise Brands',
          url: 'https://competitor3.com/automation-roi-case-studies',
          publishDate: '2023-12-01',
          readingTime: 15,
          engagementScore: 83,
          contentType: 'case study',
          shareCount: 176,
          commentCount: 23,
          keywordDensity: {
            'automation roi': 3.1,
            'marketing roi': 2.2,
            'case study': 1.8,
            'enterprise automation': 1.5
          },
          topics: ['ROI', 'Case Studies', 'Enterprise Marketing', 'Automation'],
          sentimentScore: 0.72
        },
        {
          id: '5',
          title: 'Content Personalization at Scale: The Ultimate Guide',
          url: 'https://competitor2.com/content-personalization-guide',
          publishDate: '2023-08-17',
          readingTime: 11,
          engagementScore: 89,
          contentType: 'guide',
          shareCount: 512,
          commentCount: 42,
          keywordDensity: {
            'content personalization': 3.4,
            'personalization strategy': 2.1,
            'customer segmentation': 1.9,
            'marketing automation': 1.6
          },
          topics: ['Personalization', 'Content Strategy', 'Customer Experience'],
          sentimentScore: 0.75
        }
      ];
      
      const mockInsights: ContentInsight[] = [
        {
          id: '1',
          type: 'gap',
          title: 'Missing content on AI content ROI',
          description: 'Competitors have comprehensive guides on AI content ROI with case studies, but your site lacks this content type. This is a high-search topic in your industry.',
          relevanceScore: 92,
          impact: 'high',
          actionable: true,
          relatedCompetitorContent: ['2']
        },
        {
          id: '2',
          type: 'improvement',
          title: 'Enhance engagement on automation articles',
          description: 'Your automation content has 62% lower engagement than competitors. Adding interactive elements and case studies could improve performance significantly.',
          relevanceScore: 85,
          impact: 'medium',
          actionable: true,
          relatedCompetitorContent: ['1', '4']
        },
        {
          id: '3',
          type: 'opportunity',
          title: 'Emerging topic: Personalization + AI',
          description: 'Content combining personalization and AI is gaining traction with 3x higher shares. Creating an in-depth guide could position you as a thought leader.',
          relevanceScore: 88,
          impact: 'high',
          actionable: true,
          relatedCompetitorContent: ['2', '5']
        },
        {
          id: '4',
          type: 'trend',
          title: 'Case studies outperforming other formats',
          description: 'Case study content is receiving 47% more engagement than other formats across your industry, but makes up only 12% of your content.',
          relevanceScore: 78,
          impact: 'medium',
          actionable: true,
          relatedCompetitorContent: ['4']
        },
        {
          id: '5',
          type: 'gap',
          title: 'Lack of social media analytics content',
          description: 'Competitors are ranking for high-volume social media analytics keywords, while your site has minimal content on this topic.',
          relevanceScore: 81,
          impact: 'medium',
          actionable: true,
          relatedCompetitorContent: ['3']
        }
      ];
      
      setCompetitorContent(mockCompetitorContent);
      setInsights(mockInsights);
      setAnalyzed(true);
    } catch (err) {
      setError('Failed to analyze competitor content. Please try again.');
      console.error('Error analyzing content:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter insights based on tab
  const filteredInsights = insights.filter(insight => {
    if (activeInsightTab === 'all') return true;
    return insight.type === activeInsightTab;
  });
  
  // Toggle insight selection
  const toggleInsight = (id: string) => {
    const newSelected = new Set(selectedInsights);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInsights(newSelected);
  };
  
  // Apply selected insights
  const applySelectedInsights = () => {
    if (onApplyInsights && selectedInsights.size > 0) {
      const insightsToApply = insights.filter(i => selectedInsights.has(i.id));
      onApplyInsights(insightsToApply);
    }
  };
  
  // Get the content that an insight is related to
  const getRelatedContent = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (!insight || !insight.relatedCompetitorContent) return [];
    
    return competitorContent.filter(c => 
      insight.relatedCompetitorContent?.includes(c.id)
    );
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Get color for impact label
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get icon for insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="h-5 w-5 text-green-500" />;
      case 'gap': return <EyeOff className="h-5 w-5 text-red-500" />;
      case 'improvement': return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case 'trend': return <BarChart className="h-5 w-5 text-purple-500" />;
      default: return <CheckCircle2 className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Content Intelligence
          </CardTitle>
          <CardDescription>
            Analyze competitor content to uncover gaps, opportunities, and trending topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="target-url" className="text-sm font-medium block mb-1">
                  Your Website URL
                </label>
                <Input
                  id="target-url"
                  placeholder="https://your-website.com"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="topic-focus" className="text-sm font-medium block mb-1">
                  Topic Focus (Optional)
                </label>
                <Input
                  id="topic-focus"
                  placeholder="e.g., Marketing Automation, AI Content"
                  value={topicFocus}
                  onChange={(e) => setTopicFocus(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">
                Competitor Websites (add at least one)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://competitor.com"
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={addCompetitor}
                  variant="outline"
                  disabled={!competitorInput}
                >
                  Add
                </Button>
              </div>
            </div>
            
            {competitors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {competitors.map((competitor, index) => (
                  <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                    {competitor}
                    <button 
                      type="button" 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => removeCompetitor(competitor)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !target || competitors.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Competitor Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {analyzed && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Content Intelligence Insights</CardTitle>
              <CardDescription>
                AI-powered analysis of {competitorContent.length} content pieces from {competitors.length} competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeInsightTab} onValueChange={setActiveInsightTab}>
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="all">All Insights</TabsTrigger>
                  <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
                  <TabsTrigger value="gap">Content Gaps</TabsTrigger>
                  <TabsTrigger value="improvement">Improvements</TabsTrigger>
                  <TabsTrigger value="trend">Trends</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeInsightTab} className="mt-0">
                  <div className="space-y-4">
                    {filteredInsights.map((insight) => (
                      <div 
                        key={insight.id} 
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">{getInsightIcon(insight.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">{insight.title}</h3>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(insight.impact)}`}>
                                  {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                                </span>
                                <input
                                  type="checkbox"
                                  checked={selectedInsights.has(insight.id)}
                                  onChange={() => toggleInsight(insight.id)}
                                  className="rounded border-gray-300"
                                />
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-1">{insight.description}</p>
                            
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                              </span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center">
                                <Target className="h-3 w-3 mr-1" />
                                {insight.relevanceScore}% Relevance
                              </span>
                            </div>
                            
                            {insight.relatedCompetitorContent && insight.relatedCompetitorContent.length > 0 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                                    View related competitor content ({insight.relatedCompetitorContent.length})
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                  <div className="p-4 border-b">
                                    <h4 className="font-medium">Related Competitor Content</h4>
                                  </div>
                                  <div className="max-h-[300px] overflow-y-auto">
                                    {getRelatedContent(insight.id).map((content) => (
                                      <div key={content.id} className="p-4 border-b last:border-b-0">
                                        <h5 className="font-medium text-sm">{content.title}</h5>
                                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                          <span className="flex items-center">
                                            <Eye className="h-3 w-3 mr-1" />
                                            {content.contentType}
                                          </span>
                                          <span className="flex items-center">
                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                            {content.engagementScore}% engagement
                                          </span>
                                          <span className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {content.readingTime} min read
                                          </span>
                                          <span className="flex items-center">
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            {content.commentCount} comments
                                          </span>
                                          <span className="flex items-center">
                                            <Share2 className="h-3 w-3 mr-1" />
                                            {content.shareCount} shares
                                          </span>
                                        </div>
                                        <div className="mt-2 text-xs">
                                          <a 
                                            href={content.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center"
                                          >
                                            View content <ArrowRight className="h-3 w-3 ml-1" />
                                          </a>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedInsights.size} of {filteredInsights.length} insights selected
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                    <DropdownMenuItem>Export as JSON</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  onClick={applySelectedInsights}
                  disabled={selectedInsights.size === 0}
                >
                  Apply Selected Insights
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Competitor Content Analysis</CardTitle>
              <CardDescription>
                In-depth analysis of top-performing content from competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2">
                    <CardHeader className="py-4 px-5">
                      <CardTitle className="text-base">Top Content Types</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 px-5">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Guides</span>
                            <span className="font-medium">42%</span>
                          </div>
                          <Progress value={42} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Case Studies</span>
                            <span className="font-medium">28%</span>
                          </div>
                          <Progress value={28} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Articles</span>
                            <span className="font-medium">18%</span>
                          </div>
                          <Progress value={18} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Listicles</span>
                            <span className="font-medium">12%</span>
                          </div>
                          <Progress value={12} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2">
                    <CardHeader className="py-4 px-5">
                      <CardTitle className="text-base">Popular Topics</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 px-5">
                      <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-2 bg-primary/10 rounded-full text-primary text-sm">
                          Marketing Automation
                        </div>
                        <div className="px-3 py-2 bg-primary/10 rounded-full text-primary text-sm">
                          AI Content
                        </div>
                        <div className="px-3 py-2 bg-primary/10 rounded-full text-primary text-sm">
                          Personalization
                        </div>
                        <div className="px-3 py-2 bg-primary/10 rounded-full text-primary text-sm">
                          ROI
                        </div>
                        <div className="px-3 py-2 bg-primary/10 rounded-full text-primary text-sm">
                          Social Analytics
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2">
                    <CardHeader className="py-4 px-5">
                      <CardTitle className="text-base">Engagement Factors</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 px-5">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Interactive Elements</span>
                            <span className="font-medium">+64%</span>
                          </div>
                          <Progress value={64} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Case Studies</span>
                            <span className="font-medium">+47%</span>
                          </div>
                          <Progress value={47} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Visual Content</span>
                            <span className="font-medium">+38%</span>
                          </div>
                          <Progress value={38} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Expert Quotes</span>
                            <span className="font-medium">+31%</span>
                          </div>
                          <Progress value={31} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-3 font-medium">
                    Top Performing Competitor Content
                  </div>
                  <div className="divide-y">
                    {competitorContent
                      .sort((a, b) => b.engagementScore - a.engagementScore)
                      .map((content) => (
                        <div key={content.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-medium">{content.title}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {content.contentType}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {content.readingTime} min read
                                </span>
                                <span className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {content.engagementScore}% engagement
                                </span>
                                <span>
                                  Published: {formatDate(content.publishDate)}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {content.topics.map((topic, i) => (
                                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <a 
                              href={content.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="shrink-0"
                            >
                              <Button variant="outline" size="sm" className="whitespace-nowrap">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                View Content
                              </Button>
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}