
/**
 * SEO Service
 * Provides SEO optimization features for the digital marketing platform
 */
import { Helmet } from 'react-helmet-async';
import { enhancedApiClient } from '../apiClient';
import React from 'react';

// SEO Data Interface
export interface SeoData {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object[];
  robots?: string;
}

// Schema Types
export enum SchemaType {
  ARTICLE = 'Article',
  BREADCRUMB = 'BreadcrumbList',
  FAQ = 'FAQPage',
  LOCAL_BUSINESS = 'LocalBusiness',
  PRODUCT = 'Product',
  REVIEW = 'Review',
  WEBSITE = 'WebSite',
  ORGANIZATION = 'Organization',
  PERSON = 'Person'
}

// SEO Analyzer Result Interface
export interface SeoAnalysisResult {
  score: number;
  suggestions: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    type: 'error' | 'warning' | 'info' | 'success';
  }[];
}

/**
 * SEO Service Implementation
 */
export class SeoService {
  private static instance: SeoService;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): SeoService {
    if (!SeoService.instance) {
      SeoService.instance = new SeoService();
    }
    return SeoService.instance;
  }

  /**
   * Generate SEO head tags using React Helmet
   */
  public generateSeoHead(seoData: SeoData): React.ReactElement {
    return React.createElement(
      Helmet,
      null,
      /* Basic Metadata */
      React.createElement('title', null, seoData.title),
      React.createElement('meta', { name: "description", content: seoData.description }),
      seoData.keywords && React.createElement('meta', { name: "keywords", content: seoData.keywords.join(', ') }),
      seoData.canonicalUrl && React.createElement('link', { rel: "canonical", href: seoData.canonicalUrl }),
      seoData.robots && React.createElement('meta', { name: "robots", content: seoData.robots }),
      
      /* Open Graph / Facebook */
      React.createElement('meta', { property: "og:type", content: "website" }),
      React.createElement('meta', { property: "og:title", content: seoData.ogTitle || seoData.title }),
      React.createElement('meta', { property: "og:description", content: seoData.ogDescription || seoData.description }),
      seoData.ogImage && React.createElement('meta', { property: "og:image", content: seoData.ogImage }),
      
      /* Twitter */
      React.createElement('meta', { name: "twitter:card", content: "summary_large_image" }),
      React.createElement('meta', { name: "twitter:title", content: seoData.twitterTitle || seoData.title }),
      React.createElement('meta', { name: "twitter:description", content: seoData.twitterDescription || seoData.description }),
      seoData.twitterImage && React.createElement('meta', { name: "twitter:image", content: seoData.twitterImage }),
      
      /* Structured Data / Schema.org */
      seoData.structuredData && seoData.structuredData.map((schema, index) => 
        React.createElement('script', { 
          key: index, 
          type: "application/ld+json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(schema) }
        })
      )
    );
  }

  /**
   * Analyze page SEO and provide recommendations
   */
  public async analyzeSeo(url: string): Promise<SeoAnalysisResult> {
    try {
      const response = await enhancedApiClient.post('/seo/analyze', { url });
      return response.data;
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      // Return mock data for development
      return {
        score: 76,
        suggestions: [
          {
            title: 'Meta Title Length',
            description: 'Your meta title is too long (70 chars). Keep it under 60 characters.',
            priority: 'medium',
            type: 'warning'
          },
          {
            title: 'Image Alt Tags',
            description: '3 images are missing alt tags. Add descriptive alternative text.',
            priority: 'high',
            type: 'error'
          },
          {
            title: 'Heading Structure',
            description: 'Good job using proper heading structure with H1, H2, and H3 tags.',
            priority: 'low',
            type: 'success'
          }
        ]
      };
    }
  }

  /**
   * Generate schema markup for a given type
   */
  public generateSchemaMarkup(type: SchemaType, data: any): object {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type
    };

    return { ...baseSchema, ...data };
  }

  /**
   * Generate SEO-friendly URLs
   */
  public generateSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/&/g, '-and-')      // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
      .replace(/\-\-+/g, '-');     // Replace multiple - with single -
  }

  /**
   * Optimize image alt text with AI
   */
  public async optimizeImageAlt(imageUrl: string, pageContext: string): Promise<string> {
    try {
      const response = await enhancedApiClient.post('/seo/optimize-alt', {
        imageUrl,
        pageContext
      });
      return response.data.altText;
    } catch (error) {
      console.error('Error optimizing alt text:', error);
      return 'Descriptive image alt text';
    }
  }
}

// Export default instance
export default SeoService.getInstance();
