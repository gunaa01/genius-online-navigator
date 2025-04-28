import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SentimentAnalysisSection from '../analytics/insights/SentimentAnalysisSection';

// Mock the recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

const mockSentimentData = {
  timeseries: [
    { date: '2025-01-01', sentiment: 0.7 },
    { date: '2025-02-01', sentiment: 0.8 },
    { date: '2025-03-01', sentiment: 0.6 },
    { date: '2025-04-01', sentiment: 0.9 }
  ],
  overall: 0.75,
  positive: 65,
  neutral: 25,
  negative: 10,
  insights: [
    'Overall sentiment is positive and improving',
    'Recent UI changes have been well-received',
    'Some negative sentiment around pricing changes'
  ]
};

describe('SentimentAnalysisSection', () => {
  it('renders sentiment analysis data correctly', () => {
    render(<SentimentAnalysisSection sentimentData={mockSentimentData} />);
    
    // Check if section title is rendered
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument();
    
    // Check if overall sentiment is displayed
    expect(screen.getByText('75%')).toBeInTheDocument();
    
    // Check if sentiment distribution is displayed
    expect(screen.getByText('65%')).toBeInTheDocument(); // Positive
    expect(screen.getByText('25%')).toBeInTheDocument(); // Neutral
    expect(screen.getByText('10%')).toBeInTheDocument(); // Negative
    
    // Check if insights are displayed
    expect(screen.getByText('Overall sentiment is positive and improving')).toBeInTheDocument();
    expect(screen.getByText('Recent UI changes have been well-received')).toBeInTheDocument();
    expect(screen.getByText('Some negative sentiment around pricing changes')).toBeInTheDocument();
    
    // Check if chart components are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('changes time period for sentiment data', () => {
    render(<SentimentAnalysisSection sentimentData={mockSentimentData} />);
    
    // Find and click the time period dropdown
    const timeframeButton = screen.getByRole('button', { name: /last 30 days/i });
    fireEvent.click(timeframeButton);
    
    // Select a different time period
    const quarterOption = screen.getByText('Last Quarter');
    fireEvent.click(quarterOption);
    
    // Check if the timeframe has been updated (this would typically update the chart data)
    expect(screen.getByRole('button', { name: /last quarter/i })).toBeInTheDocument();
  });

  it('handles empty sentiment data', () => {
    const emptySentimentData = {
      timeseries: [],
      overall: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      insights: []
    };
    
    render(<SentimentAnalysisSection sentimentData={emptySentimentData} />);
    expect(screen.getByText(/no sentiment data available/i)).toBeInTheDocument();
  });
});
