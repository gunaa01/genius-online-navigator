import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { apiFetch } from '../../utils/apiFetch';

export interface RecruiterProfileType {
  user_id: string;
  company: string;
  bio?: string;
}

const RecruiterProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<RecruiterProfileType | null>(null);
  const [error, handleError] = useApiError();

  useEffect(() => {
    apiFetch(`/api/hiring/recruiter-profile/${userId}`)
      .then(async res => {
        if (await handleError(res)) return;
        setProfile(await res.json());
      });
  }, [userId, handleError]);

  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>{profile.company}</h2>
      <p>{profile.bio}</p>
      {/* Add recruiter jobs, contact info, etc. */}
    </div>
  );
};

export default RecruiterProfile;
