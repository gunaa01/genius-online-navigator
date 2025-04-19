
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Briefcase, Globe } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <Card className="text-center">
    <CardHeader>
      <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        {description}
      </p>
    </CardContent>
  </Card>
);

const FreelancerFeature = () => {
  const features = [
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Pre-vetted talent",
      description: "Every freelancer on our platform is verified and has passed our quality checks."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Global expertise",
      description: "Access top talent from around the world, with expertise in every industry."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Quality guaranteed",
      description: "Satisfaction guaranteed with secure payments and dispute resolution."
    }
  ];
  
  return (
    <div className="mt-16 pb-12">
      <h2 className="text-2xl font-bold text-center mb-8">Why hire on Genius?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Feature key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FreelancerFeature;
