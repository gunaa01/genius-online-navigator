import { useState, useRef } from 'react';
import { 
  Check, 
  Edit2, 
  Lock, 
  FileText, 
  Clock,
  Download,
  RotateCcw,
  Shield,
  User,
  ChevronDown,
  Info
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Types for signatures
interface SignatureData {
  signatureType: 'draw' | 'type';
  data: string;
  timestamp: string;
  name: string;
  email?: string;
  ipAddress?: string;
}

// Participant interface
interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'freelancer' | 'client';
  signed: boolean;
  signatureData?: SignatureData;
  avatarUrl?: string;
}

interface ESignatureModuleProps {
  contractId: string;
  contractTitle: string;
  participants: Participant[];
  currentUserId: string;
  currentUserRole: 'freelancer' | 'client';
  contractPreviewUrl: string;
  onSignContract: (signatureData: SignatureData) => void;
  onDownloadContract: () => void;
}

const ESignatureModule = ({
  contractId,
  contractTitle,
  participants,
  currentUserId,
  currentUserRole,
  contractPreviewUrl,
  onSignContract,
  onDownloadContract
}: ESignatureModuleProps) => {
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signatureError, setSignatureError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const signatureCanvasRef = useRef<SignatureCanvas | null>(null);
  
  // Find current user from participants
  const currentUser = participants.find(p => p.id === currentUserId);
  const hasCurrentUserSigned = currentUser?.signed || false;
  const allSigned = participants.every(p => p.signed);
  
  // Clear signature canvas
  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
    }
    setTypedSignature('');
    setSignatureError('');
  };
  
  // Handle signature submission
  const handleSignContract = () => {
    setSignatureError('');
    let signatureData: string = '';
    
    if (signatureType === 'draw') {
      if (signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty()) {
        signatureData = signatureCanvasRef.current.toDataURL('image/png');
      } else {
        setSignatureError('Please draw your signature');
        return;
      }
    } else {
      if (typedSignature.trim().length < 3) {
        setSignatureError('Please type your signature');
        return;
      }
      signatureData = typedSignature;
    }
    
    if (!agreedToTerms) {
      setSignatureError('Please agree to the terms to sign the contract');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const signature: SignatureData = {
        signatureType,
        data: signatureData,
        timestamp: new Date().toISOString(),
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        ipAddress: '192.168.1.1' // In a real app, this would be captured server-side
      };
      
      onSignContract(signature);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Sign Contract</h2>
        <p className="text-muted-foreground">
          Review and electronically sign the contract to make it legally binding
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract preview */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Contract Preview</CardTitle>
                  <CardDescription>
                    {contractTitle} ({contractId})
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={onDownloadContract}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-white border-y overflow-hidden h-[500px]">
                <iframe
                  src={contractPreviewUrl}
                  title="Contract Preview"
                  className="w-full h-full"
                />
              </div>
              
              <div className="p-4 bg-muted/20">
                <Accordion type="single" collapsible>
                  <AccordionItem value="legal-disclaimer">
                    <AccordionTrigger>
                      <span className="text-sm font-medium">Legal Disclaimer & Data Protection Notice</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          By signing this contract electronically, you acknowledge that:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Your electronic signature is legally binding, equivalent to a handwritten signature.</li>
                          <li>We collect your signature, name, email, IP address, and timestamp for verification purposes.</li>
                          <li>You have read and agree to all terms of the contract.</li>
                          <li>You are legally authorized to enter into this agreement.</li>
                        </ul>
                        <p>
                          All contract data is encrypted and stored securely in compliance with data protection regulations.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Signature Panel */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Signature Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {participants.map(participant => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        {participant.avatarUrl ? (
                          <AvatarImage src={participant.avatarUrl} alt={participant.name} />
                        ) : (
                          <AvatarFallback>
                            {participant.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{participant.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {participant.role === 'freelancer' ? 'Freelancer' : 'Client'}
                        </div>
                      </div>
                    </div>
                    
                    {participant.signed ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Signed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
              
              {allSigned ? (
                <CardFooter className="border-t bg-muted/30 px-6 py-4">
                  <div className="w-full text-center">
                    <div className="flex justify-center mb-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                        Contract Fully Executed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      All parties have signed. The contract is now legally binding.
                    </p>
                  </div>
                </CardFooter>
              ) : null}
            </Card>
            
            {/* Signature Area */}
            {!hasCurrentUserSigned ? (
              <Card>
                <CardHeader>
                  <CardTitle>Add Your Signature</CardTitle>
                  <CardDescription>
                    Choose how you want to sign the contract
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="draw" onValueChange={(value) => setSignatureType(value as 'draw' | 'type')}>
                    <TabsList className="w-full">
                      <TabsTrigger value="draw">Draw</TabsTrigger>
                      <TabsTrigger value="type">Type</TabsTrigger>
                    </TabsList>
                    <TabsContent value="draw" className="space-y-3">
                      <div className="border rounded-md">
                        <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
                          <Label className="text-sm font-medium">Draw your signature below</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearSignature}
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Clear
                          </Button>
                        </div>
                        <div className="p-2">
                          <div className="border border-dashed rounded-md bg-white">
                            <SignatureCanvas
                              ref={signatureCanvasRef}
                              canvasProps={{
                                width: 400,
                                height: 150,
                                className: 'w-full h-[150px] cursor-crosshair'
                              }}
                              backgroundColor="rgba(255, 255, 255, 0)"
                              penColor="black"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Draw your signature using your mouse or touchscreen
                      </p>
                    </TabsContent>
                    <TabsContent value="type" className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="typed-signature">Type your full legal name</Label>
                        <Input
                          id="typed-signature"
                          placeholder="e.g., John A. Smith"
                          value={typedSignature}
                          onChange={(e) => setTypedSignature(e.target.value)}
                        />
                      </div>
                      <div className="p-4 border rounded-md bg-muted/30">
                        <p className="text-center font-handwriting text-lg">
                          {typedSignature || 'Your typed signature will appear here'}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {signatureError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{signatureError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox 
                      id="agree-terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    />
                    <Label 
                      htmlFor="agree-terms" 
                      className="text-sm leading-tight"
                    >
                      I confirm that I have read, understood, and agree to all terms and conditions in this contract. I understand that my electronic signature is legally binding.
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/20 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button 
                    onClick={handleSignContract} 
                    disabled={isLoading || !agreedToTerms}
                  >
                    {isLoading ? 'Processing...' : 'Sign Contract'}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>You've Signed</CardTitle>
                  <CardDescription>
                    Your signature has been recorded
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <p>You signed this contract on</p>
                    <p className="font-medium">
                      {new Date(currentUser?.signatureData?.timestamp || '').toLocaleString()}
                    </p>
                    
                    {currentUser?.signatureData?.data && (
                      <div className="mt-4 border rounded-md p-4 bg-muted/20">
                        {currentUser.signatureData.signatureType === 'draw' ? (
                          <img 
                            src={currentUser.signatureData.data} 
                            alt="Your signature" 
                            className="max-h-[80px] mx-auto" 
                          />
                        ) : (
                          <p className="font-handwriting text-lg text-center">
                            {currentUser.signatureData.data}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 pt-4">
                  <div className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={onDownloadContract}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Signed Contract
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
            
            {/* Security Information */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  <CardTitle className="text-base">Secure E-Signature</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  Your signature is protected by:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 mr-1.5" />
                    <span>256-bit encryption</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 mr-1.5" />
                    <span>Tamper-proof audit trail</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 mr-1.5" />
                    <span>Compliant with e-signature laws</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignatureModule;
