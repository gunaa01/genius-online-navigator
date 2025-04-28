import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Briefcase,
  AlertTriangle,
  Loader2,
  InfoIcon
} from 'lucide-react';

import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import ProjectCard, { Project, ProjectStatus, ProjectPriority } from '@/components/hire/project/ProjectCard';
import ProjectFilters from '@/components/hire/project/ProjectFilters';

// Mock team members for filter
const mockTeamMembers = [
  { id: 'user-1', name: 'John Smith', role: 'Designer' },
  { id: 'user-2', name: 'Jane Doe', role: 'Developer' },
  { id: 'user-3', name: 'Michael Johnson', role: 'Project Manager' },
  { id: 'user-4', name: 'Sarah Williams', role: 'Content Writer' },
  { id: 'user-5', name: 'David Brown', role: 'Marketing Specialist' },
];

// Mock projects data
const mockProjects: Project[] = [
  {
    id: 'proj-001',
    title: 'E-commerce Website Redesign',
    description: 'Complete redesign of an e-commerce platform with improved UI/UX and responsive design',
    status: 'active',
    priority: 'high',
    progress: 65,
    startDate: '2025-03-15',
    endDate: '2025-05-30',
    budget: '$4,500',
    client: {
      id: 'client-001',
      name: 'Michael Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop'
    },
    freelancer: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    team: [
      { id: 'user-1', name: 'John Smith', avatarUrl: '', role: 'Designer' },
      { id: 'user-2', name: 'Jane Doe', avatarUrl: '', role: 'Developer' }
    ],
    totalMilestones: 5,
    completedMilestones: 3,
    unreadMessages: 2,
    contractId: 'contract-001',
    lastActivity: '2 hours ago',
    tags: ['web design', 'e-commerce', 'responsive']
  },
  {
    id: 'proj-002',
    title: 'Digital Marketing Campaign',
    description: 'Comprehensive digital marketing strategy and implementation for product launch',
    status: 'pending_start',
    priority: 'medium',
    progress: 0,
    startDate: '2025-04-30',
    endDate: '2025-06-15',
    budget: '$3,200',
    client: {
      id: 'client-002',
      name: 'Sarah Miller',
      avatarUrl: ''
    },
    freelancer: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    totalMilestones: 4,
    completedMilestones: 0,
    unreadMessages: 0,
    contractId: 'contract-002',
    lastActivity: '1 day ago',
    tags: ['marketing', 'digital', 'social media']
  },
  {
    id: 'proj-003',
    title: 'Mobile App Development',
    description: 'Develop a cross-platform mobile application with user authentication and payment processing',
    status: 'active',
    priority: 'high',
    progress: 35,
    startDate: '2025-03-01',
    endDate: '2025-07-15',
    budget: '$9,800',
    client: {
      id: 'client-003',
      name: 'David Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop'
    },
    freelancer: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    team: [
      { id: 'user-2', name: 'Jane Doe', avatarUrl: '', role: 'Developer' },
      { id: 'user-3', name: 'Michael Johnson', avatarUrl: '', role: 'Project Manager' },
      { id: 'user-5', name: 'David Brown', avatarUrl: '', role: 'Marketing Specialist' }
    ],
    totalMilestones: 8,
    completedMilestones: 3,
    unreadMessages: 5,
    contractId: 'contract-003',
    lastActivity: '4 hours ago',
    tags: ['mobile', 'app development', 'cross-platform']
  },
  {
    id: 'proj-004',
    title: 'Content Creation for Blog',
    description: 'Write and publish monthly blog posts focusing on industry trends and insights',
    status: 'on_hold',
    priority: 'low',
    progress: 20,
    startDate: '2025-02-15',
    endDate: '2025-05-15',
    budget: '$1,800',
    client: {
      id: 'client-004',
      name: 'Emily Brown',
      avatarUrl: ''
    },
    freelancer: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    totalMilestones: 3,
    completedMilestones: 1,
    unreadMessages: 0,
    contractId: 'contract-004',
    lastActivity: '1 week ago',
    tags: ['content writing', 'blog', 'marketing']
  },
  {
    id: 'proj-005',
    title: 'Brand Identity Design',
    description: 'Create a comprehensive brand identity including logo, color palette, typography, and brand guidelines',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    startDate: '2025-01-10',
    endDate: '2025-02-28',
    budget: '$2,500',
    client: {
      id: 'client-005',
      name: 'Robert Taylor',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop'
    },
    freelancer: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    team: [
      { id: 'user-1', name: 'John Smith', avatarUrl: '', role: 'Designer' },
    ],
    totalMilestones: 5,
    completedMilestones: 5,
    unreadMessages: 0,
    contractId: 'contract-005',
    lastActivity: '1 month ago',
    tags: ['branding', 'design', 'logo']
  },
  {
    id: 'proj-006',
    title: 'SEO Optimization',
    description: 'Improve search engine ranking and visibility through comprehensive SEO strategy',
    status: 'active',
    priority: 'medium',
    progress: 50,
    startDate: '2025-03-20',
    endDate: '2025-05-20',
    budget: '$2,200',
    client: {
      id: 'client-006',
      name: 'Jennifer Adams',
      avatarUrl: ''
    },
    freelancer: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    totalMilestones: 4,
    completedMilestones: 2,
    unreadMessages: 1,
    contractId: 'contract-006',
    lastActivity: '3 days ago',
    tags: ['seo', 'marketing', 'digital']
  }
];

