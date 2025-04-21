
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Clock, Heart, MessageSquare, Star } from "lucide-react";

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
  };
}

const FreelancerCard = ({ freelancer }: FreelancerCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="relative p-0">
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img 
            src={freelancer.image} 
            alt={freelancer.name}
            className="object-cover w-full h-full"
          />
          <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-lg">{freelancer.name}</h3>
            <p className="text-sm text-muted-foreground">{freelancer.title}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{freelancer.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({freelancer.reviews})</span>
          </div>
        </div>
        
        <p className="text-sm mb-3 line-clamp-2">{freelancer.description}</p>
        
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
          
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost">
              <MessageSquare className="h-4 w-4 mr-1" />
              Contact
            </Button>
            <Button size="sm">View Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerCard;
