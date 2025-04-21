import React, { useEffect, useState } from 'react';
import { Job } from '../Hiring/JobList';
import { apiFetch } from '../../utils/apiFetch';

const JobModeration: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/admin/jobs')
      .then(async res => {
        if (!res.ok) {
          setError('Failed to fetch jobs');
          return;
        }
        setJobs(await res.json());
      });
  }, []);

  return (
    <div>
      <h3>Job Moderation</h3>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Recruiter</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.recruiter_id}</td>
              <td>{job.status}</td>
              <td>
                {/* Approve/Reject/Delete buttons here */}
                <button>Approve</button>
                <button>Reject</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobModeration;