interface ProjectFiltersState {
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

const ProjectsPage = () => {
  const navigate = useNavigate();
  
  // State for projects data and loading
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for view type, filters and sort
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProjectFiltersState>({});
  const [activeSort, setActiveSort] = useState<ProjectSortOption>({
    field: 'lastActivity',
    direction: 'desc',
    label: 'Last Updated'
  });
  
  // Default active tab
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch projects (mock data)
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      try {
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        setIsLoading(false);
      }
    }, 800);
  }, []);
  
  // Apply filters and sort
  useEffect(() => {
    if (projects.length === 0) return;
    
    let filtered = [...projects];
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(project => {
        switch (activeTab) {
          case 'active':
            return project.status === 'active';
          case 'pending':
            return project.status === 'pending_start';
          case 'completed':
            return project.status === 'completed';
          case 'on_hold':
            return project.status === 'on_hold';
          default:
            return true;
        }
      });
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(project => 
        filters.status?.includes(project.status)
      );
    }
    
    // Filter by priority
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(project => 
        filters.priority?.includes(project.priority)
      );
    }
    
    // Filter by budget range
    if (filters.budgetRange) {
      filtered = filtered.filter(project => {
        const budget = parseInt(project.budget.replace(/\D/g, ''));
        const min = filters.budgetRange?.min || 0;
        const max = filters.budgetRange?.max || Infinity;
        return budget >= min && budget <= max;
      });
    }
    
    // Filter by team members
    if (filters.team && filters.team.length > 0) {
      filtered = filtered.filter(project => 
        project.team?.some(member => 
          filters.team?.includes(member.id)
        )
      );
    }
    
    // Sort results
    filtered.sort((a, b) => {
      const { field, direction } = activeSort;
      
      // Handle different field types
      if (field === 'title') {
        return direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      
      if (field === 'startDate' || field === 'endDate') {
        const dateA = new Date(a[field]).getTime();
        const dateB = new Date(b[field]).getTime();
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (field === 'budget') {
        const budgetA = parseInt(a.budget.replace(/\D/g, ''));
        const budgetB = parseInt(b.budget.replace(/\D/g, ''));
        return direction === 'asc' ? budgetA - budgetB : budgetB - budgetA;
      }
      
      if (field === 'progress') {
        return direction === 'asc'
          ? a.progress - b.progress
          : b.progress - a.progress;
      }
      
      if (field === 'priority') {
        // Convert priority to numeric value for sorting
        const priorityValues = { high: 3, medium: 2, low: 1 };
        const priorityA = priorityValues[a.priority];
        const priorityB = priorityValues[b.priority];
        return direction === 'asc'
          ? priorityA - priorityB
          : priorityB - priorityA;
      }
      
      // Default sort by lastActivity (using mock data, so just use the array order)
      const indexA = mockProjects.findIndex(p => p.id === a.id);
      const indexB = mockProjects.findIndex(p => p.id === b.id);
      return direction === 'asc' ? indexA - indexB : indexB - indexA;
    });
    
    setFilteredProjects(filtered);
  }, [projects, filters, activeSort, activeTab]);
  
  // Handle project actions
  const handleProjectAction = (action: string, projectId: string) => {
    switch (action) {
      case 'view':
        navigate(`/hire/projects/${projectId}`);
        break;
      case 'message':
        navigate(`/hire/messages?project=${projectId}`);
        break;
      case 'contract':
        navigate(`/hire/contracts/${projects.find(p => p.id === projectId)?.contractId}`);
        break;
      case 'hold':
        // Mock API call to update project status
        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, status: 'on_hold' as ProjectStatus } : p
        ));
        break;
      case 'resume':
        // Mock API call to update project status
        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, status: 'active' as ProjectStatus } : p
        ));
        break;
      case 'add_team':
        // This would navigate to team management in a real app
        alert('Navigate to team management (mock)');
        break;
      default:
        console.log(`Action ${action} not implemented for project ${projectId}`);
    }
  };
  
  // Count projects by status
  const countProjectsByStatus = (status: ProjectStatus | 'all'): number => {
    if (status === 'all') return projects.length;
    return projects.filter(p => p.status === status).length;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Projects | Genius Online Navigator</title>
        <meta name="description" content="Manage your projects and contracts" />
      </Helmet>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your active and completed projects
          </p>
        </div>
        
        <Button asChild>
          <Link to="/hire/new-project">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="relative">
            All
            <span className="ml-1 text-xs bg-muted text-muted-foreground rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
              {countProjectsByStatus('all')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="active" className="relative">
            Active
            <span className="ml-1 text-xs bg-muted text-muted-foreground rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
              {countProjectsByStatus('active')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            <span className="ml-1 text-xs bg-muted text-muted-foreground rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
              {countProjectsByStatus('pending_start')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            <span className="ml-1 text-xs bg-muted text-muted-foreground rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
              {countProjectsByStatus('completed')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="on_hold" className="relative">
            On Hold
            <span className="ml-1 text-xs bg-muted text-muted-foreground rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
              {countProjectsByStatus('on_hold')}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ProjectFilters 
            onFilterChange={setFilters}
            onSortChange={setActiveSort}
            onViewChange={setViewType}
            viewType={viewType}
            teamMembers={mockTeamMembers}
            initialFilters={filters}
            initialSort={activeSort}
          />
          
          {renderProjects()}
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <ProjectFilters 
            onFilterChange={setFilters}
            onSortChange={setActiveSort}
            onViewChange={setViewType}
            viewType={viewType}
            teamMembers={mockTeamMembers}
            initialFilters={filters}
            initialSort={activeSort}
          />
          
          {renderProjects()}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <ProjectFilters 
            onFilterChange={setFilters}
            onSortChange={setActiveSort}
            onViewChange={setViewType}
            viewType={viewType}
            teamMembers={mockTeamMembers}
            initialFilters={filters}
            initialSort={activeSort}
          />
          
          {renderProjects()}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <ProjectFilters 
            onFilterChange={setFilters}
            onSortChange={setActiveSort}
            onViewChange={setViewType}
            viewType={viewType}
            teamMembers={mockTeamMembers}
            initialFilters={filters}
            initialSort={activeSort}
          />
          
          {renderProjects()}
        </TabsContent>
        
        <TabsContent value="on_hold" className="mt-0">
          <ProjectFilters 
            onFilterChange={setFilters}
            onSortChange={setActiveSort}
            onViewChange={setViewType}
            viewType={viewType}
            teamMembers={mockTeamMembers}
            initialFilters={filters}
            initialSort={activeSort}
          />
          
          {renderProjects()}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Helper function to render the projects based on loading state and view type
  function renderProjects() {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading projects...</span>
        </div>
      );
    }
    
    if (filteredProjects.length === 0) {
      return (
        <Card className="mt-6 text-center">
          <CardContent className="pt-10 pb-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {activeTab !== 'all' 
                ? `You don't have any ${activeTab === 'on_hold' ? 'on hold' : activeTab} projects.`
                : 'No projects match your current filters.'}
            </p>
            <Button asChild>
              <Link to="/hire/new-project">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="mt-6">
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isFreelancer={true} // This would be dynamic in a real app
                viewType="grid"
                onAction={handleProjectAction}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isFreelancer={true} // This would be dynamic in a real app
                viewType="list"
                onAction={handleProjectAction}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
};

export default ProjectsPage;
