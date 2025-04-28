import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  BarChart, 
  Filter, 
  Search, 
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Briefcase,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Download,
  FileText
} from 'lucide-react';

import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Types
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  skills: string[];
  availability: number;
  utilization: number;
  projects: string[];
  status: 'available' | 'partially' | 'unavailable';
  workload: 'low' | 'medium' | 'high' | 'overallocated';
}

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planning' | 'completed' | 'onHold';
  priority: 'low' | 'medium' | 'high';
  resourceCount: number;
  progress: number;
}

interface ResourceAllocation {
  id: string;
  memberId: string;
  projectId: string;
  allocation: number;
  startDate: string;
  endDate: string;
  role: string;
}

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Alex Johnson',
    role: 'Senior Developer',
    department: 'Engineering',
    avatar: '/avatars/alex.jpg',
    skills: ['React', 'TypeScript', 'Node.js'],
    availability: 20,
    utilization: 80,
    projects: ['p1', 'p3'],
    status: 'partially',
    workload: 'high'
  },
  {
    id: 'tm2',
    name: 'Sarah Williams',
    role: 'UX Designer',
    department: 'Design',
    avatar: '/avatars/sarah.jpg',
    skills: ['UI Design', 'User Research', 'Figma'],
    availability: 40,
    utilization: 60,
    projects: ['p1', 'p2'],
    status: 'partially',
    workload: 'medium'
  },
  {
    id: 'tm3',
    name: 'Michael Chen',
    role: 'Project Manager',
    department: 'Management',
    avatar: '/avatars/michael.jpg',
    skills: ['Agile', 'Scrum', 'Risk Management'],
    availability: 10,
    utilization: 90,
    projects: ['p1', 'p2', 'p3'],
    status: 'partially',
    workload: 'high'
  },
  {
    id: 'tm4',
    name: 'Emily Rodriguez',
    role: 'Content Strategist',
    department: 'Marketing',
    avatar: '/avatars/emily.jpg',
    skills: ['Content Creation', 'SEO', 'Social Media'],
    availability: 0,
    utilization: 100,
    projects: ['p2', 'p4'],
    status: 'unavailable',
    workload: 'overallocated'
  },
  {
    id: 'tm5',
    name: 'David Kim',
    role: 'Backend Developer',
    department: 'Engineering',
    avatar: '/avatars/david.jpg',
    skills: ['Python', 'Django', 'AWS'],
    availability: 60,
    utilization: 40,
    projects: ['p3'],
    status: 'available',
    workload: 'low'
  },
  {
    id: 'tm6',
    name: 'Lisa Thompson',
    role: 'QA Engineer',
    department: 'Engineering',
    avatar: '/avatars/lisa.jpg',
    skills: ['Test Automation', 'Manual Testing', 'QA'],
    availability: 30,
    utilization: 70,
    projects: ['p1', 'p4'],
    status: 'partially',
    workload: 'medium'
  }
];

const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    startDate: '2025-03-01',
    endDate: '2025-06-30',
    status: 'active',
    priority: 'high',
    resourceCount: 4,
    progress: 45
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    startDate: '2025-02-15',
    endDate: '2025-08-15',
    status: 'active',
    priority: 'high',
    resourceCount: 3,
    progress: 30
  },
  {
    id: 'p3',
    name: 'Data Migration',
    startDate: '2025-04-01',
    endDate: '2025-05-15',
    status: 'planning',
    priority: 'medium',
    resourceCount: 3,
    progress: 10
  },
  {
    id: 'p4',
    name: 'Marketing Campaign',
    startDate: '2025-03-15',
    endDate: '2025-04-30',
    status: 'active',
    priority: 'medium',
    resourceCount: 2,
    progress: 65
  }
];

