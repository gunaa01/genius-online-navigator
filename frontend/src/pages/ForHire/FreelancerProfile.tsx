import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Award, Clock, MapPin, Briefcase, 
  Mail, Download, Calendar, Heart, MessageSquare, Check,
  FileText, Verified, Globe, ExternalLink, ThumbsUp, User,
  Languages, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet';

// Mock data (would come from API in real implementation)
const freelancerData = {
  id: "1",
  name: "Alex Johnson",
  title: "Full Stack Web Developer",
  image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=250&h=250&auto=format&fit=crop&q=60&crop=faces",
  coverImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&h=400&auto=format&fit=crop",
  verified: true,
  topRated: true,
  rating: 4.9,
  reviews: 127,
  completedJobs: 98,
  hourlyRate: "$65",
  location: "New York, USA",
  memberSince: "Jun 2021",
  lastActive: "3 hours ago",
  responseTime: "< 2 hours",
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Conversational" }
  ],
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Next.js", "TailwindCSS", "REST API", "GraphQL"],
  education: [
    { degree: "M.S. Computer Science", institution: "Stanford University", year: "2019" },
    { degree: "B.S. Computer Science", institution: "University of Michigan", year: "2017" }
  ],
  certifications: [
    { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2022" },
    { name: "MongoDB Certified Developer", issuer: "MongoDB, Inc.", year: "2021" }
  ],
  bio: "Full stack developer with 5+ years experience specializing in React, Node.js and modern JavaScript frameworks. I've helped startups and established businesses build scalable, high-performance web applications with clean, maintainable code. I'm passionate about user experience and writing efficient, well-tested code that delivers business value.",
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
  services: [
    {
      id: "1",
      title: "Full Stack Web Development",
      price: "$2,500",
      deliveryTime: "7 days",
      description: "Complete web application development with frontend and backend implementation."
    },
    {
      id: "2",
      title: "Frontend Development",
      price: "$1,500",
      deliveryTime: "5 days",
      description: "Modern React applications with responsive design and state management."
    },
    {
      id: "3",
      title: "API Development",
      price: "$1,200",
      deliveryTime: "4 days",
      description: "RESTful or GraphQL API development with authentication and documentation."
    }
  ],
  reviews: [
    {
      id: "1",
      author: "Sarah Miller",
      rating: 5,
      date: "October 12, 2023",
      content: "Alex delivered exceptional work for our project. Communication was clear and timely, and the code quality exceeded our expectations. Would definitely hire again!"
    },
    {
      id: "2",
      author: "Michael Chen",
      rating: 5,
      date: "September 3, 2023",
      content: "Outstanding developer who truly understands both technical requirements and business needs. The application Alex built for us has received great feedback from our users."
    },
    {
      id: "3",
      author: "Jessica Wong",
      rating: 4,
      date: "August 15, 2023",
      content: "Great experience working with Alex. Delivered on time and was very responsive to feedback and change requests."
    }
  ],
  stats: {
    jobSuccess: 98,
    onBudget: 100,
    onTime: 95,
    repeatClients: 85
  }
};

