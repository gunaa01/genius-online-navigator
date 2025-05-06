import React, { useState, useEffect } from "react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Bookmark,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Mock data for jobs
const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    logo: "https://ui-avatars.com/api/?name=TechCorp&background=random",
    location: "Remote",
    locationType: "remote",
    type: "full-time",
    salary: "$120,000 - $150,000",
    salaryRange: [120000, 150000],
    experience: "senior",
    responsibilities: [
      "Develop and maintain web applications using React and TypeScript",
      "Collaborate with UX designers to implement responsive designs",
      "Work with backend developers to integrate APIs",
      "Optimize application performance",
      "Write clean, maintainable code"
    ],
    requirements: [
      "5+ years of experience with JavaScript/TypeScript",
      "3+ years of experience with React",
      "Experience with state management libraries (Redux, MobX)",
      "Knowledge of modern CSS and CSS-in-JS libraries",
      "Understanding of web accessibility standards"
    ],
    postedDate: "2023-11-15",
    applicationCount: 47,
    viewCount: 1250,
    isFeatured: true
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "DataDrive Inc",
    logo: "https://ui-avatars.com/api/?name=DataDrive&background=random",
    location: "San Francisco, CA",
    locationType: "onsite",
    type: "full-time",
    salary: "$130,000 - $160,000",
    salaryRange: [130000, 160000],
    experience: "mid",
    responsibilities: [
      "Design and implement scalable backend services",
      "Optimize database queries and schemas",
      "Develop RESTful APIs",
      "Implement authentication and authorization systems",
      "Collaborate with frontend teams to integrate services"
    ],
    requirements: [
      "4+ years of backend development experience",
      "Proficiency in Node.js, Python, or Java",
      "Experience with SQL and NoSQL databases",
      "Knowledge of microservices architecture",
      "Understanding of cloud services (AWS, Azure, GCP)"
    ],
    postedDate: "2023-11-10",
    applicationCount: 32,
    viewCount: 980,
    isFeatured: false
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "Creative Minds Agency",
    logo: "https://ui-avatars.com/api/?name=Creative&background=random",
    location: "New York, NY",
    locationType: "hybrid",
    type: "full-time",
    salary: "$90,000 - $120,000",
    salaryRange: [90000, 120000],
    experience: "mid",
    responsibilities: [
      "Create user-centered designs for web and mobile applications",
      "Develop wireframes, prototypes, and high-fidelity mockups",
      "Conduct user research and usability testing",
      "Collaborate with product managers to understand requirements",
      "Work with developers to ensure design implementation quality"
    ],
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in design tools (Figma, Sketch, Adobe XD)",
      "Understanding of user-centered design principles",
      "Experience with design systems",
      "Portfolio demonstrating your design process"
    ],
    postedDate: "2023-11-08",
    applicationCount: 58,
    viewCount: 1450,
    isFeatured: true
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudScale Technologies",
    logo: "https://ui-avatars.com/api/?name=CloudScale&background=random",
    location: "Remote",
    locationType: "remote",
    type: "contract",
    salary: "$100,000 - $130,000",
    salaryRange: [100000, 130000],
    experience: "senior",
    responsibilities: [
      "Implement and maintain CI/CD pipelines",
      "Manage cloud infrastructure using IaC tools",
      "Optimize application performance and reliability",
      "Monitor systems and implement security best practices",
      "Collaborate with development teams to improve deployment processes"
    ],
    requirements: [
      "4+ years of DevOps experience",
      "Proficiency with AWS, Azure, or GCP",
      "Experience with containerization (Docker, Kubernetes)",
      "Knowledge of Infrastructure as Code (Terraform, CloudFormation)",
      "Understanding of monitoring and logging systems"
    ],
    postedDate: "2023-11-05",
    applicationCount: 29,
    viewCount: 870,
    isFeatured: false
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Insight Analytics",
    logo: "https://ui-avatars.com/api/?name=Insight&background=random",
    location: "Chicago, IL",
    locationType: "onsite",
    type: "full-time",
    salary: "$110,000 - $140,000",
    salaryRange: [110000, 140000],
    experience: "mid",
    responsibilities: [
      "Analyze complex data sets to identify patterns and insights",
      "Develop machine learning models for predictive analytics",
      "Create data visualizations and reports",
      "Collaborate with business stakeholders to understand requirements",
      "Optimize data collection and processing methodologies"
    ],
    requirements: [
      "3+ years of experience in data science",
      "Proficiency in Python and data analysis libraries",
      "Experience with machine learning frameworks",
      "Strong background in statistics",
      "Knowledge of SQL and database systems"
    ],
    postedDate: "2023-11-01",
    applicationCount: 41,
    viewCount: 1120,
    isFeatured: false
  },
  {
    id: "6",
    title: "Product Manager",
    company: "InnovateTech",
    logo: "https://ui-avatars.com/api/?name=InnovateTech&background=random",
    location: "Boston, MA",
    locationType: "hybrid",
    type: "full-time",
    salary: "$125,000 - $155,000",
    salaryRange: [125000, 155000],
    experience: "senior",
    responsibilities: [
      "Define product vision, strategy, and roadmap",
      "Gather and prioritize product requirements",
      "Work with engineering teams to deliver features",
      "Analyze market trends and competitor products",
      "Define and track success metrics for product features"
    ],
    requirements: [
      "5+ years of product management experience",
      "Experience leading cross-functional teams",
      "Strong analytical and problem-solving skills",
      "Excellent communication and presentation abilities",
      "Technical background preferred"
    ],
    postedDate: "2023-10-28",
    applicationCount: 53,
    viewCount: 1350,
    isFeatured: true
  },
  {
    id: "7",
    title: "Mobile Developer (iOS)",
    company: "AppWorks Studio",
    logo: "https://ui-avatars.com/api/?name=AppWorks&background=random",
    location: "Remote",
    locationType: "remote",
    type: "full-time",
    salary: "$100,000 - $130,000",
    salaryRange: [100000, 130000],
    experience: "mid",
    responsibilities: [
      "Develop and maintain iOS applications using Swift",
      "Collaborate with design team to implement UI/UX",
      "Integrate RESTful APIs and third-party services",
      "Ensure app performance and reliability",
      "Publish and maintain apps in the App Store"
    ],
    requirements: [
      "3+ years of iOS development experience",
      "Proficiency in Swift and UIKit",
      "Understanding of iOS design patterns",
      "Experience with Core Data and other iOS frameworks",
      "Knowledge of App Store submission process"
    ],
    postedDate: "2023-10-25",
    applicationCount: 38,
    viewCount: 950,
    isFeatured: false
  },
  {
    id: "8",
    title: "Marketing Specialist",
    company: "GrowthBoost Marketing",
    logo: "https://ui-avatars.com/api/?name=GrowthBoost&background=random",
    location: "Miami, FL",
    locationType: "onsite",
    type: "part-time",
    salary: "$60,000 - $80,000",
    salaryRange: [60000, 80000],
    experience: "entry",
    responsibilities: [
      "Develop and execute marketing campaigns",
      "Manage social media accounts and content",
      "Analyze marketing metrics and prepare reports",
      "Collaborate with design team on marketing materials",
      "Assist in organizing company events and webinars"
    ],
    requirements: [
      "1-2 years of marketing experience",
      "Knowledge of digital marketing channels",
      "Experience with marketing analytics tools",
      "Strong writing and communication skills",
      "Bachelor's degree in Marketing or related field"
    ],
    postedDate: "2023-10-20",
    applicationCount: 67,
    viewCount: 1580,
    isFeatured: false
  },
  {
    id: "9",
    title: "Full Stack Developer",
    company: "Omnitech Solutions",
    logo: "https://ui-avatars.com/api/?name=Omnitech&background=random",
    location: "Austin, TX",
    locationType: "hybrid",
    type: "full-time",
    salary: "$90,000 - $120,000",
    salaryRange: [90000, 120000],
    experience: "mid",
    responsibilities: [
      "Develop web applications using modern JavaScript frameworks",
      "Build and maintain RESTful APIs using Node.js",
      "Design and implement database schemas",
      "Collaborate with UX/UI designers to implement designs",
      "Participate in code reviews and technical discussions"
    ],
    requirements: [
      "3+ years of full stack development experience",
      "Proficiency in JavaScript/TypeScript",
      "Experience with React, Angular, or Vue.js",
      "Knowledge of Node.js and Express",
      "Understanding of database systems (SQL and NoSQL)"
    ],
    postedDate: "2023-10-18",
    applicationCount: 45,
    viewCount: 1230,
    isFeatured: false
  },
  {
    id: "10",
    title: "Customer Success Manager",
    company: "ServicePro Inc",
    logo: "https://ui-avatars.com/api/?name=ServicePro&background=random",
    location: "Remote",
    locationType: "remote",
    type: "full-time",
    salary: "$80,000 - $100,000",
    salaryRange: [80000, 100000],
    experience: "mid",
    responsibilities: [
      "Serve as the primary point of contact for clients",
      "Develop and maintain strong relationships with customers",
      "Identify upsell opportunities and drive customer retention",
      "Create customer success plans and strategies",
      "Monitor customer satisfaction metrics and address concerns"
    ],
    requirements: [
      "3+ years of customer success or account management experience",
      "Strong communication and interpersonal skills",
      "Experience with CRM software",
      "Problem-solving abilities",
      "Background in SaaS industry preferred"
    ],
    postedDate: "2023-10-15",
    applicationCount: 39,
    viewCount: 980,
    isFeatured: false
  }
];

