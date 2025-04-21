import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { Job } from './JobList';
import { apiFetch } from '../../utils/apiFetch';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [error, handleError] = useApiError();

  useEffect(() => {
    apiFetch(`/api/hiring/jobs?id=eq.${id}`)
      .then(async res => {
        if (await handleError(res)) return;
        const data = await res.json();
        setJob(data[0]);
      });
  }, [id, handleError]);

  if (error) return <div className="error">{error}</div>;
  if (!job) return <div>Loading...</div>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p>Requirements: {job.requirements && job.requirements.join(', ')}</p>
      <p>Status: {job.status}</p>
      {/* Add application button, recruiter info, etc. */}
    </div>
  );
};

export default JobDetail;
