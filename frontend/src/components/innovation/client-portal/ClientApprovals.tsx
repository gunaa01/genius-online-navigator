import { useState } from 'react';
import { 
  CheckSquare, 
  X, 
  Check, 
  FileText, 
  Clock, 
  ExternalLink,
  Filter,
  Search,
  Eye
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Types
interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  type: 'document' | 'design' | 'milestone' | 'payment';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  submittedAt: string;
  dueBy?: string;
  fileUrl?: string;
}

// Mock data
const mockApprovals: ApprovalItem[] = [
  {
    id: 'approval-1',
    title: 'Homepage Design Final',
    description: 'Final homepage design for review and approval',
    projectId: 'p1',
    projectName: 'Website Redesign',
    type: 'design',
    status: 'pending',
    submittedBy: {
      id: 'tm2',
      name: 'Sarah Williams',
      avatar: '/avatars/sarah.jpg'
    },
    submittedAt: '2025-04-20T14:30:00Z',
    dueBy: '2025-04-24T23:59:59Z',
    fileUrl: '/files/homepage-design-final.pdf'
  },
  {
    id: 'approval-2',
    title: 'Content Strategy Document',
    description: 'Content strategy and SEO recommendations',
    projectId: 'p1',
    projectName: 'Website Redesign',
    type: 'document',
    status: 'pending',
    submittedBy: {
      id: 'tm4',
      name: 'Emily Rodriguez',
      avatar: '/avatars/emily.jpg'
    },
    submittedAt: '2025-04-21T09:15:00Z',
    dueBy: '2025-04-25T23:59:59Z',
    fileUrl: '/files/content-strategy.docx'
  },
  {
    id: 'approval-3',
    title: 'Phase 1 Milestone Completion',
    description: 'Approval for Phase 1 completion and payment release',
    projectId: 'p2',
    projectName: 'Marketing Campaign',
    type: 'milestone',
    status: 'pending',
    submittedBy: {
      id: 'tm3',
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg'
    },
    submittedAt: '2025-04-19T16:45:00Z',
    dueBy: '2025-04-23T23:59:59Z'
  },
  {
    id: 'approval-4',
    title: 'Logo Design Options',
    description: 'Three logo design options for review',
    projectId: 'p3',
    projectName: 'Brand Identity Update',
    type: 'design',
    status: 'approved',
    submittedBy: {
      id: 'tm2',
      name: 'Sarah Williams',
      avatar: '/avatars/sarah.jpg'
    },
    submittedAt: '2025-04-15T11:30:00Z',
    fileUrl: '/files/logo-options.pdf'
  },
  {
    id: 'approval-5',
    title: 'Invoice #INV-2025-042',
    description: 'Monthly retainer payment for April 2025',
    projectId: 'p1',
    projectName: 'Website Redesign',
    type: 'payment',
    status: 'rejected',
    submittedBy: {
      id: 'tm3',
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg'
    },
    submittedAt: '2025-04-18T10:00:00Z'
  }
];

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format relative time
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

// Get badge color for approval type
const getApprovalTypeBadge = (type: string) => {
  switch (type) {
    case 'document':
      return <Badge variant="outline">Document</Badge>;
    case 'design':
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Design</Badge>;
    case 'milestone':
      return <Badge variant="outline" className="border-purple-500 text-purple-500">Milestone</Badge>;
    case 'payment':
      return <Badge variant="outline" className="border-green-500 text-green-500">Payment</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

// Get badge for approval status
const getApprovalStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'approved':
      return <Badge variant="default" className="bg-green-500">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface ClientApprovalsProps {
  projectId?: string; // Optional: Filter by project
}

const ClientApprovals: React.FC<ClientApprovalsProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter approvals
  const filteredApprovals = mockApprovals.filter(approval => {
    // Filter by project if projectId is provided
    if (projectId && approval.projectId !== projectId) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        approval.title.toLowerCase().includes(query) ||
        approval.description.toLowerCase().includes(query) ||
        approval.projectName.toLowerCase().includes(query)
      );
    }
    
    // Filter by type
    if (typeFilter !== 'all' && approval.type !== typeFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && approval.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Handle approval actions
  const handleApprove = (id: string) => {
    console.log(`Approving item ${id}`);
    // In a real app, this would call an API
  };
  
  const handleReject = (id: string) => {
    console.log(`Rejecting item ${id}`);
    // In a real app, this would call an API
  };
  
  const handleView = (approval: ApprovalItem) => {
    console.log(`Viewing item ${approval.id}`);
    // In a real app, this would open a preview or download
    if (approval.fileUrl) {
      window.open(approval.fileUrl, '_blank');
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Review and approve project deliverables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search approvals..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CheckSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No approvals found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' ? 
                    'No approvals match your search criteria. Try adjusting your filters.' : 
                    'You don\'t have any items requiring approval at this time.'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Item</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.map(approval => (
                    <TableRow key={approval.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{approval.title}</span>
                          <span className="text-xs text-muted-foreground">{approval.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>{approval.projectName}</TableCell>
                      <TableCell>{getApprovalTypeBadge(approval.type)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={approval.submittedBy.avatar} alt={approval.submittedBy.name} />
                              <AvatarFallback>{approval.submittedBy.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{approval.submittedBy.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(approval.submittedAt)}
                          </span>
                          {approval.dueBy && (
                            <div className="flex items-center text-xs text-amber-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Due by {formatDate(approval.dueBy)}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getApprovalStatusBadge(approval.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {approval.fileUrl && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleView(approval)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {approval.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleReject(approval.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="text-green-500 hover:text-green-500"
                                onClick={() => handleApprove(approval.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {approval.status !== 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default ClientApprovals;
