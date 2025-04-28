import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrendingTopicsSection from '../analytics/insights/TrendingTopicsSection';

const mockTopics = [
  { id: 1, name: 'User Interface', description: 'Feedback about UI elements', sentiment: 'positive', volume: 120, category: 'UX/UI' },
  { id: 2, name: 'Performance', description: 'Feedback about system performance', sentiment: 'negative', volume: 85, category: 'Technical' },
  { id: 3, name: 'New Features', description: 'Requests for new features', sentiment: 'neutral', volume: 65, category: 'Features' }
];

describe('TrendingTopicsSection', () => {
  it('renders trending topics correctly', () => {
    render(<TrendingTopicsSection trendingTopics={mockTopics} />);
    
    // Check if section title is rendered
    expect(screen.getByText('Trending Topics')).toBeInTheDocument();
    
    // Check if all topics are rendered
    expect(screen.getByText('User Interface')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('New Features')).toBeInTheDocument();
    
    // Check if descriptions are rendered
    expect(screen.getByText('Feedback about UI elements')).toBeInTheDocument();
    expect(screen.getByText('Feedback about system performance')).toBeInTheDocument();
  });

  it('filters topics by category', () => {
    render(<TrendingTopicsSection trendingTopics={mockTopics} />);
    
    // Find and click the category filter dropdown
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    // Select a category
    const uxuiOption = screen.getByText('UX/UI');
    fireEvent.click(uxuiOption);
    
    // Check that only the filtered topic is visible
    expect(screen.getByText('User Interface')).toBeInTheDocument();
    expect(screen.queryByText('Performance')).not.toBeInTheDocument();
    expect(screen.queryByText('New Features')).not.toBeInTheDocument();
  });

  it('sorts topics by volume', () => {
    render(<TrendingTopicsSection trendingTopics={mockTopics} />);
    
    // Find and click the sort dropdown
    const sortButton = screen.getByRole('button', { name: /sort/i });
    fireEvent.click(sortButton);
    
    // Select volume sorting
    const volumeOption = screen.getByText('Volume');
    fireEvent.click(volumeOption);
    
    // Check order of topics (this is a simplified check)
    const topicElements = screen.getAllByTestId('trend-card');
    expect(topicElements[0]).toHaveTextContent('User Interface');
    expect(topicElements[1]).toHaveTextContent('Performance');
    expect(topicElements[2]).toHaveTextContent('New Features');
  });

  it('handles empty topics array', () => {
    render(<TrendingTopicsSection trendingTopics={[]} />);
    expect(screen.getByText(/no trending topics/i)).toBeInTheDocument();
  });
});
