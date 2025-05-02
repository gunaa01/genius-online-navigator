import axios from 'axios';
import { SchemaMarkup } from '../store/slices/seoSlice';

/**
 * Service for managing schema markup (structured data) for SEO
 */
export const schemaMarkupService = {
  /**
   * Fetch all schema markups for the site
   */
  getAllSchemaMarkups: async (): Promise<SchemaMarkup[]> => {
    try {
      const response = await axios.get('/api/seo/schema-markups');
      return response.data;
    } catch (error) {
      console.error('Error fetching schema markups:', error);
      throw error;
    }
  },

  /**
   * Get schema markup for a specific URL
   */
  getSchemaMarkupByUrl: async (url: string): Promise<SchemaMarkup[]> => {
    try {
      const response = await axios.get(`/api/seo/schema-markups?url=${encodeURIComponent(url)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schema markup for ${url}:`, error);
      throw error;
    }
  },

  /**
   * Create or update a schema markup
   */
  upsertSchemaMarkup: async (schemaMarkup: SchemaMarkup): Promise<SchemaMarkup> => {
    try {
      const response = await axios.post('/api/seo/schema-markups', schemaMarkup);
      return response.data;
    } catch (error) {
      console.error('Error updating schema markup:', error);
      throw error;
    }
  },

  /**
   * Delete a schema markup
   */
  deleteSchemaMarkup: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/seo/schema-markups/${id}`);
    } catch (error) {
      console.error(`Error deleting schema markup ${id}:`, error);
      throw error;
    }
  },

  /**
   * Generate schema markup based on page content
   * Uses AI to analyze the page and suggest appropriate schema
   */
  generateSchemaMarkup: async (url: string, pageContent: string): Promise<SchemaMarkup> => {
    try {
      const response = await axios.post('/api/seo/generate-schema', {
        url,
        pageContent
      });
      return response.data;
    } catch (error) {
      console.error('Error generating schema markup:', error);
      throw error;
    }
  },

  /**
   * Validate schema markup against Schema.org standards
   */
  validateSchemaMarkup: async (schemaMarkup: SchemaMarkup): Promise<{valid: boolean, errors?: string[]}> => {
    try {
      const response = await axios.post('/api/seo/validate-schema', schemaMarkup);
      return response.data;
    } catch (error) {
      console.error('Error validating schema markup:', error);
      throw error;
    }
  }
};