import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X, Mail, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PendingInvite {
  id: number;
  email: string;
  role: string;
  sentAt: string;
  expires: string;
}

interface PendingInvitesProps {
  invites: PendingInvite[];
  onInvitesChange: (invites: PendingInvite[]) => void;
  showForm: boolean;
  onShowFormChange: (show: boolean) => void;
}

export default function PendingInvites({ 
  invites, 
  onInvitesChange, 
  showForm, 
  onShowFormChange 
}: PendingInvitesProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    const newInvite: PendingInvite = {
      id: Date.now(),
      email: inviteEmail,
      role: inviteRole,
      sentAt: new Date().toISOString(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    };

    onInvitesChange([...invites, newInvite]);
    setInviteEmail('');
    onShowFormChange(false);
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    });
  };

  const handleResendInvite = (inviteId: number) => {
    const invite = invites.find(i => i.id === inviteId);
    if (invite) {
      toast({
        title: "Invitation resent",
        description: `The invitation has been resent to ${invite.email}`,
      });
    }
  };

  const handleCancelInvite = (inviteId: number) => {
    onInvitesChange(invites.filter(invite => invite.id !== inviteId));
    toast({
      title: "Invitation cancelled",
      description: "The invitation has been cancelled",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Pending Invites</CardTitle>
          <Button 
            size="sm" 
            onClick={() => onShowFormChange(!showForm)}
            variant={showForm ? "outline" : "default"}
          >
            {showForm ? (
              <>
                <X className="mr-2 h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> New Invite
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {invites.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Pending Invitations</h4>
            <div className="border rounded-lg divide-y">
              {invites.map((invite) => (
                <div key={invite.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Invited as {invite.role} • Expires {new Date(invite.expires).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleResendInvite(invite.id)}
                      title="Resend invitation"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCancelInvite(invite.id)}
                      title="Cancel invitation"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !showForm ? (
          <div className="text-center py-8">
            <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              No pending invitations
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
