
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Briefcase, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "@/components/hire/SearchBar";
import FreelancersList from "@/components/hire/FreelancersList";
import FreelancerFeature from "@/components/hire/FreelancerFeature";
import JobListings from "@/components/JobListings";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";

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
  // Removed local filter/search state; now handled by MarketplaceContext

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Development");
  const [activeTab, setActiveTab] = useState("freelancers");

  return (
    <MarketplaceProvider>
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
          <h1 className="text-3xl font-bold mb-4">Talent Marketplace</h1>
          <p className="text-muted-foreground mb-8">
            Find the perfect talent for your business or browse available job opportunities.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="freelancers">
              <Users className="h-4 w-4 mr-2" />
              Find Freelancers
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="freelancers">
            <div className="mb-8 max-w-3xl mx-auto">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            
            {/* Categories and Freelancers listing */}
            <FreelancersList 
              categories={categories}
              freelancers={freelancers}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            
            {/* Features section */}
            <FreelancerFeature />
          </TabsContent>
          
          <TabsContent value="jobs">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Available Job Opportunities</h2>
                  <p className="text-muted-foreground">Browse through job listings from businesses looking for talent</p>
                </div>
                <Link to="/hiring/post-job">
                  <Button>
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post a Job
                  </Button>
                </Link>
              </div>
              
              <JobListings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

      </MarketplaceProvider>
  );
};

export default Hire;
