import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { MessageProvider, useMessages } from "@/contexts/MessageContext";
import EnhancedMessageThread from "@/components/EnhancedMessageThread";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Search, Mail, Trash2, Settings, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import StyledUserProfileCard from "@/components/StyledUserProfileCard";
import { DeleteTeamDialog } from "@/components/DeleteTeamDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useHotkeys } from 'react-hotkeys-hook';
import PendingInvites from '@/components/PendingInvites';

type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';
type TeamStatus = 'active' | 'inactive' | 'pending';

interface TeamMember {
  id: number | string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  lastActive: string;
  avatar?: string;
}

interface Invite {
  id: string;
  email: string;
  role: TeamRole;
  status: 'pending' | 'accepted' | 'expired';
  invitedAt: string;
  expiresAt: string;
}

const roleHierarchy: Record<TeamRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1
};

const rolePermissions: Record<TeamRole, string[]> = {
  owner: ['manage_team', 'manage_members', 'manage_roles', 'view_analytics'],
  admin: ['manage_members', 'view_analytics'],
  member: ['create_content', 'edit_own_content'],
  viewer: ['view_content']
};

const TeamChatTab = () => {
  const { messages, sendMessage, markAsRead, loading } = useMessages();
  const { user } = useAuth();

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleMessageRead = (messageId: string) => {
    markAsRead(messageId);
  };

  return (
    <div className="h-[calc(100vh-200px)]">
      <EnhancedMessageThread
        messages={messages}
        onSend={handleSendMessage}
        loading={loading}
        currentUserId={user?.id || ''}
        channelId="team"
        onMessageRead={handleMessageRead}
      />
    </div>
  );
};

const TeamManagement = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingRole, setIsSavingRole] = useState<number | string | null>(null);
  const [teamName, setTeamName] = useState('My Team');
  
  // Add keyboard shortcut for inviting members (Ctrl+Shift+I or Cmd+Shift+I)
  useHotkeys('ctrl+shift+i, command+shift+i', (e) => {
    e.preventDefault();
    if (canPerformAction('invite', user?.role as TeamRole)) {
      setActiveTab('invites');
      setShowInviteForm(true);
    }
  }, [user?.role]);

  // Add keyboard shortcut for searching (Ctrl+K or Cmd+K)
  useHotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('member-search');
    searchInput?.focus();
  }, []);
  const [teamDescription, setTeamDescription] = useState('Our awesome team working together');
  const [activeTab, setActiveTab] = useState('members');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      if (!localEmail || !localRole) return;
      
      const newInvite: Invite = {
        id: Date.now().toString(),
        email: localEmail,
        role: localRole,
        status: 'pending',
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      onInvitesChange([...invites, newInvite]);
      setLocalEmail('');
      setLocalRole('member');
      onShowFormChange(false);
      
      toast({
        title: "Invite sent",
        description: `An invitation has been sent to ${localEmail}.`,
      });
    };
    
    // Implementation replaced by shared PendingInvites component.
