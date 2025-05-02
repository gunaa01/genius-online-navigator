import { FrontendAnalyticsService } from '../services/FrontendAnalyticsService';

type EventParams = Record<string, any>;

/**
 * Standard marketing events for consistent tracking
 */
export const MarketingEvents = {
  /**
   * Track lead generation
   */
  leadGenerated: (source: string, medium = 'web'): EventParams => ({
    event: 'lead_generated',
    event_category: 'marketing',
    event_label: source,
    source,
    medium
  }),

  /**
   * Track content downloads
   */
  contentDownload: (contentType: string, title: string): EventParams => ({
    event: 'content_download',
    event_category: 'engagement',
    event_label: title,
    content_type: contentType,
    content_title: title
  }),

  /**
   * Track form submissions
   */
  formSubmission: (formId: string, fields: string[]): EventParams => ({
    event: 'form_submission',
    event_category: 'conversion',
    event_label: formId,
    form_id: formId,
    fields_count: fields.length
  }),

  /**
   * Track button clicks
   */
  buttonClick: (buttonId: string, pageLocation: string): EventParams => ({
    event: 'button_click',
    event_category: 'engagement',
    event_label: buttonId,
    button_id: buttonId,
    page_location: pageLocation
  })
};

/**
 * Helper to track standard events
 */
export const trackMarketingEvent = (
  eventName: keyof typeof MarketingEvents,
  ...args: any[]
) => {
  const eventFn = MarketingEvents[eventName] as (...args: any[]) => EventParams;
  const eventParams = eventFn(...args);
  FrontendAnalyticsService.getInstance().trackEvent(
    eventParams.event,
    eventParams
  );
};
