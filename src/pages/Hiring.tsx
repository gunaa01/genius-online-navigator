import * as React from "react";
import { useState } from "react";
import Layout from "@/components/Layout";
import JobListings from "@/components/JobListings";
import JobFilterSidebar from "@/components/hiring/JobFilterSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Briefcase, LineChart, Filter, ChevronRight, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const Hiring: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Mock job categories - in a real app, these would come from an API
  const jobCategories = [
    "All Categories",
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Data Science",
    "DevOps",
    "Customer Support"
  ];

  const handlePostJob = () => {
    if (user) {
      navigate("/post-job");
    } else {
      navigate("/auth", { state: { returnUrl: "/post-job", action: "register" } });
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Job Board</h1>
            <p className="text-muted-foreground mt-2">
              Find the perfect talent or your next career opportunity
            </p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={handlePostJob}>
            <Plus className="h-4 w-4 mr-1" /> Post a Job
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="remote">Remote</TabsTrigger>
              <TabsTrigger value="fulltime">Full Time</TabsTrigger>
              <TabsTrigger value="contract">Contract</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5"
                onClick={toggleFilters}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? (
                  <>Hide Filters <ChevronLeft className="h-4 w-4" /></>
                ) : (
                  <>Advanced Filters <ChevronRight className="h-4 w-4" /></>
                )}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <LineChart className="h-4 w-4" /> Market Insights
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />

          <div className="flex flex-col lg:flex-row gap-6">
            {showFilters && (
              <div className="lg:w-1/4">
                <JobFilterSidebar 
                  jobCategories={jobCategories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            )}
            <div className={showFilters ? "lg:w-3/4" : "w-full"}>
              <TabsContent value="all">
                <JobListings />
              </TabsContent>
              
              <TabsContent value="featured">
                <JobListings featuredOnly={true} />
              </TabsContent>
              
              <TabsContent value="remote">
                <JobListings 
                  showFilters={false} 
                  limit={20}
                />
              </TabsContent>
              
              <TabsContent value="fulltime">
                <JobListings 
                  showFilters={false} 
                  limit={20}
                />
              </TabsContent>
              
              <TabsContent value="contract">
                <JobListings 
                  showFilters={false} 
                  limit={20}
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>

        <div className="mt-16 bg-muted rounded-lg p-8 text-center">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Are you a recruiter or company?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Post your job listing and reach thousands of qualified professionals.
            Our talent pool spans across various industries and expertise levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handlePostJob}>
              Post a Job
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/hiring-plans")}>
              View Hiring Plans
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hiring;
