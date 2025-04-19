
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  User, 
  Mail, 
  Calendar, 
  Activity,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserRole = "admin" | "member" | "viewer";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLogin: string;
  joinDate: string;
}

const users: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-04-23",
    joinDate: "2023-01-15"
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "member",
    status: "active",
    lastLogin: "2023-04-22",
    joinDate: "2023-02-10"
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "member",
    status: "inactive",
    lastLogin: "2023-03-15",
    joinDate: "2023-02-05"
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    role: "viewer",
    status: "active",
    lastLogin: "2023-04-21",
    joinDate: "2023-03-22"
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    role: "viewer",
    status: "active",
    lastLogin: "2023-04-19",
    joinDate: "2023-03-30"
  }
];

const teams = [
  {
    id: "1",
    name: "Marketing Team",
    members: 8,
    projects: 12,
    lead: "Alex Johnson"
  },
  {
    id: "2",
    name: "Development Team",
    members: 12,
    projects: 15,
    lead: "Michael Chen"
  },
  {
    id: "3",
    name: "Content Team",
    members: 6,
    projects: 9,
    lead: "Sarah Williams"
  }
];

const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case "admin":
      return <Badge className="bg-red-500">Admin</Badge>;
    case "member":
      return <Badge className="bg-blue-500">Member</Badge>;
    case "viewer":
      return <Badge variant="outline">Viewer</Badge>;
    default:
      return null;
  }
};

const getStatusBadge = (status: "active" | "inactive") => {
  return (
    <Badge variant={status === "active" ? "default" : "secondary"} className="capitalize">
      {status}
    </Badge>
  );
};

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage users, teams, and permissions for your platform.
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Platform Users</CardTitle>
              <CardDescription>
                Manage users and their permissions on your platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              View profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Change role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Deactivate account
                            </DropdownMenuItem>
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
        
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Teams</CardTitle>
              <CardDescription>
                Manage teams and team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Team Lead</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="font-medium">{team.name}</div>
                      </TableCell>
                      <TableCell>{team.members}</TableCell>
                      <TableCell>{team.projects}</TableCell>
                      <TableCell>{team.lead}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View team details</DropdownMenuItem>
                            <DropdownMenuItem>Edit team</DropdownMenuItem>
                            <DropdownMenuItem>Manage members</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete team
                            </DropdownMenuItem>
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
        
        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>Manage role definitions and capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Admin</div>
                      <Badge className="bg-red-500">3 Users</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Full access to all features and settings
                    </p>
                    <Button size="sm" variant="outline">Edit Permissions</Button>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Member</div>
                      <Badge className="bg-blue-500">12 Users</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Can create and edit content, run campaigns
                    </p>
                    <Button size="sm" variant="outline">Edit Permissions</Button>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Viewer</div>
                      <Badge variant="outline">8 Users</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Read-only access to content and reports
                    </p>
                    <Button size="sm" variant="outline">Edit Permissions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Define feature access by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="font-medium mb-2">Content Management</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <Badge className="bg-red-500">Admin</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Full Access</p>
                      </div>
                      <div>
                        <Badge className="bg-blue-500">Member</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Edit Only</p>
                      </div>
                      <div>
                        <Badge variant="outline">Viewer</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Read Only</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="font-medium mb-2">User Management</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <Badge className="bg-red-500">Admin</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Full Access</p>
                      </div>
                      <div>
                        <Badge className="bg-blue-500">Member</Badge>
                        <p className="text-xs text-muted-foreground mt-1">No Access</p>
                      </div>
                      <div>
                        <Badge variant="outline">Viewer</Badge>
                        <p className="text-xs text-muted-foreground mt-1">No Access</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="font-medium mb-2">Settings</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <Badge className="bg-red-500">Admin</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Full Access</p>
                      </div>
                      <div>
                        <Badge className="bg-blue-500">Member</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Limited Access</p>
                      </div>
                      <div>
                        <Badge variant="outline">Viewer</Badge>
                        <p className="text-xs text-muted-foreground mt-1">No Access</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
