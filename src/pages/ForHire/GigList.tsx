import React, { useEffect, useState } from 'react';
import GigCard from '../../components/GigCard';
import { useApiError } from '../../hooks/useApiError';

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  status?: string;
  freelancer_id: string;
}

const GigList: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [error, handleError] = useApiError();

  useEffect(() => {
    fetch('/api/for-hire/gigs')
      .then(async res => {
        if (await handleError(res)) return;
        setGigs(await res.json());
      });
  }, [handleError]);

  return (
    <div>
      <h2>Browse Gigs</h2>
      {error && <div className="error">{error}</div>}
      <div className="gig-list">
        {gigs.map(gig => <GigCard key={gig.id} gig={gig} />)}
      </div>
    </div>
  );
};

export default GigList;
