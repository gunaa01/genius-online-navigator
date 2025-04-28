import React, { useEffect, useState } from 'react';
import { useApiError } from '../../hooks/useApiError';
import { apiFetch } from '../../utils/apiFetch';

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
}

interface ApplicationsProps {
  userId: string;
}

const Applications: React.FC<ApplicationsProps> = ({ userId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, handleError] = useApiError();

  useEffect(() => {
    apiFetch(`/api/hiring/applicant-profile/${userId}`)
      .then(async res => {
        if (await handleError(res)) return;
        const profile = await res.json();
        if (!profile) return;
        apiFetch(`/api/hiring/applications/${profile.user_id}`)
          .then(async res2 => {
            if (await handleError(res2)) return;
            setApplications(await res2.json());
          });
      });
  }, [userId, handleError]);

  return (
    <div>
      <h2>Your Job Applications</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {applications.map(app => (
          <li key={app.id}>
            Job: {app.job_id} | Status: {app.status}
            {/* Link to application detail or messaging */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
