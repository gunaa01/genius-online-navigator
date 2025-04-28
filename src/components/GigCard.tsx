import React from 'react';
import { Gig } from '../pages/ForHire/GigList';

interface GigCardProps {
  gig: Gig;
}

const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  return (
    <div className="gig-card">
      <h3>{gig.title}</h3>
      <p>{gig.description}</p>
      <p>Price: ${gig.price}</p>
      {gig.status && <p>Status: {gig.status}</p>}
      {/* Add images, link to detail, etc. */}
    </div>
  );
};

export default GigCard;
