
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const AIInsights = () => {
  const insights = [
    {
      id: 1,
      title: "Optimize your landing page",
      description: "Your landing page has a 3.5s load time which is affecting conversion rates. Consider optimizing images and reducing JavaScript.",
      impact: "high",
    },
    {
      id: 2,
      title: "Email campaign opportunity",
      description: "Based on customer behavior, sending a re-engagement email to inactive users could increase retention by 15%.",
      impact: "medium",
    },
    {
      id: 3,
      title: "Social media growth potential",
      description: "Your Instagram engagement is 30% higher than other platforms. Consider focusing more resources here.",
      impact: "high",
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-blue-100 text-blue-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI-Powered Insights
        </CardTitle>
        <Button variant="link" size="sm" className="text-sm">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">{insight.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Implement</Button>
                  <Button variant="ghost" size="sm">Dismiss</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
