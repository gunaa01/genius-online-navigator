import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, CheckCircle2, Clock, ArrowRight, Brain } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
  aiConfidence: number;
  dataPoints: string[];
  implemented: boolean;
}

interface SmartRecommendationsWidgetProps {
  recommendations: Recommendation[];
  onImplement: (id: string) => void;
}

/**
 * Smart Recommendations Widget
 * 
 * AI-powered recommendations based on insights data analysis
 * Provides actionable suggestions to improve platform performance
 */
const SmartRecommendationsWidget: React.FC<SmartRecommendationsWidgetProps> = ({
  recommendations,
  onImplement
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  // Filter recommendations based on active tab
  const filteredRecommendations = recommendations.filter(rec => {
    if (activeTab === 'all') return true;
    if (activeTab === 'implemented') return rec.implemented;
    if (activeTab === 'pending') return !rec.implemented;
    return rec.category === activeTab;
  });

  // Get unique categories
  const categories = ['all', 'pending', 'implemented', ...new Set(recommendations.map(r => r.category))];

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get effort color
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle recommendation expansion
  const toggleExpand = (id: string) => {
    if (expandedRecommendation === id) {
      setExpandedRecommendation(null);
    } else {
      setExpandedRecommendation(id);
    }
  };

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            <div>
              <CardTitle>Smart Recommendations</CardTitle>
              <CardDescription>
                AI-powered suggestions to improve your platform
              </CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center mt-2 md:mt-0 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4 mr-1 text-primary" />
                  AI Confidence
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  AI confidence score indicates how certain the AI is about this recommendation based on available data and patterns.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-4 flex-wrap">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map(recommendation => (
                <Card 
                  key={recommendation.id} 
                  className={`border-l-4 ${recommendation.implemented ? 'border-l-green-500' : 'border-l-blue-500'} transition-all duration-200`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          {recommendation.implemented ? (
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          )}
                          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {recommendation.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getImpactColor(recommendation.impact)}>
                          Impact: {recommendation.impact}
                        </Badge>
                        <Badge className={getEffortColor(recommendation.effort)}>
                          Effort: {recommendation.effort}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedRecommendation === recommendation.id && (
                    <CardContent className="pb-2 pt-0">
                      <div className="mt-2 space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Based on:</h4>
                          <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {recommendation.dataPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm text-muted-foreground">AI Confidence:</div>
                          <div className="ml-2 w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${recommendation.aiConfidence * 100}%` }}
                            ></div>
                          </div>
                          <div className="ml-2 text-sm font-medium">
                            {Math.round(recommendation.aiConfidence * 100)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                  
                  <CardFooter className="pt-0 flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(recommendation.id)}>
                      {expandedRecommendation === recommendation.id ? 'Less details' : 'More details'}
                    </Button>
                    {!recommendation.implemented && (
                      <Button size="sm" onClick={() => onImplement(recommendation.id)}>
                        Implement <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recommendations available for this category.
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendationsWidget;