type JobListingsProps = {
  searchTerm?: string;
  jobTypes?: string[];

const JobListings: React.FC = () => {
  const { filters, setFilters } = useMarketplace();
  const [jobs, setJobs] = useState<typeof MOCK_JOBS>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const jobsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filteredJobs = [...MOCK_JOBS];
      
      // Apply search filter
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(lowercaseSearch) ||
          job.company.toLowerCase().includes(lowercaseSearch) ||
          job.responsibilities.some(resp => resp.toLowerCase().includes(lowercaseSearch)) ||
          job.requirements.some(req => req.toLowerCase().includes(lowercaseSearch))
        );
      }
      
      // Apply job type filter
      if (jobTypes.length > 0) {
        filteredJobs = filteredJobs.filter(job => jobTypes.includes(job.type));
      }
      
      // Apply location filter
      if (locations.length > 0) {
        filteredJobs = filteredJobs.filter(job => locations.includes(job.locationType));
      }
      
      // Apply experience level filter
      if (experienceLevels.length > 0) {
        filteredJobs = filteredJobs.filter(job => experienceLevels.includes(job.experience));
      }
      
      // Apply salary filter
      if (salaryRange) {
        filteredJobs = filteredJobs.filter(job => 
          job.salaryRange[0] >= salaryRange[0] && job.salaryRange[1] <= salaryRange[1]
        );
      }

      setJobs(filteredJobs);
      setTotalPages(Math.ceil(filteredJobs.length / jobsPerPage));
      setLoading(false);
    }, 800);
  }, [searchTerm, jobTypes, locations, experienceLevels, salaryRange]);

  // Load saved jobs from localStorage on component mount
  useEffect(() => {
    const savedJobsFromStorage = localStorage.getItem('savedJobs');
    if (savedJobsFromStorage) {
      setSavedJobs(JSON.parse(savedJobsFromStorage));
    }
  }, []);

  const handleSaveJob = (jobId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    let updatedSavedJobs: string[];
    
    if (savedJobs.includes(jobId)) {
      updatedSavedJobs = savedJobs.filter(id => id !== jobId);
    } else {
      updatedSavedJobs = [...savedJobs, jobId];
    }
    
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/hiring/job/${jobId}`);
  };

  // Calculate pagination
  const startIdx = (page - 1) * jobsPerPage;
  const endIdx = startIdx + jobsPerPage;
  const paginatedJobs = jobs.slice(startIdx, endIdx);

  // Format date to relative time
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No matching jobs found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any jobs matching your current filters. Try adjusting your search criteria.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear all filters
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {startIdx + 1}-{Math.min(endIdx, jobs.length)} of {jobs.length} jobs
        </p>
        <div className="flex items-center gap-2">
          <Select.Root defaultValue="relevance">
            <Select.Trigger className="w-[140px]">
              <Select.Value placeholder="Sort by" />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>Sort Options</Select.Label>
                <Select.Item value="relevance">Relevance</Select.Item>
                <Select.Item value="recent">Most Recent</Select.Item>
                <Select.Item value="salary-high">Highest Salary</Select.Item>
                <Select.Item value="salary-low">Lowest Salary</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedJobs.map(job => (
          <Card 
            key={job.id}
            className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
            onClick={() => handleJobClick(job.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex gap-4 items-start md:items-center">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-muted flex-shrink-0">
                    <img 
                      src={job.logo} 
                      alt={`${job.company} logo`} 
                      className="object-cover" 
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl">{job.title}</CardTitle>
                    <CardDescription className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                      {job.company}
                      {job.isFeatured && (
                        <Badge variant="secondary" className="ml-0 md:ml-2 w-fit">
                          <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                          Featured
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={(e) => handleSaveJob(job.id, e)}
                >
                  <Bookmark 
                    className={`h-5 w-5 ${savedJobs.includes(job.id) ? 'fill-primary text-primary' : ''}`} 
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {job.salary}
                </Badge>
              </div>
              <p className="text-sm line-clamp-2">
                {job.responsibilities[0]}
              </p>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                Posted {formatRelativeDate(job.postedDate)}
              </div>
              <Button size="sm">
                View Job
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              // Show first page, last page, current page, and pages around current
              const shouldShow = 
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= page - 1 && pageNumber <= page + 1);
              
              // Show ellipsis if needed (but not next to first/last page)
              if (!shouldShow) {
                if ((pageNumber === 2 && page > 3) || (pageNumber === totalPages - 1 && page < totalPages - 2)) {
                  return (
                    <PaginationItem key={`ellipsis-${pageNumber}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              }
              
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    isActive={page === pageNumber}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                aria-disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default JobListings;