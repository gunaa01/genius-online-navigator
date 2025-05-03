
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
    // Add error handling for the fetch operation
    const fetchGigs = async () => {
      try {
        const response = await fetch('/api/for-hire/gigs');
        if (!response.ok) {
          if (handleError) await handleError(response);
          return;
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setGigs(data);
        } else {
          console.error("Expected array but got:", typeof data);
          setGigs([]);
        }
      } catch (err) {
        console.error("Error fetching gigs:", err);
        setGigs([]);
      }
    };
    
    fetchGigs();
  }, [handleError]);

  return (
    <div>
      <h2>Browse Gigs</h2>
      {error && <div className="error">{error}</div>}
      <div className="gig-list">
        {Array.isArray(gigs) && gigs.length > 0 ? 
          gigs.map(gig => <GigCard key={gig.id} gig={gig} />) : 
          <p>No gigs available</p>
        }
      </div>
    </div>
  );
};

export default GigList;
