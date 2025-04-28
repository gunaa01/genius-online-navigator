
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Role {
  name: string;
  description: string;
  permissions: string[];
}

interface RolePermissionsProps {
  roleKey: string;
  role: Role;
  userCount: number;
  onEditRole: (roleKey: string) => void;
  badge: React.ReactNode;
}

const AdminRolePermissions: React.FC<RolePermissionsProps> = ({ 
  roleKey,
  role, 
  userCount,
  onEditRole,
  badge
}) => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{role.name}</CardTitle>
          {badge}
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
          Users: {userCount}
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEditRole(roleKey)}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Role
        </Button>
      </CardFooter>
    </Card>
  );
};

export const CreateCustomRoleCard: React.FC<{
  onCreateRole: () => void;
}> = ({ onCreateRole }) => {
  const { toast } = useToast();
  
  const handleCreateRole = () => {
    toast({
      title: "Create Custom Role",
      description: "Opening custom role creation dialog",
    });
    onCreateRole();
  };
  
  return (
    <Card className="border-dashed flex flex-col justify-center items-center p-6">
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-3">
        <Shield className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-1">Custom Role</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Create a custom role with specific permissions
      </p>
      <Button variant="outline" onClick={handleCreateRole}>
        Create Custom Role
      </Button>
    </Card>
  );
};

export default AdminRolePermissions;
