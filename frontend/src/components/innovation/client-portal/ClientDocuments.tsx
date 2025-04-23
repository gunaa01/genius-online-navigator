import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Eye, 
  File, 
  Image, 
  FileSpreadsheet,
  FilePdf,
  Clock,
  MoreHorizontal
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'spreadsheet' | 'other';
  size: number;
  projectId: string;
  projectName: string;
  category: 'contract' | 'deliverable' | 'report' | 'invoice' | 'other';
  uploadedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  uploadedAt: string;
  lastViewed?: string;
  version: number;
}

// Mock data
const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Website Design Mockups.pdf',
    type: 'pdf',
    size: 4500000, // 4.5 MB
    projectId: 'p1',
    projectName: 'Website Redesign',
    category: 'deliverable',
    uploadedBy: {
      id: 'tm2',
      name: 'Sarah Williams',
      avatar: '/avatars/sarah.jpg'
    },
    uploadedAt: '2025-04-18T14:30:00Z',
    lastViewed: '2025-04-20T10:15:00Z',
    version: 2
  },
  {
    id: 'doc-2',
    name: 'Project Contract.pdf',
    type: 'pdf',
    size: 2100000, // 2.1 MB
    projectId: 'p1',
    projectName: 'Website Redesign',
    category: 'contract',
    uploadedBy: {
      id: 'tm3',
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg'
    },
    uploadedAt: '2025-02-15T09:00:00Z',
    lastViewed: '2025-04-05T16:30:00Z',
    version: 1
  },
  {
    id: 'doc-3',
    name: 'Marketing Campaign Strategy.doc',
    type: 'doc',
    size: 1800000, // 1.8 MB
    projectId: 'p2',
    projectName: 'Marketing Campaign',
    category: 'deliverable',
    uploadedBy: {
      id: 'tm4',
      name: 'Emily Rodriguez',
      avatar: '/avatars/emily.jpg'
    },
    uploadedAt: '2025-03-22T11:45:00Z',
    lastViewed: '2025-04-21T14:20:00Z',
    version: 3
  },
  {
    id: 'doc-4',
    name: 'Invoice - April 2025.pdf',
    type: 'pdf',
    size: 500000, // 0.5 MB
    projectId: 'p1',
    projectName: 'Website Redesign',
    category: 'invoice',
    uploadedBy: {
      id: 'tm3',
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg'
    },
    uploadedAt: '2025-04-05T10:00:00Z',
    version: 1
  },
  {
    id: 'doc-5',
    name: 'Progress Report - March 2025.xlsx',
    type: 'spreadsheet',
    size: 1200000, // 1.2 MB
    projectId: 'p2',
    projectName: 'Marketing Campaign',
    category: 'report',
    uploadedBy: {
      id: 'tm3',
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg'
    },
    uploadedAt: '2025-04-01T15:30:00Z',
    lastViewed: '2025-04-10T09:45:00Z',
    version: 1
  },
  {
    id: 'doc-6',
    name: 'Logo Concepts.png',
    type: 'image',
    size: 3500000, // 3.5 MB
    projectId: 'p3',
    projectName: 'Brand Identity Update',
    category: 'deliverable',
    uploadedBy: {
      id: 'tm2',
      name: 'Sarah Williams',
      avatar: '/avatars/sarah.jpg'
    },
    uploadedAt: '2025-02-28T16:15:00Z',
    lastViewed: '2025-03-15T11:30:00Z',
    version: 1
  }
];

// Format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
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

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
};

// Get file icon based on type
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FilePdf className="h-5 w-5 text-red-500" />;
    case 'doc':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'image':
      return <Image className="h-5 w-5 text-purple-500" />;
    case 'spreadsheet':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

// Get badge for document category
const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'contract':
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Contract</Badge>;
    case 'deliverable':
      return <Badge variant="outline" className="border-green-500 text-green-500">Deliverable</Badge>;
    case 'report':
      return <Badge variant="outline" className="border-purple-500 text-purple-500">Report</Badge>;
    case 'invoice':
      return <Badge variant="outline" className="border-amber-500 text-amber-500">Invoice</Badge>;
    default:
      return <Badge variant="outline">Other</Badge>;
  }
};

interface ClientDocumentsProps {
  projectId?: string; // Optional: Filter by project
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Filter documents
  const filteredDocuments = mockDocuments.filter(document => {
    // Filter by project if projectId is provided
    if (projectId && document.projectId !== projectId) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        document.name.toLowerCase().includes(query) ||
        document.projectName.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all' && document.category !== categoryFilter) {
      return false;
    }
    
    // Filter by type
    if (typeFilter !== 'all' && document.type !== typeFilter) {
      return false;
    }
    
    return true;
  });
  
  // Handle document actions
  const handleView = (document: DocumentItem) => {
    console.log(`Viewing document ${document.id}`);
    // In a real app, this would open a preview or download
  };
  
  const handleDownload = (document: DocumentItem) => {
    console.log(`Downloading document ${document.id}`);
    // In a real app, this would trigger a download
  };
  
  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Documents</CardTitle>
            <CardDescription>Access and manage project files and documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="contract">Contracts</SelectItem>
                  <SelectItem value="deliverable">Deliverables</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery || categoryFilter !== 'all' || typeFilter !== 'all' ? 
                    'No documents match your search criteria. Try adjusting your filters.' : 
                    'There are no documents available for your projects at this time.'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Document</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map(document => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(document.type)}
                          <div className="flex flex-col">
                            <span className="font-medium">{document.name}</span>
                            {document.version > 1 && (
                              <span className="text-xs text-muted-foreground">Version {document.version}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{document.projectName}</TableCell>
                      <TableCell>{getCategoryBadge(document.category)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={document.uploadedBy.avatar} alt={document.uploadedBy.name} />
                              <AvatarFallback>{document.uploadedBy.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{document.uploadedBy.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(document.uploadedAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(document.size)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleView(document)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownload(document)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

export default ClientDocuments;
