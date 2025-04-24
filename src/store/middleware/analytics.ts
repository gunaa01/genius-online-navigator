import { Middleware } from '@reduxjs/toolkit';

/**
 * Redux middleware for tracking analytics events
 * Sends analytics data for specific actions to an analytics service
 */
export const analyticsMiddleware: Middleware = (store) => (next) => (action) => {
  // Track specific actions for analytics
  const trackableActions = [
    // Auth actions
    'auth/login/fulfilled',
    'auth/register/fulfilled',
    'auth/logout/fulfilled',
    
    // Ad Campaign actions
    'adCampaign/createCampaign/fulfilled',
    'adCampaign/updateCampaign/fulfilled',
    'adCampaign/deleteCampaign/fulfilled',
    
    // Social Media actions
    'socialMedia/createPost/fulfilled',
    'socialMedia/publishPost/fulfilled',
    'socialMedia/connectAccount/fulfilled',
    
    // AI Content actions
    'aiContent/generateContent/fulfilled',
    'aiContent/createTemplate/fulfilled',
    
    // Analytics actions
    'analytics/fetchData/fulfilled',
  ];

  // If this is a trackable action, send to analytics
  if (trackableActions.includes(action.type)) {
    try {
      // In a real application, this would send data to an analytics service
      // like Google Analytics, Mixpanel, or a custom analytics endpoint
      
      // For now, we'll just log to console in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Analytics Event:', {
          action: action.type,
          timestamp: new Date().toISOString(),
          // Include relevant payload data but exclude sensitive information
          data: sanitizePayload(action),
        });
      }
      
      // Example of how you would send to a real analytics service:
      // analyticsService.trackEvent({
      //   eventName: action.type,
      //   properties: sanitizePayload(action)
      // });
    } catch (error) {
      // Don't let analytics errors affect the application
      console.error('Analytics error:', error);
    }
  }
  
  // Always continue with the action
  return next(action);
};

/**
 * Sanitize the action payload to remove sensitive information
 * before sending to analytics
 */
function sanitizePayload(action: any) {
  // Deep clone the payload to avoid modifying the original
  const payload = action.payload ? JSON.parse(JSON.stringify(action.payload)) : {};
  
  // Remove sensitive fields based on action type
  if (action.type.startsWith('auth/')) {
    // Remove passwords, tokens, and other sensitive auth data
    if (payload.password) delete payload.password;
    if (payload.token) delete payload.token;
    if (payload.user?.email) payload.user.email = maskEmail(payload.user.email);
  }
  
  // Remove any other potentially sensitive information
  if (payload.creditCard) delete payload.creditCard;
  if (payload.apiKey) delete payload.apiKey;
  
  return payload;
}

/**
 * Mask an email address for privacy
 * e.g. j***@example.com
 */
function maskEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return '';
  
  const firstChar = username.charAt(0);
  const maskedUsername = `${firstChar}${'*'.repeat(Math.min(username.length - 1, 3))}`;
  
  return `${maskedUsername}@${domain}`;
}
