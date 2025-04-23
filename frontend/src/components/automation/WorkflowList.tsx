import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Edit, 
  Copy, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  BarChart2, 
  CheckCircle, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Workflow } from '@/services/automation/workflowService';

interface WorkflowListProps {
  workflows: Workflow[];
  loading: boolean;
  onCreateWorkflow: () => void;
  onEditWorkflow: (id: string) => void;
  onDuplicateWorkflow: (id: string) => void;
  onDeleteWorkflow: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onRunWorkflow: (id: string) => void;
  onViewRuns: (id: string) => void;
}

/**
 * Workflow List
 * 
 * Displays a list of workflows with filtering and actions
 */
export default function WorkflowList({
  workflows,
  loading,
  onCreateWorkflow,
  onEditWorkflow,
  onDuplicateWorkflow,
  onDeleteWorkflow,
  onToggleActive,
  onRunWorkflow,
  onViewRuns
}: WorkflowListProps) {
  const router = useRouter();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Filter workflows
  const filteredWorkflows = workflows.filter(workflow => {
    // Search term filter
    if (searchTerm && !workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !workflow.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Trigger type filter
    if (filterType !== 'all') {
      const hasTriggerType = workflow.triggers.some(trigger => trigger.type === filterType);
      if (!hasTriggerType) return false;
    }
    
    // Status filter
    if (filterStatus === 'active' && !workflow.isActive) return false;
    if (filterStatus === 'inactive' && workflow.isActive) return false;
    
    return true;
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via the filteredWorkflows
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
  };
  
  // Get trigger type label
  const getTriggerTypeLabel = (type: string) => {
    switch (type) {
      case 'schedule':
        return 'Schedule';
      case 'event':
        return 'Event';
      case 'webhook':
        return 'Webhook';
      case 'manual':
        return 'Manual';
      default:
        return type;
    }
  };
  
  // Get trigger type icon
  const getTriggerTypeIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="h-4 w-4 mr-1" />;
      case 'event':
        return <BarChart2 className="h-4 w-4 mr-1" />;
      case 'webhook':
        return <Play className="h-4 w-4 mr-1" />;
      case 'manual':
        return <Play className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  // Get schedule description
  const getScheduleDescription = (trigger: any) => {
    if (trigger.type !== 'schedule') return null;
    
    const schedule = trigger.config.schedule;
    
    if (schedule.frequency === 'once') {
      return `Once on ${format(parseISO(schedule.date!), 'PPP')} at ${schedule.time}`;
    } else if (schedule.frequency === 'daily') {
      return `Daily at ${schedule.time}`;
    } else if (schedule.frequency === 'weekly') {
      const days = schedule.days!.join(', ');
      return `Weekly on ${days} at ${schedule.time}`;
    } else if (schedule.frequency === 'monthly') {
      return `Monthly on day ${schedule.date} at ${schedule.time}`;
    } else if (schedule.frequency === 'custom') {
      return `Custom: ${schedule.cronExpression}`;
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>
                Create and manage automated workflows
              </CardDescription>
            </div>
            <Button onClick={onCreateWorkflow}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search workflows..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All triggers</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={handleClearFilters}
                    type="button"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredWorkflows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-4 md:col-span-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium line-clamp-1">{workflow.name}</h3>
                      <Badge variant={workflow.isActive ? 'success' : 'secondary'}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {workflow.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Triggers</h4>
                      <div className="flex flex-wrap gap-2">
                        {workflow.triggers.map((trigger) => (
                          <div key={trigger.id} className="flex items-center text-sm">
                            <Badge variant="outline" className="mr-2">
                              {getTriggerTypeIcon(trigger.type)}
                              {getTriggerTypeLabel(trigger.type)}
                            </Badge>
                            {trigger.type === 'schedule' && (
                              <span className="text-xs text-muted-foreground">
                                {getScheduleDescription(trigger)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground mt-4">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Created: {format(parseISO(workflow.createdAt), 'PPP')}</span>
                      <span className="mx-2">•</span>
                      <span>Updated: {format(parseISO(workflow.updatedAt), 'PPP')}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col justify-between h-full">
                    {workflow.stats && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Statistics</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Runs</p>
                            <p className="text-sm font-medium">{workflow.stats.runsTotal}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Success Rate</p>
                            <p className="text-sm font-medium">
                              {workflow.stats.runsTotal > 0
                                ? `${Math.round((workflow.stats.runsSuccess / workflow.stats.runsTotal) * 100)}%`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        {workflow.stats.lastRun && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Last Run</p>
                            <p className="text-sm">{format(parseISO(workflow.stats.lastRun), 'PPP p')}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onToggleActive(workflow.id, !workflow.isActive)}
                        aria-label={workflow.isActive ? 'Deactivate workflow' : 'Activate workflow'}
                      >
                        {workflow.isActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onRunWorkflow(workflow.id)}
                        disabled={!workflow.isActive}
                        aria-label="Run workflow now"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewRuns(workflow.id)}
                        aria-label="View workflow runs"
                      >
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onEditWorkflow(workflow.id)}
                        aria-label="Edit workflow"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDuplicateWorkflow(workflow.id)}
                        aria-label="Duplicate workflow"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => onDeleteWorkflow(workflow.id)}
                        aria-label="Delete workflow"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No workflows found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? "Try adjusting your filters or search term"
                : "Get started by creating your first workflow"}
            </p>
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={onCreateWorkflow}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
