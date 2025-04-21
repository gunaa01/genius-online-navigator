
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobListHeaderProps {
  jobCount: number;
}

const JobListHeader = ({ jobCount }: JobListHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Available Jobs ({jobCount})</h2>
      <div className="flex items-center text-sm">
        <span className="mr-2">Sort by:</span>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="budget-high">Budget (High to Low)</SelectItem>
            <SelectItem value="budget-low">Budget (Low to High)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default JobListHeader;
