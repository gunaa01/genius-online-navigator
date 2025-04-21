import React, { useEffect, useState } from 'react';
import { Gig } from '../ForHire/GigList';
import { apiFetch } from '../../utils/apiFetch';

const GigModeration: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/admin/gigs')
      .then(async res => {
        if (!res.ok) {
          setError('Failed to fetch gigs');
          return;
        }
        setGigs(await res.json());
      });
  }, []);

  return (
    <div>
      <h3>Gig Moderation</h3>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Freelancer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gigs.map(gig => (
            <tr key={gig.id}>
              <td>{gig.title}</td>
              <td>{gig.freelancer_id}</td>
              <td>{gig.status}</td>
              <td>
                {/* Approve/Reject/Delete buttons here */}
                <button>Approve</button>
                <button>Reject</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GigModeration;
