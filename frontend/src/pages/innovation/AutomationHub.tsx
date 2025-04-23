import { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Clock, 
  Calendar, 
  Mail, 
  MessageSquare,
  FileText,
  Bell,
  Check,
  X,
  Info,
  ArrowRight,
  MoreHorizontal,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Automation types
interface Trigger {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'project' | 'time' | 'communication' | 'system';
}

interface Action {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'notification' | 'project' | 'communication' | 'integration';
}

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: Trigger;
  actions: Action[];
  isActive: boolean;
  createdAt: string;
  lastRun?: string;
  runCount: number;
  isTemplate?: boolean;
}

// Mock triggers
const triggers: Trigger[] = [
  {
    id: 'trigger-1',
    name: 'Project Status Change',
    description: 'When a project status changes',
    icon: <FileText className="h-5 w-5" />,
    category: 'project'
  },
  {
    id: 'trigger-2',
    name: 'Task Deadline Approaching',
    description: 'When a task deadline is within X days',
    icon: <Clock className="h-5 w-5" />,
    category: 'time'
  },
  {
    id: 'trigger-3',
    name: 'New Comment',
    description: 'When a new comment is added to a task or project',
    icon: <MessageSquare className="h-5 w-5" />,
    category: 'communication'
  },
  {
    id: 'trigger-4',
    name: 'Milestone Completed',
    description: 'When a project milestone is marked as completed',
    icon: <Check className="h-5 w-5" />,
    category: 'project'
  },
  {
    id: 'trigger-5',
    name: 'Daily Schedule',
    description: 'Run at a specific time every day',
    icon: <Calendar className="h-5 w-5" />,
    category: 'time'
  },
  {
    id: 'trigger-6',
    name: 'New File Upload',
    description: 'When a new file is uploaded to a project',
    icon: <FileText className="h-5 w-5" />,
    category: 'system'
  }
];

// Mock actions
const actions: Action[] = [
  {
    id: 'action-1',
    name: 'Send Email Notification',
    description: 'Send an email to specified recipients',
    icon: <Mail className="h-5 w-5" />,
    category: 'communication'
  },
  {
    id: 'action-2',
    name: 'Create Task',
    description: 'Create a new task in a project',
    icon: <FileText className="h-5 w-5" />,
    category: 'project'
  },
  {
    id: 'action-3',
    name: 'Update Project Status',
    description: 'Change the status of a project',
    icon: <RefreshCw className="h-5 w-5" />,
    category: 'project'
  },
  {
    id: 'action-4',
    name: 'Send Slack Message',
    description: 'Send a message to a Slack channel',
    icon: <MessageSquare className="h-5 w-5" />,
    category: 'communication'
  },
  {
    id: 'action-5',
    name: 'Generate Report',
    description: 'Create and send a project report',
    icon: <FileText className="h-5 w-5" />,
    category: 'project'
  },
  {
    id: 'action-6',
    name: 'Add to Calendar',
    description: 'Create a calendar event',
    icon: <Calendar className="h-5 w-5" />,
    category: 'integration'
  },
  {
    id: 'action-7',
    name: 'Send Push Notification',
    description: 'Send a push notification to team members',
    icon: <Bell className="h-5 w-5" />,
    category: 'notification'
  }
];

// Mock automations
const mockAutomations: Automation[] = [
  {
    id: 'automation-1',
    name: 'Project Status Alert',
    description: 'Send email when project status changes to "At Risk"',
    trigger: triggers[0],
    actions: [actions[0]],
    isActive: true,
    createdAt: '2025-04-10T10:00:00Z',
    lastRun: '2025-04-21T15:30:00Z',
    runCount: 8
  },
  {
    id: 'automation-2',
    name: 'Deadline Reminder',
    description: 'Send notification 2 days before task deadline',
    trigger: triggers[1],
    actions: [actions[6], actions[0]],
    isActive: true,
    createdAt: '2025-04-12T14:20:00Z',
    lastRun: '2025-04-22T09:15:00Z',
    runCount: 24
  },
  {
    id: 'automation-3',
    name: 'Comment Notification',
    description: 'Notify team members when new comments are added',
    trigger: triggers[2],
    actions: [actions[6]],
    isActive: false,
    createdAt: '2025-04-15T11:45:00Z',
    lastRun: '2025-04-20T16:30:00Z',
    runCount: 12
  },
  {
    id: 'automation-4',
    name: 'Milestone Celebration',
    description: 'Send Slack message when milestone is completed',
    trigger: triggers[3],
    actions: [actions[3]],
    isActive: true,
    createdAt: '2025-04-18T09:30:00Z',
    lastRun: '2025-04-21T14:20:00Z',
    runCount: 5
  },
  {
    id: 'automation-5',
    name: 'Daily Project Summary',
    description: 'Generate and email daily project status report',
    trigger: triggers[4],
    actions: [actions[4], actions[0]],
    isActive: true,
    createdAt: '2025-04-05T16:15:00Z',
    lastRun: '2025-04-22T08:00:00Z',
    runCount: 17
  }
];

