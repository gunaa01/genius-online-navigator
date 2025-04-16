
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertCircle, Key, Save } from "lucide-react";

interface AdminSecuritySettingsProps {
  onToggleSecurity: (setting: string) => void;
  onSaveSettings: () => void;
}

const AdminSecuritySettings: React.FC<AdminSecuritySettingsProps> = ({
  onToggleSecurity,
  onSaveSettings
}) => {
  return (
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
          <Switch onChange={() => onToggleSecurity('2FA')} />
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
          <Switch defaultChecked onChange={() => onToggleSecurity('login notifications')} />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium">IP Restrictions</h4>
            <p className="text-sm text-muted-foreground">
              Limit access to specific IP addresses
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onToggleSecurity('IP restrictions')}>
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
        <Button onClick={onSaveSettings}>
          <Save className="mr-2 h-4 w-4" /> Save Security Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminSecuritySettings;
