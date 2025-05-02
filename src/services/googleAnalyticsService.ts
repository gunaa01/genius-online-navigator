
/**
 * Google Analytics 4 Service
 * Provides GA4 integration and tracking for the digital marketing platform
 */

// GA4 Event Types
export enum GA4EventType {
  PAGE_VIEW = 'page_view',
  SCROLL = 'scroll',
  CLICK = 'click',
  FILE_DOWNLOAD = 'file_download',
  VIDEO_COMPLETE = 'video_complete',
  FORM_SUBMIT = 'form_submit',
  PURCHASE = 'purchase',
  ADD_TO_CART = 'add_to_cart',
  ADD_TO_WISHLIST = 'add_to_wishlist',
  SIGN_UP = 'sign_up',
  LOGIN = 'login',
  SEARCH = 'search',
  VIEW_ITEM = 'view_item',
  VIEW_ITEM_LIST = 'view_item_list',
  SELECT_ITEM = 'select_item',
  BEGIN_CHECKOUT = 'begin_checkout',
  SHARE = 'share'
}

// Event Parameters Interface
export interface GA4EventParameters {
  [key: string]: any;
}

// GA4 Configuration
interface GA4Config {
  measurementId: string;
  debugMode?: boolean;
  sendPageViews?: boolean;
  customDimensions?: {
    [key: string]: string;
  };
}

/**
 * Google Analytics 4 Service
 * Implementation of GA4 tracking for the digital marketing platform
 */
class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService;
  private measurementId: string | null = null;
  private debugMode = false;
  private initialized = false;
  private customDimensions: Record<string, string> = {};

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService();
    }
    return GoogleAnalyticsService.instance;
  }

  /**
   * Initialize GA4 with configuration
   */
  public init(config: GA4Config): void {
    this.measurementId = config.measurementId;
    this.debugMode = config.debugMode || false;
    this.customDimensions = config.customDimensions || {};
    
    // Add Google Analytics script to page
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      debug_mode: this.debugMode,
      send_page_view: config.sendPageViews !== false
    });

    // Add custom dimensions
    if (Object.keys(this.customDimensions).length > 0) {
      window.gtag('set', this.customDimensions);
    }

    this.initialized = true;
    if (this.debugMode) {
      console.log('Google Analytics 4 initialized with measurement ID:', this.measurementId);
    }
  }

  /**
   * Send an event to GA4
   */
  public sendEvent(
    eventName: GA4EventType | string,
    parameters?: GA4EventParameters
  ): void {
    if (!this.initialized) {
      console.warn('Google Analytics 4 not initialized. Call init() first.');
      return;
    }

    if (this.debugMode) {
      console.log(`GA4 Event: ${eventName}`, parameters);
    }

    window.gtag('event', eventName, parameters);
  }

  /**
   * Send a page view event to GA4
   */
  public sendPageView(pageTitle?: string, pagePath?: string): void {
    const params: GA4EventParameters = {};
    
    if (pageTitle) params.page_title = pageTitle;
    if (pagePath) params.page_path = pagePath;
    else params.page_path = window.location.pathname;
    
    this.sendEvent(GA4EventType.PAGE_VIEW, params);
  }

  /**
   * Set user properties in GA4
   */
  public setUserProperties(properties: Record<string, string>): void {
    if (!this.initialized) {
      console.warn('Google Analytics 4 not initialized. Call init() first.');
      return;
    }

    window.gtag('set', 'user_properties', properties);
    
    if (this.debugMode) {
      console.log('GA4 User Properties Set:', properties);
    }
  }

  /**
   * Set user ID for cross-platform tracking
   */
  public setUserId(userId: string | null): void {
    if (!this.initialized) {
      console.warn('Google Analytics 4 not initialized. Call init() first.');
      return;
    }

    window.gtag('set', { user_id: userId });
    
    if (this.debugMode) {
      console.log('GA4 User ID Set:', userId);
    }
  }

  /**
   * Track e-commerce transaction
   */
  public trackPurchase(
    transactionId: string,
    value: number,
    currency: string = 'USD',
    items: any[] = []
  ): void {
    this.sendEvent(GA4EventType.PURCHASE, {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items
    });
  }

  /**
   * Track form submission
   */
  public trackFormSubmission(
    formId: string,
    formName: string,
    formDestination?: string
  ): void {
    this.sendEvent(GA4EventType.FORM_SUBMIT, {
      form_id: formId,
      form_name: formName,
      form_destination: formDestination
    });
  }
}

// Declare global gtag function
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default GoogleAnalyticsService;
