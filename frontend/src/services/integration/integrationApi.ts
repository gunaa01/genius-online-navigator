import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Integration } from "./types";

// Get user integrations
export const getUserIntegrations = async () => {
  try {
    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return data as Integration[];
  } catch (error: unknown) {
    toast({
      title: "Error fetching integrations",
      description: error as string,
      variant: "destructive",
    });
    return [];
  }
};

// Add new integration
export const addIntegration = async (integration: Partial<Integration>) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Ensure required fields are present to match the Supabase table requirements
    if (!integration.name) {
      throw new Error("Integration name is required");
    }

    if (!integration.type) {
      throw new Error("Integration type is required");
    }

    // Create a properly typed object for Supabase insert
    const insertData = {
      user_id: user.id,
      name: integration.name,
      type: integration.type,
      api_key: integration.api_key || null,
      access_token: integration.access_token || null,
      refresh_token: integration.refresh_token || null,
      credentials: integration.credentials || null,
      configuration: integration.configuration || null,
      connected: integration.connected !== undefined ? integration.connected : false
    };

    const { data, error } = await supabase
      .from("integrations")
      .insert(insertData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Integration added",
      description: `${integration.name} has been successfully connected.`,
    });
    
    return data as Integration;
  } catch (error: unknown) {
    toast({
      title: "Error adding integration",
      description: error as string,
      variant: "destructive",
    });
    throw error;
  }
};

// Update integration
export const updateIntegration = async (id: string, updates: Partial<Integration>) => {
  try {
    const { data, error } = await supabase
      .from("integrations")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Integration updated",
      description: `Integration settings have been updated.`,
    });
    
    return data as Integration;
  } catch (error: unknown) {
    toast({
      title: "Error updating integration",
      description: error as string,
      variant: "destructive",
    });
    throw error;
  }
};

// Delete integration
export const deleteIntegration = async (id: string) => {
  try {
    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    toast({
      title: "Integration removed",
      description: `The integration has been successfully removed.`,
    });
    
    return true;
  } catch (error: unknown) {
    toast({
      title: "Error removing integration",
      description: error as string,
      variant: "destructive",
    });
    throw error;
  }
};
