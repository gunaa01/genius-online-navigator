
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobFilterSidebarProps {
  jobCategories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const JobFilterSidebar = ({ 
  jobCategories, 
  selectedCategory, 
  setSelectedCategory 
}: JobFilterSidebarProps) => {
  return (
    <div className="w-full lg:w-64 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {jobCategories.map((category) => (
              <div key={category} className="flex items-center">
                <button 
                  className={`w-full justify-start text-sm h-9 px-4 py-2 rounded-md ${
                    selectedCategory === category 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <input id="full-time" type="checkbox" className="h-4 w-4 mr-2"/>
            <label htmlFor="full-time" className="text-sm">Full-time</label>
          </div>
          <div className="flex items-center">
            <input id="part-time" type="checkbox" className="h-4 w-4 mr-2"/>
            <label htmlFor="part-time" className="text-sm">Part-time</label>
          </div>
          <div className="flex items-center">
            <input id="contract" type="checkbox" className="h-4 w-4 mr-2"/>
            <label htmlFor="contract" className="text-sm">Contract</label>
          </div>
          <div className="flex items-center">
            <input id="project" type="checkbox" className="h-4 w-4 mr-2"/>
            <label htmlFor="project" className="text-sm">Project-based</label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <input id="budget-1" type="radio" name="budget" className="h-4 w-4 mr-2"/>
            <label htmlFor="budget-1" className="text-sm">Under $500</label>
          </div>
          <div className="flex items-center">
            <input id="budget-2" type="radio" name="budget" className="h-4 w-4 mr-2"/>
            <label htmlFor="budget-2" className="text-sm">$500 - $1,000</label>
          </div>
          <div className="flex items-center">
            <input id="budget-3" type="radio" name="budget" className="h-4 w-4 mr-2"/>
            <label htmlFor="budget-3" className="text-sm">$1,000 - $5,000</label>
          </div>
          <div className="flex items-center">
            <input id="budget-4" type="radio" name="budget" className="h-4 w-4 mr-2"/>
            <label htmlFor="budget-4" className="text-sm">$5,000+</label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobFilterSidebar;
