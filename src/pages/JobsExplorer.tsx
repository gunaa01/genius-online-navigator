import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from "@/components/Layout";
import JobsListing from "@/components/hiring/JobsListing";
import JobFilterSidebar from "@/components/hiring/JobFilterSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Mock data for jobs
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    duration: "Permanent",
    budget: "$110k - $140k",
    posted: "2 days ago",
    description: "We're looking for an experienced React developer to join our team and help build innovative web applications.",
    skills: ["React", "TypeScript", "Redux", "Node.js"],
    applicants: 24
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "New York, NY",
    type: "Contract",
    duration: "6 months",
    budget: "$75k - $95k",
    posted: "1 week ago",
    description: "Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    applicants: 36
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "SoftSolutions",
    location: "San Francisco, CA",
    type: "Full-time",
    duration: "Permanent",
    budget: "$120k - $150k",
    posted: "3 days ago",
    description: "Looking for a versatile developer comfortable working with both frontend and backend technologies.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    applicants: 18
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    type: "Full-time",
    duration: "Permanent",
    budget: "$130k - $160k",
    posted: "5 days ago",
    description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
    applicants: 12
  },
  {
    id: 5,
    title: "Content Marketing Specialist",
    company: "MediaGroup",
    location: "Chicago, IL",
    type: "Part-time",
    duration: "Ongoing",
    budget: "$50k - $65k",
    posted: "1 day ago",
    description: "Create engaging content for our digital marketing campaigns and social media channels.",
    skills: ["Content Creation", "SEO", "Social Media", "Copywriting"],
    applicants: 42
  }
];

// Job categories for filtering
const JOB_CATEGORIES = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "DevOps",
  "Data Science",
  "Marketing",
  "Content Creation",
  "Customer Support"
];

const JobsExplorer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handlePostJob = () => {
    if (user) {
      navigate("/post-job");
    } else {
      navigate("/auth", { state: { returnUrl: "/post-job", action: "register" } });
    }
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Filter jobs based on search term and selected category
  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All Categories" || 
      (selectedCategory === "Web Development" && job.skills.some(s => ["React", "JavaScript", "TypeScript", "Node.js"].includes(s))) ||
      (selectedCategory === "UI/UX Design" && job.skills.some(s => ["Figma", "Adobe XD", "User Research", "Prototyping"].includes(s))) ||
      (selectedCategory === "DevOps" && job.skills.some(s => ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"].includes(s))) ||
      (selectedCategory === "Marketing" && job.skills.some(s => ["Content Creation", "SEO", "Social Media", "Copywriting"].includes(s)));
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Helmet>
        <title>Explore Jobs | Genius Navigator</title>
        <meta name="description" content="Find your next career opportunity or hire top talent. Browse through our curated list of jobs across various industries and skill sets." />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Explore Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Find opportunities matching your skills and career goals
            </p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={handlePostJob}>
            <Plus className="h-4 w-4 mr-1" /> Post a Job
          </Button>
        </div>
        
        <div className="flex w-full items-center space-x-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for jobs, skills, or companies..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="md:hidden" onClick={toggleMobileFilters}>
            <Sliders className="h-4 w-4 mr-1" /> Filters
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - hidden on mobile unless toggled */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block lg:w-1/4`}>
            <JobFilterSidebar
              jobCategories={JOB_CATEGORIES}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            {filteredJobs.length > 0 ? (
              <JobsListing jobs={filteredJobs} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No matching jobs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find more opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobsExplorer; 