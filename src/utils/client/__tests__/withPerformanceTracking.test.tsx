import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { withPerformanceTracking, useInteractionTracker } from '../withPerformanceTracking';
import { clientPerformance } from '../performance';

// Mock the clientPerformance
jest.mock('../performance', () => ({
  clientPerformance: {
    trackComponentRender: jest.fn(),
describe('withPerformanceTracking', () => {
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

describe('useInteractionTracker', () => {
  const TestComponent: React.FC = () => {
    const trackClick = useInteractionTracker('buttonClick');
    
    return (
      <button onClick={trackClick} data-testid="test-button">
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
