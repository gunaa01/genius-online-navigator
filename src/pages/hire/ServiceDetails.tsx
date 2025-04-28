import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Briefcase, 
  Check,
  Calendar, 
  Shield, 
  MessageSquare, 
  Heart,
  Share,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet';

// Mock service data (would come from API in real implementation)
const serviceData = {
  id: "1",
  title: "Full Stack Web Development",
  description: "Complete web application development with frontend and backend implementation, including database design, API development, and responsive UI.",
  price: "$2,500",
  deliveryTime: "7 days",
  category: "Web Development",
  tags: ["React", "Node.js", "MongoDB", "API"],
  image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop",
  rating: 4.9,
  reviews: 127,
  ordersInQueue: 3,
  createdAt: "2023-08-15",
  updatedAt: "2024-03-22",
  freelancer: {
    id: "1",
    name: "Alex Johnson",
    title: "Full Stack Web Developer",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=250&h=250&auto=format&fit=crop&q=60&crop=faces",
    rating: 4.9,
    reviews: 127,
    verified: true,
    topRated: true,
    responseTime: "< 2 hours",
    location: "New York, USA",
    completedProjects: 98
  },
  packages: [
    {
      id: "1",
      name: "Basic",
      price: "$1,200",
      deliveryTime: "5 days",
      description: "Frontend development only with responsive design and basic functionalities.",
      features: [
        "Responsive design",
        "3 pages",
        "Contact form",
        "Basic SEO",
        "1 revision"
      ]
    },
    {
      id: "2",
      name: "Standard",
      price: "$2,500",
      deliveryTime: "7 days",
      isPopular: true,
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
    },
    {
      id: "3",
      name: "Premium",
      price: "$4,000",
      deliveryTime: "14 days",
      description: "Enterprise-grade web application with advanced features and optimizations.",
      features: [
        "Responsive design",
        "10+ pages",
        "User authentication & roles",
        "Advanced database design",
        "RESTful API with documentation",
        "Payment integration",
        "Performance optimization",
        "Advanced SEO",
        "Unlimited revisions"
      ]
    }
  ],
  faqs: [
    {
      question: "What tech stack do you use for web development?",
      answer: "I primarily use the MERN stack (MongoDB, Express.js, React, Node.js) but am also proficient with other technologies like PostgreSQL, Next.js, and AWS services."
    },
    {
      question: "Do you provide source code?",
      answer: "Yes, full source code is included with all packages. You'll receive complete ownership and rights to the codebase."
    },
    {
      question: "Can you handle custom design requirements?",
      answer: "Absolutely! I can work with your existing design or create a custom design based on your requirements and brand guidelines."
    },
    {
      question: "Do you offer website maintenance after completion?",
      answer: "Yes, I offer maintenance packages that can be discussed after project completion. These include updates, bug fixes, and performance monitoring."
    },
    {
      question: "What information do you need to get started?",
      answer: "To begin, I need your project requirements, design preferences, content (text, images), and any technical constraints. We'll discuss these in detail during our initial consultation."
    }
  ],
  portfolio: [
    {
      id: "1",
      title: "E-commerce Platform",
      image: "https://images.unsplash.com/photo-1561069934-eee225952461?w=600&auto=format&fit=crop",
      description: "Built a complete e-commerce solution with React, Node.js, and Stripe integration."
    },
    {
      id: "2",
      title: "SaaS Dashboard",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop",
      description: "Designed and implemented an analytics dashboard for a SaaS product."
    },
    {
      id: "3",
      title: "Social Media App",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop",
      description: "Created a social networking app with real-time chat using Socket.io."
    }
  ],
  reviews: [
    {
      id: "1",
      author: "Sarah Miller",
      authorImage: "",
      rating: 5,
      date: "October 12, 2023",
      content: "Alex delivered exceptional work for our project. Communication was clear and timely, and the code quality exceeded our expectations. Would definitely hire again!"
    },
    {
      id: "2",
      author: "Michael Chen",
      authorImage: "",
      rating: 5,
      date: "September 3, 2023",
      content: "Outstanding developer who truly understands both technical requirements and business needs. The application Alex built for us has received great feedback from our users."
    },
    {
      id: "3",
      author: "Jessica Wong",
      authorImage: "",
      rating: 4,
      date: "August 15, 2023",
      content: "Great experience working with Alex. Delivered on time and was very responsive to feedback and change requests."
    }
  ]
};