const mockAllocations: ResourceAllocation[] = [
  {
    id: 'a1',
    memberId: 'tm1',
    projectId: 'p1',
    allocation: 50,
    startDate: '2025-03-01',
    endDate: '2025-05-30',
    role: 'Lead Developer'
  },
  {
    id: 'a2',
    memberId: 'tm1',
    projectId: 'p3',
    allocation: 30,
    startDate: '2025-04-01',
    endDate: '2025-05-15',
    role: 'Developer'
  },
  {
    id: 'a3',
    memberId: 'tm2',
    projectId: 'p1',
    allocation: 40,
    startDate: '2025-03-01',
    endDate: '2025-06-30',
    role: 'UX Designer'
  },
  {
    id: 'a4',
    memberId: 'tm2',
    projectId: 'p2',
    allocation: 20,
    startDate: '2025-02-15',
    endDate: '2025-08-15',
    role: 'UI Designer'
  }
  // Additional allocations would be defined here
];

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'partially':
      return 'bg-yellow-500';
    case 'unavailable':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getWorkloadColor = (workload: string): string => {
  switch (workload) {
    case 'low':
      return 'text-green-500';
    case 'medium':
      return 'text-blue-500';
    case 'high':
      return 'text-yellow-500';
    case 'overallocated':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const ResourceManagement = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  
  // Filter team members
  const filteredTeamMembers = mockTeamMembers.filter(member => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query) ||
        member.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    // Filter by department
    if (departmentFilter !== 'all' && member.department !== departmentFilter) {
      return false;
    }
    
    // Filter by availability
    if (availabilityFilter !== 'all' && member.status !== availabilityFilter) {
      return false;
    }
    
    // Filter by project
    if (projectFilter !== 'all' && !member.projects.includes(projectFilter)) {
      return false;
    }
    
    return true;
  });
  
  // Get project by ID
  const getProjectById = (id: string): Project | undefined => {
    return mockProjects.find(project => project.id === id);
  };
  
  // Get member by ID
  const getMemberById = (id: string): TeamMember | undefined => {
    return mockTeamMembers.find(member => member.id === id);
  };
  
  // Get allocations for a member
  const getAllocationsForMember = (memberId: string): ResourceAllocation[] => {
    return mockAllocations.filter(allocation => allocation.memberId === memberId);
  };
  
  // Get allocations for a project
  const getAllocationsForProject = (projectId: string): ResourceAllocation[] => {
    return mockAllocations.filter(allocation => allocation.projectId === projectId);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Resource Management | Genius Online Navigator</title>
        <meta name="description" content="Manage team resources, track availability, and optimize resource allocation across projects." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resource Management</h1>
          <p className="text-muted-foreground">Manage team resources, track availability, and optimize resource allocation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Resource Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Team Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">76%</div>
              <BarChart className="h-5 w-5 text-muted-foreground" />
            </div>
            <Progress value={76} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Average team utilization across all projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resource Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">4/6</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs">Available (1)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-xs">Partial (4)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs">Unavailable (1)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Current team availability status</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Capacity Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">+2</div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center text-xs">
                <span className="text-green-500 mr-1">+1</span>
                <span>May 15 - Project completion</span>
              </div>
              <div className="flex items-center text-xs">
                <span className="text-green-500 mr-1">+1</span>
                <span>May 30 - New hire starting</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Projected resource changes in next 30 days</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>
        
        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search team members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="partially">Partially Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={projectFilter}
                onValueChange={setProjectFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <span>Team Member</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead className="text-center">Availability</TableHead>
                    <TableHead className="text-center">Utilization</TableHead>
                    <TableHead className="text-center">Workload</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeamMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{member.availability}%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium mb-1">{member.utilization}%</span>
                          <Progress value={member.utilization} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                          {member.workload.charAt(0).toUpperCase() + member.workload.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>View Allocations</DropdownMenuItem>
                            <DropdownMenuItem>Edit Skills</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Manage Availability</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <span>Project</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                    <TableHead className="text-center">Resources</TableHead>
                    <TableHead className="text-center">Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProjects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={project.status === 'active' ? 'default' : 'outline'}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className={
                            project.priority === 'high' 
                              ? 'text-red-500 border-red-500' 
                              : project.priority === 'medium'
                                ? 'text-yellow-500 border-yellow-500'
                                : 'text-green-500 border-green-500'
                          }
                        >
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{project.resourceCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium mb-1">{project.progress}%</span>
                          <Progress value={project.progress} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Project</DropdownMenuItem>
                            <DropdownMenuItem>View Resources</DropdownMenuItem>
                            <DropdownMenuItem>Manage Allocations</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Resource Forecast</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Allocations Tab */}
        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocations</CardTitle>
              <CardDescription>View and manage resource allocations across projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Detailed allocation matrix will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceManagement;
