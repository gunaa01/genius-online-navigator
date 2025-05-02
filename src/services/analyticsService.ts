
/**
 * Analytics Service - Handles tracking and data collection
 * for the digital marketing platform
 */

// Analytics Event Types
export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  CONVERSION = 'conversion',
  SOCIAL_ENGAGEMENT = 'social_engagement',
  CAMPAIGN_INTERACTION = 'campaign_interaction',
  FORM_SUBMISSION = 'form_submission',
  VIDEO_INTERACTION = 'video_interaction'
}

// Event Properties Interface
export interface EventProperties {
  [key: string]: any;
}

// Analytics Configuration
interface AnalyticsConfig {
  enableGoogleAnalytics: boolean;
  enableFacebookPixel: boolean;
  enableHotjar: boolean;
  anonymizeIp: boolean;
  trackingId?: string;
  pixelId?: string;
  hotjarId?: string;
}

/**
 * Core Analytics Service
 * Provides unified tracking across multiple analytics platforms
 */
class AnalyticsService {
  private static instance: AnalyticsService;
  private config: AnalyticsConfig = {
    enableGoogleAnalytics: false,
    enableFacebookPixel: false,
    enableHotjar: false,
    anonymizeIp: true
  };

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize analytics with configuration
   */
  public init(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.config.enableGoogleAnalytics && this.config.trackingId) {
      this.initGoogleAnalytics(this.config.trackingId);
    }
    
    if (this.config.enableFacebookPixel && this.config.pixelId) {
      this.initFacebookPixel(this.config.pixelId);
    }
    
    if (this.config.enableHotjar && this.config.hotjarId) {
      this.initHotjar(this.config.hotjarId);
    }

    console.log('Analytics service initialized with config:', this.config);
  }

  /**
   * Track an event across all configured analytics platforms
   */
  public trackEvent(
    eventType: EventType,
    eventProperties: EventProperties = {}
  ): void {
    // Track in Google Analytics
    if (this.config.enableGoogleAnalytics && window.gtag) {
      window.gtag('event', eventType, eventProperties);
    }

    // Track in Facebook Pixel
    if (this.config.enableFacebookPixel && window.fbq) {
      window.fbq('trackCustom', eventType, eventProperties);
    }

    // Console logging for development
    console.log(`Analytics event: ${eventType}`, eventProperties);
  }

  /**
   * Track a page view
   */
  public trackPageView(page: string, properties: EventProperties = {}): void {
    const pageViewProps = {
      page_path: page,
      page_title: document.title,
      ...properties
    };

    this.trackEvent(EventType.PAGE_VIEW, pageViewProps);
  }

  /**
   * Track a conversion event
   */
  public trackConversion(
    conversionType: string, 
    value?: number,
    properties: EventProperties = {}
  ): void {
    const conversionProps = {
      conversion_type: conversionType,
      value,
      ...properties
    };

    this.trackEvent(EventType.CONVERSION, conversionProps);
  }

  /**
   * Initialize Google Analytics
   */
  private initGoogleAnalytics(trackingId: string): void {
    // Add Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', trackingId, {
      anonymize_ip: this.config.anonymizeIp
    });
  }

  /**
   * Initialize Facebook Pixel
   */
  private initFacebookPixel(pixelId: string): void {
    // Add Facebook Pixel script
    window.fbq = window.fbq || function() {
      (window.fbq.q = window.fbq.q || []).push(arguments);
    };
    window._fbq = window._fbq || window.fbq;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
    
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }

  /**
   * Initialize Hotjar
   */
  private initHotjar(hotjarId: string): void {
    // Add Hotjar script
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:parseInt(hotjarId),hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  }
}

export default AnalyticsService;
