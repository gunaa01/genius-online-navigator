
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, ThumbsUp, Award } from "lucide-react";

const FreelancerFeature = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "Every freelancer is verified and reviewed for quality"
    },
    {
      icon: Clock,
      title: "Quick Turnaround",
      description: "Find the right help for your immediate business needs"
    },
    {
      icon: ThumbsUp,
      title: "Satisfaction Guarantee",
      description: "Pay only when you're 100% satisfied with the work"
    },
    {
      icon: Award,
      title: "Top 1% Talent",
      description: "Access to skilled professionals across all specialties"
    }
  ];
  
  return (
    <div className="mt-16 py-10 bg-muted/50 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-3">Why Choose Our Freelancers?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We carefully vet all professionals on our platform to ensure you get the highest 
          quality service for your business needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FreelancerFeature;
