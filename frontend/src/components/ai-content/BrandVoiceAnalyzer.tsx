import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';

interface BrandVoiceAnalyzerProps {
  brandVoiceProfiles: contentGenerationService.BrandVoiceProfile[];
}

/**
 * Brand Voice Analyzer
 * 
 * Analyzes content for brand voice consistency
 */
export default function BrandVoiceAnalyzer({
  brandVoiceProfiles
}: BrandVoiceAnalyzerProps) {
  // State
  const [content, setContent] = useState('');
  const [brandVoiceId, setBrandVoiceId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    matchedAttributes: string[];
    unmatchedAttributes: string[];
    prohibitedWords: { word: string; index: number }[];
    suggestions: string[];
  } | null>(null);
  
  // Handle analyze content
  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter content to analyze.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!brandVoiceId) {
      toast({
        title: 'Error',
        description: 'Please select a brand voice profile.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Analyze content
      const result = await contentGenerationService.analyzeBrandVoiceConsistency(
        content,
        brandVoiceId
      );
      
      setAnalysisResult(result);
      
      toast({
        title: 'Analysis Complete',
        description: 'Your content has been analyzed for brand voice consistency.',
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
  
  // Get selected profile
  const selectedProfile = brandVoiceProfiles.find(p => p.id === brandVoiceId);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Voice Analyzer</CardTitle>
          <CardDescription>
            Analyze content for brand voice consistency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-voice">Brand Voice Profile</Label>
            <Select
              value={brandVoiceId}
              onValueChange={setBrandVoiceId}
            >
              <SelectTrigger id="brand-voice">
                <SelectValue placeholder="Select brand voice profile" />
              </SelectTrigger>
              <SelectContent>
                {brandVoiceProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedProfile && (
            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="text-sm font-medium mb-2">{selectedProfile.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{selectedProfile.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedProfile.toneAttributes.map((attr) => (
                  <Badge key={attr} variant="outline" className="text-xs">
                    {attr}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="content">Content to Analyze</Label>
            <Textarea
              id="content"
              placeholder="Enter content to analyze for brand voice consistency"
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleAnalyzeContent}
            disabled={isAnalyzing || !content.trim() || !brandVoiceId}
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
        </CardFooter>
      </Card>
      
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Brand voice consistency analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">Overall Consistency Score</h3>
                <span className={`font-bold text-xl ${getScoreColor(analysisResult.score)}`}>
                  {analysisResult.score}/100
                </span>
              </div>
              <Progress value={analysisResult.score} className={getProgressColor(analysisResult.score)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Matched Attributes</h3>
                  {analysisResult.matchedAttributes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matchedAttributes.map((attr) => (
                        <Badge key={attr} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {attr}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No matched attributes found.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Unmatched Attributes</h3>
                  {analysisResult.unmatchedAttributes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.unmatchedAttributes.map((attr) => (
                        <Badge key={attr} variant="outline" className="border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {attr}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No unmatched attributes found.</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Prohibited Words</h3>
                  {analysisResult.prohibitedWords.length > 0 ? (
                    <div className="space-y-2">
                      {analysisResult.prohibitedWords.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Badge variant="outline" className="border-red-200 text-red-500">
                            {item.word}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            at position {item.index}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No prohibited words found.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Improvement Suggestions</h3>
                  {analysisResult.suggestions.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No suggestions available.</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
