import React from 'react';
import { render, screen } from '@testing-library/react';
import GuideList from '../GuideList';

describe('Guides GuideList Page', () => {
  it('renders the guide list heading', () => {
    render(<GuideList />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
