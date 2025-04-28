import { useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export interface MCPContext {
  id: string;
  user_id: string;
  model_type: string;
  context: object;
  session_id: string;
  timestamp: string;
}

/**
 * React hook for Model Context Protocol (MCP).
 * @param userId - The user's unique identifier.
 * @returns { loadContext, saveContext }
 */
export function useMCP(userId: string) {
  /** Load context chain by session_id. */
  const loadContext = useCallback(async (sessionId: string): Promise<MCPContext[]> => {
    const { data, error } = await supabase
      .from('context_chain')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data as MCPContext[];
  }, [userId]);

  /** Save new context entry. */
  const saveContext = useCallback(async (modelType: string, context: object, sessionId: string) => {
    const { data, error } = await supabase
      .from('context_chain')
      .insert([{ user_id: userId, model_type: modelType, context, session_id: sessionId }])
      .select();
    if (error) throw error;
    return data;
  }, [userId]);

  return { loadContext, saveContext };
}
