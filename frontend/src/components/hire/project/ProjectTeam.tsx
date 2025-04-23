import { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  MoreHorizontal, 
  Search,
  Filter,
  UserMinus,
  Shield,
  MessageSquare,
  Star,
  Clock,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Team member interface
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastActive?: string;
  joinedDate: string;
  permissions: 'admin' | 'editor' | 'viewer';
  tasks?: {
    assigned: number;
    completed: number;
  };
  isStarred?: boolean;
}

// Mock team members
const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Project Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop',
    isOnline: true,
    joinedDate: '2025-03-10T10:00:00Z',
    permissions: 'admin',
    tasks: {
      assigned: 12,
      completed: 8
    },
    isStarred: true
  },
  {
    id: 'user-2',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'Client',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop',
    isOnline: true,
    lastActive: '2025-04-22T14:30:00Z',
    joinedDate: '2025-03-10T10:00:00Z',
    permissions: 'admin'
  },
  {
    id: 'user-3',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'Designer',
    avatarUrl: '',
    isOnline: false,
    lastActive: '2025-04-21T16:45:00Z',
    joinedDate: '2025-03-15T14:30:00Z',
    permissions: 'editor',
    tasks: {
      assigned: 8,
      completed: 5
    }
  },
  {
    id: 'user-4',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Developer',
    avatarUrl: '',
    isOnline: false,
    lastActive: '2025-04-22T09:15:00Z',
    joinedDate: '2025-03-18T11:00:00Z',
    permissions: 'editor',
    tasks: {
      assigned: 10,
      completed: 7
    }
  },
  {
    id: 'user-5',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'Content Writer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
    isOnline: false,
    lastActive: '2025-04-20T15:30:00Z',
    joinedDate: '2025-04-01T09:00:00Z',
    permissions: 'viewer',
    tasks: {
      assigned: 5,
      completed: 3
    }
  }
];

// Available roles
const availableRoles = [
  'Project Manager',
  'Designer',
  'Developer',
  'Content Writer',
  'QA Tester',
  'Marketing Specialist',
  'Client'
];

interface ProjectTeamProps {
  projectId: string;
  isFreelancer?: boolean;
}

