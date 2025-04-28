
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface InviteTeamMemberFormProps {
  onCancel: () => void;
  onSubmit: (email: string, role: string, message: string) => Promise<void>;
  loading: boolean;
}

const InviteTeamMemberForm: React.FC<InviteTeamMemberFormProps> = ({
  onCancel,
  onSubmit,
  loading
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('marketing');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, role, message);
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Invite New Team Member</CardTitle>
        <CardDescription>
          Send an invitation email to add someone to your team
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select 
                value={role} 
                onValueChange={setRole}
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InviteTeamMemberForm;
