import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  UserMinus, 
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Key
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Type definitions for team members and invites
interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  status: string;
  lastActive: string | null;
}
interface PendingInvite {
  id: number;
  email: string;
  role: string;
  sentAt: string;
  expires: string;
}

const TeamManagement = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('marketing');
  const [inviteMessage, setInviteMessage] = useState('');
  const { user } = useAuth();
  
  // Demo team members data - would be replaced with actual data from Supabase
  const teamMembersDemo: TeamMember[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "admin",
      avatar: null,
      status: "active",
      lastActive: "2025-04-16T10:30:00",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "marketing",
      avatar: null,
      status: "active",
      lastActive: "2025-04-15T16:45:00",
    },
    {
      id: 3,
      name: "Michael Wong",
      email: "michael@example.com",
      role: "analyst",
      avatar: null,
      status: "active",
      lastActive: "2025-04-16T09:15:00",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "marketing",
      avatar: null,
      status: "pending",
      lastActive: null,
    },
  ];
  
  const pendingInvitesDemo: PendingInvite[] = [
    {
      id: 1,
      email: "alex@example.com",
      role: "marketing",
      sentAt: "2025-04-14T11:20:00",
      expires: "2025-04-21T11:20:00"
    },
    {
      id: 2,
      email: "jessica@example.com",
      role: "analyst",
      sentAt: "2025-04-15T09:45:00",
      expires: "2025-04-22T09:45:00"
    }
  ];

  useEffect(() => {
    // In a real implementation, this would fetch data from Supabase
    setTeamMembers(teamMembersDemo);
    setPendingInvites(pendingInvitesDemo);
  }, []);

  const rolePermissions = {
    admin: {
      name: "Administrator",
      description: "Full access to all features and settings",
      permissions: [
        "View and manage all data",
        "Invite and manage team members",
        "Configure integrations",
        "Generate reports",
        "Manage subscription",
        "Access billing information"
      ]
    },
    marketing: {
      name: "Marketing Manager",
      description: "Manage marketing campaigns and content",
      permissions: [
        "View analytics dashboard",
        "Create and schedule social posts",
        "Generate AI content",
        "Manage ad campaigns",
        "View reports",
        "Limited integrations access"
      ]
    },
    analyst: {
      name: "Data Analyst",
      description: "Access to data and analytics",
      permissions: [
        "View analytics dashboard",
        "Generate and download reports",
        "Access data integrations",
        "Limited ad campaigns access",
        "View social media performance",
        "No billing access"
      ]
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case "admin":
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Administrator</Badge>;
      case "marketing":
        return <Badge className="bg-accent/20 text-accent hover:bg-accent/30">Marketing Manager</Badge>;
      case "analyst":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Data Analyst</Badge>;
      default:
        return <Badge variant="outline">Unknown Role</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleInviteForm = () => {
    setShowInviteForm(!showInviteForm);
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real implementation, this would send an invitation through Supabase
      // For demo purposes, we're just adding the invite to the list
      const newInvite = {
        id: pendingInvites.length + 1,
        email: inviteEmail,
        role: inviteRole,
        sentAt: new Date().toISOString(),
        expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 days from now
      };
      
      setPendingInvites([...pendingInvites, newInvite]);
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}`,
      });
      
      // Reset form
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteForm(false);
      
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvitation = (inviteId: number) => {
    const invite = pendingInvites.find(invite => invite.id === inviteId);
    if (invite) {
      toast({
        title: "Invitation resent",
        description: `The invitation has been resent to ${invite.email}`,
      });
    }
  };

  const handleCancelInvitation = (inviteId: number) => {
    setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId));
    toast({
      title: "Invitation cancelled",
      description: "The invitation has been cancelled",
    });
  };

  const handleEditMember = (memberId: number) => {
    // In a real implementation, this would open a modal to edit the member
    toast({
      title: "Edit member",
      description: "This feature is not yet implemented",
    });
  };

  const handleRemoveMember = (memberId: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    toast({
      title: "Member removed",
      description: "The team member has been removed",
    });
  };

  const handleCreateCustomRole = () => {
    toast({
      title: "Create custom role",
      description: "This feature is not yet implemented",
    });
  };

  const handleEditRole = (role: string) => {
    toast({
      title: "Edit role",
      description: `Editing the ${rolePermissions[role].name} role`,
    });
  };

  const handleToggleSecurity = (setting: string) => {
    toast({
      title: "Security setting updated",
      description: `The ${setting} setting has been updated`,
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members and their permissions</p>
          </div>
          <Button onClick={() => window.location.href = '/team/invite'}>
            <UserPlus className="mr-2 h-4 w-4" /> Invite Team Member
          </Button>
        </header>

        {showInviteForm && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Invite New Team Member</CardTitle>
              <CardDescription>
                Send an invitation email to add someone to your team
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSendInvitation}>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          placeholder="colleague@example.com" 
                          className="pl-9" 
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select 
                      value={inviteRole} 
                      onValueChange={setInviteRole}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="marketing">Marketing Manager</SelectItem>
                        <SelectItem value="analyst">Data Analyst</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="text-sm font-medium">Personal Message (Optional)</label>
                  <Input 
                    placeholder="Add a personal note to the invitation email..."
                    className="mt-2"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={toggleInviteForm}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Invitation'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="invites">Pending Invites</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Manage your team members and their roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 bg-secondary/50 p-3 text-sm">
                    <div className="col-span-3 font-medium">User</div>
                    <div className="col-span-3 font-medium">Email</div>
                    <div className="col-span-2 font-medium">Role</div>
                    <div className="col-span-2 font-medium">Status</div>
                    <div className="col-span-2 font-medium text-right">Actions</div>
                  </div>
                  {teamMembers.map((member) => (
                    <div key={member.id} className="grid grid-cols-12 py-4 px-3 border-t items-center">
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={member.avatar || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Last active: {formatDate(member.lastActive)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 text-sm">
                        {member.email}
                      </div>
                      <div className="col-span-2">
                        {getRoleBadge(member.role)}
                      </div>
                      <div className="col-span-2">
                        {member.status === "active" ? (
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-sm">Pending</span>
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditMember(member.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {member.id !== 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invites">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  Manage outstanding team invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingInvites.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-10 bg-secondary/50 p-3 text-sm">
                      <div className="col-span-4 font-medium">Email</div>
                      <div className="col-span-2 font-medium">Role</div>
                      <div className="col-span-2 font-medium">Sent</div>
                      <div className="col-span-2 font-medium text-right">Actions</div>
                    </div>
                    {pendingInvites.map((invite) => (
                      <div key={invite.id} className="grid grid-cols-10 py-4 px-3 border-t items-center">
                        <div className="col-span-4">
                          {invite.email}
                        </div>
                        <div className="col-span-2">
                          {getRoleBadge(invite.role)}
                        </div>
                        <div className="col-span-2 text-sm">
                          <div className="flex flex-col">
                            <span>{formatDate(invite.sentAt)}</span>
                            <span className="text-xs text-muted-foreground">
                              Expires: {formatDate(invite.expires)}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResendInvitation(invite.id)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Resend
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCancelInvitation(invite.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Pending Invites</h3>
                    <p className="text-muted-foreground mb-4">
                      All invitations have been accepted or have expired.
                    </p>
                    <Button onClick={() => window.location.href = '/team/invite'}>
                      <UserPlus className="mr-2 h-4 w-4" /> Invite Team Member
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(rolePermissions).map(([key, role]) => (
                <Card key={key} className="card-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      {getRoleBadge(key)}
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium mb-3">Permissions:</h4>
                    <ul className="space-y-2">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span className="text-sm">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Users: {teamMembers.filter(m => m.role === key).length}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditRole(key)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Role
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Card className="border-dashed flex flex-col justify-center items-center p-6">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Custom Role</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create a custom role with specific permissions
                </p>
                <Button variant="outline" onClick={handleCreateCustomRole}>
                  Create Custom Role
                </Button>
              </Card>
            </div>

            <Card className="card-shadow mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Security Settings</CardTitle>
                <CardDescription>
                  Configure team access and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all team members
                    </p>
                  </div>
                  <Switch onChange={() => handleToggleSecurity('2FA')} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Session Timeout</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Login Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify administrators of new logins
                    </p>
                  </div>
                  <Switch defaultChecked onChange={() => handleToggleSecurity('login notifications')} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">IP Restrictions</h4>
                    <p className="text-sm text-muted-foreground">
                      Limit access to specific IP addresses
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleToggleSecurity('IP restrictions')}>
                    Configure
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">API Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage API keys and permissions
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Key className="mr-2 h-4 w-4" /> Manage Keys
                  </Button>
                </div>

                <div className="border-t pt-6 mt-6">
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-700">Security Recommendation</h4>
                      <p className="text-xs text-amber-600">
                        We recommend enabling two-factor authentication for all administrative accounts
                        to enhance your account security.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" /> Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeamManagement;
