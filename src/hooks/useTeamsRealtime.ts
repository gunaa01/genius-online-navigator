import { useEffect } from 'react';
import { createClient, SupabaseClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!
);

export function useTeamsRealtime(onTeamEvent: (payload: RealtimePostgresChangesPayload<any>) => void) {
  useEffect(() => {
    const channel = supabase
      .channel('public:teams')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        payload => {
          onTeamEvent(payload as RealtimePostgresChangesPayload<any>);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onTeamEvent]);
}
