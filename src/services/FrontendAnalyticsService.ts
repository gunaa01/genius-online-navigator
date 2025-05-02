import { GA4Config, GTMConfig } from '../components/analytics';

type EventParams = Record<string, any>;

/**
 * Unified service for frontend analytics tracking
 * Combines GA4 and GTM functionality with a single interface
 */
export class FrontendAnalyticsService {
  private static instance: FrontendAnalyticsService;
  private ga4Config?: GA4Config;
  private gtmConfig?: GTMConfig;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): FrontendAnalyticsService {
    if (!FrontendAnalyticsService.instance) {
      FrontendAnalyticsService.instance = new FrontendAnalyticsService();
    }
    return FrontendAnalyticsService.instance;
  }

  /**
   * Initialize GA4 tracking
   */
  initGA4(config: GA4Config): void {
    this.ga4Config = config;
    if (typeof window !== 'undefined') {
      window.gtag = window.gtag || function() {
        (window.dataLayer = window.dataLayer || []).push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', config.measurementId, {
        user_id: config.userId,
        ...config.userProperties
      });
    }
  }

  /**
   * Initialize GTM tracking
   */
  initGTM(config: GTMConfig): void {
    this.gtmConfig = config;
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
        ...config.dataLayer
      });
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, params?: EventParams): void {
    if (this.ga4Config && window.gtag) {
      window.gtag('event', eventName, params);
    }
    if (this.gtmConfig && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...params
      });
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title: string): void {
    this.trackEvent('page_view', {
      page_path: path,
      page_title: title
    });
  }
}
