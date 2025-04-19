
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input 
        placeholder="Search for skills, services, or freelancers..." 
        className="pl-10 pr-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-1 top-1/2 transform -translate-y-1/2"
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBar;
