import React from 'react';
import { Helmet } from 'react-helmet';

interface SchemaMarkupProps {
  type: 'Organization' | 'LocalBusiness' | 'Product' | 'Article' | 'Event' | 'Person' | 'WebPage' | 'BreadcrumbList';
  data: Record<string, any>;
}

/**
 * Schema Markup Component for SEO Rich Snippets
 * Implements JSON-LD structured data according to schema.org standards
 */
const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data }) => {
  // Base schema with context and type
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

/**
 * Generate Organization schema markup
 */
export const OrganizationSchema: React.FC<{
  name: string;
  url: string;
  logo?: string;
  description?: string;
  socialProfiles?: string[];
}> = ({ name, url, logo, description, socialProfiles }) => {
  const data = {
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(socialProfiles && { sameAs: socialProfiles }),
  };

  return <SchemaMarkup type="Organization" data={data} />;
};

/**
 * Generate Product schema markup
 */
export const ProductSchema: React.FC<{
  name: string;
  description: string;
  image?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability?: string;
  };
  reviews?: Array<{
    author: string;
    reviewRating: {
      ratingValue: number;
      bestRating?: number;
    };
    reviewBody?: string;
  }>;
}> = ({ name, description, image, offers, reviews }) => {
  const data = {
    name,
    description,
    ...(image && { image }),
    ...(offers && { offers: {
      '@type': 'Offer',
      ...offers
    }}),
    ...(reviews && { review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ...review.reviewRating
      },
      ...(review.reviewBody && { reviewBody: review.reviewBody })
    }))})
  };

  return <SchemaMarkup type="Product" data={data} />;
};

/**
 * Generate Article schema markup
 */
export const ArticleSchema: React.FC<{
  headline: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
  description?: string;
}> = ({ headline, image, datePublished, dateModified, author, publisher, description }) => {
  const data = {
    headline,
    ...(image && { image }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url })
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.logo && { logo: {
        '@type': 'ImageObject',
        url: publisher.logo
      }})
    },
    ...(description && { description })
  };

  return <SchemaMarkup type="Article" data={data} />;
};

/**
 * Generate BreadcrumbList schema markup
 */
export const BreadcrumbSchema: React.FC<{
  items: Array<{
    name: string;
    url?: string;
  }>;
}> = ({ items }) => {
  const data = {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };

  return <SchemaMarkup type="BreadcrumbList" data={data} />;
};

export default SchemaMarkup;
