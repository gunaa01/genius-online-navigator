import React from 'react';
import { render, screen } from '@testing-library/react';
import GigList from '../GigList';

describe('ForHire GigList Page', () => {
  it('renders the gig list heading', () => {
    render(<GigList />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