const ServiceDetails = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState(serviceData);
  const [selectedPackage, setSelectedPackage] = useState(service.packages[1].id); // Default to Standard
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // In a real app, fetch data based on serviceId
  // useEffect(() => {
  //   fetchServiceDetails(serviceId).then(setService);
  // }, [serviceId]);
  
  const toggleFaq = (faqId: number) => {
    const faqIdString = faqId.toString();
    if (expandedFaqs.includes(faqIdString)) {
      setExpandedFaqs(expandedFaqs.filter(id => id !== faqIdString));
    } else {
      setExpandedFaqs([...expandedFaqs, faqIdString]);
    }
  };
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  const getSelectedPackageDetails = () => {
    return service.packages.find(pkg => pkg.id === selectedPackage) || service.packages[1];
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${service.title} | ${service.freelancer.name} | Genius For Hire`}</title>
        <meta name="description" content={service.description.substring(0, 160)} />
        <meta property="og:title" content={service.title} />
        <meta property="og:description" content={service.description.substring(0, 160)} />
        <meta property="og:image" content={service.image} />
        <meta property="og:type" content="product" />
      </Helmet>
      
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/hire">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleBookmark}>
                <Heart className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Left side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service header */}
            <div>
              <h1 className="text-3xl font-bold mb-3">{service.title}</h1>
              <div className="flex flex-wrap gap-3 items-center mb-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium mr-1">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviews} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{service.ordersInQueue} orders in queue</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Last updated {new Date(service.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Service image */}
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Service tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Description</CardTitle>
                    <CardDescription>What's included in this service</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line mb-6">{service.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">What You'll Get</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Professional, clean code architecture</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Mobile-responsive design</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Database setup and integration</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>API development and documentation</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Deployment assistance</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Why Choose This Service</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>5+ years of professional experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Adherence to best coding practices</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Excellent communication and collaboration</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Timely delivery and project updates</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Post-delivery support and guidance</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>Previous Work</CardTitle>
                    <CardDescription>Examples of similar projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {service.portfolio.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden group">
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Client Reviews</CardTitle>
                      <CardDescription>{service.reviews.length} reviews from past clients</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{service.rating}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.round(service.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">{service.reviews.length} reviews</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {service.reviews.map((review) => (
                        <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                {review.authorImage ? (
                                  <AvatarImage src={review.authorImage} alt={review.author} />
                                ) : (
                                  <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.author}</div>
                                <div className="text-sm text-muted-foreground">{review.date}</div>
                              </div>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Common questions about this service</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {service.faqs.map((faq, index) => (
                        <div key={index} className="border rounded-lg">
                          <button
                            className="flex justify-between items-center w-full p-4 text-left font-medium"
                            onClick={() => toggleFaq(index)}
                          >
                            {faq.question}
                            {expandedFaqs.includes(index.toString()) ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          {expandedFaqs.includes(index.toString()) && (
                            <div className="p-4 pt-0 border-t">
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - Right side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing packages */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Packages</CardTitle>
                  <CardDescription>Choose the package that fits your needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {service.packages.map((pkg) => (
                      <Button
                        key={pkg.id}
                        variant={selectedPackage === pkg.id ? "default" : "outline"}
                        className="relative"
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        {pkg.isPopular && (
                          <div className="absolute -top-2.5 left-0 right-0 mx-auto w-max">
                            <Badge variant="default" className="text-[10px] px-2 py-0">Popular</Badge>
                          </div>
                        )}
                        {pkg.name}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Selected package details */}
                  {getSelectedPackageDetails() && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{getSelectedPackageDetails().price}</h3>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{getSelectedPackageDetails().deliveryTime} delivery</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {getSelectedPackageDetails().description}
                      </p>
                      
                      <div className="space-y-2 mb-6">
                        {getSelectedPackageDetails().features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full">
                        Continue ({getSelectedPackageDetails().price})
                      </Button>
                      
                      <Button variant="outline" className="w-full mt-2">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                    </div>
                  )}
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
                  
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">From</span>
                      <span>{service.freelancer.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response time</span>
                      <span>{service.freelancer.responseTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed projects</span>
                      <span>{service.freelancer.completedProjects}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{service.freelancer.rating} ({service.freelancer.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to={`/hire/freelancer/${service.freelancer.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Service guarantees */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Genius Platform Guarantees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">100% Secure Payments</h4>
                        <p className="text-xs text-muted-foreground">All transactions are protected</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Quality Guarantee</h4>
                        <p className="text-xs text-muted-foreground">Get what you paid for or your money back</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">24/7 Support</h4>
                        <p className="text-xs text-muted-foreground">Our team is always here to help</p>
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

export default ServiceDetails;
