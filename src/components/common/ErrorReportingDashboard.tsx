import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Bug, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  BarChart,
  Users,
  Layers,
  X,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Import types and services from our error reporting service
import {
  ErrorEvent,
  ErrorSummary,
  getAllErrors,
  updateErrorStatus,
  assignError,
  calculateErrorSummary
} from '@/services/errorReporting';

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) {
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new':
      return <Badge variant="destructive">New</Badge>;
    case 'investigating':
      return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-500">Investigating</Badge>;
    case 'resolved':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-500">Resolved</Badge>;
    case 'ignored':
      return <Badge variant="outline">Ignored</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive" className="bg-red-600 hover:bg-red-600">Critical</Badge>;
    case 'high':
      return <Badge variant="destructive">High</Badge>;
    case 'medium':
      return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-500">Medium</Badge>;
    case 'low':
      return <Badge variant="outline">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

// We now use the calculateErrorSummary function from our service
interface ErrorReportingDashboardProps {
  isDevMode?: boolean;
  onAssignError?: (errorId: string, assignee: string) => void;
  onUpdateStatus?: (errorId: string, status: string) => void;
  onRefresh?: () => void;
}

/**
 * ErrorReportingDashboard - A dashboard for tracking and managing application errors
 * 
 * Features:
 * - Real-time error tracking and visualization
 * - Filtering and searching capabilities
 * - Error assignment and status management
 * - Detailed error information and stack traces
 */
const ErrorReportingDashboard: React.FC<ErrorReportingDashboardProps> = ({
  isDevMode = true,
  onAssignError,
  onUpdateStatus,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);
  const [errorSummary, setErrorSummary] = useState<ErrorSummary>({} as ErrorSummary);
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load errors from our error reporting service
  const loadErrors = () => {
    // Get errors from our service
    const allErrors = getAllErrors();
    setErrors(allErrors);
    setErrorSummary(calculateErrorSummary(allErrors));
    setIsLoading(false);
  };

  useEffect(() => {
    loadErrors();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (onRefresh) {
        onRefresh();
      }
      
      loadErrors();
    } catch (error) {
      console.error('Error refreshing error reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter errors based on active tab and filters
  const filteredErrors = errors.filter(error => {
    // Filter by tab
    if (activeTab !== 'all' && error.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        error.message.toLowerCase().includes(query) ||
        error.component.toLowerCase().includes(query) ||
        error.module.toLowerCase().includes(query) ||
        (error.userName && error.userName.toLowerCase().includes(query))
      );
    }
    
    // Filter by module
    if (moduleFilter !== 'all' && error.module !== moduleFilter) {
      return false;
    }
    
    // Filter by priority
    if (priorityFilter !== 'all' && error.priority !== priorityFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && error.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  // Toggle error details
  const toggleErrorDetails = (errorId: string) => {
    if (expandedErrorId === errorId) {
      setExpandedErrorId(null);
    } else {
      setExpandedErrorId(errorId);
    }
  };

  // Handle status update
  const handleStatusUpdate = (errorId: string, status: string) => {
    // Call our service to update the error status
    const updatedError = updateErrorStatus(errorId, status as ErrorEvent['status']);
    
    if (updatedError) {
      // Refresh the errors list
      loadErrors();
      
      if (onUpdateStatus) {
        onUpdateStatus(errorId, status);
      }
    }
  };

  // Handle error assignment
  const handleAssign = (errorId: string, assignee: string) => {
    if (onAssignError) {
      onAssignError(errorId, assignee);
    } else {
      // For demo purposes, update the local state
      const updatedErrors = errors.map(error => {
        if (error.id === errorId) {
          return { ...error, assignedTo: assignee };
        }
        return error;
      });
      setErrors(updatedErrors);
    }
  };

  // Get available modules for filter
  const availableModules = Array.from(new Set(errors.map(error => error.module)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Error Reporting Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage application errors across all modules
          </p>
        </div>
        
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {errorSummary.total || 0}
              </div>
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {errorSummary.new || 0} new in the last 24 hours
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-red-600">
                {errorSummary.critical || 0}
              </div>
              <Bug className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {errorSummary.high || 0} high priority issues
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">
                {errorSummary.total ? Math.round((errorSummary.resolved / errorSummary.total) * 100) : 0}%
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {errorSummary.resolved || 0} issues resolved
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Investigating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-amber-500">
                {errorSummary.investigating || 0}
              </div>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {errorSummary.new || 0} new issues pending investigation
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Errors</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="investigating">Investigating</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search errors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={moduleFilter}
              onValueChange={setModuleFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {availableModules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading error reports...</p>
              </div>
            </div>
          ) : filteredErrors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No errors found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery || moduleFilter !== 'all' || priorityFilter !== 'all' ? 
                  'No errors match your search criteria. Try adjusting your filters.' : 
                  'There are no errors to display at this time.'
                }
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Error</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Occurrences</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredErrors.map(error => (
                    <React.Fragment key={error.id}>
                      <TableRow 
                        className={expandedErrorId === error.id ? 'bg-muted/50' : ''}
                        onClick={() => toggleErrorDetails(error.id)}
                      >
                        <TableCell>
                          <div className="font-medium truncate max-w-[300px]">{error.message}</div>
                          <div className="text-xs text-muted-foreground">{error.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{error.component}</span>
                            <span className="text-xs text-muted-foreground">{error.module}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{error.occurrences}</Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {formatRelativeTime(error.lastOccurrence)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{formatDate(error.lastOccurrence)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{getPriorityBadge(error.priority)}</TableCell>
                        <TableCell>{getStatusBadge(error.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleErrorDetails(error.id);
                            }}
                          >
                            {expandedErrorId === error.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Error Details */}
                      {expandedErrorId === error.id && (
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Environment</h4>
                                  <div className="text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline">{error.browser}</Badge>
                                      <Badge variant="outline">{error.os}</Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Path: {error.path}
                                    </div>
                                  </div>
                                </div>
                                
                                {error.userId && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">User</h4>
                                    <div className="text-sm">
                                      <div>{error.userName}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {error.userRole} (ID: {error.userId})
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Timing</h4>
                                  <div className="text-sm">
                                    <div>First seen: {formatDate(error.timestamp)}</div>
                                    <div>Last occurrence: {formatDate(error.lastOccurrence)}</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <h4 className="text-sm font-medium mb-1">Stack Trace</h4>
                                <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[200px] whitespace-pre-wrap">
                                  {error.stack}
                                </pre>
                              </div>
                              
                              {isDevMode && (
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={error.status}
                                      onValueChange={(value) => handleStatusUpdate(error.id, value)}
                                    >
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Update Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="investigating">Investigating</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="ignored">Ignored</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    
                                    <Select
                                      value={error.assignedTo || ''}
                                      onValueChange={(value) => handleAssign(error.id, value)}
                                    >
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Assign To" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">Unassigned</SelectItem>
                                        <SelectItem value="Error Handling Expert">Error Handling Expert</SelectItem>
                                        <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                                        <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Button variant="outline" size="sm">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View in Error Tracker
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErrorReportingDashboard;
