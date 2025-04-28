
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Edit, UserMinus } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  status: string;
  lastActive: string | null;
}

interface AdminTeamMembersProps {
  members: TeamMember[];
  formatDate: (dateString: string | null) => string;
  getRoleBadge: (role: string) => React.ReactNode;
  onEditMember: (id: number) => void;
  onRemoveMember: (id: number) => void;
}

const AdminTeamMembers: React.FC<AdminTeamMembersProps> = ({
  members,
  formatDate,
  getRoleBadge,
  onEditMember,
  onRemoveMember
}) => {
  return (
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
          {members.map((member) => (
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
                  onClick={() => onEditMember(member.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {member.id !== 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRemoveMember(member.id)}
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
  );
};

export default AdminTeamMembers;
