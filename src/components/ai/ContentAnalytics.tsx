import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { AlertCircle, Check, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface ContentAnalyticsProps {
  seoScore: number;
  readabilityScore: number;
  suggestions: string[];
  onImprove: (focus: 'seo' | 'readability' | 'engagement') => void;
  isAnalyzing?: boolean;
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getScoreText = (score: number): { text: string; color: string } => {
  if (score >= 90) return { text: 'Excellent', color: 'text-green-500' };
  if (score >= 70) return { text: 'Good', color: 'text-yellow-500' };
  return { text: 'Needs Improvement', color: 'text-red-500' };
};

const ContentAnalytics: React.FC<ContentAnalyticsProps> = ({
  seoScore,
  readabilityScore,
  suggestions,
  onImprove,
  isAnalyzing = false,
}) => {
  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Analysis</CardTitle>
          <CardDescription>Analyzing your content...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const seoScoreInfo = getScoreText(seoScore);
  const readabilityScoreInfo = getScoreText(readabilityScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Analysis</CardTitle>
        <CardDescription>Analysis and optimization suggestions for your content</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="readability">Readability</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">SEO Score</h3>
                  <Badge variant={seoScore >= 70 ? "default" : "destructive"}>
                    {seoScore}/100
                  </Badge>
                </div>
                <Progress value={seoScore} className={getScoreColor(seoScore)} />
                <p className={`text-xs ${seoScoreInfo.color}`}>{seoScoreInfo.text}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Readability Score</h3>
                  <Badge variant={readabilityScore >= 70 ? "default" : "destructive"}>
                    {readabilityScore}/100
                  </Badge>
                </div>
                <Progress value={readabilityScore} className={getScoreColor(readabilityScore)} />
                <p className={`text-xs ${readabilityScoreInfo.color}`}>{readabilityScoreInfo.text}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Improvement Suggestions</h3>
              
              {suggestions.length === 0 ? (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertTitle>Great job!</AlertTitle>
                  <AlertDescription>
                    Your content looks good with no major issues.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <Alert key={index} variant="default">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{suggestion}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">SEO Score</h3>
                <Badge variant={seoScore >= 70 ? "default" : "destructive"}>
                  {seoScore}/100
                </Badge>
              </div>
              <Progress value={seoScore} className={getScoreColor(seoScore)} />
              <p className={`text-xs ${seoScoreInfo.color}`}>{seoScoreInfo.text}</p>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>SEO Analysis</AlertTitle>
              <AlertDescription>
                Our AI analyzes keyword density, meta information, headers structure, 
                and content readability to determine SEO effectiveness.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => onImprove('seo')} 
              className="w-full"
              variant="default"
            >
              Optimize for SEO
            </Button>
          </TabsContent>
          
          <TabsContent value="readability" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Readability Score</h3>
                <Badge variant={readabilityScore >= 70 ? "default" : "destructive"}>
                  {readabilityScore}/100
                </Badge>
              </div>
              <Progress value={readabilityScore} className={getScoreColor(readabilityScore)} />
              <p className={`text-xs ${readabilityScoreInfo.color}`}>{readabilityScoreInfo.text}</p>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Readability Analysis</AlertTitle>
              <AlertDescription>
                We analyze sentence length, paragraph structure, vocabulary complexity, 
                and overall flow to determine how readable your content is.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => onImprove('readability')} 
              className="w-full"
              variant="default"
            >
              Improve Readability
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentAnalytics;