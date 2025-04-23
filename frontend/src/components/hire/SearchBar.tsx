import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters?: {
    priceRange: [number, number];
    location: string;
    availability: string;
    skills: string[];
    rating: number;
  };
  setFilters?: (filters: any) => void;
}

const SearchBar = ({ 
  searchTerm, 
  setSearchTerm,
  filters,
  setFilters 
}: SearchBarProps) => {
  const [localFilters, setLocalFilters] = useState({
    priceRange: [10, 150],
    location: "anywhere",
    availability: "anytime",
    skills: [] as string[],
    rating: 0
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const popularSkills = [
    "React", "JavaScript", "PHP", "WordPress", "Shopify", 
    "Graphic Design", "Content Writing", "SEO", "Social Media"
  ];
  
  const handlePriceChange = (value: number[]) => {
    setLocalFilters({...localFilters, priceRange: [value[0], value[1]]});
    updateActiveFilters("price", `$${value[0]}-$${value[1]}/hr`);
  };
  
  const handleLocationChange = (value: string) => {
    setLocalFilters({...localFilters, location: value});
    if (value !== "anywhere") {
      updateActiveFilters("location", value);
    } else {
      removeActiveFilter("location");
    }
  };
  
  const handleAvailabilityChange = (value: string) => {
    setLocalFilters({...localFilters, availability: value});
    if (value !== "anytime") {
      updateActiveFilters("availability", value);
    } else {
      removeActiveFilter("availability");
    }
  };
  
  const handleSkillToggle = (skill: string) => {
    const updatedSkills = localFilters.skills.includes(skill)
      ? localFilters.skills.filter(s => s !== skill)
      : [...localFilters.skills, skill];
    
    setLocalFilters({...localFilters, skills: updatedSkills});
    
    if (updatedSkills.length > 0) {
      updateActiveFilters("skills", updatedSkills.join(", "));
    } else {
      removeActiveFilter("skills");
    }
  };
  
  const handleRatingChange = (value: string) => {
    const rating = parseInt(value);
    setLocalFilters({...localFilters, rating});
    if (rating > 0) {
      updateActiveFilters("rating", `${rating}+ stars`);
    } else {
      removeActiveFilter("rating");
    }
  };
  
  const updateActiveFilters = (key: string, value: string) => {
    const existingIndex = activeFilters.findIndex(f => f.startsWith(key + ":"));
    
    if (existingIndex >= 0) {
      const updatedFilters = [...activeFilters];
      updatedFilters[existingIndex] = `${key}:${value}`;
      setActiveFilters(updatedFilters);
    } else {
      setActiveFilters([...activeFilters, `${key}:${value}`]);
    }
  };
  
  const removeActiveFilter = (key: string) => {
    setActiveFilters(activeFilters.filter(f => !f.startsWith(key + ":")));
  };
  
  const removeFilterByIndex = (index: number) => {
    const filter = activeFilters[index];
    const key = filter.split(":")[0];
    
    // Reset the corresponding filter
    if (key === "price") {
      setLocalFilters({...localFilters, priceRange: [10, 150]});
    } else if (key === "location") {
      setLocalFilters({...localFilters, location: "anywhere"});
    } else if (key === "availability") {
      setLocalFilters({...localFilters, availability: "anytime"});
    } else if (key === "skills") {
      setLocalFilters({...localFilters, skills: []});
    } else if (key === "rating") {
      setLocalFilters({...localFilters, rating: 0});
    }
    
    // Remove from active filters display
    const updatedFilters = [...activeFilters];
    updatedFilters.splice(index, 1);
    setActiveFilters(updatedFilters);
  };
  
  const clearAllFilters = () => {
    setLocalFilters({
      priceRange: [10, 150],
      location: "anywhere",
      availability: "anytime",
      skills: [],
      rating: 0
    });
    setActiveFilters([]);
    
    // Update parent component filters if provided
    if (setFilters) {
      setFilters({
        priceRange: [10, 150],
        location: "anywhere",
        availability: "anytime",
        skills: [],
        rating: 0
      });
    }
  };
  
  const applyFilters = () => {
    if (setFilters) {
      setFilters(localFilters);
    }
  };

  return (
    <div>
      <div className="relative max-w-3xl mx-auto mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for skills, services, or freelancers..."
          className="pl-10 pr-20 py-6 text-base rounded-full border-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4"
              variant="outline"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilters.length > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-5" align="end">
            <div className="space-y-4">
              <h3 className="font-medium">Filter Freelancers</h3>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Price Range (per hour)</h4>
                <div className="flex justify-between text-sm mb-2">
                  <span>${localFilters.priceRange[0]}</span>
                  <span>${localFilters.priceRange[1]}+</span>
                </div>
                <Slider 
                  value={[localFilters.priceRange[0], localFilters.priceRange[1]]}
                  min={10}
                  max={200}
                  step={5}
                  onValueChange={handlePriceChange}
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Location</h4>
                <Select 
                  value={localFilters.location}
                  onValueChange={handleLocationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anywhere">Anywhere</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="africa">Africa</SelectItem>
                    <SelectItem value="south-america">South America</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Availability</h4>
                <Select 
                  value={localFilters.availability} 
                  onValueChange={handleAvailabilityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Any Time</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Min. Rating</h4>
                <Select 
                  value={localFilters.rating.toString()} 
                  onValueChange={handleRatingChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`skill-${skill}`}
                        checked={localFilters.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={`skill-${skill}`} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between pt-2 border-t">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 max-w-3xl mx-auto">
          {activeFilters.map((filter, index) => {
            const [key, value] = filter.split(":");
            return (
              <Badge 
                key={index} 
                variant="secondary"
                className="px-3 py-1 flex items-center gap-1"
              >
                <span>{value}</span>
                <button 
                  onClick={() => removeFilterByIndex(index)}
                  className="ml-1 h-4 w-4 rounded-full bg-muted-foreground/20 inline-flex items-center justify-center hover:bg-muted-foreground/40"
                >
                  ✕
                </button>
              </Badge>
            );
          })}
          
          {activeFilters.length > 1 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 px-2 text-xs">
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
