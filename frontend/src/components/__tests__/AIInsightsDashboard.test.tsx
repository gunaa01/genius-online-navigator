import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIInsightsDashboard from '../analytics/AIInsightsDashboard';

// Mock the insightsService
jest.mock('../../services/ai/insightsService', () => ({
  getInsightsDashboard: jest.fn(() => Promise.resolve({
    trendingTopics: [{ name: 'Topic A', description: 'Desc', sentiment: 'positive', volume: 10 }],
    actionableInsights: [{ id: 1, title: 'Do X', status: 'open', priority: 'high', impact: 'large' }],
    sentimentAnalysis: { timeseries: [{ date: '2025-04-22', sentiment: 0.8 }] },
    keywordAnalysis: { topKeywords: [{ keyword: 'AI', count: 20, sentiment: 0.7 }], risingKeywords: [] },
    userSegments: [{ segment: 'Power Users', count: 5, sentiment: 0.9 }],
  })),
}));

describe('AIInsightsDashboard', () => {
  it('renders all dashboard sections with data', async () => {
    render(<AIInsightsDashboard />);
    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByTestId('dashboard-loading')).not.toBeInTheDocument());
    // Trending Topics
    expect(screen.getByText('Trending Topics')).toBeInTheDocument();
    expect(screen.getByText('Topic A')).toBeInTheDocument();
    // Actionable Insights
    expect(screen.getByText('Actionable Insights')).toBeInTheDocument();
    expect(screen.getByText('Do X')).toBeInTheDocument();
    // Sentiment Analysis
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument();
    // Keyword Analysis
    expect(screen.getByText('Keyword Analysis')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    // User Segments
    expect(screen.getByText('User Segments')).toBeInTheDocument();
    expect(screen.getByText('Power Users')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<AIInsightsDashboard />);
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
  });

  it('shows error state on fetch failure', async () => {
    const { getInsightsDashboard } = require('../../services/ai/insightsService');
    getInsightsDashboard.mockImplementationOnce(() => Promise.reject(new Error('API error')));
    render(<AIInsightsDashboard />);
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });
});
