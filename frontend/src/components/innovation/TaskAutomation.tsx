import { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  ArrowRight,
  Settings,
  MoreHorizontal,
  ChevronDown,
  FileText,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Types
interface TaskTrigger {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface TaskAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface TaskAutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: TaskTrigger;
  actions: TaskAction[];
  isActive: boolean;
  createdAt: string;
  lastRun?: string;
  runCount: number;
  projectId?: string;
}

// Mock data
const taskTriggers: TaskTrigger[] = [
  {
    id: 'task-trigger-1',
    name: 'Task Status Change',
    description: 'When a task status changes',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'task-trigger-2',
    name: 'Task Assignment',
    description: 'When a task is assigned to someone',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'task-trigger-3',
    name: 'Task Deadline Approaching',
    description: 'When a task deadline is within X days',
    icon: <Clock className="h-5 w-5" />
  },
  {
    id: 'task-trigger-4',
    name: 'Task Comment Added',
    description: 'When a comment is added to a task',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'task-trigger-5',
    name: 'Task Priority Change',
    description: 'When a task priority changes',
    icon: <FileText className="h-5 w-5" />
  }
];

const taskActions: TaskAction[] = [
  {
    id: 'task-action-1',
    name: 'Create Subtask',
    description: 'Create a new subtask',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'task-action-2',
    name: 'Notify Team Member',
    description: 'Send a notification to a team member',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'task-action-3',
    name: 'Update Task Status',
    description: 'Change the status of the task',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'task-action-4',
    name: 'Add Task Label',
    description: 'Add a label to the task',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'task-action-5',
    name: 'Create Calendar Event',
    description: 'Add an event to the calendar',
    icon: <Calendar className="h-5 w-5" />
  }
];

const mockTaskAutomations: TaskAutomationRule[] = [
  {
    id: 'task-auto-1',
    name: 'Create QA Task When Development Complete',
    description: 'Automatically creates a QA task when a development task is marked as complete',
    trigger: taskTriggers[0],
    actions: [taskActions[0], taskActions[1]],
    isActive: true,
    createdAt: '2025-04-10T10:00:00Z',
    lastRun: '2025-04-21T15:30:00Z',
    runCount: 12,
    projectId: 'p1'
  },
  {
    id: 'task-auto-2',
    name: 'Deadline Reminder',
    description: 'Notify assignee when task deadline is approaching',
    trigger: taskTriggers[2],
    actions: [taskActions[1]],
    isActive: true,
    createdAt: '2025-04-12T14:20:00Z',
    lastRun: '2025-04-22T09:15:00Z',
    runCount: 24,
    projectId: 'p2'
  },
  {
    id: 'task-auto-3',
    name: 'High Priority Task Alert',
    description: 'Notify team lead when a task is set to high priority',
    trigger: taskTriggers[4],
    actions: [taskActions[1]],
    isActive: false,
    createdAt: '2025-04-15T11:45:00Z',
    lastRun: '2025-04-20T16:30:00Z',
    runCount: 5,
    projectId: 'p1'
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

interface TaskAutomationProps {
  projectId?: string;
}

const TaskAutomation: React.FC<TaskAutomationProps> = ({ projectId }) => {
  const [automations, setAutomations] = useState<TaskAutomationRule[]>(mockTaskAutomations);
  const [searchQuery, setSearchQuery] = useState('');
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
  
  // Filter automations
  const filteredAutomations = automations.filter(automation => {
    // Filter by project if projectId is provided
    if (projectId && automation.projectId !== projectId) {
      return false;
    }
    
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
    
    return true;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Task Automations</h2>
        
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
          
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
      
      {filteredAutomations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No task automations found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchQuery ? 
                'No automations match your search criteria.' : 
                'You haven\'t created any task automations yet. Get started by creating your first automation.'
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task Automation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {filteredAutomations.map(automation => (
              <AccordionItem key={automation.id} value={automation.id}>
                <Card className="mb-2">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <AccordionTrigger className="hover:no-underline py-0">
                        <div className="space-y-1 text-left">
                          <CardTitle className="flex items-center text-base">
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
                      </AccordionTrigger>
                      
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
                  
                  <AccordionContent>
                    <CardContent className="pt-0 pb-2">
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
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Last run: {formatRelativeTime(automation.lastRun)}</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span>Run count: {automation.runCount}</span>
                        </div>
                      </div>
                      
                      {automation.actions.length > 1 && (
                        <>
                          <Separator className="my-2" />
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Actions:</p>
                            <ul className="space-y-1">
                              {automation.actions.map((action, index) => (
                                <li key={index} className="text-sm flex items-center">
                                  <Check className="h-3 w-3 mr-1 text-green-500" />
                                  {action.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
      
      {/* Create automation modal would be implemented here */}
    </div>
  );
};

export default TaskAutomation;
