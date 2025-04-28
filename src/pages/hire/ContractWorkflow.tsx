import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Pencil,
  ListChecks,
  Send,
  Clock,
  Shield,
  Info,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Steps, Step } from '@/components/ui/steps';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet';

// Import our contract components
import ContractTemplateSelector from '@/components/hire/contract/ContractTemplateSelector';
import ContractTermsForm from '@/components/hire/contract/ContractTermsForm';
import MilestoneEditor from '@/components/hire/contract/MilestoneEditor';
import ESignatureModule from '@/components/hire/contract/ESignatureModule';

// Types imported from the contract components
import { ContractType } from '@/components/hire/contract/ContractTemplateSelector';
import { Milestone } from '@/components/hire/contract/MilestoneEditor';

// Define the steps in our contract workflow
enum ContractStep {
  SELECT_TEMPLATE = 0,
  CUSTOMIZE_TERMS = 1,
  DEFINE_MILESTONES = 2,
  REVIEW_CONTRACT = 3,
  SIGN_CONTRACT = 4
}

// Workflow stage display information
const workflowSteps = [
  { 
    label: "Template", 
    description: "Select contract type",
    icon: <FileText className="h-5 w-5" />
  },
  { 
    label: "Terms", 
    description: "Define contract terms", 
    icon: <Pencil className="h-5 w-5" />
  },
  { 
    label: "Milestones", 
    description: "Set project milestones", 
    icon: <ListChecks className="h-5 w-5" />
  },
  { 
    label: "Review", 
    description: "Review the contract", 
    icon: <Info className="h-5 w-5" />
  },
  { 
    label: "Sign", 
    description: "Sign the contract", 
    icon: <Send className="h-5 w-5" />
  }
];

// Mock participant data
const mockParticipants = [
  {
    id: "client-001",
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "client",
    signed: false,
    avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop"
  },
  {
    id: "freelancer-001",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "freelancer",
    signed: false,
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop"
  }
];

// Mock contract preview URL
const mockContractPreviewUrl = "https://docs.google.com/document/d/e/2PACX-1vQp-GHJ1XR6hHXsU5YNGxFsZ7cx1aYYsA2a0sJU4sFJ1JGUBBfTK2OAYHKPQQnlnCGMzJ5_XTZcsXp0/pub?embedded=true";

