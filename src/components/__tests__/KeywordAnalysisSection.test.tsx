import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import KeywordAnalysisSection from '../analytics/insights/KeywordAnalysisSection';

// Mock the recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

const mockKeywordData = {
  topKeywords: [
    { keyword: 'dashboard', count: 120, sentiment: 0.8 },
    { keyword: 'interface', count: 85, sentiment: 0.7 },
    { keyword: 'analytics', count: 65, sentiment: 0.9 },
    { keyword: 'reports', count: 50, sentiment: 0.6 },
    { keyword: 'filtering', count: 45, sentiment: 0.5 }
  ],
  risingKeywords: [
    { keyword: 'AI insights', count: 30, sentiment: 0.9, growth: 150 },
    { keyword: 'dark mode', count: 25, sentiment: 0.8, growth: 120 },
    { keyword: 'export', count: 20, sentiment: 0.7, growth: 100 }
  ],
  insights: [
    'Dashboard and interface are frequently mentioned with positive sentiment',
    'AI insights is trending with very positive feedback',
    'Filtering has mixed sentiment and may need attention'
  ]
};

describe('KeywordAnalysisSection', () => {
  it('renders keyword analysis data correctly', () => {
    render(<KeywordAnalysisSection keywordData={mockKeywordData} />);
    
    // Check if section title is rendered
    expect(screen.getByText('Keyword Analysis')).toBeInTheDocument();
    
    // Check if tabs are rendered
    expect(screen.getByRole('tab', { name: /top keywords/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /rising keywords/i })).toBeInTheDocument();
    
    // Check if top keywords are displayed
    expect(screen.getByText('dashboard')).toBeInTheDocument();
    expect(screen.getByText('interface')).toBeInTheDocument();
    expect(screen.getByText('analytics')).toBeInTheDocument();
    
    // Check if insights are displayed
    expect(screen.getByText('Dashboard and interface are frequently mentioned with positive sentiment')).toBeInTheDocument();
    expect(screen.getByText('AI insights is trending with very positive feedback')).toBeInTheDocument();
    
    // Check if chart components are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('switches between top and rising keywords tabs', () => {
    render(<KeywordAnalysisSection keywordData={mockKeywordData} />);
    
    // Initially, top keywords should be visible
    expect(screen.getByText('dashboard')).toBeInTheDocument();
    expect(screen.queryByText('AI insights')).not.toBeInTheDocument();
    
    // Click on the rising keywords tab
    fireEvent.click(screen.getByRole('tab', { name: /rising keywords/i }));
    
    // Now rising keywords should be visible and top keywords hidden
    expect(screen.queryByText('dashboard')).not.toBeInTheDocument();
    expect(screen.getByText('AI insights')).toBeInTheDocument();
    expect(screen.getByText('dark mode')).toBeInTheDocument();
    expect(screen.getByText('export')).toBeInTheDocument();
  });

  it('filters keywords by sentiment', () => {
    render(<KeywordAnalysisSection keywordData={mockKeywordData} />);
    
    // Find and click the sentiment filter dropdown
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    // Select positive sentiment filter
    const positiveOption = screen.getByText('Positive');
    fireEvent.click(positiveOption);
    
    // Check that keywords are filtered (this would typically filter the displayed keywords)
    // For this test, we're just checking if the filter option was selected
    expect(screen.getByRole('button', { name: /positive/i })).toBeInTheDocument();
  });

  it('handles empty keyword data', () => {
    const emptyKeywordData = {
      topKeywords: [],
      risingKeywords: [],
      insights: []
    };
    
    render(<KeywordAnalysisSection keywordData={emptyKeywordData} />);
    expect(screen.getByText(/no keyword data available/i)).toBeInTheDocument();
  });
});
