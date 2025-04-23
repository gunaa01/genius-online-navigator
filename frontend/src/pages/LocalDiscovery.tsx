import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Globe, Mail, Clock } from "lucide-react";
import Layout from "@/components/Layout";

interface BusinessCategory {
  id: number;
  name: string;
  description: string;
}

interface LocalBusiness {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  categories: string[];
  rating: number | null;
  reviews_count: number | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  is_claimed: boolean;
  hours: Record<string, string> | null;
}

interface BusinessSearchResponse {
  businesses: LocalBusiness[];
  total: number;
  page: number;
  page_size: number;
}

const LocalDiscovery: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const pageSize = 10;
  const navigate = useNavigate();

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/discovery/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleSearch = async () => {
    if (!location) return;
    
    setLoading(true);
    
    try {
      const response = await axios.get<BusinessSearchResponse>("/api/discovery/search", {
        params: {
          location,
          query: query || undefined,
          category_id: selectedCategory || undefined,
          page: currentPage,
          page_size: pageSize
        }
      });
      
      setBusinesses(response.data.businesses);
      setTotalResults(response.data.total);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const viewBusinessDetails = (businessId: number) => {
    navigate(`/business/${businessId}`);
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Discover Local Businesses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input 
              placeholder="City, State, or ZIP" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>
          
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
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
          
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input 
              placeholder="Search keywords..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
          </div>
          
          <div className="md:col-span-1 flex items-end">
            <Button 
              className="w-full" 
              onClick={handleSearch}
              disabled={loading || !location}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
        
        {businesses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {businesses.map((business) => (
                <Card key={business.id} className="overflow-hidden h-full flex flex-col">
                  {business.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={business.image_url} 
                        alt={business.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle>{business.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center space-x-1 mt-1">
                        {business.rating && (
                          <>
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span>{business.rating}</span>
                            {business.reviews_count && (
                              <span className="text-muted-foreground">
                                ({business.reviews_count} reviews)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="mb-4">{business.description}</p>
                    
                    <div className="flex items-start space-x-2 mb-2">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>
                        {business.address}, {business.city}, {business.state} {business.zip_code}
                      </span>
                    </div>
                    
                    {business.phone && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                    
                    {business.website && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="h-4 w-4 flex-shrink-0" />
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {business.categories.map((category, index) => (
                        <Badge key={index} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center">
                    <Button 
                      variant="outline"
                      onClick={() => viewBusinessDetails(business.id)}
                    >
                      View Details
                    </Button>
                    
                    {business.is_claimed && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Claimed
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            {location ? (
              loading ? (
                <p>Searching for businesses...</p>
              ) : (
                <p>No businesses found. Try adjusting your search criteria.</p>
              )
            ) : (
              <p>Enter a location to start your search.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LocalDiscovery; 