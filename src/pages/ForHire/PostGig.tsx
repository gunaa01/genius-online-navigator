import React, { useState } from 'react';
import { useApiError } from '../../hooks/useApiError';
import { apiFetch } from '../../utils/apiFetch';

const PostGig: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, handleError] = useApiError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const res = await apiFetch('/api/for-hire/gigs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price: parseFloat(price), freelancer_id: 'me' })
    });
    if (await handleError(res)) return;
    setSuccess(true);
    setTitle(''); setDescription(''); setPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post a New Gig</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Gig posted!</div>}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" required />
      <button type="submit">Post Gig</button>
    </form>
  );
};

export default PostGig;
