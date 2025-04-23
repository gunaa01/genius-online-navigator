import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserSegmentSection from '../analytics/insights/UserSegmentSection';

// Mock the recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
    Pie: () => <div data-testid="pie" />,
    Cell: () => <div data-testid="cell" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
  };
});

const mockSegmentData = [
  {
    segmentId: '1',
    segmentName: 'Power Users',
    size: 250,
    percentage: 25,
    sentiment: 0.85,
    topKeywords: ['dashboard', 'analytics', 'exports'],
    topFeedback: ['Need more advanced filtering options', 'Love the analytics dashboard'],
    needs: ['Advanced filtering', 'Bulk operations', 'API access'],
    recommendations: ['Add advanced filtering options', 'Implement bulk editing features'],
    growth: 5
  },
  {
    segmentId: '2',
    segmentName: 'Casual Users',
    size: 450,
    percentage: 45,
    sentiment: 0.75,
    topKeywords: ['interface', 'simplicity', 'help'],
    topFeedback: ['Interface is intuitive', 'Need better help documentation'],
    needs: ['Simpler interface', 'Better tutorials', 'Quick access'],
    recommendations: ['Improve onboarding flow', 'Add contextual help'],
    growth: 12
  },
  {
    segmentId: '3',
    segmentName: 'New Users',
    size: 300,
    percentage: 30,
    sentiment: 0.65,
    topKeywords: ['tutorial', 'onboarding', 'confusion'],
    topFeedback: ['Onboarding is confusing', 'Need more tutorials'],
    needs: ['Better onboarding', 'Simplified views', 'Quick wins'],
    recommendations: ['Create interactive tutorials', 'Implement simplified starter views'],
    growth: 20
  }
];

describe('UserSegmentSection', () => {
  it('renders user segment data correctly', () => {
    render(<UserSegmentSection segments={mockSegmentData} />);
    
    // Check if section title is rendered
    expect(screen.getByText('User Segments')).toBeInTheDocument();
    
    // Check if segments are displayed
    expect(screen.getByText('Power Users')).toBeInTheDocument();
    expect(screen.getByText('Casual Users')).toBeInTheDocument();
    expect(screen.getByText('New Users')).toBeInTheDocument();
    
    // Check if segment details are displayed
    expect(screen.getByText('25%')).toBeInTheDocument(); // Power Users percentage
    expect(screen.getByText('45%')).toBeInTheDocument(); // Casual Users percentage
    expect(screen.getByText('30%')).toBeInTheDocument(); // New Users percentage
    
    // Check if chart components are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('shows segment details when a segment is selected', () => {
    render(<UserSegmentSection segments={mockSegmentData} />);
    
    // Initially, detailed view might not be visible
    expect(screen.queryByText('Segment Details')).not.toBeInTheDocument();
    
    // Click on a segment to view details
    fireEvent.click(screen.getByText('Power Users'));
    
    // Now segment details should be visible
    expect(screen.getByText('Segment Details')).toBeInTheDocument();
    expect(screen.getByText('Power Users')).toBeInTheDocument();
    expect(screen.getByText('250 users (25%)')).toBeInTheDocument();
    
    // Check if needs and recommendations are displayed
    expect(screen.getByText('Advanced filtering')).toBeInTheDocument();
    expect(screen.getByText('Bulk operations')).toBeInTheDocument();
    expect(screen.getByText('API access')).toBeInTheDocument();
    expect(screen.getByText('Add advanced filtering options')).toBeInTheDocument();
    expect(screen.getByText('Implement bulk editing features')).toBeInTheDocument();
  });

  it('switches between different segments', () => {
    render(<UserSegmentSection segments={mockSegmentData} />);
    
    // Click on Power Users segment
    fireEvent.click(screen.getByText('Power Users'));
    
    // Check Power Users details are visible
    expect(screen.getByText('Advanced filtering')).toBeInTheDocument();
    
    // Click on Casual Users segment
    fireEvent.click(screen.getByText('Casual Users'));
    
    // Now Casual Users details should be visible and Power Users details hidden
    expect(screen.queryByText('Advanced filtering')).not.toBeInTheDocument();
    expect(screen.getByText('Simpler interface')).toBeInTheDocument();
    expect(screen.getByText('Better tutorials')).toBeInTheDocument();
    expect(screen.getByText('Improve onboarding flow')).toBeInTheDocument();
  });

  it('handles empty segment data', () => {
    render(<UserSegmentSection segments={[]} />);
    expect(screen.getByText(/no user segment data available/i)).toBeInTheDocument();
  });
});
