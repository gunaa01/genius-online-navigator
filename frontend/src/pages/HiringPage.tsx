import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Filter,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import Layout from "@/components/Layout";
import JobListings from "@/components/JobListings";

const jobTypes = [
  { id: "full-time", label: "Full Time" },
  { id: "part-time", label: "Part Time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
  { id: "remote", label: "Remote" }
];

const locationOptions = [
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "onsite", label: "On-site" },
  { id: "united-states", label: "United States" },
  { id: "europe", label: "Europe" },
  { id: "asia", label: "Asia" },
  { id: "africa", label: "Africa" },
  { id: "australia", label: "Australia" }
];

const experienceLevels = [
  { id: "entry", label: "Entry Level" },
  { id: "mid", label: "Mid Level" },
  { id: "senior", label: "Senior Level" },
  { id: "manager", label: "Manager" },
  { id: "executive", label: "Executive" }
];

const HiringPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);
  const [activeFilters, setActiveFilters] = useState<{id: string, label: string, type: string}[]>([]);

  // Check if we're on the job listings page or a detailed job page
  const isListingPage = location.pathname === "/hiring";

  const handleJobTypeSelection = (type: string) => {
    if (selectedJobTypes.includes(type)) {
      setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
      setActiveFilters(activeFilters.filter(f => f.id !== type));
    } else {
      setSelectedJobTypes([...selectedJobTypes, type]);
      const jobType = jobTypes.find(j => j.id === type);
      if (jobType) {
        setActiveFilters([...activeFilters, {...jobType, type: 'jobType'}]);
      }
    }
  };

  const handleLocationSelection = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
      setActiveFilters(activeFilters.filter(f => f.id !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
      const locOption = locationOptions.find(l => l.id === location);
      if (locOption) {
        setActiveFilters([...activeFilters, {...locOption, type: 'location'}]);
      }
    }
  };

  const handleExperienceSelection = (exp: string) => {
    if (selectedExperience.includes(exp)) {
      setSelectedExperience(selectedExperience.filter(e => e !== exp));
      setActiveFilters(activeFilters.filter(f => f.id !== exp));
    } else {
      setSelectedExperience([...selectedExperience, exp]);
      const expLevel = experienceLevels.find(e => e.id === exp);
      if (expLevel) {
        setActiveFilters([...activeFilters, {...expLevel, type: 'experience'}]);
      }
    }
  };

  const removeFilter = (filterId: string) => {
    const filterToRemove = activeFilters.find(f => f.id === filterId);
    if (filterToRemove) {
      if (filterToRemove.type === 'jobType') {
        setSelectedJobTypes(selectedJobTypes.filter(t => t !== filterId));
      } else if (filterToRemove.type === 'location') {
        setSelectedLocations(selectedLocations.filter(l => l !== filterId));
      } else if (filterToRemove.type === 'experience') {
        setSelectedExperience(selectedExperience.filter(e => e !== filterId));
      }
      setActiveFilters(activeFilters.filter(f => f.id !== filterId));
    }
  };

  const clearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedLocations([]);
    setSelectedExperience([]);
    setActiveFilters([]);
    setSalaryRange([0, 200000]);
    setSearchTerm("");
  };

  // If we're on a detailed job page, just render the outlet which will be the JobDetail component
  if (!isListingPage) {
    return <Outlet />;
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Briefcase className="mr-2 h-8 w-8" />
              Job Board
            </h1>
            <p className="text-muted-foreground mt-2">
              Find your next opportunity - explore jobs that match your skills and interests
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search job titles or skills..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Jobs</SheetTitle>
                  <SheetDescription>
                    Narrow down your job search with specific criteria
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Job Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {jobTypes.map((type) => (
                        <Button
                          key={type.id}
                          variant={selectedJobTypes.includes(type.id) ? "default" : "outline"}
                          size="sm"
                          className="justify-start"
                          onClick={() => handleJobTypeSelection(type.id)}
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Location</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {locationOptions.map((location) => (
                        <Button
                          key={location.id}
                          variant={selectedLocations.includes(location.id) ? "default" : "outline"}
                          size="sm"
                          className="justify-start"
                          onClick={() => handleLocationSelection(location.id)}
                        >
                          {location.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Experience Level</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {experienceLevels.map((exp) => (
                        <Button
                          key={exp.id}
                          variant={selectedExperience.includes(exp.id) ? "default" : "outline"}
                          size="sm"
                          className="justify-start"
                          onClick={() => handleExperienceSelection(exp.id)}
                        >
                          {exp.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <SheetFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                  <SheetClose asChild>
                    <Button>Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(filter => (
              <Badge key={filter.id} variant="secondary" className="pl-2 pr-1 py-1">
                {filter.label}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => removeFilter(filter.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs" 
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <JobListings 
              searchTerm={searchTerm} 
              jobTypes={selectedJobTypes}
              locations={selectedLocations}
              experienceLevels={selectedExperience}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Alerts</CardTitle>
                <CardDescription>
                  Get notified when new jobs match your criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Create Job Alert</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Career Resources</CardTitle>
                <CardDescription>
                  Tools to help with your job search
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Resume Builder</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a professional resume with our AI-powered tool
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Interview Prep</h4>
                  <p className="text-sm text-muted-foreground">
                    Practice with common interview questions
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Salary Calculator</h4>
                  <p className="text-sm text-muted-foreground">
                    Compare salaries in your industry and location
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HiringPage; 