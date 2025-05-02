
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart, LineChart, PieChart, ResponsiveContainer, 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  Line, Pie, Cell 
} from 'recharts';
import { 
  FileText, BarChart2, TrendingUp, 
  PieChart as PieChartIcon, Download, Filter, RefreshCw,
  CheckCircle, AlertCircle, HelpCircle
} from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Sample data for demonstration
const sampleContentData = {
  readabilityScore: 72,
  seoScore: 85,
  sentimentScore: 64,
  keywords: [
    { word: 'marketing', count: 12, relevance: 0.85 },
    { word: 'strategy', count: 8, relevance: 0.72 },
    { word: 'business', count: 7, relevance: 0.68 },
    { word: 'digital', count: 6, relevance: 0.65 },
    { word: 'content', count: 5, relevance: 0.62 },
  ],
  recommendations: [
    { id: 1, type: 'readability', text: 'Consider breaking up longer paragraphs for better readability.' },
    { id: 2, type: 'seo', text: 'Add more internal links to improve SEO performance.' },
    { id: 3, type: 'seo', text: 'Increase keyword density for "digital marketing" to 2-3%.' },
    { id: 4, type: 'sentiment', text: 'The tone is slightly negative in the third paragraph, consider rephrasing.' },
  ],
  metrics: {
    wordCount: 1240,
    readTime: 5.2, // minutes
    sentenceCount: 62,
    flesch: 58,
    complexity: 'moderate'
  }
};

// COLORS
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ContentAnalyzer: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState(sampleContentData);
  
  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call
    try {
      // In a real app, this would be an API call to analyze the content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use sample data for demonstration
      setAnalysisResults(sampleContentData);
      setHasResults(true);
      toast.success('Content analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <HelpCircle className="h-5 w-5 text-amber-500" />;
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Content Analyzer</CardTitle>
          <CardDescription>
            Paste your content below to get AI-powered insights on readability, SEO optimization, and sentiment analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your content here (article, blog post, product description, etc.)"
            className="min-h-[200px] mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button 
            onClick={handleAnalyzeContent}
            disabled={isAnalyzing || !content.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Content...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Analyze Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {hasResults && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered insights for your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
                <TabsTrigger value="readability">Readability</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        SEO Score
                        {getScoreIcon(analysisResults.seoScore)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2 flex items-baseline gap-2">
                        <span className={getScoreColor(analysisResults.seoScore)}>
                          {analysisResults.seoScore}
                        </span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                      <Progress value={analysisResults.seoScore} className="h-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        Readability Score
                        {getScoreIcon(analysisResults.readabilityScore)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2 flex items-baseline gap-2">
                        <span className={getScoreColor(analysisResults.readabilityScore)}>
                          {analysisResults.readabilityScore}
                        </span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                      <Progress value={analysisResults.readabilityScore} className="h-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        Sentiment Score
                        {getScoreIcon(analysisResults.sentimentScore)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2 flex items-baseline gap-2">
                        <span className={getScoreColor(analysisResults.sentimentScore)}>
                          {analysisResults.sentimentScore}
                        </span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                      <Progress value={analysisResults.sentimentScore} className="h-2" />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysisResults.recommendations.map(rec => (
                        <Alert key={rec.id}>
                          <AlertDescription className="flex items-start">
                            <Badge variant="outline" className="mr-2 capitalize">
                              {rec.type}
                            </Badge>
                            {rec.text}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Keyword Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.keywords.map((keyword, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary"
                            style={{ opacity: 0.5 + keyword.relevance / 2 }}
                          >
                            {keyword.word} <span className="ml-1 opacity-70">{keyword.count}</span>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="h-[250px] mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            width={500}
                            height={300}
                            data={analysisResults.keywords}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="word" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Occurrences" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="readability" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Word Count</Label>
                        <p className="text-2xl font-bold">{analysisResults.metrics.wordCount}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Reading Time</Label>
                        <p className="text-2xl font-bold">{analysisResults.metrics.readTime} min</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Sentences</Label>
                        <p className="text-2xl font-bold">{analysisResults.metrics.sentenceCount}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Complexity</Label>
                        <p className="text-2xl font-bold capitalize">{analysisResults.metrics.complexity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sentiment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                      <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Detailed sentiment analysis coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Analysis Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ContentAnalyzer;
