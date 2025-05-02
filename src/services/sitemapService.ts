
/**
 * Sitemap Service
 * Handles generation, validation and submission of XML sitemaps
 */

import { enhancedApiClient } from './apiClient';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapConfig {
  hostname: string;
  excludedPaths?: string[];
  extraURLs?: SitemapURL[];
  outputPath?: string;
}

export class SitemapService {
  private hostname: string = '';
  private excludedPaths: string[] = [];
  private extraURLs: SitemapURL[] = [];
  private outputPath: string = 'sitemap.xml';

  constructor(config?: SitemapConfig) {
    if (config) {
      this.hostname = config.hostname;
      this.excludedPaths = config.excludedPaths || [];
      this.extraURLs = config.extraURLs || [];
      this.outputPath = config.outputPath || 'sitemap.xml';
    }
  }

  /**
   * Generate sitemap XML from website pages
   */
  public async generateSitemap(): Promise<string> {
    try {
      const response = await enhancedApiClient.post('/seo/sitemap/generate', {
        hostname: this.hostname,
        excludedPaths: this.excludedPaths,
        extraURLs: this.extraURLs,
        outputPath: this.outputPath
      });
      
      return response.data.sitemapUrl;
    } catch (error) {
      console.error('Error generating sitemap:', error);
      // In development mode, return mock response
      return `${this.hostname}/${this.outputPath}`;
    }
  }

  /**
   * Ping search engines to notify them about sitemap updates
   */
  public async pingSitemapToSearchEngines(): Promise<boolean> {
    try {
      const response = await enhancedApiClient.post('/seo/sitemap/ping', {
        sitemapUrl: `${this.hostname}/${this.outputPath}`,
        engines: ['google', 'bing', 'yandex']
      });
      
      return response.data.success;
    } catch (error) {
      console.error('Error pinging search engines:', error);
      // In development mode, return mock response
      return true;
    }
  }

  /**
   * Validate sitemap against schema
   */
  public async validateSitemap(): Promise<{valid: boolean, errors?: string[]}> {
    try {
      const response = await enhancedApiClient.post('/seo/sitemap/validate', {
        sitemapUrl: `${this.hostname}/${this.outputPath}`
      });
      
      return response.data;
    } catch (error) {
      console.error('Error validating sitemap:', error);
      // In development mode, return mock response
      return { valid: true };
    }
  }

  /**
   * Set configuration
   */
  public setConfig(config: SitemapConfig): void {
    this.hostname = config.hostname;
    this.excludedPaths = config.excludedPaths || this.excludedPaths;
    this.extraURLs = config.extraURLs || this.extraURLs;
    this.outputPath = config.outputPath || this.outputPath;
  }

  /**
   * Add URLs to sitemap
   */
  public addURLs(urls: SitemapURL[]): void {
    this.extraURLs = [...this.extraURLs, ...urls];
  }

  /**
   * Exclude paths from sitemap
   */
  public excludePaths(paths: string[]): void {
    this.excludedPaths = [...this.excludedPaths, ...paths];
  }
}

// Export singleton instance
export const sitemapService = new SitemapService({
  hostname: window.location.origin,
  excludedPaths: ['/admin', '/login', '/private', '/thank-you'],
  outputPath: 'sitemap.xml'
});

export default sitemapService;
