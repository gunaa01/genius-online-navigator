import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Share2, 
  Bookmark, 
  ChevronLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import Layout from "@/components/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Mock job data (to be replaced with API call)
const MOCK_JOBS = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "TechInnovate Solutions",
    companyLogo: "/placeholder.svg",
    companyDescription: "TechInnovate Solutions is a leading software development company specializing in creating innovative web and mobile applications for businesses of all sizes. With a team of experienced developers, designers, and project managers, we deliver high-quality solutions tailored to our clients' needs.",
    location: "Remote",
    salary: "$80,000 - $120,000",
    employmentType: "Full-time",
    experienceLevel: "3-5 years",
    isFeatured: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Git"],
    description: "We're looking for a full stack developer with experience in React, Node.js, and MongoDB to join our growing team. The ideal candidate will work on challenging projects for our clients across various industries.",
    responsibilities: [
      "Design and develop web applications using React, Node.js, and other modern technologies",
      "Collaborate with the design team to implement responsive and intuitive user interfaces",
      "Write clean, maintainable, and efficient code",
      "Perform code reviews and mentor junior developers",
      "Troubleshoot and debug applications",
      "Optimize applications for maximum speed and scalability"
    ],
    requirements: [
      "3-5 years of experience in full stack development",
      "Strong proficiency in JavaScript, TypeScript, React, and Node.js",
      "Experience with MongoDB, PostgreSQL, or other databases",
      "Understanding of server-side rendering and state management",
      "Knowledge of version control systems (Git)",
      "Excellent problem-solving and communication skills"
    ],
    benefits: [
      "Competitive salary based on experience",
      "Remote work with flexible hours",
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Professional development budget",
      "Regular team events and retreats"
    ],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Application form schema
const applicationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  resume: z.string().min(1, { message: "Please upload your resume." }),
  coverLetter: z.string().optional(),
  linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal("")),
  portfolio: z.string().url({ message: "Please enter a valid portfolio URL." }).optional().or(z.literal(""))
});

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [savedJob, setSavedJob] = useState(false);

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      resume: "",
      coverLetter: "",
      linkedin: "",
      portfolio: ""
    }
  });

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const foundJob = MOCK_JOBS.find(job => job.id === Number(id));
        
        if (foundJob) {
          setJob(foundJob);
        } else {
          // Job not found
          toast({
            variant: "destructive",
            title: "Job not found",
            description: "The job listing you're looking for doesn't exist or has been removed."
          });
          navigate("/hiring");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          variant: "destructive",
          title: "Failed to load job details",
          description: "Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, navigate]);

  const onSubmit = async (values: z.infer<typeof applicationSchema>) => {
    console.log("Application submitted:", values);
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setApplicationSubmitted(true);
    
    // Reset form after successful submission
    form.reset();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleSaveJob = () => {
    setSavedJob(!savedJob);
    toast({
      title: savedJob ? "Job removed from saved jobs" : "Job saved successfully",
      description: savedJob ? "This job has been removed from your saved jobs" : "You can view it later in your saved jobs"
    });
  };

  const handleShareJob = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this job listing with others"
    });
  };

  if (loading || !job) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-2/3 bg-muted rounded"></div>
            <div className="h-4 w-1/3 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded mt-6"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center" 
          onClick={() => navigate("/hiring")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Job Listings
        </Button>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center text-muted-foreground mt-2">
              <Building className="h-4 w-4 mr-1" />
              <span className="mr-4">{job.company}</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span className="mr-4">{job.location}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShareJob}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant={savedJob ? "default" : "outline"} 
              size="sm" 
              onClick={handleSaveJob}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {savedJob ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex gap-4 items-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={job.companyLogo} alt={job.company} />
                <AvatarFallback>{job.company.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{job.company}</CardTitle>
                <CardDescription>
                  Visit company profile to learn more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Employment Type</h4>
                <p className="text-sm font-medium">{job.employmentType}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Experience</h4>
                <p className="text-sm font-medium">{job.experienceLevel}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Salary Range</h4>
                <p className="text-sm font-medium">{job.salary}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Application Deadline</h4>
                <p className="text-sm font-medium">{formatDate(job.applicationDeadline)}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mr-2 w-full">Required Skills:</h4>
              {job.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                {applicationSubmitted ? (
                  <div className="py-6 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <DialogTitle className="text-2xl mb-2">Application Submitted!</DialogTitle>
                    <DialogDescription className="text-base mb-6">
                      Your application for the {job.title} position at {job.company} has been successfully submitted.
                      The hiring team will review your application and reach out to you if there's a match.
                    </DialogDescription>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setApplicationSubmitted(false);
                          setApplyDialogOpen(false);
                        }}
                      >
                        Close
                      </Button>
                      <Button onClick={() => navigate("/dashboard/applications")}>
                        View My Applications
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        Submit your application for the {job.title} position at {job.company}.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 (555) 000-0000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="resume"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Resume</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="file" 
                                    accept=".pdf,.doc,.docx" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        field.onChange(file.name);
                                      }
                                    }} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Upload your resume (PDF, DOC, DOCX)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="coverLetter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cover Letter (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us why you're a great fit for this position..."
                                  className="resize-none"
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="linkedin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="portfolio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Portfolio Website (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://yourportfolio.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setApplyDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Submit Application</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Tabs defaultValue="description">
          <TabsList className="mb-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="similar">Similar Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Job Description</h3>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-medium mb-3">Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {job.responsibilities.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-medium mb-3">Requirements</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {job.requirements.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-medium mb-3">Benefits</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {job.benefits.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <div className="flex gap-4 items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={job.companyLogo} alt={job.company} />
                    <AvatarFallback>{job.company.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{job.company}</CardTitle>
                    <CardDescription>
                      Technology • 50-200 employees • Founded 2015
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-medium mb-3">About the Company</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {job.companyDescription}
                </p>
                
                <h3 className="text-xl font-medium mb-3">Company Culture</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Innovation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        We value creative problem-solving and new ideas
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Collaboration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        We work together to achieve common goals
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        We support personal and professional development
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline">
                    Visit Company Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="similar">
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Similar Jobs Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                We're working on AI-powered job recommendations based on your skills and interests.
              </p>
              <Button onClick={() => navigate("/hiring")}>
                Browse All Jobs
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default JobDetail; 