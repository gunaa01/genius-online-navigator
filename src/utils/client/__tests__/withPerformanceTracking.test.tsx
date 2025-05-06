import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { withPerformanceTracking, useInteractionTracker } from '../withPerformanceTracking';
import { clientPerformance } from '../performance';

// Store the original performance object
const originalPerformance = global.performance;

// Mock the clientPerformance module
jest.mock('../performance', () => ({
  clientPerformance: {
    trackComponentRender: jest.fn(),
    trackInteraction: jest.fn(),
    resetMetrics: jest.fn(),
    getMetrics: jest.fn()
  }
}));

// Import the mocked clientPerformance
import { clientPerformance } from '../performance';

// Set up and clean up mocks
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock performance.now() with a sequence of values
  let counter = 1000;
  global.performance = {
    ...originalPerformance,
    now: jest.fn(() => {
      counter += 1000;
      return counter - 1000; // Return 1000, 2000, 3000, etc.
    })
  } as unknown as Performance;
});

afterAll(() => {
  global.performance = originalPerformance;
});

describe('withPerformanceTracking', () => {
  const TestComponent: React.FC<{ name: string }> = ({ name }) => (
    <div data-testid="test-component">Hello {name}</div>
  );

  it('should track component render time', () => {
    // Performance timing is mocked in beforeEach
    const WrappedComponent = withPerformanceTracking(TestComponent, 'TestComponent');
    
    render(<WrappedComponent />);
    
    // Verify component name is passed correctly
    expect(clientPerformance.trackComponentRender).toHaveBeenCalledWith(
      'TestComponent',
      expect.any(Number)
    );
    
    // Verify the duration is approximately what we expect
    const actualDuration = (clientPerformance.trackComponentRender as jest.Mock).mock.calls[0][1];
    expect(actualDuration).toBeGreaterThan(0);
    expect(actualDuration).toBeLessThan(2000); // Should be less than 2000ms
  });

  it('should use component name as fallback', () => {
    // Create a component with no name and verify it uses the component's name
    const WrappedAnonymous = withPerformanceTracking(TestComponent);
    
    render(<WrappedAnonymous name="Test" />);
    
    // Verify component name is used as fallback
    expect(clientPerformance.trackComponentRender).toHaveBeenCalledWith(
      'TestComponent',
      expect.any(Number)
    );
  });
});

describe('useInteractionTracker', () => {
  const TestComponent: React.FC = () => {
    const { startTracking, endTracking } = useInteractionTracker('buttonClick');
    
    return (
      <button 
        onMouseDown={startTracking}
        onMouseUp={endTracking}
        data-testid="test-button"
      >
        Click me
      </button>
    );
  };

  it('should track interaction time', async () => {
    render(<TestComponent />);
    
    // Simulate mouse down and up
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('test-button'));
      fireEvent.mouseUp(screen.getByTestId('test-button'));
    });
    
    // Verify performance tracking was called
    expect(clientPerformance.trackInteraction).toHaveBeenCalled();
    
    // Get the actual call arguments
    const calls = (clientPerformance.trackInteraction as jest.Mock).mock.calls;
    expect(calls[0][0]).toBe('buttonClick');
    
    // Verify the duration is a number and reasonable
    expect(typeof calls[0][1]).toBe('number');
    expect(calls[0][1]).toBeGreaterThan(0);
  });

  it('should handle multiple interactions', async () => {
    render(<TestComponent />);
    const button = screen.getByTestId('test-button');
    
    // First interaction
    await act(async () => {
      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);
    });
    
    // Second interaction
    await act(async () => {
      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);
    });
    
    // Verify both interactions were tracked
    expect(clientPerformance.trackInteraction).toHaveBeenCalledTimes(2);
    
    // Get the actual call arguments
    const calls = (clientPerformance.trackInteraction as jest.Mock).mock.calls;
    
    // Verify the interaction names
    expect(calls[0][0]).toBe('buttonClick');
    expect(calls[1][0]).toBe('buttonClick');
    
    // Verify the durations are numbers and reasonable
    expect(typeof calls[0][1]).toBe('number');
    expect(typeof calls[1][1]).toBe('number');
    expect(calls[0][1]).toBeGreaterThan(0);
    expect(calls[1][1]).toBeGreaterThan(0);
  });
});

describe('trackInteractionTime', () => {
  it('should not track if start time is not set', () => {
    // Import the function directly for testing
    const { trackInteractionTime } = require('../withPerformanceTracking');
    
    // Test with null start time
    trackInteractionTime('test', null, 1000);
    expect(clientPerformance.trackInteraction).not.toHaveBeenCalled();
  });

  it('should track interaction with valid start time', () => {
    const { trackInteractionTime } = require('../withPerformanceTracking');
    
    // Test with valid start time
    trackInteractionTime('test', 500, 1000);
    expect(clientPerformance.trackInteraction).toHaveBeenCalledWith('test', 500);
  });
});
