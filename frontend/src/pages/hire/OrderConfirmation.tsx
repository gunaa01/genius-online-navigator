import { useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { 
  Check, 
  Clock, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Home,
  ChevronRight,
  Copy,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MailOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';

// Mock order confirmation data (would come from API in real implementation)
const orderData = {
  orderId: "ORD-39402",
  date: new Date().toISOString(),
  status: "pending", // pending, accepted, in_progress, delivered, completed, cancelled
  service: {
    id: "1",
    title: "Full Stack Web Development",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop",
    package: {
      name: "Standard",
      price: "$2,500",
      deliveryTime: "7 days",
      revisions: 3
    }
  },
  freelancer: {
    id: "1",
    name: "Alex Johnson",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop",
    title: "Full Stack Web Developer"
  },
  timeline: {
    orderPlaced: new Date().toISOString(),
    expectedAcceptance: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
  },
  payment: {
    total: "$2,500",
    paymentMethod: "Credit Card (ending in 4242)",
    paymentStatus: "authorized" // authorized, charged, refunded
  },
  additionalServices: [
    { name: "Express Delivery", price: "$500" }
  ],
  requirements: "I need a full-stack web application that includes user authentication, a dashboard for data visualization, and the ability for users to upload and share files. The app should be responsive and follow modern design principles.",
  files: [
    { name: "project_requirements.pdf", size: "1.4 MB" },
    { name: "design_mockups.jpg", size: "3.2 MB" }
  ],
  milestones: [
    { name: "Project Requirements Review", dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), status: "pending" },
    { name: "Design Approval", dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), status: "pending" },
    { name: "Frontend Implementation", dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), status: "pending" },
    { name: "Backend Implementation", dueDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(), status: "pending" },
    { name: "Final Delivery", dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), status: "pending" }
  ]
};

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  
  // In a real app, fetch data based on orderId
  // useEffect(() => {
  //   fetchOrderDetails(orderId).then(setOrder);
  // }, [orderId]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderData.orderId);
    // Show a toast notification in a real app
    alert("Order ID copied to clipboard");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Order Confirmation | Genius For Hire</title>
        <meta name="description" content="Your order has been placed successfully" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Order confirmation header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been placed and is waiting for the freelancer's acceptance
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-muted-foreground">Order ID:</span>
            <code className="bg-muted px-2 py-1 rounded-md font-mono">{orderData.orderId}</code>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyOrderId}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/hire/dashboard/orders">
                <FileText className="h-4 w-4 mr-2" />
                View Order Details
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/hire">
                <Home className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Order status card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Current status and timeline of your order</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Status steps */}
              <div className="relative">
                <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-muted"></div>
                <div className="space-y-8">
                  <div className="relative flex items-start">
                    <div className="absolute left-0 rounded-full bg-primary p-1.5 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="ml-12">
                      <h4 className="font-medium">Order Placed</h4>
                      <time className="text-sm text-muted-foreground">
                        {format(new Date(orderData.timeline.orderPlaced), "MMM d, yyyy 'at' h:mm a")}
                      </time>
                      <p className="mt-1 text-sm">
                        Your order has been placed successfully. The freelancer will review it shortly.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="absolute left-0 rounded-full border-2 border-muted bg-background p-1.5 text-muted-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="ml-12">
                      <h4 className="font-medium">Freelancer Acceptance</h4>
                      <time className="text-sm text-muted-foreground">
                        Expected by {format(new Date(orderData.timeline.expectedAcceptance), "MMM d, yyyy")}
                      </time>
                      <p className="mt-1 text-sm">
                        The freelancer will review your requirements and accept the order.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="absolute left-0 rounded-full border-2 border-muted bg-background p-1.5 text-muted-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="ml-12">
                      <h4 className="font-medium">Work in Progress</h4>
                      <p className="mt-1 text-sm">
                        The freelancer will work on your project and provide updates.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="absolute left-0 rounded-full border-2 border-muted bg-background p-1.5 text-muted-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="ml-12">
                      <h4 className="font-medium">Delivery</h4>
                      <time className="text-sm text-muted-foreground">
                        Expected by {format(new Date(orderData.timeline.estimatedDelivery), "MMM d, yyyy")}
                      </time>
                      <p className="mt-1 text-sm">
                        The completed work will be delivered for your review.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order details and next steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Order details */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <img 
                      src={orderData.service.image} 
                      alt={orderData.service.title}
                      className="w-24 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{orderData.service.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {orderData.service.package.name}
                        </Badge>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{orderData.service.package.deliveryTime} delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Freelancer</h4>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={orderData.freelancer.image} alt={orderData.freelancer.name} />
                          <AvatarFallback>{orderData.freelancer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{orderData.freelancer.name}</div>
                          <div className="text-xs text-muted-foreground">{orderData.freelancer.title}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Order Date</h4>
                      <div className="text-muted-foreground">
                        {format(new Date(orderData.date), "MMMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Expected Delivery</h4>
                      <div className="text-muted-foreground">
                        {format(new Date(orderData.timeline.estimatedDelivery), "MMMM d, yyyy")}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Payment</h4>
                      <div className="text-muted-foreground">
                        {orderData.payment.paymentMethod}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Revisions</h4>
                      <div className="text-muted-foreground">
                        {orderData.service.package.revisions} revision rounds
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Status</h4>
                      <Badge variant="outline" className="capitalize">
                        {orderData.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="font-medium mb-2">Project Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      {orderData.requirements}
                    </p>
                    
                    {orderData.files.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Attached Files</h5>
                        <div className="space-y-2">
                          {orderData.files.map((file, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-primary underline hover:no-underline cursor-pointer">
                                {file.name} ({file.size})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="font-medium mb-2">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {orderData.service.package.name} Package
                        </span>
                        <span>{orderData.service.package.price}</span>
                      </div>
                      
                      {orderData.additionalServices.map((service, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-muted-foreground">{service.name}</span>
                          <span>{service.price}</span>
                        </div>
                      ))}
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span>$150</span>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>{orderData.payment.total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Delivery Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Milestones</CardTitle>
                  <CardDescription>
                    Planned schedule for your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`p-1.5 rounded-full ${
                          milestone.status === 'completed' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{milestone.name}</h4>
                            <Badge variant={milestone.status === 'completed' ? 'default' : 'outline'}>
                              {milestone.status === 'completed' ? 'Completed' : 'Pending'}
                            </Badge>
                          </div>
                          <time className="text-sm text-muted-foreground">
                            {format(new Date(milestone.dueDate), "MMMM d, yyyy")}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Next steps and actions */}
            <div className="space-y-6">
              {/* Next steps card */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle>Order received</AlertTitle>
                    <AlertDescription>
                      Your order has been placed and is awaiting freelancer acceptance.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Freelancer review</AlertTitle>
                    <AlertDescription>
                      The freelancer will review your order and requirements within 24 hours.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <MailOpen className="h-4 w-4" />
                    <AlertTitle>Check your email</AlertTitle>
                    <AlertDescription>
                      We've sent a confirmation email with all order details to your registered email address.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch space-y-2">
                  <Button asChild>
                    <Link to={`/hire/message/${orderData.freelancer.id}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Freelancer
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/hire/dashboard/orders">
                      <FileText className="h-4 w-4 mr-2" />
                      View All Orders
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Support and help */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have any questions about your order or need assistance, our support team is here to help.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Read FAQs
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Similar services */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You might also be interested in these similar services:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-md bg-muted overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop"
                          alt="Web development"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">APIs & Backend Development</h4>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          From $1,200
                        </div>
                        <Button variant="link" className="px-0 h-auto text-xs" asChild>
                          <Link to="/hire/service/2">
                            View Service
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-md bg-muted overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=120&auto=format&fit=crop"
                          alt="Mobile apps"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Mobile App Development</h4>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          From $3,000
                        </div>
                        <Button variant="link" className="px-0 h-auto text-xs" asChild>
                          <Link to="/hire/service/3">
                            View Service
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
