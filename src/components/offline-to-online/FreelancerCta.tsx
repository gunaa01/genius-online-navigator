
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Target } from "lucide-react";
import { Link } from "react-router-dom";

interface FreelancerCtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const FreelancerCta = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink 
}: FreelancerCtaProps) => {
  return (
    <section className="bg-muted p-6 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            {title}
          </h2>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
        <div>
          <Link to={buttonLink}>
            <Button size="lg" className="w-full md:w-auto">
              {buttonText}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreelancerCta;
