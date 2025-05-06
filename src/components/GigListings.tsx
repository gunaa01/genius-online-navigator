import * as React from "react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Star, Clock, DollarSign, Repeat, User, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Skill {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface FreelancerProfile {
  id: number;
  user_id: string;
  title: string;
  profile_picture: string | null;
  avg_rating: number;
  total_reviews: number;
}

interface Gig {
  id: number;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  revisions: number;
  is_featured: boolean;
  created_at: string;
  freelancer: FreelancerProfile;
  categories: Category[];
}

interface GigListingsProps {
  featuredOnly?: boolean;
  limit?: number;
  showFilters?: boolean;
  freelancerId?: number;
  categoryId?: number;
}

const GigListings: React.FC<GigListingsProps> = ({
  featuredOnly = false,
  limit = 12,
  showFilters = true,
  freelancerId,
  categoryId,
}) => {
  const { filters, setFilters } = useMarketplace();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalGigs, setTotalGigs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const navigate = useNavigate();

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params: any = {
        skip: (currentPage - 1) * limit,
        limit,
        is_featured: featuredOnly || undefined,
        freelancer_id: freelancerId || undefined,
        category_id: filters.category || categoryId || undefined,
        search: filters.search || undefined,
        min_price: filters.minPrice || undefined,
        max_price: filters.maxPrice || undefined,
        max_delivery_time: filters.maxDeliveryTime || undefined,
        is_active: true,
      };

      const response = await axios.get("/api/for-hire/gigs", { params });
      setGigs(response.data);
      
      // For pagination - in a real API this would come from the response
      setTotalGigs(response.data.length > 0 ? response.data.length + 10 : 0);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/for-hire/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [currentPage, featuredOnly, freelancerId, categoryId]);

  useEffect(() => {
    if (showFilters) {
      fetchCategories();
    }
  }, [showFilters]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchGigs();
  };

  const handleResetFilters = () => {
    setFilters({ search: "", category: "", minPrice: "", maxPrice: "", maxDeliveryTime: "" });
    setCurrentPage(1);
    fetchGigs();
  };

  const viewGigDetails = (gigId: number) => {
    navigate(`/gigs/${gigId}`);
  };

  const viewFreelancerProfile = (freelancerId: number) => {
    navigate(`/freelancers/${freelancerId}`);
  };

  const totalPages = Math.ceil(totalGigs / limit);

  return (
    <div className="w-full space-y-6">
      {showFilters && (
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-medium mb-4">Filter Gigs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <Input
                placeholder="Gig title, description, keyword..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={filters.category} onValueChange={(val) => setFilters({ ...filters, category: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Delivery Time</label>
              <Select value={filters.maxDeliveryTime || ""} onValueChange={(val) => setFilters({ ...filters, maxDeliveryTime: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Delivery Time</SelectItem>
                  <SelectItem value="1">Up to 1 day</SelectItem>
                  <SelectItem value="3">Up to 3 days</SelectItem>
                  <SelectItem value="7">Up to 1 week</SelectItem>
                  <SelectItem value="14">Up to 2 weeks</SelectItem>
                  <SelectItem value="30">Up to 1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Min Price ($)</label>
              <Input
                type="number"
                placeholder="Minimum price"
                value={filters.minPrice || ""}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Max Price ($)</label>
              <Input
                type="number"
                placeholder="Maximum price"
                value={filters.maxPrice || ""}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={handleSearch}>Search Gigs</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : gigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gigs.map((gig) => (
            <Card key={gig.id} className="flex flex-col h-full overflow-hidden">
              {gig.is_featured && (
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 text-center">
                  Featured
                </div>
              )}
              <div className="h-48 bg-muted relative">
                {/* This would be an image of the gig/portfolio work */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">Gig Preview</span>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2 h-12">{gig.title}</CardTitle>
                <div className="flex items-center mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewFreelancerProfile(gig.freelancer.id);
                    }}
                    className="flex items-center text-sm hover:underline"
                  >
                    {gig.freelancer.profile_picture ? (
                      <img
                        src={gig.freelancer.profile_picture}
                        alt={gig.freelancer.title}
                        className="h-6 w-6 rounded-full mr-2 object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    )}
                    <span>{gig.freelancer.title}</span>
                  </button>
                </div>
                <div className="flex items-center text-sm text-amber-500 mt-1">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <span>{gig.freelancer.avg_rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">
                    ({gig.freelancer.total_reviews})
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {gig.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {gig.categories.slice(0, 3).map((category) => (
                    <Badge key={category.id} variant="secondary" className="text-xs">
                      {category.name}
                    </Badge>
                  ))}
                  {gig.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{gig.categories.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col pt-2 border-t">
                <div className="grid grid-cols-3 w-full gap-2 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{gig.delivery_time} day{gig.delivery_time !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center">
                    <Repeat className="h-3 w-3 mr-1" />
                    <span>{gig.revisions} revision{gig.revisions !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center justify-end text-foreground font-medium">
                    <DollarSign className="h-3 w-3" />
                    <span>{gig.price}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => viewGigDetails(gig.id)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border shadow-sm">
          <Tag className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
          <h3 className="mt-4 text-lg font-medium">No gigs found</h3>
          <p className="text-muted-foreground mt-1">
            {showFilters
              ? "Try adjusting your search filters"
              : "There are no gigs available at the moment"}
          </p>
          {showFilters && (
            <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default GigListings; 