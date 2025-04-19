
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FreelancerCard from "./FreelancerCard";

interface FreelancerData {
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
  freelancers: FreelancerData[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const FreelancersList = ({ 
  categories, 
  freelancers, 
  selectedCategory, 
  setSelectedCategory 
}: FreelancersListProps) => {
  return (
    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
      <TabsList className="w-full h-auto flex flex-wrap justify-start overflow-auto pb-2">
        {categories.map((category) => (
          <TabsTrigger 
            key={category} 
            value={category}
            className="my-1 whitespace-nowrap"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FreelancersList;
