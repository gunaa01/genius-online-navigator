import { Middleware } from '@reduxjs/toolkit';

/**
 * Redux middleware for logging actions and state changes
 * Only active in development mode
 */
export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV !== 'production') {
    console.group(`Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    
    const result = next(action);
    
    console.log('Next State:', store.getState());
    console.groupEnd();
    
    return result;
  }
  
  return next(action);
};