// See usage in TeamManagement component below.

  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [allowInvites, setAllowInvites] = useState(true);
  const [allowProjectCreation, setAllowProjectCreation] = useState(true);

  // ...rest of TeamManagement component logic...

  // Render shared PendingInvites component where pending invites should appear
  // (You may want to place this in a tab or section as appropriate)
  // Example usage:
  // <PendingInvites
  //   invites={pendingInvites}
  //   onInvitesChange={setPendingInvites}
  //   showForm={showInviteForm}
  //   onShowFormChange={setShowInviteForm}
  // />

  const canPerformAction = (action: string, userRole?: TeamRole, targetRole?: TeamRole, targetUserId?: string | number): boolean => {
    if (!userRole) return false;
    
    // Owner can do everything
    if (userRole === 'owner') return true;
    
    // Check action-specific permissions
    switch (action) {
      case 'invite':
        return ['admin', 'member'].includes(userRole);
      case 'edit_role':
        return (
          ['admin'].includes(userRole) && 
          targetRole && 
          roleHierarchy[userRole] > roleHierarchy[targetRole] &&
          targetUserId !== user?.id
        );
      case 'remove':
        return (
          ['admin'].includes(userRole) && 
          targetRole && 
          roleHierarchy[userRole] > roleHierarchy[targetRole] &&
          targetUserId !== user?.id
        );
      case 'update_settings':
      case 'delete_team':
        return userRole === 'admin';
      default:
        return false;
    }
  };
  
  // Backward compatibility
  const canEditRole = (currentUserRole: TeamRole, targetRole: TeamRole, targetUserId: string | number): boolean => {
    return canPerformAction('edit_role', currentUserRole, targetRole, targetUserId);
  };

  const handleEditMember = (id: string | number) => {
    const member = teamMembers.find(m => m.id === id);
    if (member) {
      toast({
        title: "Edit Member",
        description: `Editing ${member.name}'s profile`
      });
    }
  };

  const handleRemoveMember = async (memberId: number | string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filteredMembers = React.useMemo(() => {
        if (isLoading) return [];
        if (!searchQuery) return teamMembers;
        const query = searchQuery.toLowerCase();
        return teamMembers.filter(member => 
          member.name.toLowerCase().includes(query) || 
          member.email.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query)
        );
      }, [teamMembers, searchQuery, isLoading]);

      useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          // Add any additional keyboard shortcuts here
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, []);

      const member = filteredMembers.find(m => m.id === memberId);
      if (member) {
        setTeamMembers(filteredMembers.filter(m => m.id !== memberId));
        toast({
          title: "Member removed",
          description: `${member.name} has been removed from the team.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMessageMember = (id: string | number) => {
    const member = teamMembers.find(m => m.id === id);
    if (member) {
      toast({
        title: "Message Member",
        description: `Messaging ${member.name}...`
      });
    }
  };

  useEffect(() => {
    const demoTeamMembers: TeamMember[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "owner",
        status: "active",
        lastActive: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "admin",
        status: "active",
        lastActive: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "member",
        status: "pending",
        lastActive: new Date(Date.now() - 86400000).toISOString(),
      }
    ];

    const demoInvites: Invite[] = [
      {
        id: "1",
        email: "alice@example.com",
        role: "member",
        status: "pending",
        invitedAt: new Date(Date.now() - 3600000).toISOString(),
        expiresAt: new Date(Date.now() + 6 * 24 * 3600000).toISOString()
      },
      {
        id: "2",
        email: "charlie@example.com",
        role: "developer",
        status: "pending",
      'owner': ['Manage team', 'Invite members', 'Remove members', 'Edit projects', 'View billing', 'Delete team'],
      'admin': ['Manage team', 'Invite members', 'Remove members', 'Edit projects', 'View billing'],
      'member': ['View projects', 'Create content', 'Edit own content'],
      'viewer': ['View projects']
    };
    return permissions[role] || [];
  };

  const handleRoleChange = async (memberId: number | string, newRole: string) => {
    try {
      setIsSavingRole(memberId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTeamMembers(teamMembers.map(member => 
        member.id === memberId ? { ...member, role: newRole as TeamRole } : member
      ));
      
      const member = teamMembers.find(m => m.id === memberId);
      if (member) {
        toast({
          title: "Role updated",
          description: `${member.name}'s role has been updated to ${newRole}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingRole(null);
    }
  };

  const handleStatusChange = async (memberId: number | string, newStatus: string) => {
    try {
      setIsSavingRole(memberId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTeamMembers(teamMembers.map(member => 
        member.id === memberId ? { ...member, status: newStatus as 'active' | 'inactive' | 'pending' } : member
      ));
      
      const member = teamMembers.find(m => m.id === memberId);
      if (member) {
        toast({
          title: "Status updated",
          description: `${member.name}'s status has been updated to ${newStatus}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingRole(null);
    }
  };

  const handleInvitesChange = (newInvites: Invite[]) => {
    setPendingInvites(newInvites);
  };

  const handleDeleteTeam = () => {
    // In a real app, this would call an API to delete the team
    toast({
      title: "Team deleted",
      description: `The team "${teamName}" has been deleted.`,
      variant: "destructive"
    });
    // Reset form
    setTeamName('');
    setTeamDescription('');
    setShowDeleteDialog(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Team Management</h1>
          <Button 
            onClick={() => {
              setActiveTab('invites');
              setShowInviteForm(true);
            }}
            disabled={!canPerformAction('invite', user?.role as TeamRole)}
            title={!canPerformAction('invite', user?.role as TeamRole) ? 'You do not have permission to invite members' : ''}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Team Member <span className="ml-2 text-xs opacity-60">(⌘⇧I)</span>
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="members">
              <Users className="w-4 h-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="chat">
              <Chat className="w-4 h-4 mr-2" />
              Team Chat
            </TabsTrigger>
            <TabsTrigger value="invites">
              <Mail className="w-4 h-4 mr-2" />
              Invites
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Team Members</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="member-search"
                      type="search"
                      placeholder="Search team members..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search team members"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredMembers.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMembers.map((member) => (
                      <StyledUserProfileCard
                        key={member.id}
                        id={member.id}
                        name={member.name}
                        email={member.email}
                        role={member.role}
                        status={member.status}
                        lastActive={member.lastActive}
                        onEdit={handleEditMember}
                        onRemove={handleRemoveMember}
                        onMessage={handleMessageMember}
                        onRoleChange={handleRoleChange}
                        onStatusChange={handleStatusChange}
                        canEditRole={member.role !== 'owner' && user?.role === 'admin'}
                        isSavingRole={isSavingRole === member.id}
                        className="h-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No matching team members found' : 'No team members found'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invites">
            <PendingInvites 
              invites={pendingInvites}
              onInvitesChange={handleInvitesChange}
              showForm={showInviteForm}
              onShowFormChange={setShowInviteForm}
            />
          </TabsContent>
          
          <TabsContent value="chat" className="h-[calc(100vh-300px)]">
        <TeamChatTab />
      </TabsContent>
      <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Team Settings</CardTitle>
                <CardDescription>
                  Manage your team's settings and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Team Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Team Name
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Team Name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="max-w-md"
                        />
                        <Button 
                          onClick={() => {
                            toast({
                              title: "Team updated",
                              description: `Team name has been updated to "${teamName}".`,
                            });
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Team Description
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="A brief description of your team"
                          value={teamDescription}
                          onChange={(e) => setTeamDescription(e.target.value)}
                          className="max-w-md"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Description updated",
                              description: "Team description has been updated.",
                            });
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Permissions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Allow Member Invites</h4>
                        <p className="text-sm text-muted-foreground">
                          Let team members invite new users
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Allow Project Creation</h4>
                        <p className="text-sm text-muted-foreground">
                          Let team members create new projects
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium text-destructive mb-4">Danger Zone</h3>
                    <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                      <div>
                        <h4 className="font-medium">Delete Team</h4>
                        <p className="text-sm text-muted-foreground">
                          Once you delete a team, there is no going back. Please be certain.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Team
                      </Button>
                    </div>
                    <DeleteTeamDialog
                      open={showDeleteDialog}
                      onOpenChange={setShowDeleteDialog}
                      onConfirm={handleDeleteTeam}
                      teamName={teamName}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const TeamManagementWithProvider = () => (
  <MessageProvider>
    <TeamManagement />
  </MessageProvider>
);

export default TeamManagementWithProvider;
