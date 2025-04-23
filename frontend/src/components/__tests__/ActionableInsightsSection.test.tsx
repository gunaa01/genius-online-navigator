import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionableInsightsSection from '../analytics/insights/ActionableInsightsSection';

// Mock the insightsService
jest.mock('../../services/ai/insightsService', () => ({
  updateInsightStatus: jest.fn(() => Promise.resolve({ success: true })),
}));

const mockInsights = [
  { 
    id: 1, 
    title: 'Improve mobile navigation', 
    description: 'Users are struggling with mobile navigation flow', 
    status: 'open', 
    priority: 'high', 
    impact: 'high',
    recommendedAction: 'Simplify the mobile menu and reduce nesting levels'
  },
  { 
    id: 2, 
    title: 'Add dark mode support', 
    description: 'Multiple users requesting dark mode', 
    status: 'in-progress', 
    priority: 'medium', 
    impact: 'medium',
    recommendedAction: 'Implement dark mode theme with user preference toggle'
  },
  { 
    id: 3, 
    title: 'Fix search performance', 
    description: 'Search is slow for large result sets', 
    status: 'completed', 
    priority: 'high', 
    impact: 'high',
    recommendedAction: 'Optimize search algorithm and add caching'
  }
];

describe('ActionableInsightsSection', () => {
  it('renders actionable insights correctly', () => {
    render(<ActionableInsightsSection actionableInsights={mockInsights} />);
    
    // Check if section title is rendered
    expect(screen.getByText('Actionable Insights')).toBeInTheDocument();
    
    // Check if insights are rendered
    expect(screen.getByText('Improve mobile navigation')).toBeInTheDocument();
    expect(screen.getByText('Add dark mode support')).toBeInTheDocument();
    expect(screen.getByText('Fix search performance')).toBeInTheDocument();
    
    // Check if descriptions are rendered
    expect(screen.getByText('Users are struggling with mobile navigation flow')).toBeInTheDocument();
    expect(screen.getByText('Multiple users requesting dark mode')).toBeInTheDocument();
  });

  it('filters insights by status', () => {
    render(<ActionableInsightsSection actionableInsights={mockInsights} />);
    
    // Find and click the status filter dropdown
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    // Select a status
    const openOption = screen.getByText('Open');
    fireEvent.click(openOption);
    
    // Check that only the filtered insights are visible
    expect(screen.getByText('Improve mobile navigation')).toBeInTheDocument();
    expect(screen.queryByText('Add dark mode support')).not.toBeInTheDocument();
    expect(screen.queryByText('Fix search performance')).not.toBeInTheDocument();
  });

  it('sorts insights by priority', () => {
    render(<ActionableInsightsSection actionableInsights={mockInsights} />);
    
    // Find and click the sort dropdown
    const sortButton = screen.getByRole('button', { name: /sort/i });
    fireEvent.click(sortButton);
    
    // Select priority sorting
    const priorityOption = screen.getByText('Priority');
    fireEvent.click(priorityOption);
    
    // Check order of insights (this is a simplified check)
    const insightElements = screen.getAllByTestId('insight-card');
    expect(insightElements[0]).toHaveTextContent('Improve mobile navigation');
    expect(insightElements[1]).toHaveTextContent('Fix search performance');
    expect(insightElements[2]).toHaveTextContent('Add dark mode support');
  });

  it('updates insight status', async () => {
    const { updateInsightStatus } = require('../../services/ai/insightsService');
    render(<ActionableInsightsSection actionableInsights={mockInsights} />);
    
    // Click on an insight to open the detail view
    fireEvent.click(screen.getByText('Improve mobile navigation'));
    
    // Find and click the status update button
    const statusButton = screen.getByRole('button', { name: /update status/i });
    fireEvent.click(statusButton);
    
    // Select a new status
    const inProgressOption = screen.getByText('In Progress');
    fireEvent.click(inProgressOption);
    
    // Check if the service was called with correct parameters
    await waitFor(() => {
      expect(updateInsightStatus).toHaveBeenCalledWith(1, 'in-progress');
    });
  });

  it('handles empty insights array', () => {
    render(<ActionableInsightsSection actionableInsights={[]} />);
    expect(screen.getByText(/no actionable insights/i)).toBeInTheDocument();
  });
});
