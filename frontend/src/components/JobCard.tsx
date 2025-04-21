import React from 'react';
import { Job } from '../pages/Hiring/JobList';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      {job.requirements && <p><b>Requirements:</b> {job.requirements.join(', ')}</p>}
      {job.salary && <p><b>Salary:</b> {job.salary}</p>}
      <p>Status: {job.status}</p>
      {/* Add link to detail view if needed */}
    </div>
  );
};

export default JobCard;