const ContractWorkflow = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for the workflow
  const [currentStep, setCurrentStep] = useState<ContractStep>(ContractStep.SELECT_TEMPLATE);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [contractType, setContractType] = useState<ContractType>("fixed_price");
  const [contractTerms, setContractTerms] = useState<any>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [contractPreviewUrl, setContractPreviewUrl] = useState<string>(mockContractPreviewUrl);
  const [participants, setParticipants] = useState(mockParticipants);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock order data that would come from an API
  const [order, setOrder] = useState({
    id: orderId || "ORD-12345",
    title: "Full Stack Web Development",
    freelancer: {
      id: "freelancer-001",
      name: "Alex Johnson",
      email: "alex@example.com",
    },
    client: {
      id: "client-001",
      name: "Michael Johnson",
      email: "michael@example.com",
    },
    serviceDetails: {
      title: "Full Stack Web Development",
      description: "Complete web application development with frontend and backend implementation, including database design, API development, and responsive UI.",
      amount: "2500"
    }
  });
  
  // Current user information (would be determined from auth context)
  const currentUserId = "client-001"; // Hardcoded for this example
  const currentUserRole = "client";
  
  // In a real app, fetch order data from API
  useEffect(() => {
    // setIsLoading(true);
    // api.getOrder(orderId).then(data => {
    //   setOrder(data);
    //   setIsLoading(false);
    // }).catch(err => {
    //   setError("Failed to load order data");
    //   setIsLoading(false);
    // });
  }, [orderId]);
  
  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Determine contract type from template ID
    if (templateId.includes('fixed_price')) {
      setContractType('fixed_price');
    } else if (templateId.includes('hourly_rate')) {
      setContractType('hourly_rate');
    } else if (templateId.includes('milestone_based')) {
      setContractType('milestone_based');
    } else if (templateId.includes('retainer')) {
      setContractType('retainer');
    } else {
      setContractType('custom');
    }
  };
  
  // Handle contract terms submission
  const handleContractTermsSubmit = (data: any) => {
    setContractTerms(data);
    setTotalAmount(data.totalAmount || order.serviceDetails.amount);
  };
  
  // Handle milestone submission
  const handleMilestonesSubmit = (milestonesData: Milestone[], amount: string) => {
    setMilestones(milestonesData);
    setTotalAmount(amount);
    
    // In a real app, generate contract preview here
    // generateContractPreview(contractType, contractTerms, milestonesData, amount)
    //   .then(previewUrl => setContractPreviewUrl(previewUrl));
  };
  
  // Handle signature submission
  const handleSignContract = (signatureData: any) => {
    // Update the participant's signature status
    const updatedParticipants = participants.map(p => 
      p.id === currentUserId ? { ...p, signed: true, signatureData } : p
    );
    
    setParticipants(updatedParticipants);
    
    // In a real app, send the signature to the API
    // api.submitSignature(contractId, currentUserId, signatureData)
    //   .then(response => {
    //     // Update contract status, etc.
    //   });
  };
  
  // Handle contract download
  const handleDownloadContract = () => {
    // In a real app, generate and download the PDF
    // window.open(api.getContractDownloadUrl(contractId), '_blank');
    alert('Contract download triggered (mock)');
  };
  
  // Move to the next step
  const goToNextStep = () => {
    if (currentStep < ContractStep.SIGN_CONTRACT) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Move to the previous step
  const goToPreviousStep = () => {
    if (currentStep > ContractStep.SELECT_TEMPLATE) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Check if the current step is complete
  const isCurrentStepComplete = (): boolean => {
    switch (currentStep) {
      case ContractStep.SELECT_TEMPLATE:
        return !!selectedTemplate;
      case ContractStep.CUSTOMIZE_TERMS:
        return !!contractTerms;
      case ContractStep.DEFINE_MILESTONES:
        return milestones.length > 0;
      case ContractStep.REVIEW_CONTRACT:
        return true; // Always allow proceeding from review
      case ContractStep.SIGN_CONTRACT:
        return participants.find(p => p.id === currentUserId)?.signed || false;
      default:
        return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Create Contract | Genius For Hire</title>
        <meta name="description" content="Create a legally binding contract for your project" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-auto">
            <div onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </div>
          </Button>
          
          <h1 className="text-2xl font-bold">Create Contract</h1>
          
          <div className="w-[88px]"></div> {/* For balance */}
        </div>
        
        {/* Order summary */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Order: {order.id}</CardTitle>
              <CardDescription>{order.serviceDetails.title}</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Contract Value</p>
              <p className="text-xl font-bold">${order.serviceDetails.amount}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-1 mb-2 md:mb-0">
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{order.client.name}</p>
              </div>
              
              <div className="w-8 h-0.5 hidden md:block bg-muted rounded-full" />
              
              <div className="space-y-1 mb-2 md:mb-0">
                <p className="text-sm text-muted-foreground">Freelancer</p>
                <p className="font-medium">{order.freelancer.name}</p>
              </div>
              
              <div className="w-8 h-0.5 hidden md:block bg-muted rounded-full" />
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-amber-500" />
                  <span className="font-medium">Contract Creation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Contract workflow steps */}
        <div className="mb-8">
          <Steps currentStep={currentStep} className="mb-8">
            {workflowSteps.map((step, index) => (
              <Step 
                key={index} 
                title={step.label} 
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Main content area */}
        <div className="space-y-8">
          {/* Step content */}
          {currentStep === ContractStep.SELECT_TEMPLATE && (
            <ContractTemplateSelector 
              onSelect={handleSelectTemplate}
              selectedTemplateId={selectedTemplate}
              serviceType={order.serviceDetails.title}
            />
          )}
          
          {currentStep === ContractStep.CUSTOMIZE_TERMS && (
            <ContractTermsForm 
              contractType={contractType}
              serviceTitle={order.serviceDetails.title}
              serviceDescription={order.serviceDetails.description}
              freelancerName={order.freelancer.name}
              clientName={order.client.name}
              onSave={handleContractTermsSubmit}
            />
          )}
          
          {currentStep === ContractStep.DEFINE_MILESTONES && (
            <MilestoneEditor 
              initialMilestones={milestones}
              contractTotal={contractTerms?.totalAmount || order.serviceDetails.amount}
              onSave={handleMilestonesSubmit}
              // Use contract terms for project dates if available
              projectStartDate={contractTerms?.startDate || new Date()}
              projectEndDate={contractTerms?.endDate}
            />
          )}
          
          {currentStep === ContractStep.REVIEW_CONTRACT && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Review Contract</h2>
                <p className="text-muted-foreground">
                  Review all contract details before proceeding to signing
                </p>
              </div>
              
              <Tabs defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="space-y-4">
                  <Card>
                    <CardContent className="p-0">
                      <div className="bg-white border-y overflow-hidden h-[600px]">
                        <iframe
                          src={contractPreviewUrl}
                          title="Contract Preview"
                          className="w-full h-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Please Review Carefully</AlertTitle>
                    <AlertDescription>
                      Ensure all contract details are correct before proceeding to signing. Once signed, the contract will be legally binding.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
                
                <TabsContent value="summary" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contract Summary</CardTitle>
                      <CardDescription>Key contract details and terms</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Contract Type</h3>
                        <p className="font-medium">{contractType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Project Details</h3>
                        <p className="font-medium">{contractTerms?.projectTitle || order.serviceDetails.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {contractTerms?.projectDescription || order.serviceDetails.description}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Timeline</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium">
                              {contractTerms?.startDate 
                                ? new Date(contractTerms.startDate).toLocaleDateString() 
                                : new Date().toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">End Date</p>
                            <p className="font-medium">
                              {contractTerms?.endDate 
                                ? new Date(contractTerms.endDate).toLocaleDateString() 
                                : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Terms</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="font-medium">${totalAmount || order.serviceDetails.amount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Schedule</p>
                            <p className="font-medium">
                              {contractType === 'milestone_based' 
                                ? `${milestones.length} milestones` 
                                : contractTerms?.paymentSchedule?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Standard'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {contractType === 'milestone_based' && milestones.length > 0 && (
                        <>
                          <Separator />
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Milestones</h3>
                            <div className="space-y-2">
                              {milestones.map((milestone, index) => (
                                <div key={index} className="flex justify-between p-2 bg-muted rounded-md">
                                  <div>
                                    <p className="font-medium">{milestone.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <p className="font-medium">${milestone.amount}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Legal Terms</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Intellectual Property</p>
                            <p className="font-medium">
                              {contractTerms?.intellectualProperty?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Client Ownership'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Confidentiality</p>
                            <p className="font-medium">
                              {contractTerms?.confidentiality !== undefined
                                ? contractTerms.confidentiality ? 'Yes' : 'No'
                                : 'Yes'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {currentStep === ContractStep.SIGN_CONTRACT && (
            <ESignatureModule 
              contractId={`CNT-${order.id}`}
              contractTitle={contractTerms?.projectTitle || order.serviceDetails.title}
              participants={participants}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole as 'freelancer' | 'client'}
              contractPreviewUrl={contractPreviewUrl}
              onSignContract={handleSignContract}
              onDownloadContract={handleDownloadContract}
            />
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === ContractStep.SELECT_TEMPLATE}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Step
            </Button>
            
            {currentStep < ContractStep.SIGN_CONTRACT ? (
              <Button
                onClick={goToNextStep}
                disabled={!isCurrentStepComplete()}
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/hire/dashboard/contracts')}
                disabled={!participants.find(p => p.id === currentUserId)?.signed}
              >
                {participants.every(p => p.signed) 
                  ? 'View Contracts' 
                  : 'Waiting for All Signatures'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractWorkflow;
