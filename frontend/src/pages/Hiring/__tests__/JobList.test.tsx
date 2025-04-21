import React from 'react';
import { render, screen } from '@testing-library/react';
import JobList from '../JobList';

describe('Hiring JobList Page', () => {
  it('renders the job list heading', () => {
    render(<JobList />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
