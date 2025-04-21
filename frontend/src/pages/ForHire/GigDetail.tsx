import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { Gig } from './GigList';

const GigDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gig, setGig] = useState<Gig | null>(null);
  const [error, handleError] = useApiError();

  useEffect(() => {
    fetch(`/api/for-hire/gigs?id=eq.${id}`)
      .then(async res => {
        if (await handleError(res)) return;
        const data = await res.json();
        setGig(data[0]);
      });
  }, [id, handleError]);

  if (error) return <div className="error">{error}</div>;
  if (!gig) return <div>Loading...</div>;

  return (
    <div>
      <h2>{gig.title}</h2>
      <p>{gig.description}</p>
      <p>Price: ${gig.price}</p>
      {/* Add images, order button, messaging, etc. */}
    </div>
  );
};

export default GigDetail;
