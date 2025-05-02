import fs from 'fs';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  img?: {
    url: string;
    caption?: string;
    title?: string;
    geoLocation?: string;
    license?: string;
  }[];
}

/**
 * Generate XML sitemap for the website
 * @param urls Array of URLs to include in the sitemap
 * @param outputPath Path to save the sitemap
 * @returns Promise that resolves when the sitemap is generated
 */
export const generateSitemap = async (
  urls: SitemapUrl[],
  outputPath: string = 'public/sitemap.xml'
): Promise<void> => {
  try {
    // Create a stream to write to
    const stream = new SitemapStream({ hostname: process.env.REACT_APP_BASE_URL || 'https://geniusnavigator.com' });
    
    // Return a promise that resolves with your XML string
    const data = await streamToPromise(Readable.from(urls).pipe(stream));
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write sitemap to file
    fs.writeFileSync(outputPath, data.toString());
    
    console.log(`Sitemap generated at ${outputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};

/**
 * Generate sitemap URLs from content
 * @param pages Array of page objects
 * @returns Array of sitemap URLs
 */
export const generateSitemapFromPages = (
  pages: Array<{
    path: string;
    lastModified?: Date;
    priority?: number;
    changeFrequency?: SitemapUrl['changefreq'];
    images?: Array<{
      url: string;
      alt?: string;
      title?: string;
    }>;
  }>
): SitemapUrl[] => {
  return pages.map((page) => ({
    url: page.path,
    lastmod: page.lastModified ? page.lastModified.toISOString() : new Date().toISOString(),
    changefreq: page.changeFrequency || 'weekly',
    priority: page.priority || 0.7,
    ...(page.images && {
      img: page.images.map((image) => ({
        url: image.url,
        caption: image.alt,
        title: image.title,
      })),
    }),
  }));
};

/**
 * Auto-generate sitemap from routes
 * @param routes Array of route paths
 * @param outputPath Path to save the sitemap
 */
export const generateSitemapFromRoutes = async (
  routes: string[],
  outputPath: string = 'public/sitemap.xml'
): Promise<void> => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://geniusnavigator.com';
  
  const urls: SitemapUrl[] = routes.map((route) => ({
    url: route,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: route === '/' ? 1.0 : 0.7,
  }));
  
  await generateSitemap(urls, outputPath);
};
