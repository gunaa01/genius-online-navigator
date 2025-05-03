import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { withPerformanceTracking, useInteractionTracker } from '../withPerformanceTracking';
import { clientPerformance } from '../performance';

// Mock the clientPerformance
jest.mock('../performance', () => ({
  clientPerformance: {
    trackComponentRender: jest.fn(),
    trackInteraction: jest.fn(),
    resetMetrics: jest.fn(),
    getMetrics: jest.fn()
  }
}));

describe('withPerformanceTracking - Integration Test', () => {
  const TestComponent: React.FC<{ name: string }> = ({ name }) => (
    <div data-testid="test-component">Hello {name}</div>
  );

  it('should track component render time', () => {
    const WrappedComponent = withPerformanceTracking(TestComponent, 'TestComponent');
    
    render(<WrappedComponent name="World" />);
    
    expect(clientPerformance.trackComponentRender).toHaveBeenCalledWith(
      'TestComponent',
      expect.any(Number)
    );
    expect(screen.getByTestId('test-component')).toHaveTextContent('Hello World');
  });
});

describe('useInteractionTracker - Integration Test', () => {
  const TestComponent: React.FC = () => {
    const trackClick = useInteractionTracker('buttonClick');
    
    return (
      <button 
        data-testid="test-button" 
        onClick={() => {
          trackClick();
        }}
      >
        Click me
      </button>
    );
  };

  it('should track interaction time', () => {
    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('test-button'));
    
    expect(clientPerformance.trackInteraction).toHaveBeenCalledWith(
      'buttonClick',
      expect.any(Number)
    );
  });
});