const ProjectTeam = ({ projectId, isFreelancer = false }: ProjectTeamProps) => {
  // State for team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: ''
  });
  
  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
      );
    }
    
    // Filter by role
    if (filterRole) {
      return member.role === filterRole;
    }
    
    return true;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format last active
  const formatLastActive = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  // Handle add member
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) return;
    
    // Create new team member
    const newTeamMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      joinedDate: new Date().toISOString(),
      permissions: 'editor',
      tasks: {
        assigned: 0,
        completed: 0
      }
    };
    
    // Add to team
    setTeamMembers(prev => [...prev, newTeamMember]);
    
    // Reset form
    setNewMember({
      name: '',
      email: '',
      role: ''
    });
    
    // Close dialog
    setShowAddMemberDialog(false);
  };
  
  // Handle remove member
  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };
  
  // Handle change permissions
  const handleChangePermissions = (memberId: string, permissions: 'admin' | 'editor' | 'viewer') => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, permissions } : member
      )
    );
  };
  
  // Handle star member
  const handleStarMember = (memberId: string) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, isStarred: !member.isStarred } : member
      )
    );
  };
  
  // Get permission badge variant
  const getPermissionBadgeVariant = (permissions: 'admin' | 'editor' | 'viewer') => {
    switch (permissions) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'editor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'viewer':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Team Members</h2>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAddMemberDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search team members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={filterRole}
            onValueChange={setFilterRole}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              {availableRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Team members */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" />
          <span className="text-lg">Loading team members...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No team members found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? 
              `No team members matching "${searchQuery}"` : 
              filterRole ? 
                `No team members with role "${filterRole}"` : 
                'Add team members to collaborate on this project'
            }
          </p>
          <Button onClick={() => setShowAddMemberDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMembers.map(member => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-10 w-10">
                      {member.avatarUrl ? (
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                      ) : (
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      )}
                      {member.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription className="text-xs">{member.role}</CardDescription>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = `mailto:${member.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Message ${member.name}`)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStarMember(member.id)}>
                        <Star className={`h-4 w-4 mr-2 ${member.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        {member.isStarred ? 'Unstar' : 'Star'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleChangePermissions(member.id, 'admin')}>
                        <Shield className={`h-4 w-4 mr-2 ${member.permissions === 'admin' ? 'text-red-500' : ''}`} />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangePermissions(member.id, 'editor')}>
                        <Shield className={`h-4 w-4 mr-2 ${member.permissions === 'editor' ? 'text-blue-500' : ''}`} />
                        Make Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangePermissions(member.id, 'viewer')}>
                        <Shield className={`h-4 w-4 mr-2 ${member.permissions === 'viewer' ? 'text-green-500' : ''}`} />
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="text-xs text-muted-foreground mb-2">
                  <div className="flex items-center mb-1">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {member.isOnline 
                        ? 'Online now' 
                        : `Last active: ${formatLastActive(member.lastActive)}`}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className={getPermissionBadgeVariant(member.permissions)}
                  >
                    {member.permissions.charAt(0).toUpperCase() + member.permissions.slice(1)}
                  </Badge>
                  
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDate(member.joinedDate)}
                  </span>
                </div>
                
                {member.tasks && (
                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span>Tasks</span>
                      <span>{member.tasks.completed}/{member.tasks.assigned}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ 
                          width: member.tasks.assigned > 0 
                            ? `${(member.tasks.completed / member.tasks.assigned) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-2">
                <div className="flex justify-between w-full">
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Message
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleStarMember(member.id)}
                        >
                          <Star className={`h-4 w-4 ${member.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{member.isStarred ? 'Remove from favorites' : 'Add to favorites'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 bg-muted p-3 text-xs font-medium text-muted-foreground">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Permissions</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Tasks</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {/* Table body */}
          <div className="divide-y">
            {filteredMembers.map(member => (
              <div 
                key={member.id} 
                className="grid grid-cols-12 gap-2 p-3 hover:bg-muted/50 items-center"
              >
                <div className="col-span-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {member.avatarUrl ? (
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                      ) : (
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      )}
                      {member.isOnline && (
                        <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </Avatar>
                    
                    <div className="min-w-0">
                      <p className="font-medium truncate" title={member.name}>
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={member.email}>
                        {member.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Badge variant="outline">{member.role}</Badge>
                </div>
                
                <div className="col-span-2">
                  <Badge 
                    variant="outline" 
                    className={getPermissionBadgeVariant(member.permissions)}
                  >
                    {member.permissions.charAt(0).toUpperCase() + member.permissions.slice(1)}
                  </Badge>
                </div>
                
                <div className="col-span-2 text-sm">
                  <div className="flex items-center">
                    {member.isOnline ? (
                      <>
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {formatLastActive(member.lastActive)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  {member.tasks ? (
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>{member.tasks.completed}/{member.tasks.assigned}</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ 
                            width: member.tasks.assigned > 0 
                              ? `${(member.tasks.completed / member.tasks.assigned) * 100}%` 
                              : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No tasks</span>
                  )}
                </div>
                
                <div className="col-span-1 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = `mailto:${member.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Message ${member.name}`)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStarMember(member.id)}>
                        <Star className={`h-4 w-4 mr-2 ${member.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        {member.isStarred ? 'Unstar' : 'Star'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleChangePermissions(member.id, 'admin')}>
                        <Shield className={`h-4 w-4 mr-2 ${member.permissions === 'admin' ? 'text-red-500' : ''}`} />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangePermissions(member.id, 'editor')}>
                        <Shield className={`h-4 w-4 mr-2 ${member.permissions === 'editor' ? 'text-blue-500' : ''}`} />
                        Make Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangePermissions(member.id, 'viewer')}>
                        <Shield className={`h-4 w-4 mr-2 ${member.permissions === 'viewer' ? 'text-green-500' : ''}`} />
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add member dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to collaborate on this project. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right text-sm font-medium">
                Role
              </label>
              <Select
                value={newMember.role}
                onValueChange={(value) => setNewMember({ ...newMember, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMember}
              disabled={!newMember.name || !newMember.email || !newMember.role}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTeam;
