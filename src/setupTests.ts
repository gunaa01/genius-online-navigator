// Mock performance API
const originalPerformance = global.performance;

global.performance = {
  ...originalPerformance,
  now: jest.fn().mockReturnValue(1000)
} as any;

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: (initialValue: any) => ({ current: initialValue }),
  useEffect: (effect: () => void) => effect(),
  useCallback: (callback: Function) => callback
}));

// Mock console.error to fail tests on React errors
const originalError = console.error;
console.error = (...args: any[]) => {
  // Suppress specific React warning about act()
  if (args[0] && args[0].includes('act(...)')) {
    return;
  }
  originalError(...args);
};

// Cleanup after tests
afterAll(() => {
  global.performance = originalPerformance;
  jest.restoreAllMocks();
});
