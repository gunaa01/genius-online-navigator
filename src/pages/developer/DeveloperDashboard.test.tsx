import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DeveloperDashboard from './DeveloperDashboard';
import * as errorReporting from '../../services/errorReporting';

// Mock the error reporting service
jest.mock('../../services/errorReporting', () => ({
  getErrors: jest.fn(() => Promise.resolve([
    {
      id: '1',
      message: 'Test error',
      timestamp: new Date().toISOString(),
      stack: 'Error: Test error\n    at TestComponent',
      context: { component: 'TestComponent' },
    },
  ])),
  clearErrors: jest.fn(),
}));

describe('DeveloperDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all tabs', () => {
    render(
      <Router>
        <DeveloperDashboard />
      </Router>
    );

    expect(screen.getByText('Error Reporting')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Feature Flags')).toBeInTheDocument();
  });

  test('loads and displays error reports', async () => {
    render(
      <Router>
        <DeveloperDashboard />
      </Router>
    );

    // Click on Error Reporting tab if not already active
    fireEvent.click(screen.getByText('Error Reporting'));

    // Wait for errors to load
    await waitFor(() => {
      expect(errorReporting.getErrors).toHaveBeenCalled();
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  test('can clear error reports', async () => {
    render(
      <Router>
        <DeveloperDashboard />
      </Router>
    );

    // Click on Error Reporting tab if not already active
    fireEvent.click(screen.getByText('Error Reporting'));
    
    // Click clear button
    fireEvent.click(screen.getByText('Clear All'));
    
    await waitFor(() => {
      expect(errorReporting.clearErrors).toHaveBeenCalled();
    });
  });

  test('switches between tabs', () => {
    render(
      <Router>
        <DeveloperDashboard />
      </Router>
    );

    // Click on Performance tab
    fireEvent.click(screen.getByText('Performance'));
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();

    // Click on Feature Flags tab
    fireEvent.click(screen.getByText('Feature Flags'));
    expect(screen.getByText('Feature Flag Management')).toBeInTheDocument();
  });
});
