import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Star, 
  MoreHorizontal, 
  Users,
  ArrowRight,
  FileText,
  MessageSquare,
  PieChart
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Project status types
export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'cancelled' | 'pending_start';

// Project priority types
export type ProjectPriority = 'high' | 'medium' | 'low';

// Project interface
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  startDate: string;
  endDate: string;
  budget: string;
  client: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  freelancer: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  team?: {
    id: string;
    name: string;
    avatarUrl?: string;
    role: string;
  }[];
  totalMilestones: number;
  completedMilestones: number;
  unreadMessages: number;
  contractId: string;
  lastActivity?: string;
  tags?: string[];
}

interface ProjectCardProps {
  project: Project;
  isFreelancer: boolean;
  viewType?: 'grid' | 'list';
  onAction?: (action: string, projectId: string) => void;
}

const ProjectCard = ({ 
  project, 
  isFreelancer, 
  viewType = 'grid',
  onAction
}: ProjectCardProps) => {
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status badge with appropriate styling
  const getStatusBadge = (status: ProjectStatus) => {
    switch(status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'on_hold':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            On Hold
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'pending_start':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Calendar className="h-3 w-3 mr-1" />
            Pending Start
          </Badge>
        );
    }
  };
  
  // Get priority indicator
  const getPriorityIndicator = (priority: ProjectPriority) => {
    switch(priority) {
      case 'high':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  High Priority
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This project requires immediate attention</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'medium':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Medium Priority
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Standard priority project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'low':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Low Priority
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This project has flexible deadlines</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };
  
  if (viewType === 'list') {
    // List view (horizontal card)
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Project info */}
            <div className="flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-medium">
                      <Link 
                        to={`/hire/projects/${project.id}`} 
                        className="hover:text-primary hover:underline"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    {getStatusBadge(project.status)}
                    {project.priority !== 'medium' && getPriorityIndicator(project.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onAction?.('view', project.id)}>
                      View Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction?.('message', project.id)}>
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onAction?.('contract', project.id)}>
                      View Contract
                    </DropdownMenuItem>
                    {project.status === 'active' && (
                      <DropdownMenuItem onClick={() => onAction?.('hold', project.id)}>
                        Place On Hold
                      </DropdownMenuItem>
                    )}
                    {project.status === 'on_hold' && (
                      <DropdownMenuItem onClick={() => onAction?.('resume', project.id)}>
                        Resume Project
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Timeline */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                  </div>
                </div>
                
                <div className="w-px h-8 bg-border hidden sm:block" />
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-sm font-medium">{project.budget}</p>
                </div>
                
                <div className="w-px h-8 bg-border hidden sm:block" />
                
                <div className="space-y-1 flex-grow">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-xs font-medium">{project.progress}%</p>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            </div>
            
            {/* Team members and actions */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3">
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-background">
                  {isFreelancer ? (
                    project.client.avatarUrl ? (
                      <AvatarImage src={project.client.avatarUrl} alt={project.client.name} />
                    ) : (
                      <AvatarFallback>{project.client.name.substring(0, 2)}</AvatarFallback>
                    )
                  ) : (
                    project.freelancer.avatarUrl ? (
                      <AvatarImage src={project.freelancer.avatarUrl} alt={project.freelancer.name} />
                    ) : (
                      <AvatarFallback>{project.freelancer.name.substring(0, 2)}</AvatarFallback>
                    )
                  )}
                </Avatar>
                
                {project.team && project.team.length > 0 && (
                  <>
                    {project.team.slice(0, 2).map((member) => (
                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                        {member.avatarUrl ? (
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                        ) : (
                          <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                    ))}
                    
                    {project.team.length > 2 && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                        +{project.team.length - 2}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex gap-2 ml-auto">
                {project.unreadMessages > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-9 px-2.5"
                          onClick={() => onAction?.('messages', project.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">{project.unreadMessages}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{project.unreadMessages} unread messages</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <Button 
                  size="sm"
                  onClick={() => onAction?.('view', project.id)}
                >
                  View Project
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  // Grid view (vertical card)
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <h3 className="font-medium line-clamp-1">
              <Link 
                to={`/hire/projects/${project.id}`} 
                className="hover:text-primary hover:underline"
              >
                {project.title}
              </Link>
            </h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction?.('view', project.id)}>
                View Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.('message', project.id)}>
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction?.('contract', project.id)}>
                View Contract
              </DropdownMenuItem>
              {project.status === 'active' && (
                <DropdownMenuItem onClick={() => onAction?.('hold', project.id)}>
                  Place On Hold
                </DropdownMenuItem>
              )}
              {project.status === 'on_hold' && (
                <DropdownMenuItem onClick={() => onAction?.('resume', project.id)}>
                  Resume Project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {getStatusBadge(project.status)}
            {project.priority !== 'medium' && getPriorityIndicator(project.priority)}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="text-xs font-medium">{project.progress}%</p>
          </div>
          <Progress value={project.progress} className="h-2" />
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Start Date</p>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-xs">{formatDate(project.startDate)}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">End Date</p>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-xs">{formatDate(project.endDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-sm font-medium">{project.budget}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{isFreelancer ? 'Client' : 'Freelancer'}</p>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                {isFreelancer ? (
                  project.client.avatarUrl ? (
                    <AvatarImage src={project.client.avatarUrl} alt={project.client.name} />
                  ) : (
                    <AvatarFallback>{project.client.name.substring(0, 2)}</AvatarFallback>
                  )
                ) : (
                  project.freelancer.avatarUrl ? (
                    <AvatarImage src={project.freelancer.avatarUrl} alt={project.freelancer.name} />
                  ) : (
                    <AvatarFallback>{project.freelancer.name.substring(0, 2)}</AvatarFallback>
                  )
                )}
              </Avatar>
              <span className="text-sm">
                {isFreelancer ? project.client.name : project.freelancer.name}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <FileText className="h-3.5 w-3.5 mr-1" />
              <span>{project.completedMilestones}/{project.totalMilestones} Milestones</span>
            </div>
            
            {project.lastActivity && (
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>Updated {project.lastActivity}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t mt-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.team && project.team.length > 0 ? (
              <>
                {project.team.slice(0, 3).map((member) => (
                  <TooltipProvider key={member.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-8 w-8 border-2 border-background">
                          {member.avatarUrl ? (
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                          ) : (
                            <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                          )}
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{member.name} ({member.role})</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                
                {project.team.length > 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                          +{project.team.length - 3}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{project.team.length - 3} more team members</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAction?.('add_team', project.id)}
                className="h-8"
              >
                <Users className="h-3.5 w-3.5 mr-1" />
                Add Team
              </Button>
            )}
          </div>
          
          {project.unreadMessages > 0 ? (
            <Button 
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => onAction?.('messages', project.id)}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              {project.unreadMessages}
            </Button>
          ) : (
            <Button 
              size="sm"
              className="h-8"
              onClick={() => onAction?.('view', project.id)}
            >
              View
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
