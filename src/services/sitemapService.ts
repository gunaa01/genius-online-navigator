import axios from 'axios';
import { SitemapConfig } from '../store/slices/seoSlice';

/**
 * Service for managing XML sitemap generation and configuration
 */
export const sitemapService = {
  /**
   * Fetch the current sitemap configuration
   */
  getSitemapConfig: async (): Promise<SitemapConfig[]> => {
    try {
      const response = await axios.get('/api/seo/sitemap-config');
      return response.data;
    } catch (error) {
      console.error('Error fetching sitemap config:', error);
      throw error;
    }
  },

  /**
   * Update sitemap configuration for a specific URL
   */
  updateSitemapConfig: async (config: SitemapConfig): Promise<SitemapConfig> => {
    try {
      const response = await axios.post('/api/seo/sitemap-config', config);
      return response.data;
    } catch (error) {
      console.error('Error updating sitemap config:', error);
      throw error;
    }
  },

  /**
   * Generate and download the XML sitemap
   */
  generateSitemap: async (): Promise<string> => {
    try {
      const response = await axios.get('/api/seo/generate-sitemap', {
        responseType: 'blob'
      });
      
      // Create a download link for the sitemap
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sitemap.xml');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return 'Sitemap generated successfully';
    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    }
  },

  /**
   * Ping search engines to notify them of sitemap updates
   */
  pingSitemapToSearchEngines: async (): Promise<{success: boolean, message: string}> => {
    try {
      const response = await axios.post('/api/seo/ping-sitemap');
      return response.data;
    } catch (error) {
      console.error('Error pinging search engines:', error);
      throw error;
    }
  }
};