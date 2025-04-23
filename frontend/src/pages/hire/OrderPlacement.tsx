import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calendar,
  FileText, 
  Upload, 
  Check, 
  X,
  AlertCircle,
  CreditCard,
  Shield,
  ChevronDown,
  ChevronUp,
  FileIcon,
  Trash2,
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

// Mock service and package data (would come from API in real implementation)
const serviceData = {
  id: "1",
  title: "Full Stack Web Development",
  image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop",
  freelancer: {
    id: "1",
    name: "Alex Johnson",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop",
    title: "Full Stack Web Developer",
    rating: 4.9,
    reviews: 127
  },
  selectedPackage: {
    id: "2",
    name: "Standard",
    price: "$2,500",
    deliveryTime: "7 days",
    revisions: 3,
    description: "Complete full stack web application with both frontend and backend.",
    features: [
      "Responsive design",
      "5 pages",
      "User authentication",
      "Database integration",
      "API development",
      "Advanced SEO",
      "3 revisions"
    ]
  }
};

const OrderPlacement = () => {
  const { serviceId, packageId } = useParams<{ serviceId: string, packageId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState(serviceData);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, type: string}[]>([]);
  const [requirements, setRequirements] = useState('');
  const [date, setDate] = useState<Date>();
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate the delivery date based on the selected package's delivery time
  const calculateDeliveryDate = () => {
    const days = parseInt(service.selectedPackage.deliveryTime.split(' ')[0]);
    const expressDeliveryDays = Math.max(Math.floor(days / 2), 1);
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (isExpressDelivery ? expressDeliveryDays : days));
    
    return format(deliveryDate, 'MMMM d, yyyy');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      // Create display versions of files
      const newUploadedFiles = newFiles.map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type
      }));
      
      setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles.splice(index, 1);
    setUploadedFiles(newUploadedFiles);
  };
  
  const toggleAdditionalService = (service: string) => {
    if (additionalServices.includes(service)) {
      setAdditionalServices(additionalServices.filter(s => s !== service));
    } else {
      setAdditionalServices([...additionalServices, service]);
    }
  };
  
  const calculateTotal = () => {
    // Start with the base price
    let basePrice = parseInt(service.selectedPackage.price.replace(/\$|,/g, ''));
    
    // Add express delivery fee if selected
    if (isExpressDelivery) {
      basePrice += 500; // $500 express fee
    }
    
    // Add additional services
    additionalServices.forEach(service => {
      switch(service) {
        case 'extra_revision':
          basePrice += 250; // $250 for extra revision
          break;
        case 'source_files':
          basePrice += 300; // $300 for source files
          break;
        case 'commercial_use':
          basePrice += 350; // $350 for commercial use license
          break;
      }
    });
    
    return `$${basePrice.toLocaleString()}`;
  };
  
  const handlePlaceOrder = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/hire/order/confirmation');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Complete Your Order | Genius For Hire</title>
        <meta name="description" content="Specify your requirements and complete your order" />
      </Helmet>
      
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/hire/service/${serviceId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Service
              </Link>
            </Button>
            
            <div className="mx-auto text-center">
              <h1 className="text-lg font-semibold">Complete Your Order</h1>
            </div>
            
            <div className="w-[80px]"></div> {/* For balance */}
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Left side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Project Requirements</CardTitle>
                <CardDescription>
                  Provide detailed information about what you need
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Describe your project in detail</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Please include all the specific details about your project requirements, including any technical specifications, design preferences, or functionality needed."
                    rows={8}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Be as specific as possible to help the freelancer deliver exactly what you need.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Upload reference files (optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground mb-1">
                        Drag and drop files here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: Images, PDFs, DOCs, and other document formats (max 20MB each)
                      </p>
                    </label>
                  </div>
                  
                  {/* Display uploaded files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Uploaded Files ({uploadedFiles.length})</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <div className="flex items-center">
                              <FileIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => removeFile(index)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
                <CardDescription>
                  Choose when you'd like to receive your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-grow space-y-2">
                    <div className="flex justify-between">
                      <Label>Standard Delivery</Label>
                      <span className="text-sm">Included</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Delivery by {calculateDeliveryDate()}</span>
                    </div>
                  </div>
                  <RadioGroup defaultValue="standard" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="standard" 
                        id="standard" 
                        checked={!isExpressDelivery}
                        onClick={() => setIsExpressDelivery(false)}
                      />
                      <Label htmlFor="standard">Standard</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-4">
                  <div className="flex-grow space-y-2">
                    <div className="flex justify-between">
                      <Label>Express Delivery</Label>
                      <span className="text-sm">+$500</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        Get it in half the time - 
                        Delivery by {format(new Date(new Date().setDate(
                          new Date().getDate() + Math.max(Math.floor(parseInt(service.selectedPackage.deliveryTime.split(' ')[0]) / 2), 1)
                        )), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <RadioGroup defaultValue="express" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="express" 
                        id="express" 
                        checked={isExpressDelivery}
                        onClick={() => setIsExpressDelivery(true)}
                      />
                      <Label htmlFor="express">Express</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="delivery-date">Schedule a custom delivery date (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !date && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a specific date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date() || date < new Date(new Date().setDate(
                          new Date().getDate() + (isExpressDelivery ? 
                            Math.max(Math.floor(parseInt(service.selectedPackage.deliveryTime.split(' ')[0]) / 2), 1) :
                            parseInt(service.selectedPackage.deliveryTime.split(' ')[0]))
                        ))}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    Note: Custom delivery dates may affect pricing. The freelancer will need to confirm availability.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
                <CardDescription>
                  Enhance your order with these optional services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Checkbox 
                        id="extra_revision" 
                        checked={additionalServices.includes('extra_revision')}
                        onCheckedChange={() => toggleAdditionalService('extra_revision')}
                      />
                      <div>
                        <Label 
                          htmlFor="extra_revision" 
                          className="text-base font-medium"
                        >
                          Extra Revision (+$250)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get 3 additional revision rounds (total of 6 revisions)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Checkbox 
                        id="source_files" 
                        checked={additionalServices.includes('source_files')}
                        onCheckedChange={() => toggleAdditionalService('source_files')}
                      />
                      <div>
                        <Label 
                          htmlFor="source_files" 
                          className="text-base font-medium"
                        >
                          Source Files (+$300)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive all source code and design files used in the project
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Checkbox 
                        id="commercial_use" 
                        checked={additionalServices.includes('commercial_use')}
                        onCheckedChange={() => toggleAdditionalService('commercial_use')}
                      />
                      <div>
                        <Label 
                          htmlFor="commercial_use" 
                          className="text-base font-medium"
                        >
                          Commercial Use License (+$350)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Full commercial use rights for all deliverables
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose how you'd like to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="credit_card" 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="font-medium">Credit / Debit Card</Label>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs">VISA</div>
                      <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs">MC</div>
                      <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs">AMEX</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="font-medium">PayPal</Label>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="w-14 h-6 bg-muted rounded flex items-center justify-center text-xs">PayPal</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="font-medium">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="w-14 h-6 bg-muted rounded flex items-center justify-center text-xs">ACH</div>
                    </div>
                  </div>
                </RadioGroup>
                
                {/* Credit card form would go here if selected */}
                {paymentMethod === 'credit_card' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card_number">Card Number</Label>
                      <Input id="card_number" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Smith" />
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Secure Payment</AlertTitle>
                    <AlertDescription>
                      Your payment information is encrypted and never stored on our servers.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary - Right side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-16 h-12 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">{service.title}</h3>
                      <div className="flex items-center text-sm">
                        <Badge variant="outline" className="mr-2">
                          {service.selectedPackage.name}
                        </Badge>
                        <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {service.selectedPackage.deliveryTime} delivery
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{service.selectedPackage.name} Package</span>
                      <span>{service.selectedPackage.price}</span>
                    </div>
                    
                    {isExpressDelivery && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Express Delivery</span>
                        <span>$500</span>
                      </div>
                    )}
                    
                    {additionalServices.map(service => {
                      let serviceName = '';
                      let servicePrice = '';
                      
                      switch(service) {
                        case 'extra_revision':
                          serviceName = 'Extra Revisions';
                          servicePrice = '$250';
                          break;
                        case 'source_files':
                          serviceName = 'Source Files';
                          servicePrice = '$300';
                          break;
                        case 'commercial_use':
                          serviceName = 'Commercial License';
                          servicePrice = '$350';
                          break;
                      }
                      
                      return (
                        <div key={service} className="flex justify-between">
                          <span className="text-muted-foreground">{serviceName}</span>
                          <span>{servicePrice}</span>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>$150</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{calculateTotal()}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 mt-4">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-tight">
                      I agree to the <Link to="/terms" className="text-primary underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>
                    </Label>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!agreedToTerms || isLoading}
                    onClick={handlePlaceOrder}
                  >
                    {isLoading ? 'Processing...' : 'Place Order'}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    You won't be charged until the freelancer accepts your order
                  </p>
                </CardContent>
              </Card>
              
              {/* Freelancer info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">About the Seller</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={service.freelancer.image} alt={service.freelancer.name} />
                      <AvatarFallback>{service.freelancer.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{service.freelancer.name}</div>
                      <div className="text-sm text-muted-foreground">{service.freelancer.title}</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to={`/hire/freelancer/${service.freelancer.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* FAQ about ordering */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does payment work?</AccordionTrigger>
                  <AccordionContent>
                    Your payment is held securely until you approve the delivered work. If you're not satisfied, you can request revisions or get a refund.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>What if I need revisions?</AccordionTrigger>
                  <AccordionContent>
                    This package includes {service.selectedPackage.revisions} revision rounds. You can request changes and the freelancer will update the work accordingly.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>When will work begin?</AccordionTrigger>
                  <AccordionContent>
                    Work begins as soon as the freelancer accepts your order, typically within 24 hours of placing your order.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I cancel my order?</AccordionTrigger>
                  <AccordionContent>
                    You can cancel your order before the freelancer starts working. Once work has begun, you can still cancel but there may be partial payments due.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacement;
