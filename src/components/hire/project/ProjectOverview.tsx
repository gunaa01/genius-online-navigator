import { useState } from 'react';
import { 
  ChartBar,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  MessageSquare,
  DollarSign,
  ArrowRight,
  PieChart,
  User,
  Users,
  CalendarClock,
  ClipboardCheck,
  Lightbulb,
  AlertCircle,
  Plus,
  FilePlus,
  Pencil,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { MilestoneWithStatus } from '../milestone/MilestoneTracker';
import { ProjectStatus } from './ProjectCard';

interface ProjectOverviewProps {
  projectId: string;
  title: string;
  description: string;
  status: ProjectStatus;
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
  milestones: MilestoneWithStatus[];
  upcomingDeadlines: {
    id: string;
    title: string;
    dueDate: string;
    type: 'milestone' | 'payment' | 'meeting';
  }[];
  recentActivities: {
    id: string;
    title: string;
    timestamp: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
    type: 'message' | 'file' | 'milestone' | 'payment' | 'status';
  }[];
  isFreelancer: boolean;
  onAction: (action: string, data?: any) => void;
}

const ProjectOverview = ({
  projectId,
  title,
  description,
  status,
  progress,
  startDate,
  endDate,
  budget,
  client,
  freelancer,
  team = [],
  milestones,
  upcomingDeadlines,
  recentActivities,
  isFreelancer,
  onAction
}: ProjectOverviewProps) => {
  // Calculate project statistics
  const completedMilestones = milestones.filter(m => 
    m.status === 'completed' || m.status === 'paid'
  ).length;
  
  const totalMilestones = milestones.length;
  
  const totalAmount = parseInt(budget.replace(/\D/g, ''));
  
  const paidAmount = milestones
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + parseInt(m.amount.replace(/\D/g, '')), 0);
  
  const pendingAmount = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + parseInt(m.amount.replace(/\D/g, '')), 0);
  
  const remainingAmount = totalAmount - paidAmount - pendingAmount;
  
  // Calculate time remaining
  const now = new Date();
  const end = new Date(endDate);
  const projectDuration = end.getTime() - new Date(startDate).getTime();
  const timeElapsed = now.getTime() - new Date(startDate).getTime();
  const timeProgress = Math.min(100, Math.round((timeElapsed / projectDuration) * 100));
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time remaining
  const getTimeRemaining = () => {
    const diffTime = end.getTime() - now.getTime();
    if (diffTime <= 0) {
      return 'Deadline passed';
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '1 day remaining';
    } else if (diffDays < 30) {
      return `${diffDays} days remaining`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} remaining`;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Project Description */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <CardTitle>Project Details</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => onAction('edit_details')}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
      
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Time Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Timeline</span>
                <span className="font-medium">{timeProgress}% Elapsed</span>
              </div>
              <Progress value={timeProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Start Date</div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{formatDate(startDate)}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">End Date</div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{formatDate(endDate)}</span>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t">
                <div className="flex items-center text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  <span>{getTimeRemaining()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Milestone Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Milestone Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-medium">{completedMilestones} of {totalMilestones}</span>
              </div>
              <Progress 
                value={totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/50 rounded-md flex flex-col items-center">
                <span className="text-2xl font-bold">{completedMilestones}</span>
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              
              <div className="p-2 bg-muted/50 rounded-md flex flex-col items-center">
                <span className="text-2xl font-bold">{totalMilestones - completedMilestones}</span>
                <span className="text-xs text-muted-foreground">Remaining</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onAction('view_milestones')}
            >
              View Milestones
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Budget Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Budget Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Payments</span>
                <span className="font-medium">
                  ${paidAmount} of ${totalAmount}
                </span>
              </div>
              <Progress 
                value={totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-green-50 rounded-md flex flex-col items-center">
                <span className="text-sm font-bold text-green-700">${paidAmount}</span>
                <span className="text-xs text-green-600">Paid</span>
              </div>
              
              <div className="p-2 bg-amber-50 rounded-md flex flex-col items-center">
                <span className="text-sm font-bold text-amber-700">${pendingAmount}</span>
                <span className="text-xs text-amber-600">Pending</span>
              </div>
              
              <div className="p-2 bg-blue-50 rounded-md flex flex-col items-center">
                <span className="text-sm font-bold text-blue-700">${remainingAmount}</span>
                <span className="text-xs text-blue-600">Remaining</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onAction('view_payments')}
            >
              View Payments
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Team and Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Section */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Project Team</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAction('add_team_member')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Project Owner */}
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {freelancer.avatarUrl ? (
                      <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
                    ) : (
                      <AvatarFallback>{freelancer.name.substring(0, 2)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{freelancer.name}</p>
                    <p className="text-xs text-muted-foreground">Project Owner</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">Owner</Badge>
              </div>
              
              {/* Client */}
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {client.avatarUrl ? (
                      <AvatarImage src={client.avatarUrl} alt={client.name} />
                    ) : (
                      <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">Client</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">Client</Badge>
              </div>
              
              {/* Team Members */}
              {team.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {member.avatarUrl ? (
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                      ) : (
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onAction('edit_team_member', { memberId: member.id })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {team.length === 0 && (
                <div className="text-center py-6">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-sm font-medium mb-1">No Team Members</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add team members to collaborate on this project
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAction('add_team_member')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Team Member
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onAction('view_team')}
            >
              Manage Team
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAction('add_deadline')}
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline) => (
                  <div 
                    key={deadline.id} 
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-start gap-3">
                      {deadline.type === 'milestone' ? (
                        <ClipboardCheck className="h-5 w-5 text-primary mt-0.5" />
                      ) : deadline.type === 'payment' ? (
                        <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{deadline.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {formatDate(deadline.dueDate)}
                        </p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={
                        deadline.type === 'milestone' 
                          ? 'bg-primary/10 text-primary' 
                          : deadline.type === 'payment'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-blue-50 text-blue-700'
                      }
                    >
                      {deadline.type === 'milestone' 
                        ? 'Milestone' 
                        : deadline.type === 'payment'
                          ? 'Payment'
                          : 'Meeting'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-sm font-medium mb-1">No Upcoming Deadlines</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add important dates and deadlines to stay on track
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="relative mt-1">
                    <Avatar className="h-8 w-8">
                      {activity.user.avatarUrl ? (
                        <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
                      ) : (
                        <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-0.5">
                      {activity.type === 'message' ? (
                        <MessageSquare className="h-3 w-3 text-blue-500" />
                      ) : activity.type === 'file' ? (
                        <FileText className="h-3 w-3 text-amber-500" />
                      ) : activity.type === 'milestone' ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : activity.type === 'payment' ? (
                        <DollarSign className="h-3 w-3 text-purple-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-primary" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <p className="text-sm">{activity.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="font-medium mr-1">{activity.user.name}</span>
                      <span>• {activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-sm font-medium mb-1">No Recent Activity</h3>
                <p className="text-xs text-muted-foreground">
                  Activity will appear here as you work on the project
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onAction('view_activity')}
          >
            View All Activity
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectOverview;
