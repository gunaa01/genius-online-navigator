import * as React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface MetaTags {
  title: string;
  description: string;
  keywords: string;
}

const SEOHead: React.FC = () => {
  const location = useLocation();
  const [metaTags, setMetaTags] = React.useState<MetaTags>({
    title: "Genius Online Navigator",
    description: "All-in-one platform for transforming offline businesses into online success stories",
    keywords: "digital transformation, online business, AI tools"
  });

  React.useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await axios.get(`/api/seo/meta-tags?path=${location.pathname}`);
        if (response.data) {
          setMetaTags(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch meta tags:", error);
      }
    };

    fetchMetaTags();
  }, [location.pathname]);

  // Structured data for better search engine understanding
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": metaTags.title,
    "description": metaTags.description,
    "url": window.location.origin + location.pathname,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      
      {/* Open Graph tags for social sharing */}
      <meta property="og:title" content={metaTags.title} />
      <meta property="og:description" content={metaTags.description} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${window.location.origin}/images/og-image.jpg`} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTags.title} />
      <meta name="twitter:description" content={metaTags.description} />
      <meta name="twitter:image" content={`${window.location.origin}/images/twitter-image.jpg`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={window.location.href} />
      
      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead; 