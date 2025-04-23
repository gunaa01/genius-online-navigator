import { FileText, CheckSquare, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  pendingApprovals: number;
  unreadMessages: number;
}

interface ClientDashboardSummaryProps {
  projects: ClientProject[];
}

const ClientDashboardSummary: React.FC<ClientDashboardSummaryProps> = ({ projects }) => {
  // Calculate summary metrics
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalPendingApprovals = projects.reduce((sum, p) => sum + p.pendingApprovals, 0);
  const totalUnreadMessages = projects.reduce((sum, p) => sum + p.unreadMessages, 0);
  
  // Calculate upcoming deadlines (simplified for now)
  const upcomingDeadlines = 2; // In a real app, this would be calculated based on project end dates
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{activeProjects}</div>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{totalPendingApprovals}</div>
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Unread Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{totalUnreadMessages}</div>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{upcomingDeadlines}</div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboardSummary;
