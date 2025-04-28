import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { apiFetch } from '../../utils/apiFetch';

export interface ApplicantProfileType {
  user_id: string;
  bio?: string;
  skills?: string[];
  resume_url?: string;
}

const ApplicantProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ApplicantProfileType | null>(null);
  const [error, handleError] = useApiError();

  useEffect(() => {
    apiFetch(`/api/hiring/applicant-profile/${userId}`)
      .then(async res => {
        if (await handleError(res)) return;
        setProfile(await res.json());
      });
  }, [userId, handleError]);

  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Applicant Profile</h2>
      <p>{profile.bio}</p>
      <p>Skills: {profile.skills && profile.skills.join(', ')}</p>
      <p>Resume: {profile.resume_url && <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a>}</p>
      {/* Add applications, contact info, etc. */}
    </div>
  );
};

export default ApplicantProfile;
