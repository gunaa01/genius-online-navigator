import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
  generateAlt?: boolean;
  onAltGenerated?: (alt: string) => void;
}

/**
 * Enhanced Image component with SEO optimization features
 * - Automatically generates descriptive alt text if not provided or if generateAlt is true
 * - Implements lazy loading by default
 * - Provides proper width and height to prevent layout shifts
 */
const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  onClick,
  generateAlt = false,
  onAltGenerated
}) => {
  const [optimizedAlt, setOptimizedAlt] = useState<string>(alt);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate descriptive alt text if needed
  useEffect(() => {
    const shouldGenerateAlt = generateAlt || !alt || alt.trim() === '';
    
    if (shouldGenerateAlt && src) {
      setIsLoading(true);
      
      // This would connect to an AI service in production
      // For now, we'll simulate the API call
      const simulateAltTextGeneration = async () => {
        // In a real implementation, this would call an AI service API
        const fileName = src.split('/').pop() || '';
        const fileNameWithoutExtension = fileName.split('.')[0] || '';
        
        // Generate a more descriptive alt text based on the filename
        const words = fileNameWithoutExtension
          .replace(/[-_]/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .toLowerCase()
          .trim();
          
        const generatedAlt = `Image of ${words}`;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setOptimizedAlt(generatedAlt);
        if (onAltGenerated) {
          onAltGenerated(generatedAlt);
        }
        setIsLoading(false);
      };
      
      simulateAltTextGeneration();
    }
  }, [src, alt, generateAlt, onAltGenerated]);

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={optimizedAlt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        onClick={onClick}
      />
      {isLoading && (
        <div className="absolute top-0 right-0 bg-primary/10 p-1 rounded-bl text-xs flex items-center">
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          <span>Optimizing</span>
        </div>
      )}
    </div>
  );
};

/**
 * Bulk optimize images in content
 * @param content HTML content with images
 * @returns Optimized HTML content with enhanced alt texts
 */
export const optimizeContentImages = (content: string): string => {
  // Simple regex to find image tags
  const imgRegex = /<img[^>]+>/g;
  
  // Replace each image tag with an optimized version
  return content.replace(imgRegex, (imgTag) => {
    // Extract src and alt attributes
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/);
    
    const src = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';
    
    // If alt is empty or missing, generate a basic one from the filename
    if (!alt || alt.trim() === '') {
      const fileName = src.split('/').pop() || '';
      const fileNameWithoutExtension = fileName.split('.')[0] || '';
      
      // Generate a more descriptive alt text based on the filename
      const words = fileNameWithoutExtension
        .replace(/[-_]/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .trim();
        
      const generatedAlt = `Image of ${words}`;
      
      // Replace or add the alt attribute
      if (altMatch) {
        return imgTag.replace(/alt=["'][^"']*["']/, `alt="${generatedAlt}"`);
      } else {
        return imgTag.replace(/<img/, `<img alt="${generatedAlt}"`);
      }
    }
    
    return imgTag;
  });
};

export default ImageOptimizer;
