import React, { useState } from 'react';
import { createContent } from '../api/content';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useDispatch } from 'react-redux';
import { addContent } from '../redux/contentSlice';

export const ContentForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const newContent = await createContent(token, { title, body, status });
      dispatch(addContent(newContent));
      setTitle('');
      setBody('');
      setStatus('draft');
    } catch (e) {
      setError('Error creating content');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
        required
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <button type="submit" disabled={loading} data-testid="save-context-btn">
        {loading ? 'Saving...' : 'Save Content'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};