// Template automations
const templateAutomations: Automation[] = [
  {
    id: 'template-1',
    name: 'Project Kickoff',
    description: 'Creates tasks and sends notifications when a new project starts',
    trigger: triggers[0],
    actions: [actions[1], actions[0], actions[3]],
    isActive: false,
    createdAt: '2025-03-15T10:00:00Z',
    runCount: 0,
    isTemplate: true
  },
  {
    id: 'template-2',
    name: 'Weekly Status Update',
    description: 'Generates and sends weekly project status reports',
    trigger: triggers[4],
    actions: [actions[4], actions[0]],
    isActive: false,
    createdAt: '2025-03-15T10:00:00Z',
    runCount: 0,
    isTemplate: true
  },
  {
    id: 'template-3',
    name: 'Task Assignment Notification',
    description: 'Notifies team members when they are assigned to a task',
    trigger: triggers[2],
    actions: [actions[6], actions[0]],
    isActive: false,
    createdAt: '2025-03-15T10:00:00Z',
    runCount: 0,
    isTemplate: true
  }
];

// Format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

// Format relative time
const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return formatDate(dateString);
  }
};

const AutomationHub = () => {
  const [activeTab, setActiveTab] = useState('automations');
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Toggle automation active state
  const toggleAutomationActive = (id: string) => {
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === id 
          ? { ...automation, isActive: !automation.isActive } 
          : automation
      )
    );
  };
  
  // Delete automation
  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(automation => automation.id !== id));
  };
  
  // Use template
  const useTemplate = (template: Automation) => {
    const newAutomation: Automation = {
      ...template,
      id: `automation-${Date.now()}`,
      isTemplate: false,
      createdAt: new Date().toISOString(),
      runCount: 0
    };
    
    setAutomations(prev => [...prev, newAutomation]);
    setActiveTab('automations');
  };
  
  // Filter automations
  const filteredAutomations = automations.filter(automation => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        automation.name.toLowerCase().includes(query) ||
        automation.description.toLowerCase().includes(query) ||
        automation.trigger.name.toLowerCase().includes(query) ||
        automation.actions.some(action => action.name.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (filterCategory !== 'all') {
      return automation.trigger.category === filterCategory || 
             automation.actions.some(action => action.category === filterCategory);
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Automation Hub | Genius Online Navigator</title>
        <meta name="description" content="Create and manage automated workflows to streamline your project processes." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Automation Hub</h1>
          <p className="text-muted-foreground">Create and manage automated workflows to save time and reduce manual work</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Automation
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Automation Insights</AlertTitle>
        <AlertDescription>
          Your automations have saved approximately 12 hours of manual work this month.
          <Button variant="link" className="p-0 h-auto">View detailed report</Button>
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="automations">My Automations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        
        {/* My Automations Tab */}
        <TabsContent value="automations" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search automations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={filterCategory}
                onValueChange={setFilterCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={() => setActiveTab('templates')}>
              Browse Templates
            </Button>
          </div>
          
          {filteredAutomations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No automations found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchQuery || filterCategory !== 'all' ? 
                    'No automations match your search criteria. Try adjusting your filters.' : 
                    'You haven\'t created any automations yet. Get started by creating your first automation or using a template.'
                  }
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Automation
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('templates')}>
                    Browse Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAutomations.map(automation => (
                <Card key={automation.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center">
                          {automation.name}
                          <Badge 
                            variant={automation.isActive ? "default" : "outline"}
                            className="ml-2"
                          >
                            {automation.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{automation.description}</CardDescription>
                      </div>
                      
                      <div className="flex items-center">
                        <Switch 
                          checked={automation.isActive}
                          onCheckedChange={() => toggleAutomationActive(automation.id)}
                          className="mr-2"
                        />
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Run Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Logs
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteAutomation(automation.id)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 py-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                          {automation.trigger.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">When</p>
                          <p className="text-sm text-muted-foreground">{automation.trigger.name}</p>
                        </div>
                      </div>
                      
                      <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground" />
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                          {automation.actions[0].icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Then</p>
                          <p className="text-sm text-muted-foreground">
                            {automation.actions.length === 1 
                              ? automation.actions[0].name 
                              : `${automation.actions[0].name} + ${automation.actions.length - 1} more`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Created: {formatDate(automation.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Play className="h-3 w-3 mr-1" />
                        <span>Last run: {formatRelativeTime(automation.lastRun)}</span>
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        <span>Run count: {automation.runCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templateAutomations.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="flex flex-col gap-4 py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                        {template.trigger.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">When</p>
                        <p className="text-sm text-muted-foreground">{template.trigger.name}</p>
                      </div>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-4" />
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                        {template.actions[0].icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">Then</p>
                        <p className="text-sm text-muted-foreground">
                          {template.actions.length === 1 
                            ? template.actions[0].name 
                            : `${template.actions[0].name} + ${template.actions.length - 1} more`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => useTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed hover:shadow-md transition-shadow">
              <CardHeader className="flex items-center justify-center h-full py-8">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <CardTitle className="text-base">Create Custom Template</CardTitle>
                <CardDescription>Design your own automation template</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        
        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Activity Log</CardTitle>
              <CardDescription>Recent automation runs and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Activity log will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationHub;
