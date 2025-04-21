import React from 'react';
import { render, screen } from '@testing-library/react';
import PageDetail from '../PageDetail';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ title: 'Test Page' }),
    })
  ) as jest.Mock;
});

describe('Pages PageDetail', () => {
  test('renders the page detail heading', async () => {
    render(<PageDetail />);
    expect(await screen.findByRole('heading')).toBeInTheDocument();
  });
});
