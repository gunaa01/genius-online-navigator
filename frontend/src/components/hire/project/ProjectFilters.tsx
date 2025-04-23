import { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  Filter, 
  ChevronDown,
  Grid2X2,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ProjectStatus, ProjectPriority } from './ProjectCard';

interface ProjectFilter {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  startDateRange?: {
    from?: Date;
    to?: Date;
  };
  endDateRange?: {
    from?: Date;
    to?: Date;
  };
  budgetRange?: {
    min?: number;
    max?: number;
  };
  team?: string[];
  search?: string;
}

interface ProjectSortOption {
  field: 'title' | 'startDate' | 'endDate' | 'budget' | 'progress' | 'priority' | 'lastActivity';
  direction: 'asc' | 'desc';
  label: string;
}

interface ProjectFiltersProps {
  onFilterChange: (filters: ProjectFilter) => void;
  onSortChange: (sort: ProjectSortOption) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  viewType: 'grid' | 'list';
  teamMembers?: { id: string; name: string; role: string }[];
  initialFilters?: ProjectFilter;
  initialSort?: ProjectSortOption;
}

const ProjectFilters = ({
  onFilterChange,
  onSortChange,
  onViewChange,
  viewType,
  teamMembers = [],
  initialFilters = {},
  initialSort = { field: 'lastActivity', direction: 'desc', label: 'Last Updated' }
}: ProjectFiltersProps) => {
  // State for filters
  const [filters, setFilters] = useState<ProjectFilter>(initialFilters);
  const [activeSort, setActiveSort] = useState<ProjectSortOption>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Sort options
  const sortOptions: ProjectSortOption[] = [
    { field: 'lastActivity', direction: 'desc', label: 'Last Updated' },
    { field: 'title', direction: 'asc', label: 'Project Name (A-Z)' },
    { field: 'title', direction: 'desc', label: 'Project Name (Z-A)' },
    { field: 'startDate', direction: 'desc', label: 'Start Date (Recent)' },
    { field: 'startDate', direction: 'asc', label: 'Start Date (Oldest)' },
    { field: 'endDate', direction: 'asc', label: 'Due Date (Soonest)' },
    { field: 'endDate', direction: 'desc', label: 'Due Date (Latest)' },
    { field: 'budget', direction: 'desc', label: 'Budget (High to Low)' },
    { field: 'budget', direction: 'asc', label: 'Budget (Low to High)' },
    { field: 'progress', direction: 'desc', label: 'Progress (Most Complete)' },
    { field: 'progress', direction: 'asc', label: 'Progress (Least Complete)' },
    { field: 'priority', direction: 'desc', label: 'Priority (High to Low)' },
  ];
  
  // Status options
  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'pending_start', label: 'Pending Start' },
  ];
  
  // Priority options
  const priorityOptions: { value: ProjectPriority; label: string }[] = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];
  
  // Budget range
  const [budgetRange, setBudgetRange] = useState<[number, number]>([
    filters.budgetRange?.min || 0,
    filters.budgetRange?.max || 10000
  ]);
  
  // Count active filters
  const countActiveFilters = (): number => {
    let count = 0;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.priority && filters.priority.length > 0) count++;
    if (filters.startDateRange?.from || filters.startDateRange?.to) count++;
    if (filters.endDateRange?.from || filters.endDateRange?.to) count++;
    if (filters.budgetRange?.min || filters.budgetRange?.max) count++;
    if (filters.team && filters.team.length > 0) count++;
    if (filters.search && filters.search.trim().length > 0) count++;
    return count;
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString()}`;
  };
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce search for performance
    const debounceSearch = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
    }, 300);
    
    return () => clearTimeout(debounceSearch);
  };
  
  // Handle status filter change
  const handleStatusChange = (value: ProjectStatus, checked: boolean) => {
    setFilters(prev => {
      const currentStatus = prev.status || [];
      
      if (checked) {
        return { ...prev, status: [...currentStatus, value] };
      } else {
        return { ...prev, status: currentStatus.filter(s => s !== value) };
      }
    });
  };
  
  // Handle priority filter change
  const handlePriorityChange = (value: ProjectPriority, checked: boolean) => {
    setFilters(prev => {
      const currentPriorities = prev.priority || [];
      
      if (checked) {
        return { ...prev, priority: [...currentPriorities, value] };
      } else {
        return { ...prev, priority: currentPriorities.filter(p => p !== value) };
      }
    });
  };
  
  // Handle team member filter change
  const handleTeamMemberChange = (memberId: string, checked: boolean) => {
    setFilters(prev => {
      const currentTeam = prev.team || [];
      
      if (checked) {
        return { ...prev, team: [...currentTeam, memberId] };
      } else {
        return { ...prev, team: currentTeam.filter(id => id !== memberId) };
      }
    });
  };
  
  // Handle budget range change
  const handleBudgetRangeChange = (value: [number, number]) => {
    setBudgetRange(value);
    setFilters(prev => ({
      ...prev,
      budgetRange: {
        min: value[0],
        max: value[1]
      }
    }));
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    setBudgetRange([0, 10000]);
  };
  
  // Remove a specific filter
  const removeFilter = (filterType: keyof ProjectFilter, value?: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'search') {
        delete newFilters.search;
        setSearchQuery('');
      } 
      else if (filterType === 'status' && value) {
        newFilters.status = prev.status?.filter(s => s !== value);
        if (newFilters.status?.length === 0) delete newFilters.status;
      } 
      else if (filterType === 'priority' && value) {
        newFilters.priority = prev.priority?.filter(p => p !== value);
        if (newFilters.priority?.length === 0) delete newFilters.priority;
      } 
      else if (filterType === 'team' && value) {
        newFilters.team = prev.team?.filter(t => t !== value);
        if (newFilters.team?.length === 0) delete newFilters.team;
      } 
      else if (filterType === 'budgetRange') {
        delete newFilters.budgetRange;
        setBudgetRange([0, 10000]);
      } 
      else if (filterType === 'startDateRange') {
        delete newFilters.startDateRange;
      } 
      else if (filterType === 'endDateRange') {
        delete newFilters.endDateRange;
      }
      
      return newFilters;
    });
  };
  
  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  // Handle sort change
  const handleSortChange = (option: ProjectSortOption) => {
    setActiveSort(option);
    onSortChange(option);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search bar */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects"
            className="pl-9 w-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          {/* View toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {viewType === 'grid' ? (
                  <Grid2X2 className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>View</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={viewType} onValueChange={value => onViewChange(value as 'grid' | 'list')}>
                <DropdownMenuRadioItem value="grid">
                  <Grid2X2 className="h-4 w-4 mr-2" />
                  Grid
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {activeSort.direction === 'asc' ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                Sort
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={`${option.field}-${option.direction}`}
                  checked={activeSort.field === option.field && activeSort.direction === option.direction}
                  onCheckedChange={() => handleSortChange(option)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Filter popover */}
          <Popover open={showFilterMenu} onOpenChange={setShowFilterMenu}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {countActiveFilters() > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1 rounded-full">
                    {countActiveFilters()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                </div>
                
                <Separator />
                
                {/* Status filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((status) => (
                      <div className="flex items-center space-x-2" key={status.value}>
                        <Checkbox 
                          id={`status-${status.value}`} 
                          checked={filters.status?.includes(status.value) || false}
                          onCheckedChange={(checked) => handleStatusChange(status.value, checked as boolean)}
                        />
                        <Label htmlFor={`status-${status.value}`} className="cursor-pointer">
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Priority filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Priority</h4>
                  <div className="flex flex-wrap gap-2">
                    {priorityOptions.map((priority) => (
                      <div className="flex items-center space-x-2" key={priority.value}>
                        <Checkbox 
                          id={`priority-${priority.value}`} 
                          checked={filters.priority?.includes(priority.value) || false}
                          onCheckedChange={(checked) => handlePriorityChange(priority.value, checked as boolean)}
                        />
                        <Label htmlFor={`priority-${priority.value}`} className="cursor-pointer">
                          {priority.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Budget range filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Budget Range</h4>
                    <div className="text-sm">
                      {formatCurrency(budgetRange[0])} - {formatCurrency(budgetRange[1])}
                    </div>
                  </div>
                  
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={budgetRange}
                    onValueChange={handleBudgetRangeChange}
                    className="my-6"
                  />
                </div>
                
                {/* Team members filter (if provided) */}
                {teamMembers.length > 0 && (
                  <>
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Team Members</h4>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {teamMembers.map((member) => (
                          <div className="flex items-center space-x-2" key={member.id}>
                            <Checkbox 
                              id={`team-${member.id}`} 
                              checked={filters.team?.includes(member.id) || false}
                              onCheckedChange={(checked) => handleTeamMemberChange(member.id, checked as boolean)}
                            />
                            <Label htmlFor={`team-${member.id}`} className="cursor-pointer flex-grow">
                              <span>{member.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({member.role})
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <div className="pt-2">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowFilterMenu(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Active filters */}
      {countActiveFilters() > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>Search: {filters.search}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeFilter('search')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.status?.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              <span>Status: {statusOptions.find(s => s.value === status)?.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeFilter('status', status)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {filters.priority?.map(priority => (
            <Badge key={priority} variant="secondary" className="flex items-center gap-1">
              <span>Priority: {priorityOptions.find(p => p.value === priority)?.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeFilter('priority', priority)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {filters.budgetRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>
                Budget: {formatCurrency(filters.budgetRange.min || 0)} - 
                {formatCurrency(filters.budgetRange.max || 10000)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeFilter('budgetRange')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.team?.map(teamId => {
            const member = teamMembers.find(m => m.id === teamId);
            return member ? (
              <Badge key={teamId} variant="secondary" className="flex items-center gap-1">
                <span>Team: {member.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter('team', teamId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;
