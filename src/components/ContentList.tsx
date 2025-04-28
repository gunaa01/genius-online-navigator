import React, { useEffect, useState } from 'react';
import { fetchContent, GeneratedContent } from '../api/content';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useDispatch } from 'react-redux';
import { setContents } from '../redux/contentSlice';

export const ContentList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<GeneratedContent[]>([]);
  const supabase = useSupabaseClient();
  const dispatch = useDispatch();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      const token = session.data.session.access_token;
      try {
        const data = await fetchContent(token);
        setLocalContent(data);
        dispatch(setContents(data));
      } catch (e) {
        setError('Error loading content');
      }
      setLoading(false);
    }
    load();
  }, [supabase, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <ul data-testid="ai-suggestion-list">
      {localContent.map(c => (
        <li key={c.id}>
          <strong>{c.title}</strong><br />
          {c.body}
        </li>
      ))}
    </ul>
  );
};
