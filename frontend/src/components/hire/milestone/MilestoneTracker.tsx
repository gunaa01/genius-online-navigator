import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Upload, 
  FileText, 
  MoreHorizontal,
  CalendarClock,
  DollarSign,
  Loader2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Lock,
  Shield,
  Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Define milestone status
export type MilestoneStatus = 'pending' | 'in_progress' | 'under_review' | 'rejected' | 'completed' | 'paid';

// Milestone interface
export interface MilestoneWithStatus {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  amount: string;
  paymentTrigger: 'completion' | 'approval' | 'date';
  deliverables: string;
  status: MilestoneStatus;
  completedDate?: string;
  deliveryNotes?: string;
  rejectionReason?: string;
  attachments?: {
    id: string;
    name: string;
    size: string;
    type: string;
    url: string;
  }[];
}

interface MilestoneTrackerProps {
  contractId: string;
  milestones: MilestoneWithStatus[];
  totalAmount: string;
  isFreelancer: boolean;
  onMilestoneAction: (milestoneId: string, action: 'start' | 'deliver' | 'approve' | 'reject' | 'release_payment', data?: any) => void;
  onDownloadAttachment?: (attachmentId: string) => void;
}

const MilestoneTracker = ({
  contractId,
  milestones,
  totalAmount,
  isFreelancer,
  onMilestoneAction,
  onDownloadAttachment
}: MilestoneTrackerProps) => {
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([]);
  
  // Calculate project progress
  const completedMilestones = milestones.filter(m => 
    m.status === 'completed' || m.status === 'paid'
  ).length;
  
  const progress = Math.round((completedMilestones / milestones.length) * 100);
  
  // Calculate total amount paid and remaining
  const paidAmount = milestones
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + parseInt(m.amount.replace(/\D/g, '')), 0);
  
  const remainingAmount = parseInt(totalAmount.replace(/\D/g, '')) - paidAmount;
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };
  
  // Handle milestone delivery
  const handleDeliverMilestone = () => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (activeMilestoneId) {
        // In a real app, you would upload files here
        // This would include creating FormData and sending it to your API
        
        // Then update the milestone status
        onMilestoneAction(activeMilestoneId, 'deliver', {
          deliveryNotes,
          files: selectedFiles
        });
      }
      
      // Reset state
      setIsSubmitting(false);
      setDeliveryNotes('');
      setSelectedFiles([]);
      setShowDeliveryDialog(false);
    }, 1500);
  };
  
  // Handle milestone rejection
  const handleRejectMilestone = () => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (activeMilestoneId) {
        onMilestoneAction(activeMilestoneId, 'reject', {
          rejectionReason
        });
      }
      
      // Reset state
      setIsSubmitting(false);
      setRejectionReason('');
      setShowRejectDialog(false);
    }, 1500);
  };
  
  // Toggle milestone expansion
  const toggleMilestoneExpansion = (milestoneId: string) => {
    if (expandedMilestones.includes(milestoneId)) {
      setExpandedMilestones(expandedMilestones.filter(id => id !== milestoneId));
    } else {
      setExpandedMilestones([...expandedMilestones, milestoneId]);
    }
  };
  
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Helper to get status badge
  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            In Progress
          </Badge>
        );
      case 'under_review':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <FileText className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Needs Revision
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'paid':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <DollarSign className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
    }
  };
  
  // Get action button based on milestone status and user role
  const getMilestoneAction = (milestone: MilestoneWithStatus) => {
    if (isFreelancer) {
      // Freelancer actions
      switch (milestone.status) {
        case 'pending':
          return (
            <Button 
              size="sm"
              onClick={() => onMilestoneAction(milestone.id, 'start')}
            >
              Start Work
            </Button>
          );
        case 'in_progress':
          return (
            <Button
              size="sm"
              onClick={() => {
                setActiveMilestoneId(milestone.id);
                setShowDeliveryDialog(true);
              }}
            >
              Deliver Work
            </Button>
          );
        case 'rejected':
          return (
            <Button
              size="sm"
              onClick={() => {
                setActiveMilestoneId(milestone.id);
                setShowDeliveryDialog(true);
              }}
            >
              Submit Revision
            </Button>
          );
        default:
          return null;
      }
    } else {
      // Client actions
      switch (milestone.status) {
        case 'under_review':
          return (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setActiveMilestoneId(milestone.id);
                  setShowRejectDialog(true);
                }}
              >
                Request Changes
              </Button>
              <Button 
                size="sm"
                onClick={() => onMilestoneAction(milestone.id, 'approve')}
              >
                Approve
              </Button>
            </div>
          );
        case 'completed':
          return (
            <Button 
              size="sm"
              onClick={() => onMilestoneAction(milestone.id, 'release_payment')}
            >
              Release Payment
            </Button>
          );
        default:
          return null;
      }
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Project Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>
            Contract #{contractId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <DollarSign className="h-8 w-8 mb-2 text-green-500" />
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Paid</p>
                  <p className="text-xl font-bold">${paidAmount}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <CalendarClock className="h-8 w-8 mb-2 text-blue-500" />
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">In Progress</p>
                  <p className="text-xl font-bold">
                    {milestones.filter(m => 
                      m.status === 'in_progress' || 
                      m.status === 'under_review'
                    ).length}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Lock className="h-8 w-8 mb-2 text-amber-500" />
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">In Escrow</p>
                  <p className="text-xl font-bold">${remainingAmount}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Payment Protection</AlertTitle>
            <AlertDescription>
              All milestone payments are held in escrow until work is approved, providing security for both parties.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      {/* Milestones List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Milestones</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download Milestone Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <Card 
              key={milestone.id}
              className={milestone.status === 'rejected' ? 'border-red-200' : ''}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold mr-2">{index + 1}. {milestone.title}</h3>
                      {getStatusBadge(milestone.status)}
                    </div>
                    <CardDescription>
                      Due: {formatDate(milestone.dueDate)}
                      {milestone.completedDate ? ` • Completed: ${formatDate(milestone.completedDate)}` : ''}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <p className="text-lg font-bold">{milestone.amount}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleMilestoneExpansion(milestone.id)}
                    >
                      {expandedMilestones.includes(milestone.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedMilestones.includes(milestone.id) && (
                <>
                  <Separator />
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Deliverables</h4>
                      <p className="text-sm text-muted-foreground">{milestone.deliverables}</p>
                    </div>
                    
                    {milestone.status === 'under_review' && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Delivery Notes</h4>
                        <p className="text-sm text-muted-foreground">{milestone.deliveryNotes}</p>
                      </div>
                    )}
                    
                    {milestone.status === 'rejected' && milestone.rejectionReason && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Revision Requested</AlertTitle>
                        <AlertDescription>{milestone.rejectionReason}</AlertDescription>
                      </Alert>
                    )}
                    
                    {milestone.attachments && milestone.attachments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Attachments</h4>
                        <div className="space-y-2">
                          {milestone.attachments.map((attachment) => (
                            <div 
                              key={attachment.id} 
                              className="flex items-center justify-between bg-muted p-2 rounded-md"
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">{attachment.name}</p>
                                  <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => onDownloadAttachment && onDownloadAttachment(attachment.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Payment trigger info */}
                    <div className="flex items-center p-2 bg-muted/50 rounded-md">
                      <Info className="h-4 w-4 text-muted-foreground mr-2" />
                      <p className="text-xs text-muted-foreground">
                        Payment is released {' '}
                        {milestone.paymentTrigger === 'completion' 
                          ? 'when the freelancer marks the milestone as complete'
                          : milestone.paymentTrigger === 'approval'
                          ? 'after client approval of deliverables'
                          : 'automatically on the due date'}
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <div onClick={() => alert('Messaging feature would open here')}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Discuss
                      </div>
                    </Button>
                    
                    {getMilestoneAction(milestone)}
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      {/* Delivery Dialog */}
      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Work for Review</DialogTitle>
            <DialogDescription>
              Upload your work and provide any relevant notes for the client
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Notes</label>
              <Textarea 
                placeholder="Describe what you're delivering and any instructions for the client..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Files</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="w-full h-full cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                </label>
              </div>
              
              {/* Selected files list */}
              {selectedFiles.length > 0 && (
                <div className="mt-2 space-y-2">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const newFiles = [...selectedFiles];
                          newFiles.splice(i, 1);
                          setSelectedFiles(newFiles);
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeliveryDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeliverMilestone}
              disabled={isSubmitting || !deliveryNotes.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit for Review
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Provide detailed feedback on what needs to be revised
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Revision Request Details</label>
              <Textarea 
                placeholder="Please explain what changes are needed and why..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={6}
              />
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Constructive Feedback</AlertTitle>
              <AlertDescription>
                Clear, specific feedback helps the freelancer understand exactly what needs to be changed.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleRejectMilestone}
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Send Revision Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestoneTracker;
