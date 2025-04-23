import React, { useState, useEffect } from 'react';
import { Shield, Download, Trash2, FileText, Clock, AlertTriangle, Check, X, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  complianceService, 
  CompliancePolicy, 
  UserConsent, 
  DataSubjectRequest, 
  DataRetentionPolicy 
} from '@/services/compliance/complianceService';
import { useAuth } from '@/contexts/AuthContext';

interface DataPrivacyCenterProps {
  onClose?: () => void;
}

/**
 * DataPrivacyCenter - Component for managing data privacy settings and requests
 * 
 * Features:
 * - View and manage consent history
 * - Submit data subject requests (access, delete, modify, export)
 * - View data retention policies
 * - Manage privacy preferences
 */
const DataPrivacyCenter: React.FC<DataPrivacyCenterProps> = ({
  onClose
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [policies, setPolicies] = useState<CompliancePolicy[]>([]);
  const [consents, setConsents] = useState<UserConsent[]>([]);
  const [dataRequests, setDataRequests] = useState<DataSubjectRequest[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<DataRetentionPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState<'access' | 'delete' | 'modify' | 'export'>('access');
  const [requestDetails, setRequestDetails] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load policies
        const policiesData = await complianceService.getPolicies();
        setPolicies(policiesData);
        
        // Load consents
        const consentsData = await complianceService.getUserConsents();
        setConsents(consentsData);
        
        // Load data requests
        const dataRequestsResponse = await fetch('/api/compliance/data-requests');
        const dataRequestsData = await dataRequestsResponse.json();
        setDataRequests(dataRequestsData);
        
        // Load retention policies
        const retentionPoliciesData = await complianceService.getDataRetentionPolicies();
        setRetentionPolicies(retentionPoliciesData);
      } catch (error) {
        console.error('Error loading data privacy data:', error);
        toast({
          title: "Error loading data",
          description: "There was an error loading your privacy data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Submit data subject request
  const handleSubmitRequest = async () => {
    setSubmittingRequest(true);
    try {
      const result = await complianceService.submitDataSubjectRequest(requestType, requestDetails);
      
      if (result) {
        setDataRequests([...dataRequests, result]);
        setShowRequestDialog(false);
        setRequestDetails('');
        
        toast({
          title: "Request submitted",
          description: "Your data request has been submitted successfully.",
        });
        
        // Log compliance action
        await complianceService.logComplianceAction(
          'submit_data_request',
          'data_subject_request',
          result.id,
          { requestType, timestamp: new Date().toISOString() }
        );
      }
    } catch (error) {
      console.error('Error submitting data request:', error);
      toast({
        title: "Error submitting request",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingRequest(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge for data requests
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Denied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get request type icon
  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access':
        return <FileText className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'modify':
        return <FileText className="h-4 w-4" />;
      case 'export':
        return <Download className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading privacy data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Data Privacy Center</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consents">Consents</TabsTrigger>
          <TabsTrigger value="requests">Data Requests</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy at a Glance</CardTitle>
              <CardDescription>
                Overview of your privacy settings and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Consents</h3>
                  </div>
                  <p className="text-2xl font-bold">{consents.length}</p>
                  <p className="text-sm text-muted-foreground">Active consent records</p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Data Requests</h3>
                  </div>
                  <p className="text-2xl font-bold">{dataRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Total data requests</p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Data Retention</h3>
                  </div>
                  <p className="text-2xl font-bold">{retentionPolicies.length}</p>
                  <p className="text-sm text-muted-foreground">Active retention policies</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setRequestType('export');
                      setShowRequestDialog(true);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setRequestType('delete');
                      setShowRequestDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Request Data Deletion
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('consents')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Consents
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Privacy Summary</h3>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Your data is protected according to our privacy policy and applicable data protection laws.
                    You have the right to access, modify, export, or delete your personal data at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Consents Tab */}
        <TabsContent value="consents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consent Management</CardTitle>
              <CardDescription>
                View and manage your privacy consents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {consents.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Consents Found</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't provided any privacy consents yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consents.map((consent, index) => {
                    const policy = policies.find(p => p.id === consent.policyId);
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{policy?.name || consent.policyId}</h3>
                            <p className="text-sm text-muted-foreground">
                              Version: {consent.version}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Consented on: {formatDate(consent.consentDate)}
                            </p>
                          </div>
                          <div>
                            {consent.status === 'accepted' ? (
                              <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                            ) : consent.status === 'declined' ? (
                              <Badge className="bg-red-100 text-red-800">Declined</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Data Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Data Subject Requests</CardTitle>
                <CardDescription>
                  Manage your data access, deletion, and export requests
                </CardDescription>
              </div>
              <Button 
                size="sm"
                onClick={() => setShowRequestDialog(true)}
              >
                New Request
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataRequests.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Data Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't made any data subject requests yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dataRequests.map((request, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getRequestTypeIcon(request.requestType)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium capitalize">{request.requestType} Request</h3>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Submitted: {formatDate(request.createdAt)}
                            </p>
                            {request.completedAt && (
                              <p className="text-sm text-muted-foreground">
                                Completed: {formatDate(request.completedAt)}
                              </p>
                            )}
                            {request.details && (
                              <p className="text-sm mt-2 bg-muted p-2 rounded">
                                {request.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Data Retention Tab */}
        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Policies</CardTitle>
              <CardDescription>
                How long we keep your data and why
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {retentionPolicies.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Retention Policies</h3>
                  <p className="text-sm text-muted-foreground">
                    No data retention policies are currently available.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {retentionPolicies.map((policy, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium">{policy.dataType}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Retention period: {policy.retentionPeriod} days
                      </p>
                      <p className="text-sm mb-2">{policy.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Legal basis: {policy.legalBasis}</span>
                        {policy.automaticDeletion ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Automatic Deletion
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            Manual Deletion
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Data Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Data Request</DialogTitle>
            <DialogDescription>
              Request access to, modification of, or deletion of your personal data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Request Type</h4>
              <RadioGroup 
                value={requestType} 
                onValueChange={(value) => setRequestType(value as any)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="access" id="access" />
                  <Label htmlFor="access" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Access my data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delete" id="delete" />
                  <Label htmlFor="delete" className="flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete my data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="modify" id="modify" />
                  <Label htmlFor="modify" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Modify my data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="export" id="export" />
                  <Label htmlFor="export" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export my data
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="request-details">Additional Details (Optional)</Label>
              <textarea
                id="request-details"
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Please provide any additional details about your request..."
              />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">Important Information</p>
                  <p className="text-yellow-700 mt-1">
                    We will process your request within 30 days as required by applicable data protection laws.
                    You may be required to verify your identity before we can fulfill your request.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRequestDialog(false)}
              disabled={submittingRequest}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={submittingRequest}
            >
              {submittingRequest ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataPrivacyCenter;
