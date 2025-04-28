import React from 'react';
import { render, screen } from '@testing-library/react';
import CommunityList from '../CommunityList';

describe('Community CommunityList Page', () => {
  it('renders the community list heading', () => {
    render(<CommunityList />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
