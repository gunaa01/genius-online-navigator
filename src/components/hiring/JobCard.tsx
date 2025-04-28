
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, Bookmark, Briefcase, Calendar, Clock, MapPin } from "lucide-react";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    duration: string;
    budget: string;
    posted: string;
    description: string;
    skills: string[];
    applicants: number;
  };
  onDelete?: (id: number) => void;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
            <p className="text-muted-foreground mb-2">{job.company}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-normal">{skill}</Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="mb-4 text-sm">{job.description}</p>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-4">
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{job.duration}</span>
          </div>
          <div className="flex items-center">
            <BadgeDollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{job.budget}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground">Posted {job.posted}</span>
            <span className="mx-2">•</span>
            <span className="text-muted-foreground">{job.applicants} applicants</span>
          </div>
          
          <Button>Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
