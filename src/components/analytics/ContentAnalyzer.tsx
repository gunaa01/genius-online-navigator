
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import RealTimeMetricsCard from './RealTimeMetricsCard';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

const ContentAnalyzer: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    readability: number;
    sentiment: number;
    seo: number;
    engagement: number;
  }>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleAnalyzeContent = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    
    // Simulating API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated analysis results
      setAnalysisResults({
        readability: Math.floor(Math.random() * 30) + 70, // 70-100
        sentiment: Math.floor(Math.random() * 60) + 40, // 40-100
        seo: Math.floor(Math.random() * 40) + 60, // 60-100
        engagement: Math.floor(Math.random() * 50) + 50, // 50-100
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your content here to analyze readability, SEO, sentiment, and engagement potential..."
              value={content}
              onChange={handleContentChange}
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleAnalyzeContent} 
              disabled={isAnalyzing || content.trim() === ''}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Content'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RealTimeMetricsCard
            title="Readability Score"
            metric={analysisResults.readability}
            suffix="%"
            previousMetric={75}
          />
          
          <RealTimeMetricsCard
            title="Sentiment Analysis"
            metric={analysisResults.sentiment}
            suffix="%"
            previousMetric={60}
          />
          
          <RealTimeMetricsCard
            title="SEO Optimization"
            metric={analysisResults.seo}
            suffix="%"
            previousMetric={70}
          />
          
          <RealTimeMetricsCard
            title="Engagement Potential"
            metric={analysisResults.engagement}
            suffix="%"
            previousMetric={55}
          />
        </div>
      )}

      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Content Improvement Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Readability</h4>
                  <span className={`text-sm font-medium ${getMetricColor(analysisResults.readability)}`}>
                    {analysisResults.readability}%
                  </span>
                </div>
                <Progress value={analysisResults.readability} className="h-2" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {analysisResults.readability >= 80 ? (
                    <span className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" /> Great readability! Your content is easy to understand.
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" /> Try using shorter sentences and simpler language to improve readability.
                    </span>
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">SEO Optimization</h4>
                  <span className={`text-sm font-medium ${getMetricColor(analysisResults.seo)}`}>
                    {analysisResults.seo}%
                  </span>
                </div>
                <Progress value={analysisResults.seo} className="h-2" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {analysisResults.seo >= 80 ? (
                    <span className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" /> Good keyword usage and structure for search engines.
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" /> Consider adding more relevant keywords and improving meta descriptions.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentAnalyzer;
