import { 
  addError,
  getAllErrors,
  clearErrors
} from '../errorReporting';

describe('Error Reporting Service', () => {
  beforeEach(() => {
    // Reset the error reporting service before each test
    clearErrors();
  });

  test('tracks errors correctly', () => {
    const testError = new Error('Test error');
    
    addError({
      message: testError.message,
      stack: testError.stack || '',
      component: 'TestComponent',
      module: 'test',
      browser: 'test',
      os: 'test',
      path: '/test'
    });
    
    const errors = getAllErrors();
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('Test error');
    expect(errors[0].component).toBe('TestComponent');
  });

  test('clears errors', () => {
    const testError = new Error('Test error');
    
    addError({
      message: testError.message,
      stack: testError.stack || '',
      component: 'TestComponent',
      module: 'test',
      browser: 'test',
      os: 'test',
      path: '/test'
    });
    
    clearErrors();
    const errors = getAllErrors();
    
    expect(errors).toHaveLength(0);
  });

  test('categorizes errors by component', () => {
    const error1 = new Error('Error 1');
    const error2 = new Error('Error 2');
    
    addError({
      message: error1.message,
      stack: error1.stack || '',
      component: 'NetworkComponent',
      module: 'network',
      browser: 'test',
      os: 'test',
      path: '/network'
    });
    
    addError({
      message: error2.message,
      stack: error2.stack || '',
      component: 'FormComponent',
      module: 'forms',
      browser: 'test',
      os: 'test',
      path: '/form'
    });
    
    const errors = getAllErrors();
    expect(errors[0].component).toBe('NetworkComponent');
    expect(errors[1].component).toBe('FormComponent');
  });
});
