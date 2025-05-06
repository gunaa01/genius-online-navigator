import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageSquare, User, Shield, Clock, CheckCircle2, XCircle, MoreHorizontal, UserCog, UserX, UserCheck, UserMinus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export interface UserProfileCardProps {
  id: number | string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  status: 'active' | 'inactive' | 'pending';
  lastActive?: string | null;
  bio?: string;
  skills?: string[];
  onEdit?: (id: number | string) => void;
  onRemove?: (id: number | string) => void;
  onMessage?: (id: number | string) => void;
  onRoleChange?: (id: number | string, newRole: string) => void;
  onStatusChange?: (id: number | string, newStatus: string) => void;
  canEditRole?: boolean;
  isSavingRole?: boolean;
  className?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-300">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>
      );
    case 'inactive':
    default:
      return (
        <Badge variant="outline" className="text-gray-500">
          <XCircle className="h-3 w-3 mr-1" /> Inactive
        </Badge>
      );
  }
};

const getRoleBadge = (role: string) => {
  const roleConfig: Record<string, { label: string; variant: string }> = {
    admin: { label: 'Admin', variant: 'destructive' },
    owner: { label: 'Owner', variant: 'destructive' },
    manager: { label: 'Manager', variant: 'secondary' },
    member: { label: 'Member', variant: 'outline' },
    guest: { label: 'Guest', variant: 'outline' },
  };

  const config = roleConfig[role.toLowerCase()] || { label: role, variant: 'outline' };
  
  return (
    <Badge variant={config.variant as any} className="capitalize">
      {config.label}
    </Badge>
  );
};

export const StyledUserProfileCard: React.FC<UserProfileCardProps> = ({
  id,
  name,
  email,
  role,
  avatar,
  status,
  lastActive,
  bio,
  skills = [],
  onEdit,
  onRemove,
  onMessage,
  onRoleChange,
  onStatusChange,
  canEditRole = false,
  isSavingRole = false,
  className = ''
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleRemove = () => {
    if (onRemove) onRemove(id);
  };

  const handleStatusToggle = (newStatus: string) => {
    if (onStatusChange) onStatusChange(id, newStatus);
  };

  const handleRoleChange = (newRole: string) => {
    if (onRoleChange) onRoleChange(id, newRole);
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {avatar ? (
                <AvatarImage src={avatar} alt={name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">{name}</CardTitle>
                {getStatusBadge(status)}
              </div>
              <CardDescription className="mt-1">
                {email}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getRoleBadge(role)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(id)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                )}
                {onMessage && (
                  <DropdownMenuItem onClick={() => onMessage(id)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Send Message</span>
                  </DropdownMenuItem>
                )}
                {onRemove && (
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={handleRemove}
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    <span>Remove from Team</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {bio && <p className="text-sm text-muted-foreground mb-3">{bio}</p>}
        
        {skills.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-medium text-muted-foreground mb-1.5">SKILLS</h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 5).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0 border-t bg-muted/20">
        <div className="text-xs text-muted-foreground">
          {lastActive ? (
            <span>Last active {format(new Date(lastActive), 'MMM d, yyyy')}</span>
          ) : (
            <span>Never active</span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Email</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StyledUserProfileCard;
