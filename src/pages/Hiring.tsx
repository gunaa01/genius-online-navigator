
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  BadgeDollarSign,
  Filter,
  ArrowUp,
  ArrowDown,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

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
  const form = useForm({
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "",
      budget: "",
      description: "",
      skills: "",
    },
  });

  const onSubmit = (data) => {
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
              <DialogTrigger asChild>
                <Button>Post a Job</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to post your job requirement. It will be visible to all freelancers.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g. WordPress Developer for E-commerce Site" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="onsite">On-Site</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="project">Project-based</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. $1000-$2000 or $25/hr" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the job requirements, responsibilities, and any other details." 
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Skills</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g. WordPress, PHP, CSS (comma separated)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Post Job</Button>
                    </DialogFooter>
                  </form>
                </Form>
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
          <div className="w-full lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {jobCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Button 
                        variant={selectedCategory === category ? "default" : "ghost"} 
                        className="w-full justify-start text-sm h-9"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <input id="full-time" type="checkbox" className="h-4 w-4 mr-2"/>
                  <label htmlFor="full-time" className="text-sm">Full-time</label>
                </div>
                <div className="flex items-center">
                  <input id="part-time" type="checkbox" className="h-4 w-4 mr-2"/>
                  <label htmlFor="part-time" className="text-sm">Part-time</label>
                </div>
                <div className="flex items-center">
                  <input id="contract" type="checkbox" className="h-4 w-4 mr-2"/>
                  <label htmlFor="contract" className="text-sm">Contract</label>
                </div>
                <div className="flex items-center">
                  <input id="project" type="checkbox" className="h-4 w-4 mr-2"/>
                  <label htmlFor="project" className="text-sm">Project-based</label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <input id="budget-1" type="radio" name="budget" className="h-4 w-4 mr-2"/>
                  <label htmlFor="budget-1" className="text-sm">Under $500</label>
                </div>
                <div className="flex items-center">
                  <input id="budget-2" type="radio" name="budget" className="h-4 w-4 mr-2"/>
                  <label htmlFor="budget-2" className="text-sm">$500 - $1,000</label>
                </div>
                <div className="flex items-center">
                  <input id="budget-3" type="radio" name="budget" className="h-4 w-4 mr-2"/>
                  <label htmlFor="budget-3" className="text-sm">$1,000 - $5,000</label>
                </div>
                <div className="flex items-center">
                  <input id="budget-4" type="radio" name="budget" className="h-4 w-4 mr-2"/>
                  <label htmlFor="budget-4" className="text-sm">$5,000+</label>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Job listings */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Available Jobs ({jobs.length})</h2>
              <div className="flex items-center text-sm">
                <span className="mr-2">Sort by:</span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="budget-high">Budget (High to Low)</SelectItem>
                    <SelectItem value="budget-low">Budget (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                        <p className="text-muted-foreground mb-2">{job.company}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="font-normal">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <p className="mb-4 text-sm">{job.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{job.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <BadgeDollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{job.budget}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Posted {job.posted}</span>
                        <span className="mx-2">•</span>
                        <span className="text-muted-foreground">{job.applicants} applicants</span>
                      </div>
                      
                      <Button>Apply Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hiring;
