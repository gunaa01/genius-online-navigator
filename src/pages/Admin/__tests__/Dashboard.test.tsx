import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Admin Dashboard Page', () => {
  it('renders the dashboard heading', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
