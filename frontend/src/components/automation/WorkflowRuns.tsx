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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  X, 
  CheckCircle, 
  AlertCircle,
  Info,
  ArrowLeft,
  RefreshCw,
  Eye
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { WorkflowRun } from '@/services/automation/workflowService';

interface WorkflowRunsProps {
  workflowId: string;
  workflowName: string;
  runs: WorkflowRun[];
  loading: boolean;
  onRefresh: () => void;
  onBack: () => void;
}

/**
 * Workflow Runs
 * 
 * Displays a list of workflow execution runs with filtering and details
 */
export default function WorkflowRuns({
  workflowId,
  workflowName,
  runs,
  loading,
  onRefresh,
  onBack
}: WorkflowRunsProps) {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Filter runs
  const filteredRuns = runs.filter(run => {
    // Search term filter (by trigger or ID)
    if (searchTerm && 
        !run.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !run.triggeredBy.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filterStatus === 'success' && run.status !== 'success') return false;
    if (filterStatus === 'failed' && run.status !== 'failed') return false;
    if (filterStatus === 'running' && run.status !== 'running') return false;
    
    return true;
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via the filteredRuns
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };
  
  // View run details
  const handleViewDetails = (run: WorkflowRun) => {
    setSelectedRun(run);
    setShowDetailsDialog(true);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success" className="flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Success</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'running':
        return <Badge variant="default" className="flex items-center"><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format duration
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}m ${seconds}s`;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workflows
              </Button>
              <CardTitle>Workflow Runs: {workflowName}</CardTitle>
              <CardDescription>
                View execution history for this workflow
              </CardDescription>
            </div>
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
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
                    placeholder="Search by run ID or trigger..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchTerm || filterStatus !== 'all') && (
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
      ) : filteredRuns.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Triggered By</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>{getStatusBadge(run.status)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{run.triggeredBy}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {run.triggerDetails}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(run.startTime), 'PPP')}
                      <div className="text-sm text-muted-foreground">
                        {format(parseISO(run.startTime), 'p')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {run.endTime ? formatDuration(new Date(run.endTime).getTime() - new Date(run.startTime).getTime()) : 'Running...'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDetails(run)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No runs found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterStatus !== 'all'
                ? "Try adjusting your filters or search term"
                : "This workflow hasn't been executed yet"}
            </p>
            {searchTerm || filterStatus !== 'all' ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}
      
      {/* Run Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Run Details</DialogTitle>
            <DialogDescription>
              Execution details for run {selectedRun?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRun && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <div>{getStatusBadge(selectedRun.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Run ID</h4>
                  <div className="text-sm font-mono">{selectedRun.id}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Start Time</h4>
                  <div>{format(parseISO(selectedRun.startTime), 'PPP p')}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">End Time</h4>
                  <div>{selectedRun.endTime ? format(parseISO(selectedRun.endTime), 'PPP p') : 'Running...'}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Duration</h4>
                  <div>
                    {selectedRun.endTime 
                      ? formatDuration(new Date(selectedRun.endTime).getTime() - new Date(selectedRun.startTime).getTime()) 
                      : 'Running...'}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Triggered By</h4>
                  <div>{selectedRun.triggeredBy}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Trigger Details</h4>
                <Card>
                  <CardContent className="p-4">
                    <pre className="text-xs whitespace-pre-wrap font-mono bg-muted p-2 rounded-md overflow-x-auto">
                      {JSON.stringify(selectedRun.triggerData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Action Executions</h4>
                <Accordion type="multiple" className="w-full">
                  {selectedRun.actionExecutions.map((execution, index) => (
                    <AccordionItem key={index} value={`action-${index}`}>
                      <AccordionTrigger className="px-4 py-2 bg-muted/50 rounded-t-md hover:no-underline hover:bg-muted">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center">
                            <span className="font-medium">
                              {execution.actionName}
                            </span>
                          </div>
                          {getStatusBadge(execution.status)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border border-t-0 rounded-b-md p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-xs font-medium mb-1">Start Time</h5>
                              <div className="text-sm">{format(parseISO(execution.startTime), 'PPP p')}</div>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium mb-1">End Time</h5>
                              <div className="text-sm">
                                {execution.endTime ? format(parseISO(execution.endTime), 'PPP p') : 'Running...'}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium mb-1">Duration</h5>
                              <div className="text-sm">
                                {execution.endTime 
                                  ? formatDuration(new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) 
                                  : 'Running...'}
                              </div>
                            </div>
                          </div>
                          
                          {execution.error && (
                            <div>
                              <h5 className="text-xs font-medium mb-1 text-red-500">Error</h5>
                              <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
                                {execution.error}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h5 className="text-xs font-medium mb-1">Input</h5>
                            <pre className="text-xs whitespace-pre-wrap font-mono bg-muted p-2 rounded-md overflow-x-auto">
                              {JSON.stringify(execution.input, null, 2)}
                            </pre>
                          </div>
                          
                          {execution.output && (
                            <div>
                              <h5 className="text-xs font-medium mb-1">Output</h5>
                              <pre className="text-xs whitespace-pre-wrap font-mono bg-muted p-2 rounded-md overflow-x-auto">
                                {JSON.stringify(execution.output, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              
              {selectedRun.logs && selectedRun.logs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Execution Logs</h4>
                  <Card>
                    <CardContent className="p-0">
                      <div className="max-h-[300px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>Level</TableHead>
                              <TableHead>Message</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedRun.logs.map((log, index) => (
                              <TableRow key={index}>
                                <TableCell className="whitespace-nowrap">
                                  {format(parseISO(log.timestamp), 'HH:mm:ss.SSS')}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={
                                      log.level === 'error' ? 'destructive' : 
                                      log.level === 'warn' ? 'warning' : 
                                      log.level === 'info' ? 'default' : 
                                      'outline'
                                    }
                                  >
                                    {log.level}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-mono text-xs whitespace-pre-wrap">
                                    {log.message}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
