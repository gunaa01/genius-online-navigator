
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Freelancer {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: string;
  image: string;
  tags: string[];
  description: string;
}

interface FreelancerCardProps {
  freelancer: Freelancer;
  isSaved: boolean;
  onToggleSave: () => void;
}

const FreelancerCard = ({ freelancer, isSaved, onToggleSave }: FreelancerCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
      <CardContent className="pt-6 pb-2 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <img 
              src={freelancer.image} 
              alt={freelancer.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-muted"
            />
            <div>
              <h3 className="font-medium text-lg">{freelancer.name}</h3>
              <p className="text-muted-foreground text-sm">{freelancer.title}</p>
            </div>
          </div>
          <button 
            onClick={onToggleSave} 
            className={`p-1.5 rounded-full ${isSaved ? 'text-red-500' : 'text-muted-foreground hover:text-primary'}`}
            aria-label={isSaved ? "Remove from saved" : "Save freelancer"}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="mb-2 flex items-center">
          <div className="flex items-center mr-2">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="font-medium">{freelancer.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground text-sm">({freelancer.reviews} reviews)</span>
        </div>
        
        <p className="mb-4 text-sm line-clamp-2">{freelancer.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-auto mb-2">
          {freelancer.tags.map((tag) => (
            <span key={tag} className="bg-muted px-2 py-0.5 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 flex items-center justify-between border-t">
        <div>
          <span className="font-semibold">{freelancer.hourlyRate}</span>
          <span className="text-muted-foreground text-sm ml-1">/hr</span>
        </div>
        <Button size="sm">View Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default FreelancerCard;
