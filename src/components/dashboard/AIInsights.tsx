import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, ArrowRight, BrainCircuit, TrendingUp, BarChart2, 
  BarChart, Users, Mail, Globe, LineChart, Lightbulb, CheckCircle, 
  ThumbsUp, MessageSquare, FileEdit
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface AIInsightsProps {
  loading: boolean;
}

// Added specific insight types for better organization
type InsightType = "growth" | "optimization" | "audience" | "content";

interface Insight {
  id: number;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  type: InsightType;
  actionable: boolean;
  potentialGain?: string;
  confidence?: number;
}

const AIInsights = ({ loading }: AIInsightsProps) => {
  const [activeTab, setActiveTab] = useState<InsightType>("growth");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedInsights, setCompletedInsights] = useState<number[]>([]);
  
  const insights: Insight[] = [
    {
      id: 1,
      title: "Optimize your landing page",
      description: "Your landing page has a 3.5s load time which is affecting conversion rates. Consider optimizing images and reducing JavaScript.",
      impact: "high",
      type: "optimization",
      actionable: true,
      potentialGain: "+18% conversion rate",
      confidence: 89,
    },
    {
      id: 2,
      title: "Email campaign opportunity",
      description: "Based on customer behavior, sending a re-engagement email to inactive users could increase retention by 15%.",
      impact: "medium",
      type: "audience",
      actionable: true,
      potentialGain: "+15% retention",
      confidence: 82,
    },
    {
      id: 3,
      title: "Social media growth potential",
      description: "Your Instagram engagement is 30% higher than other platforms. Consider focusing more resources here.",
      impact: "high",
      type: "growth",
      actionable: true,
      potentialGain: "+30% engagement",
      confidence: 95,
    },
    {
      id: 4,
      title: "Content gap analysis",
      description: "Competitor analysis reveals a content gap in 'how-to' articles for your industry. This presents an opportunity for SEO gains.",
      impact: "medium",
      type: "content",
      actionable: true,
      potentialGain: "+40% organic traffic",
      confidence: 78,
    },
    {
      id: 5,
      title: "Campaign timing optimization",
      description: "User activity peaks on Tuesdays and Thursdays between 2-5pm. Scheduling campaigns during these times could improve engagement.",
      impact: "medium",
      type: "optimization",
      actionable: true,
      potentialGain: "+22% campaign engagement",
      confidence: 86,
    },
    {
      id: 6,
      title: "Pricing strategy adjustment",
      description: "A/B testing suggests a small price reduction of 5% could increase conversion by 20%, resulting in 14% more revenue overall.",
      impact: "high",
      type: "growth",
      actionable: true,
      potentialGain: "+14% revenue",
      confidence: 82,
    },
    {
      id: 7,
      title: "Customer segment opportunity",
      description: "Data shows an underserved customer segment: small businesses in the healthcare sector. Targeting this group could yield high ROI.",
      impact: "high",
      type: "audience",
      actionable: true,
      potentialGain: "New market segment",
      confidence: 77,
    },
    {
      id: 8,
      title: "Content repurposing opportunity",
      description: "Your top-performing blog post could be repurposed into a video series based on content consumption patterns of your audience.",
      impact: "medium",
      type: "content",
      actionable: true,
      potentialGain: "+35% engagement",
      confidence: 81,
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "medium":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };
  
  const getInsightIcon = (type: InsightType) => {
    switch(type) {
      case "growth": 
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case "optimization": 
        return <BarChart2 className="h-5 w-5 text-indigo-500" />;
      case "audience": 
        return <Users className="h-5 w-5 text-violet-500" />;
      case "content": 
        return <FileEdit className="h-5 w-5 text-pink-500" />;
      default: 
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };
  
  const filteredInsights = insights.filter(insight => insight.type === activeTab);
  
  const handleGenerateInsights = () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setAiPrompt("");
      // Would typically add a new insight here from API response
    }, 2000);
  };
  
  const toggleInsightCompletion = (id: number) => {
    if (completedInsights.includes(id)) {
      setCompletedInsights(prev => prev.filter(insightId => insightId !== id));
    } else {
      setCompletedInsights(prev => [...prev, id]);
    }
  };
  
  if (loading) {
    return (
      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <div className="h-7 w-48 bg-secondary animate-pulse rounded-md mb-3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-secondary/50 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-col pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <Button variant="link" size="sm" className="text-sm">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="mt-1">
          Personalized recommendations based on your business data and market trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth" value={activeTab} onValueChange={(value) => setActiveTab(value as InsightType)} className="mb-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="growth" className="flex gap-1 items-center">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Growth</span>
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex gap-1 items-center">
              <BarChart2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Optimize</span>
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex gap-1 items-center">
              <Users className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Audience</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex gap-1 items-center">
              <FileEdit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-4">
            {filteredInsights.map((insight) => (
              <div 
                key={insight.id} 
                className={`flex gap-4 p-4 rounded-lg border transition-colors ${
                  completedInsights.includes(insight.id) 
                    ? "bg-muted/50 border-muted" 
                    : "bg-secondary/50 border-transparent hover:border-primary/20"
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getInsightIcon(insight.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-medium text-base ${completedInsights.includes(insight.id) ? "line-through text-muted-foreground" : ""}`}>
                      {insight.title}
                    </h3>
                    <Badge className={`ml-2 ${getImpactColor(insight.impact)}`}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                  <p className={`text-sm text-muted-foreground mb-2 ${completedInsights.includes(insight.id) ? "line-through" : ""}`}>
                    {insight.description}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex items-center">
                      {insight.potentialGain && (
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {insight.potentialGain}
                        </span>
                      )}
                      {insight.confidence && (
                        <span className="text-xs ml-2 text-muted-foreground">
                          {insight.confidence}% confidence
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => toggleInsightCompletion(insight.id)}
                      >
                        {completedInsights.includes(insight.id) ? (
                          <><CheckCircle className="h-3.5 w-3.5 mr-1" /> Done</>
                        ) : (
                          <><CheckCircle className="h-3.5 w-3.5 mr-1" /> Mark Done</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" /> Get Help
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tabs>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
            Ask AI for specific insights
          </h3>
          <div className="flex gap-2">
            <Textarea 
              placeholder="Ask about customer retention, marketing ideas, etc..." 
              className="resize-none h-10"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button 
              size="sm" 
              disabled={!aiPrompt.trim() || isGenerating}
              onClick={handleGenerateInsights}
            >
              {isGenerating ? (
                <><span className="animate-spin">↻</span> Thinking...</>
              ) : (
                <>Generate</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
