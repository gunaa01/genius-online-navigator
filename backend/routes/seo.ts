import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { PrismaClient } from '@prisma/client';
import { createSitemap } from 'sitemap';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function seoRoutes(server: FastifyInstance) {
  // Original route
  server.post('/api/seo/meta-tags', {
    schema: {
      body: Type.Object({
        url: Type.String(),
        title: Type.String(),
        description: Type.String(),
      }),
    },
  }, async (request, reply) => {
    const { url, title, description } = request.body as any;
    
    try {
      const metaTags = await prisma.metaTag.upsert({
        where: { url },
        update: { title, description },
        create: { url, title, description },
      });
      
      reply.send(metaTags);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to update meta tags' });
    }
  });
  
  /**
   * Generate XML sitemap from content in the database
   * GET /api/seo/sitemap
   */
  server.get('/api/seo/sitemap', async (request, reply) => {
    try {
      // Get all pages, blog posts, and other content from database
      const pages = await prisma.page.findMany();
      const posts = await prisma.post.findMany();
      const products = await prisma.product.findMany();
      
      // Base URL from request or configuration
      const baseUrl = process.env.SITE_URL || `${request.protocol}://${request.hostname}`;
      
      // Create sitemap
      const sitemap = createSitemap({
        hostname: baseUrl,
        cacheTime: 600000, // 10 minutes cache
      });
      
      // Add static pages
      sitemap.add({ url: '/', changefreq: 'daily', priority: 1.0 });
      sitemap.add({ url: '/about', changefreq: 'monthly', priority: 0.8 });
      sitemap.add({ url: '/contact', changefreq: 'monthly', priority: 0.8 });
      
      // Add dynamic pages
      pages.forEach(page => {
        sitemap.add({
          url: `/${page.slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: page.updatedAt?.toISOString()
        });
      });
      
      // Add blog posts
      posts.forEach(post => {
        sitemap.add({
          url: `/blog/${post.slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: post.updatedAt?.toISOString()
        });
      });
      
      // Add products
      products.forEach(product => {
        sitemap.add({
          url: `/products/${product.slug}`,
          changefreq: 'daily',
          priority: 0.8,
          lastmod: product.updatedAt?.toISOString()
        });
      });
      
      // Generate sitemap XML
      const sitemapXML = sitemap.toString();
      
      // Save sitemap to public directory for search engines to access
      const publicDir = path.join(process.cwd(), '../public');
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXML);
      
      // Return sitemap XML
      reply.header('Content-Type', 'application/xml');
      reply.send(sitemapXML);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      reply.status(500).send({ error: 'Failed to generate sitemap' });
    }
  });
  
  /**
   * Generate schema.org JSON-LD markup for a page
   * GET /api/seo/schema/:type
   */
  server.get('/api/seo/schema/:type', {
    schema: {
      params: Type.Object({
        type: Type.String()
      }),
      querystring: Type.Object({
        name: Type.Optional(Type.String()),
        url: Type.Optional(Type.String()),
        title: Type.Optional(Type.String()),
        description: Type.Optional(Type.String()),
        image: Type.Optional(Type.String()),
        author: Type.Optional(Type.String()),
        publisher: Type.Optional(Type.String()),
        publisherLogo: Type.Optional(Type.String()),
        datePublished: Type.Optional(Type.String()),
        dateModified: Type.Optional(Type.String()),
        price: Type.Optional(Type.String()),
        currency: Type.Optional(Type.String()),
        availability: Type.Optional(Type.String()),
        phone: Type.Optional(Type.String()),
        email: Type.Optional(Type.String()),
        socialLinks: Type.Optional(Type.String())
      })
    }
  }, async (request, reply) => {
    try {
      const { type } = request.params as { type: string };
      const data = request.query as any;
      
      let schema = {};
      
      switch (type) {
        case 'organization':
          schema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: data.name,
            url: data.url,
            logo: data.logo,
            sameAs: data.socialLinks?.split(','),
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: data.phone,
              contactType: 'customer service',
              email: data.email
            }
          };
          break;
          
        case 'article':
          schema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.title,
            image: data.image,
            author: {
              '@type': 'Person',
              name: data.author
            },
            publisher: {
              '@type': 'Organization',
              name: data.publisher,
              logo: {
                '@type': 'ImageObject',
                url: data.publisherLogo
              }
            },
            datePublished: data.datePublished,
            dateModified: data.dateModified,
            description: data.description
          };
          break;
          
        case 'product':
          schema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: data.name,
            image: data.image,
            description: data.description,
            offers: {
              '@type': 'Offer',
              price: data.price,
              priceCurrency: data.currency || 'USD',
              availability: data.availability || 'https://schema.org/InStock'
            }
          };
          break;
          
        default:
          return reply.status(400).send({ error: 'Invalid schema type' });
      }
      
      reply.send(schema);
    } catch (error) {
      console.error('Error generating schema:', error);
      reply.status(500).send({ error: 'Failed to generate schema markup' });
    }
  });
}
