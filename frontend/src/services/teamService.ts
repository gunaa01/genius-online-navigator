import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  status: string;
  lastActive: string | null;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: string;
  sentAt: string;
  expires: string;
}

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    // In a real implementation, this would fetch data from Supabase
    // For now we're just simulating a successful API call
    return [
      {
        id: "1",
        name: "John Smith",
        email: "john@example.com",
        role: "admin",
        avatar: null,
        status: "active",
        lastActive: "2025-04-16T10:30:00",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "marketing",
        avatar: null,
        status: "active",
        lastActive: "2025-04-15T16:45:00",
      },
      {
        id: "3",
        name: "Michael Wong",
        email: "michael@example.com",
        role: "analyst",
        avatar: null,
        status: "active",
        lastActive: "2025-04-16T09:15:00",
      }
    ];
  } catch (error: unknown) {
    console.error("Error fetching team members:", error);
    toast({
      title: "Error",
      description: "Failed to fetch team members",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchPendingInvites = async (): Promise<PendingInvite[]> => {
  try {
    // In a real implementation, this would fetch data from Supabase
    return [
      {
        id: "1",
        email: "alex@example.com",
        role: "marketing",
        sentAt: "2025-04-14T11:20:00",
        expires: "2025-04-21T11:20:00"
      },
      {
        id: "2",
        email: "jessica@example.com",
        role: "analyst",
        sentAt: "2025-04-15T09:45:00",
        expires: "2025-04-22T09:45:00"
      }
    ];
  } catch (error: unknown) {
    console.error("Error fetching pending invites:", error);
    toast({
      title: "Error",
      description: "Failed to fetch pending invitations",
      variant: "destructive",
    });
    throw error;
  }
};

export const sendInvitation = async (
  email: string, 
  role: string, 
  message?: string
): Promise<PendingInvite> => {
  try {
    // In a real implementation, this would send an invitation through Supabase
    // For now we're just simulating a successful API call
    
    const newInvite = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      role,
      sentAt: new Date().toISOString(),
      expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 days from now
    };
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}`,
    });
    
    return newInvite;
    
  } catch (error: unknown) {
    console.error("Error sending invitation:", error);
    toast({
      title: "Error",
      description: "Failed to send invitation. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const resendInvitation = async (inviteId: string): Promise<void> => {
  try {
    // In a real implementation, this would resend an invitation through Supabase
    // For now we're just simulating a successful API call
    
    toast({
      title: "Invitation resent",
      description: "The invitation has been resent",
    });
    
  } catch (error: unknown) {
    console.error("Error resending invitation:", error);
    toast({
      title: "Error",
      description: "Failed to resend invitation. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const cancelInvitation = async (inviteId: string): Promise<void> => {
  try {
    // In a real implementation, this would cancel an invitation through Supabase
    // For now we're just simulating a successful API call
    
    toast({
      title: "Invitation cancelled",
      description: "The invitation has been cancelled",
    });
    
  } catch (error: unknown) {
    console.error("Error cancelling invitation:", error);
    toast({
      title: "Error",
      description: "Failed to cancel invitation. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const editTeamMember = async (
  memberId: string, 
  updates: {
    role?: string;
    name?: string;
    email?: string;
  }
): Promise<void> => {
  try {
    // In a real implementation, this would update a team member through Supabase
    // For now we're just simulating a successful API call
    
    toast({
      title: "Member updated",
      description: "The team member has been updated",
    });
    
  } catch (error: unknown) {
    console.error("Error updating team member:", error);
    toast({
      title: "Error",
      description: "Failed to update team member. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const removeTeamMember = async (memberId: string): Promise<void> => {
  try {
    // In a real implementation, this would remove a team member through Supabase
    // For now we're just simulating a successful API call
    
    toast({
      title: "Member removed",
      description: "The team member has been removed",
    });
    
  } catch (error: unknown) {
    console.error("Error removing team member:", error);
    toast({
      title: "Error",
      description: "Failed to remove team member. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateSecuritySettings = async (
  settings: {
    twoFactorAuth?: boolean;
    sessionTimeout?: number;
    loginNotifications?: boolean;
    ipRestrictions?: string[];
  }
): Promise<void> => {
  try {
    // In a real implementation, this would update security settings through Supabase
    // For now we're just simulating a successful API call
    
    toast({
      title: "Settings updated",
      description: "Security settings have been updated",
    });
    
  } catch (error: unknown) {
    console.error("Error updating security settings:", error);
    toast({
      title: "Error",
      description: "Failed to update security settings. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
