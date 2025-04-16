
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, UserMinus, UserPlus, CheckCircle2 } from "lucide-react";

interface PendingInvite {
  id: number;
  email: string;
  role: string;
  sentAt: string;
  expires: string;
}

interface AdminPendingInvitesProps {
  invites: PendingInvite[];
  formatDate: (dateString: string | null) => string;
  getRoleBadge: (role: string) => React.ReactNode;
  onResendInvitation: (id: number) => void;
  onCancelInvitation: (id: number) => void;
  onShowInviteForm: () => void;
}

const AdminPendingInvites: React.FC<AdminPendingInvitesProps> = ({
  invites,
  formatDate,
  getRoleBadge,
  onResendInvitation,
  onCancelInvitation,
  onShowInviteForm
}) => {
  return (
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
        {invites.length > 0 ? (
          <div className="rounded-md border">
            <div className="grid grid-cols-10 bg-secondary/50 p-3 text-sm">
              <div className="col-span-4 font-medium">Email</div>
              <div className="col-span-2 font-medium">Role</div>
              <div className="col-span-2 font-medium">Sent</div>
              <div className="col-span-2 font-medium text-right">Actions</div>
            </div>
            {invites.map((invite) => (
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
                    onClick={() => onResendInvitation(invite.id)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Resend
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onCancelInvitation(invite.id)}
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
            <Button onClick={onShowInviteForm}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite Team Member
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPendingInvites;
