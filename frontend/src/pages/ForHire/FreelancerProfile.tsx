import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { Gig } from './GigList';

export interface FreelancerProfileType {
  user_id: string;
  display_name: string;
  bio?: string;
  skills?: string[];
  portfolio_links?: string[];
}

const FreelancerProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<FreelancerProfileType | null>(null);
  const [error, handleError] = useApiError();

  useEffect(() => {
    fetch(`/api/for-hire/freelancer-profile/${userId}`)
      .then(async res => {
        if (await handleError(res)) return;
        setProfile(await res.json());
      });
  }, [userId, handleError]);

  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>{profile.display_name}</h2>
      <p>{profile.bio}</p>
      <p>Skills: {profile.skills && profile.skills.join(', ')}</p>
      {/* Add portfolio links, gigs, etc. */}
    </div>
  );
};

export default FreelancerProfile;
