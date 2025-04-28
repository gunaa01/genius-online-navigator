import React from 'react';
import { render, screen } from '@testing-library/react';
import JobCard from '../JobCard';
import { Job } from '../../pages/Hiring/JobList';

describe('JobCard', () => {
  const job: Job = {
    id: '1',
    title: 'Frontend Developer',
    description: 'Build amazing UI',
    requirements: ['React', 'TypeScript'],
    salary: '100k',
    status: 'open',
    recruiter_id: 'rec1',
  };

  it('renders job details', () => {
    render(<JobCard job={job} />);
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Build amazing UI')).toBeInTheDocument();
    expect(screen.getByText(/React, TypeScript/)).toBeInTheDocument();
    expect(screen.getByText('100k')).toBeInTheDocument();
    expect(screen.getByText(/Status: open/)).toBeInTheDocument();
  });
});
