import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Lock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  FileCheck,
  Eye,
  Info,
  Shield,
  CreditCard,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Define payment status
export type PaymentStatus = 'scheduled' | 'pending' | 'processing' | 'released' | 'failed';

// Payment trigger type
export type PaymentTrigger = 'milestone_completion' | 'date' | 'manual' | 'approval';

// Payment interface
export interface ScheduledPayment {
  id: string;
  amount: string;
  scheduledDate: string;
  status: PaymentStatus;
  description: string;
  paymentMethod?: string;
  trigger: PaymentTrigger;
  milestoneId?: string;
  milestoneName?: string;
  recipient: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  transactionId?: string;
  processingDate?: string;
  releaseDate?: string;
}

interface PaymentSchedulerProps {
  contractId: string;
  payments: ScheduledPayment[];
  totalAmount: string;
  availableMilestones?: { id: string; name: string }[];
  isFreelancer: boolean;
  paymentMethods: { id: string; name: string; last4?: string; brand?: string; type: string }[];
  onAddPayment?: (payment: Partial<ScheduledPayment>) => void;
  onReleasePayment: (paymentId: string) => void;
  onCancelPayment?: (paymentId: string) => void;
  onDownloadInvoice?: (paymentId: string) => void;
}

const PaymentScheduler = ({
  contractId,
  payments,
  totalAmount,
  availableMilestones = [],
  isFreelancer,
  paymentMethods,
  onAddPayment,
  onReleasePayment,
  onCancelPayment,
  onDownloadInvoice
}: PaymentSchedulerProps) => {
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showConfirmReleaseDialog, setShowConfirmReleaseDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New payment form state
  const [newPayment, setNewPayment] = useState<Partial<ScheduledPayment>>({
    amount: '',
    description: '',
    trigger: 'milestone_completion' as PaymentTrigger,
    status: 'scheduled' as PaymentStatus,
    scheduledDate: new Date().toISOString()
  });
  
  // Calculate payment statistics
  const totalPaid = payments
    .filter(p => p.status === 'released')
    .reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g, '')), 0);
  
  const totalScheduled = payments
    .filter(p => p.status !== 'released')
    .reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g, '')), 0);
  
  const totalContractValue = parseInt(totalAmount.replace(/\D/g, ''));
  const paidPercentage = Math.round((totalPaid / totalContractValue) * 100) || 0;
  
  // Handle new payment form changes
  const updateNewPayment = (field: keyof ScheduledPayment, value: any) => {
    setNewPayment({
      ...newPayment,
      [field]: value
    });
  };
  
  // Handle payment release
  const handleReleasePayment = () => {
    if (!selectedPaymentId) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onReleasePayment(selectedPaymentId);
      setIsProcessing(false);
      setShowConfirmReleaseDialog(false);
      setSelectedPaymentId(null);
    }, 2000);
  };
  
  // Handle new payment submission
  const handleAddPayment = () => {
    if (onAddPayment && newPayment.amount && newPayment.description) {
      // Add additional data
      const payment = {
        ...newPayment,
        id: `payment-${Date.now()}`,
        status: 'scheduled' as PaymentStatus,
      };
      
      onAddPayment(payment);
      setShowAddPaymentDialog(false);
      
      // Reset form
      setNewPayment({
        amount: '',
        description: '',
        trigger: 'milestone_completion' as PaymentTrigger,
        status: 'scheduled' as PaymentStatus,
        scheduledDate: new Date().toISOString()
      });
    }
  };
  
  // Get payment status badge
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CreditCard className="h-3 w-3 mr-1" />
            Ready to Release
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'released':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Released
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  return (
    <div className="space-y-6">
      {/* Payment Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>
            Contract #{contractId} • Total: ${totalContractValue}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Amount Paid</span>
              <span className="font-medium">${totalPaid} of ${totalContractValue} ({paidPercentage}%)</span>
            </div>
            <Progress value={paidPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Released</p>
                  <p className="text-xl font-bold">${totalPaid}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {payments.filter(p => p.status === 'released').length} payment(s)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Clock className="h-8 w-8 mb-2 text-amber-500" />
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Pending</p>
                  <p className="text-xl font-bold">${totalScheduled}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {payments.filter(p => p.status !== 'released').length} payment(s)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Lock className="h-8 w-8 mb-2 text-blue-500" />
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">In Escrow</p>
                  <p className="text-xl font-bold">${totalScheduled}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Securely held until release
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Payments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Payment Schedule</h2>
          
          {!isFreelancer && onAddPayment && (
            <Button onClick={() => setShowAddPaymentDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Payment
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="scheduled">
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4">
            {payments.length > 0 ? renderPaymentsList(payments) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Payments Yet</h3>
                  <p className="text-muted-foreground">
                    No payments have been scheduled for this contract yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="scheduled" className="mt-4 space-y-4">
            {payments.filter(p => p.status !== 'released').length > 0 ? 
              renderPaymentsList(payments.filter(p => p.status !== 'released')) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Scheduled Payments</h3>
                  <p className="text-muted-foreground">
                    All payments have been released or no payments have been scheduled.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4 space-y-4">
            {payments.filter(p => p.status === 'released').length > 0 ? 
              renderPaymentsList(payments.filter(p => p.status === 'released')) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Completed Payments</h3>
                  <p className="text-muted-foreground">
                    No payments have been released yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Payment security info */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Secure Payment Processing</AlertTitle>
        <AlertDescription>
          All payments are securely processed and protected by our escrow system. Funds are only released when work is approved.
        </AlertDescription>
      </Alert>
      
      {/* Add Payment Dialog */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Payment</DialogTitle>
            <DialogDescription>
              Add a payment to the contract schedule
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="amount" 
                    className="pl-9" 
                    placeholder="1000" 
                    value={newPayment.amount}
                    onChange={(e) => updateNewPayment('amount', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trigger">Payment Trigger</Label>
                <Select 
                  value={newPayment.trigger}
                  onValueChange={(value) => updateNewPayment('trigger', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milestone_completion">Milestone Completion</SelectItem>
                    <SelectItem value="date">Specific Date</SelectItem>
                    <SelectItem value="manual">Manual Release</SelectItem>
                    <SelectItem value="approval">Client Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {newPayment.trigger === 'milestone_completion' && (
              <div className="space-y-2">
                <Label htmlFor="milestone">Associated Milestone</Label>
                <Select 
                  value={newPayment.milestoneId}
                  onValueChange={(value) => {
                    const milestone = availableMilestones.find(m => m.id === value);
                    updateNewPayment('milestoneId', value);
                    updateNewPayment('milestoneName', milestone?.name);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMilestones.map(milestone => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {newPayment.trigger === 'date' && (
              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPayment.scheduledDate ? 
                        format(new Date(newPayment.scheduledDate), 'PPP') : 
                        "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(newPayment.scheduledDate || Date.now())}
                      onSelect={(date) => 
                        updateNewPayment('scheduledDate', date?.toISOString() || new Date().toISOString())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Payment Description</Label>
              <Input 
                id="description" 
                placeholder="e.g., Final payment for design work" 
                value={newPayment.description}
                onChange={(e) => updateNewPayment('description', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup defaultValue={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-grow flex items-center cursor-pointer">
                        {method.type === 'card' ? (
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {method.brand} •••• {method.last4}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{method.name}</span>
                          </div>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddPayment}
              disabled={!newPayment.amount || !newPayment.description}
            >
              Schedule Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Release Dialog */}
      <Dialog open={showConfirmReleaseDialog} onOpenChange={setShowConfirmReleaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment Release</DialogTitle>
            <DialogDescription>
              You're about to release payment to the freelancer
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedPaymentId && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-bold">
                        ${parseInt(payments.find(p => p.id === selectedPaymentId)?.amount || '0')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">To</span>
                      <span className="font-medium">
                        {payments.find(p => p.id === selectedPaymentId)?.recipient.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Description</span>
                      <span>
                        {payments.find(p => p.id === selectedPaymentId)?.description}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Payment is Final</AlertTitle>
                  <AlertDescription>
                    Once released, this payment cannot be reversed. Make sure work has been completed to your satisfaction.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmReleaseDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReleasePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Release Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
  
  // Helper function to render payments list
  function renderPaymentsList(paymentsList: ScheduledPayment[]) {
    return (
      <div className="space-y-4">
        {paymentsList.map((payment) => (
          <Card key={payment.id}>
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 hidden sm:flex">
                    {payment.recipient.avatarUrl ? (
                      <AvatarImage src={payment.recipient.avatarUrl} alt={payment.recipient.name} />
                    ) : (
                      <AvatarFallback>{payment.recipient.name.substring(0, 2)}</AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{payment.description}</h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {payment.status === 'released' ? 
                            `Released on ${formatDate(payment.releaseDate || payment.scheduledDate)}` : 
                            `Scheduled for ${formatDate(payment.scheduledDate)}`}
                        </span>
                      </div>
                      
                      {payment.milestoneName && (
                        <div className="flex items-center">
                          <FileCheck className="h-3.5 w-3.5 mr-1" />
                          <span>Linked to milestone: {payment.milestoneName}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Info className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {payment.trigger === 'milestone_completion' ? 'Released on milestone completion' :
                            payment.trigger === 'date' ? 'Released on scheduled date' :
                            payment.trigger === 'manual' ? 'Manual release required' :
                            'Released upon approval'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                  <div className="text-right md:mr-4">
                    <div className="text-xl font-bold">${parseInt(payment.amount)}</div>
                    <div className="text-xs text-muted-foreground">
                      to {payment.recipient.name}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {payment.status === 'released' && onDownloadInvoice && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => onDownloadInvoice(payment.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Receipt</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    {payment.status === 'pending' && !isFreelancer && (
                      <Button 
                        onClick={() => {
                          setSelectedPaymentId(payment.id);
                          setShowConfirmReleaseDialog(true);
                        }}
                      >
                        Release
                      </Button>
                    )}
                    
                    {payment.status === 'scheduled' && onCancelPayment && !isFreelancer && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => onCancelPayment(payment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancel Payment</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
};

export default PaymentScheduler;
