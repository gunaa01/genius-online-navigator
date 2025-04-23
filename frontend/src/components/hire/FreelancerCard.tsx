import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Clock, Heart, MessageSquare, Star, Verified, Award, Briefcase, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FreelancerCardProps {
  freelancer: {
    id: number;
    name: string;
    title: string;
    rating: number;
    reviews: number;
    hourlyRate: string;
    image: string;
    tags: string[];
    description: string;
    verified?: boolean;
    topRated?: boolean;
    completionRate?: number;
    response?: string;
  };
  isSaved?: boolean;
  onToggleSave?: () => void;
}

const FreelancerCard = ({ freelancer, isSaved = false, onToggleSave }: FreelancerCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-2 hover:border-primary/20">
      <CardHeader className="relative p-0">
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img 
            src={freelancer.image} 
            alt={freelancer.name}
            className="object-cover w-full h-full"
          />
          <Button 
            size="icon" 
            variant={isSaved ? "default" : "outline"} 
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full h-8 w-8"
            onClick={onToggleSave}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-white text-white' : ''}`} />
          </Button>
          
          {freelancer.topRated && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
              <Award className="h-3 w-3 mr-1" />
              Top Rated
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1">
            <h3 className="font-medium text-lg">{freelancer.name}</h3>
            {freelancer.verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Verified className="h-4 w-4 text-primary fill-primary/10" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified Freelancer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{freelancer.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({freelancer.reviews})</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">{freelancer.title}</p>
        
        <p className="text-sm mb-3 line-clamp-2">{freelancer.description}</p>
        
        {freelancer.completionRate && (
          <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
            <Check className="h-3 w-3" />
            <span>{freelancer.completionRate}% Job Success</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {freelancer.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal text-xs">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm">
            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span className="font-medium">{freelancer.hourlyRate}</span>
            <span className="text-muted-foreground ml-1">/ hr</span>
          </div>
          
          {freelancer.response && (
            <div className="text-xs text-muted-foreground">
              <span>{freelancer.response}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button size="sm" variant="ghost" asChild>
          <Link to={`/hire/message/${freelancer.id}`}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to={`/hire/freelancer/${freelancer.id}`}>
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FreelancerCard;
