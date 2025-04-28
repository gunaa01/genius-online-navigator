import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document component
 * Follows our global rules for accessibility and SEO
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Character set */}
        <meta charSet="utf-8" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* PWA support */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        
        {/* Preconnect to API domain for performance */}
        <link 
          rel="preconnect" 
          href={process.env.NEXT_PUBLIC_API_URL || 'https://api.geniusonlinenavigator.com'} 
        />
        
        {/* Default meta tags that can be overridden by pages */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Genius Online Navigator - AI-powered insights and analytics platform" />
      </Head>
      <body>
        {/* Skip to content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded"
        >
          Skip to content
        </a>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
