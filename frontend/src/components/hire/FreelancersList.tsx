import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FreelancerCard from "./FreelancerCard";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Freelancer {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: string;
  image: string;
  tags: string[];
  description: string;
}

interface FreelancersListProps {
  categories: string[];
  freelancers: Freelancer[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

type ViewMode = "grid" | "list";
type SortOption = "rating" | "price-low" | "price-high" | "reviews";

const FreelancersList = ({ 
  categories, 
  freelancers, 
  selectedCategory, 
  setSelectedCategory 
}: FreelancersListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOption, setSortOption] = useState<SortOption>("rating");
  const [savedFreelancers, setSavedFreelancers] = useState<number[]>([]);
  
  // Sort freelancers based on selected option
  const sortedFreelancers = [...freelancers].sort((a, b) => {
    switch (sortOption) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return parseInt(a.hourlyRate.replace('$', '')) - parseInt(b.hourlyRate.replace('$', ''));
      case "price-high":
        return parseInt(b.hourlyRate.replace('$', '')) - parseInt(a.hourlyRate.replace('$', ''));
      case "reviews":
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });
  
  const toggleSavedFreelancer = (id: number) => {
    if (savedFreelancers.includes(id)) {
      setSavedFreelancers(savedFreelancers.filter(freelancerId => freelancerId !== id));
    } else {
      setSavedFreelancers([...savedFreelancers, id]);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-muted overflow-x-auto py-2 px-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-4 whitespace-nowrap"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="border rounded-md flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none rounded-l-md"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none rounded-r-md"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <TabsContent value={selectedCategory} className="mt-0">
            {/* Handle case with no freelancers */}
            {sortedFreelancers.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center">
                  <h3 className="text-lg font-medium mb-2">No freelancers found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                  <Button>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {sortedFreelancers.map((freelancer) => (
                  <div key={freelancer.id}>
                    {viewMode === "grid" ? (
                      <FreelancerCard 
                        freelancer={freelancer} 
                        isSaved={savedFreelancers.includes(freelancer.id)}
                        onToggleSave={() => toggleSavedFreelancer(freelancer.id)}
                      />
                    ) : (
                      <FreelancerListItem 
                        freelancer={freelancer} 
                        isSaved={savedFreelancers.includes(freelancer.id)}
                        onToggleSave={() => toggleSavedFreelancer(freelancer.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Saved freelancers section (collapsed by default) */}
      {savedFreelancers.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Saved Freelancers ({savedFreelancers.length})</CardTitle>
            <CardDescription>Freelancers you've saved for future reference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {freelancers
                .filter(f => savedFreelancers.includes(f.id))
                .map(freelancer => (
                  <div key={`saved-${freelancer.id}`} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img 
                      src={freelancer.image} 
                      alt={freelancer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{freelancer.name}</h4>
                      <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      View
                    </Button>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// List view item component
const FreelancerListItem = ({ 
  freelancer, 
  isSaved, 
  onToggleSave 
}: { 
  freelancer: Freelancer; 
  isSaved: boolean;
  onToggleSave: () => void;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="sm:w-24 sm:h-24 h-auto w-full">
        <img 
          src={freelancer.image} 
          alt={freelancer.name}
          className="object-cover w-full h-full rounded-lg"
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
          <div>
            <h3 className="font-medium text-lg">{freelancer.name}</h3>
            <p className="text-sm text-muted-foreground">{freelancer.title}</p>
          </div>
          <div className="flex items-center mt-1 sm:mt-0">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="font-medium">{freelancer.rating}</span>
            <span className="text-muted-foreground ml-1">({freelancer.reviews})</span>
          </div>
        </div>
        
        <p className="text-sm mb-3">{freelancer.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-2">
          {freelancer.tags.map((tag) => (
            <span key={tag} className="bg-muted px-2 py-0.5 rounded-full text-xs">{tag}</span>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
          <div className="text-sm mb-2 sm:mb-0">
            <span className="font-medium">{freelancer.hourlyRate}</span>
            <span className="text-muted-foreground ml-1">/ hr</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleSave}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm">Message</Button>
            <Button size="sm">View Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancersList;
