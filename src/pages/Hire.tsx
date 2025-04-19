
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Star,
  Filter,
  MessageSquare,
  Heart,
  Briefcase,
  Globe,
  Award,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock data for freelancers
const freelancers = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Full Stack Web Developer",
    rating: 4.9,
    reviews: 127,
    hourlyRate: "$65",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=250&h=250&auto=format&fit=crop&q=60&crop=faces",
    tags: ["React", "Node.js", "MongoDB"],
    description: "Full stack developer with 5+ years experience in building modern web applications with React and Node.js."
  },
  {
    id: 2,
    name: "Sarah Williams",
    title: "UI/UX Designer",
    rating: 4.8,
    reviews: 98,
    hourlyRate: "$70",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&h=250&auto=format&fit=crop&q=60&crop=faces",
    tags: ["Figma", "UI Design", "Prototyping"],
    description: "Creative designer passionate about building intuitive, beautiful interfaces that solve real user problems."
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "E-commerce Specialist",
    rating: 4.7,
    reviews: 86,
    hourlyRate: "$55",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=250&h=250&auto=format&fit=crop&q=60&crop=faces",
    tags: ["Shopify", "WooCommerce", "SEO"],
    description: "E-commerce expert specializing in Shopify store setup, optimization, and growth strategies."
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    title: "Content Writer & SEO Expert",
    rating: 4.9,
    reviews: 112,
    hourlyRate: "$45",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&auto=format&fit=crop&q=60&crop=faces",
    tags: ["SEO", "Copywriting", "Blogs"],
    description: "SEO-driven content writer creating engaging blogs, website content, and marketing materials that rank."
  },
  {
    id: 5,
    name: "David Kim",
    title: "Mobile App Developer",
    rating: 4.7,
    reviews: 79,
    hourlyRate: "$75",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&q=60&crop=faces",
    tags: ["React Native", "iOS", "Android"],
    description: "Experienced mobile developer building cross-platform apps that feel native on both iOS and Android."
  },
  {
    id: 6,
    name: "Lisa Patel",
    title: "Social Media Manager",
    rating: 4.6,
    reviews: 63,
    hourlyRate: "$40",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop&q=60&crop=faces",
    tags: ["Instagram", "TikTok", "Strategy"],
    description: "Social media strategist helping businesses grow their online presence and engagement."
  }
];

// Categories for filtering
const categories = [
  "Development",
  "Design",
  "Marketing",
  "Content",
  "E-commerce",
  "Business",
  "Video & Animation",
  "Photography",
  "Music & Audio"
];

const Hire = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Development");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/offline-to-online">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guide
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <Link to="/hiring">
              <Button variant="outline">Post a Job</Button>
            </Link>
            <Button>Join as Freelancer</Button>
          </div>
        </div>

        {/* Hero section */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Find the perfect freelancer for your business</h1>
          <p className="text-muted-foreground mb-8">
            Browse our talented pool of freelancers to help you take your business online and grow your digital presence.
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for skills, services, or freelancers..." 
              className="pl-10 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="w-full h-auto flex flex-wrap justify-start overflow-auto pb-2">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="my-1 whitespace-nowrap"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="relative p-0">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <img 
                          src={freelancer.image} 
                          alt={freelancer.name}
                          className="object-cover w-full h-full"
                        />
                        <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{freelancer.name}</h3>
                          <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{freelancer.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({freelancer.reviews})</span>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3 line-clamp-2">{freelancer.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {freelancer.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-normal text-xs">{tag}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center text-sm">
                          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="font-medium">{freelancer.hourlyRate}</span>
                          <span className="text-muted-foreground ml-1">/ hr</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm">View Profile</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Features section */}
        <div className="mt-16 pb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why hire on Genius?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Pre-vetted talent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every freelancer on our platform is verified and has passed our quality checks.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Global expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access top talent from around the world, with expertise in every industry.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Quality guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Satisfaction guaranteed with secure payments and dispute resolution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hire;
