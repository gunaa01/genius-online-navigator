import React, { useEffect, useState } from 'react';
import JobCard from '../../components/JobCard';
import { useApiError } from '../../hooks/useApiError';
import { apiFetch } from '../../utils/apiFetch';

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
  salary?: string;
  status?: string;
  recruiter_id: string;
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, handleError] = useApiError();

  useEffect(() => {
    apiFetch('/api/hiring/jobs')
      .then(async res => {
        if (await handleError(res)) return;
        setJobs(await res.json());
      });
  }, [handleError]);

  return (
    <div>
      <h2>Job Board</h2>
      {error && <div className="error">{error}</div>}
      <div className="job-list">
        {jobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
};

export default JobList;
