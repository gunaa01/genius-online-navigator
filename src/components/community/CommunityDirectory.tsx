
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Globe, Mail, Tag } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

type Business = {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  logo: string;
  rating: number;
  tags: string[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
};

interface CommunityDirectoryProps {
  searchQuery?: string;
}

const CommunityDirectory = ({ searchQuery = "" }: CommunityDirectoryProps) => {
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: "1",
      name: "Downtown Coffee",
      description: "Artisan coffee shop serving specialty coffee and pastries",
      category: "Cafe",
      location: "123 Main St, Downtown",
      logo: "/placeholder.svg",
      rating: 4.8,
      tags: ["Coffee", "Pastries", "Pet-friendly", "WiFi"],
      contactInfo: {
        phone: "555-123-4567",
        email: "contact@downtowncoffee.com",
        website: "downtowncoffee.com"
      }
    },
    {
      id: "2",
      name: "Bookworm Haven",
      description: "Independent bookstore with a wide selection of new and used books",
      category: "Bookstore",
      location: "456 Oak St, Downtown",
      logo: "/placeholder.svg",
      rating: 4.5,
      tags: ["Books", "Events", "Local Authors", "Coffee"],
      contactInfo: {
        phone: "555-234-5678",
        email: "info@bookwormhaven.com",
        website: "bookwormhaven.com"
      }
    },
    {
      id: "3",
      name: "Green Grocery",
      description: "Organic and locally sourced produce and grocery items",
      category: "Grocery",
      location: "789 Pine Ave, Midtown",
      logo: "/placeholder.svg",
      rating: 4.3,
      tags: ["Organic", "Local Produce", "Vegan-friendly"],
      contactInfo: {
        phone: "555-345-6789",
        email: "hello@greengrocery.com",
        website: "greengrocery.com"
      }
    }
  ]);

  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>(businesses);
  
  useEffect(() => {
    if (!searchQuery) {
      setFilteredBusinesses(businesses);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    const filtered = businesses.filter(business => 
      business.name.toLowerCase().includes(lowerCaseQuery) || 
      business.description.toLowerCase().includes(lowerCaseQuery) || 
      business.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
      business.category.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredBusinesses(filtered);
  }, [searchQuery, businesses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Local Business Directory</h2>
        <Button variant="outline">
          <Tag className="h-4 w-4 mr-2" />
          Filter by Tags
        </Button>
      </div>

      {filteredBusinesses.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No businesses found matching your search query.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <img src={business.logo} alt={business.name} />
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">{business.rating}</span>
                      <Badge className="ml-2" variant="outline">{business.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">{business.description}</CardDescription>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {business.location}
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {business.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 items-start">
                <div className="text-sm flex items-center">
                  <Globe className="h-3.5 w-3.5 mr-1" />
                  <a href={`https://${business.contactInfo.website}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {business.contactInfo.website}
                  </a>
                </div>
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                  <Button size="sm">
                    Collaborate
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityDirectory;
