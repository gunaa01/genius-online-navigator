import React, { useState } from 'react';
import { useApiError } from '../../hooks/useApiError';
import { apiFetch } from '../../utils/apiFetch';

const PostJob: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, handleError] = useApiError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const reqs = requirements.split(',').map(r => r.trim()).filter(Boolean);
    const res = await apiFetch('/api/hiring/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, requirements: reqs, salary, recruiter_id: 'me' })
    });
    if (await handleError(res)) return;
    setSuccess(true);
    setTitle(''); setDescription(''); setRequirements(''); setSalary('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post a New Job</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Job posted!</div>}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <input value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Requirements (comma separated)" />
      <input value={salary} onChange={e => setSalary(e.target.value)} placeholder="Salary" />
      <button type="submit">Post Job</button>
    </form>
  );
};

export default PostJob;
