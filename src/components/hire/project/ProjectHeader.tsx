import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  MessageSquare,
  FileText,
  Paperclip,
  Users,
  Star,
  StarHalf,
  Pencil,
  Share2,
  Archive,
  AlertCircle,
  ArrowUpDown,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectStatus } from './ProjectCard';

// Define project sections for navigation
type ProjectSection = 'overview' | 'milestones' | 'payments' | 'files' | 'messages' | 'team';

interface ProjectHeaderProps {
  projectId: string;
  projectTitle: string;
  status: ProjectStatus;
  currentSection: ProjectSection;
  onSectionChange: (section: ProjectSection) => void;
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
  startDate: string;
  endDate: string;
  isFreelancer: boolean;
  teamCount: number;
  filesCount: number;
  messagesCount: number;
  unreadMessages: number;
  onProjectAction?: (action: string) => void;
  isLoading?: boolean;
}

const ProjectHeader = ({
  projectId,
  projectTitle,
  status,
  currentSection,
  onSectionChange,
  client,
  freelancer,
  startDate,
  endDate,
  isFreelancer,
  teamCount,
  filesCount,
  messagesCount,
  unreadMessages,
  onProjectAction,
  isLoading = false
}: ProjectHeaderProps) => {
  const navigate = useNavigate();
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ProjectStatus>(status);
  const [isUpdating, setIsUpdating] = useState(false);
  
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
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle status change
  const handleStatusChange = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      onProjectAction?.('change_status');
      setIsUpdating(false);
      setShowStatusChangeDialog(false);
    }, 1000);
  };
  
  // Get available status options based on current status
  const getAvailableStatusOptions = (): ProjectStatus[] => {
    switch(status) {
      case 'active':
        return ['completed', 'on_hold', 'cancelled'];
      case 'on_hold':
        return ['active', 'cancelled'];
      case 'pending_start':
        return ['active', 'cancelled'];
      case 'cancelled':
        return ['active'];
      case 'completed':
        return ['active'];
      default:
        return [];
    }
  };
  
  return (
    <div className="border-b pb-6 mb-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/hire/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{projectTitle}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Project Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2 hidden sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{projectTitle}</h1>
              {getStatusBadge(status)}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => onProjectAction?.('message')}
            className="relative"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-medium h-4 min-w-4 rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </Button>
          
          <Button
            variant={status === 'active' ? 'default' : 'outline'}
            onClick={() => {
              setNewStatus(
                status === 'active' ? 'on_hold' : 
                status === 'on_hold' ? 'active' :
                status === 'pending_start' ? 'active' : 'active'
              );
              setShowStatusChangeDialog(true);
            }}
            disabled={isLoading}
          >
            {status === 'active' ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Pause Project
              </>
            ) : status === 'on_hold' ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Resume Project
              </>
            ) : status === 'pending_start' ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Start Project
              </>
            ) : status === 'completed' ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Reopen Project
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Reactivate
              </>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onProjectAction?.('edit')}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onProjectAction?.('share')}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onProjectAction?.('rate')}>
                <Star className="h-4 w-4 mr-2" />
                Rate Collaboration
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onProjectAction?.('contract')}>
                <FileText className="h-4 w-4 mr-2" />
                View Contract
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onProjectAction?.('archive')}>
                <Archive className="h-4 w-4 mr-2" />
                Archive Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Team & Client Info */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg">
          <Avatar className="h-8 w-8">
            {isFreelancer ? (
              client.avatarUrl ? (
                <AvatarImage src={client.avatarUrl} alt={client.name} />
              ) : (
                <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
              )
            ) : (
              freelancer.avatarUrl ? (
                <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
              ) : (
                <AvatarFallback>{freelancer.name.substring(0, 2)}</AvatarFallback>
              )
            )}
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">
              {isFreelancer ? 'Client' : 'Freelancer'}
            </p>
            <p className="text-sm font-medium">
              {isFreelancer ? client.name : freelancer.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-2">
            <Avatar className="h-8 w-8 border-2 border-background">
              {freelancer.avatarUrl ? (
                <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
              ) : (
                <AvatarFallback>{freelancer.name.substring(0, 2)}</AvatarFallback>
              )}
            </Avatar>
            {teamCount > 0 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{teamCount}
              </div>
            )}
          </div>
          <span className="text-sm">
            {teamCount > 0 ? `${teamCount + 1} team members` : "Only you"}
          </span>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <Tabs 
        value={currentSection} 
        onValueChange={(value) => onSectionChange(value as ProjectSection)}
        className="mt-6"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="relative">
            Overview
          </TabsTrigger>
          <TabsTrigger value="milestones" className="relative">
            Milestones
          </TabsTrigger>
          <TabsTrigger value="payments" className="relative">
            Payments
          </TabsTrigger>
          <TabsTrigger value="files" className="relative">
            Files
            {filesCount > 0 && (
              <span className="ml-1 text-xs bg-muted rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
                {filesCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="relative">
            Messages
            {messagesCount > 0 && (
              <span className="ml-1 text-xs bg-muted rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
                {messagesCount}
              </span>
            )}
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-medium h-4 min-w-4 rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="team" className="relative">
            Team
            {teamCount > 0 && (
              <span className="ml-1 text-xs bg-muted rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
                {teamCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Status Change Dialog */}
      <Dialog open={showStatusChangeDialog} onOpenChange={setShowStatusChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Project Status</DialogTitle>
            <DialogDescription>
              {status === 'active' 
                ? 'This will pause all active work on the project.' 
                : status === 'on_hold' 
                  ? 'This will resume work on the project.'
                  : status === 'pending_start'
                    ? 'This will mark the project as started.'
                    : 'This will change the project status.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Current Status:</span>
                {getStatusBadge(status)}
              </div>
              
              <div className="flex items-center justify-between">
                <span>New Status:</span>
                {getStatusBadge(newStatus)}
              </div>
              
              {(status === 'active' && newStatus === 'on_hold') && (
                <div className="p-3 bg-amber-50 text-amber-700 rounded-md mt-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Pausing the project will:</p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Temporarily stop all work</li>
                      <li>Freeze milestone deadlines</li>
                      <li>Notify all team members</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {(status === 'on_hold' && newStatus === 'active') && (
                <div className="p-3 bg-blue-50 text-blue-700 rounded-md mt-4 flex items-start">
                  <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Resuming the project will:</p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Restart all work</li>
                      <li>Update milestone deadlines</li>
                      <li>Notify all team members</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusChangeDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusChange}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Confirm Change
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectHeader;
