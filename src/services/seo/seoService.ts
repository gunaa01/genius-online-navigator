import { Helmet } from 'react-helmet';
import React from 'react';

/**
 * SEO metadata interface
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, any>;
}

/**
 * Default SEO values
 */
const DEFAULT_SEO: SEOMetadata = {
  title: 'Genius Online Navigator',
  description: 'AI-powered insights and analytics platform',
  keywords: ['analytics', 'insights', 'AI', 'dashboard'],
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

/**
 * Base URL from environment
 */
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://geniusonlinenavigator.com';

/**
 * Generate SEO component with metadata
 * @param metadata SEO metadata
 * @returns React component with Helmet
 */
export const SEOHead: React.FC<{ metadata: Partial<SEOMetadata>; path?: string }> = ({ 
  metadata, 
  path = '' 
}) => {
  const seoData: SEOMetadata = {
    ...DEFAULT_SEO,
    ...metadata,
  };

  const canonicalUrl = seoData.canonicalUrl || `${BASE_URL}${path}`;

  // Generate structured data
  const structuredData = seoData.structuredData || {
    '@context': 'https://schema.org',
    '@type': seoData.ogType === 'article' ? 'Article' : 'WebPage',
    headline: seoData.title,
    description: seoData.description,
    url: canonicalUrl,
    ...(seoData.ogImage && { image: seoData.ogImage }),
  };

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords.join(', ')} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={seoData.ogType} />
      {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      {seoData.ogImage && <meta name="twitter:image" content={seoData.ogImage} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

/**
 * Generate structured data for insights
 * @param insights Insights data
 * @returns Structured data object
 */
export const generateInsightsStructuredData = (insights: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'AI Insights Dashboard',
    description: 'AI-powered analytics and insights',
    keywords: ['AI', 'analytics', 'insights', 'dashboard'],
    url: `${BASE_URL}/admin/insights`,
    creator: {
      '@type': 'Organization',
      name: 'Genius Online Navigator',
      url: BASE_URL,
    },
    dateModified: new Date().toISOString(),
    license: `${BASE_URL}/terms`,
  };
};

/**
 * Generate page title with proper format
 * @param title Page title
 * @returns Formatted title
 */
export const formatPageTitle = (title: string): string => {
  return `${title} | Genius Online Navigator`;
};

/**
 * Generate dynamic meta description
 * @param content Base content
 * @param maxLength Maximum length
 * @returns Formatted description
 */
export const formatMetaDescription = (content: string, maxLength = 160): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength - 3) + '...';
};