const FreelancerProfile = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const [freelancer, setFreelancer] = useState(freelancerData);
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // In a real app, fetch data based on freelancerId
  useEffect(() => {
    // Simulating API fetch
    // In production: fetchFreelancerProfile(freelancerId)
    setFreelancer(freelancerData);
  }, [freelancerId]);
  
  const averageRating = freelancer.reviews.reduce((acc, review) => acc + review.rating, 0) / freelancer.reviews.length;
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  if (!freelancer) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-20 w-20 bg-muted rounded-full mb-4"></div>
          <div className="h-8 w-60 bg-muted rounded-md mb-4"></div>
          <div className="h-4 w-40 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Helmet>
        <title>{`${freelancer.name} - ${freelancer.title} | Genius For Hire`}</title>
        <meta name="description" content={freelancer.bio.substring(0, 160)} />
        <meta property="og:title" content={`${freelancer.name} - ${freelancer.title}`} />
        <meta property="og:description" content={freelancer.bio.substring(0, 160)} />
        <meta property="og:image" content={freelancer.image} />
        <meta property="og:type" content="profile" />
      </Helmet>
      
      {/* Cover image */}
      <div className="w-full h-64 bg-muted relative overflow-hidden">
        <img 
          src={freelancer.coverImage}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-auto">
            <Link to="/hire">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Freelancers
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={toggleBookmark}>
              <Heart className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 mb-4 border-4 border-background">
                      <AvatarImage src={freelancer.image} alt={freelancer.name} />
                      <AvatarFallback>{freelancer.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {freelancer.topRated && (
                      <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full">
                        <Award className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-1">
                    <h1 className="text-2xl font-bold">{freelancer.name}</h1>
                    {freelancer.verified && (
                      <Verified className="h-5 w-5 text-primary fill-primary/10" />
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-2">{freelancer.title}</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">{freelancer.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({freelancer.reviews.length} reviews)</span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {freelancer.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5 mr-1" />
                      {freelancer.completedJobs} Jobs
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {freelancer.responseTime}
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Job Success</span>
                      <span className="text-sm font-medium">{freelancer.stats.jobSuccess}%</span>
                    </div>
                    <Progress value={freelancer.stats.jobSuccess} className="h-2 mb-4" />
                    
                    <Button className="w-full mb-2">
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Availability</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Available now • Full time</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Languages</h3>
                    <div className="space-y-1">
                      {freelancer.languages.map((language, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{language.name}</span>
                          <span className="text-muted-foreground">{language.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {freelancer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Education</h3>
                    <div className="space-y-2">
                      {freelancer.education.map((edu, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{edu.degree}</div>
                          <div className="text-muted-foreground">{edu.institution}, {edu.year}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Certifications</h3>
                    <div className="space-y-2">
                      {freelancer.certifications.map((cert, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{cert.name}</div>
                          <div className="text-muted-foreground">{cert.issuer}, {cert.year}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Member Since</h3>
                    <div className="text-sm text-muted-foreground">{freelancer.memberSince}</div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Last Active</h3>
                    <div className="text-sm text-muted-foreground">{freelancer.lastActive}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Tabs with content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{freelancer.bio}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                      <div className="bg-muted/50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{freelancer.stats.jobSuccess}%</div>
                        <div className="text-sm text-muted-foreground">Job Success</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{freelancer.stats.onBudget}%</div>
                        <div className="text-sm text-muted-foreground">On Budget</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{freelancer.stats.onTime}%</div>
                        <div className="text-sm text-muted-foreground">On Time</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{freelancer.stats.repeatClients}%</div>
                        <div className="text-sm text-muted-foreground">Repeat Hire</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Featured Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {freelancer.services.slice(0, 2).map((service) => (
                        <div key={service.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{service.title}</h3>
                            <span className="font-bold">{service.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 inline mr-1" /> 
                              Delivery in {service.deliveryTime}
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/hire/service/${service.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button variant="link" onClick={() => setActiveTab("services")}>
                        View All Services
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Work</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {freelancer.portfolio.slice(0, 2).map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden group">
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button variant="link" onClick={() => setActiveTab("portfolio")}>
                        View Full Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="portfolio" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                    <CardDescription>Recent projects and work samples</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {freelancer.portfolio.map((item) => (
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
                            <p className="text-muted-foreground mb-4">{item.description}</p>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              View Project
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                    <CardDescription>Packages and custom services available for hire</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {freelancer.services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-5 hover:border-primary/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                              <p className="text-muted-foreground">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{service.price}</div>
                              <div className="text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 inline mr-1" /> 
                                {service.deliveryTime} delivery
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button>Order Now</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Need something custom?</h3>
                      <p className="text-muted-foreground mb-4">
                        Don't see what you're looking for? Contact me to discuss your specific requirements and get a custom quote.
                      </p>
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Me
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Client Reviews</CardTitle>
                      <CardDescription>{freelancer.reviews.length} reviews from past clients</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">{freelancer.reviews.length} reviews</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {freelancer.reviews.map((review) => (
                        <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
