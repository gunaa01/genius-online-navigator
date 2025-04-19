
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import JobFilterSidebar from "@/components/hiring/JobFilterSidebar";
import JobsListing from "@/components/hiring/JobsListing";
import JobPostForm from "@/components/hiring/JobPostForm";

// Mock data for job listings
const jobs = [
  {
    id: 1,
    title: "WordPress Developer for E-commerce Site",
    company: "Green Retail Solutions",
    location: "Remote",
    type: "Contract",
    duration: "3 months",
    budget: "$2,000 - $3,000",
    posted: "2 days ago",
    description: "Looking for an experienced WordPress developer to build an e-commerce site with WooCommerce integration, custom theme development, and payment gateway setup.",
    skills: ["WordPress", "WooCommerce", "PHP", "CSS"],
    applicants: 12
  },
  {
    id: 2,
    title: "Social Media Marketing Specialist",
    company: "Fashion Forward",
    location: "Remote",
    type: "Part-time",
    duration: "Ongoing",
    budget: "$25 - $35/hr",
    posted: "1 day ago",
    description: "Seeking a social media specialist to handle our Instagram, Facebook and TikTok accounts. Must have experience in fashion or retail industry.",
    skills: ["Social Media", "Content Creation", "Analytics", "Fashion"],
    applicants: 24
  },
  {
    id: 3,
    title: "Full Stack Developer - MERN Stack",
    company: "TechInnovate",
    location: "Remote",
    type: "Full-time",
    duration: "Permanent",
    budget: "$70,000 - $90,000/year",
    posted: "Just now",
    description: "Looking for a full stack developer with experience in MongoDB, Express.js, React, and Node.js to join our team and work on our SaaS product.",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    applicants: 7
  },
  {
    id: 4,
    title: "Shopify Expert for Store Migration",
    company: "Artisanal Goods Co.",
    location: "Remote",
    type: "Fixed-price",
    duration: "1 month",
    budget: "$1,500",
    posted: "3 days ago",
    description: "Need help migrating our online store from WooCommerce to Shopify while maintaining our product data, customer accounts, and SEO ranking.",
    skills: ["Shopify", "WooCommerce", "Data Migration", "SEO"],
    applicants: 18
  },
  {
    id: 5,
    title: "Graphic Designer for Brand Identity",
    company: "New Horizons Startup",
    location: "Remote",
    type: "Project-based",
    duration: "2 weeks",
    budget: "$800 - $1,200",
    posted: "4 days ago",
    description: "Startup looking for a talented graphic designer to create our brand identity including logo, color palette, typography, and basic brand guidelines.",
    skills: ["Logo Design", "Branding", "Adobe Creative Suite", "Typography"],
    applicants: 31
  }
];

// Job categories for filtering
const jobCategories = [
  "All Jobs",
  "Development",
  "Design",
  "Marketing",
  "Content Writing",
  "Customer Support",
  "Sales",
  "Admin & VA"
];

const Hiring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Jobs");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log(data);
    setIsDialogOpen(false);
  };

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
            <Link to="/hire">
              <Button variant="outline">Find Freelancers</Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button onClick={() => setIsDialogOpen(true)}>Post a Job</Button>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to post your job requirement. It will be visible to all freelancers.
                  </DialogDescription>
                </DialogHeader>
                <JobPostForm onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Hero section */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Find talent for your business</h1>
          <p className="text-muted-foreground mb-8">
            Post your job and get connected with skilled freelancers ready to bring your projects to life.
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for jobs or keywords..." 
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

        {/* Job Listings */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters sidebar */}
          <JobFilterSidebar 
            jobCategories={jobCategories} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          {/* Job listings */}
          <JobsListing jobs={jobs} />
        </div>
      </div>
    </div>
  );
};

export default Hiring;
