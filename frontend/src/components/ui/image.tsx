import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Whether to lazy load the image
   * @default true
   */
  lazyLoad?: boolean;
  
  /**
   * Fallback image URL to use if the primary image fails to load
   */
  fallbackSrc?: string;
  
  /**
   * Low-quality placeholder image to show while the main image loads
   */
  placeholderSrc?: string;
  
  /**
   * Whether to blur the placeholder image
   * @default true
   */
  blurPlaceholder?: boolean;
  
  /**
   * Whether to fade in the image when it loads
   * @default true
   */
  fadeIn?: boolean;
  
  /**
   * Additional classes for the image container
   */
  containerClassName?: string;
}

/**
 * Optimized image component with lazy loading, placeholder, and fallback support
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    src, 
    alt = '', 
    className, 
    lazyLoad = true, 
    fallbackSrc, 
    placeholderSrc,
    blurPlaceholder = true,
    fadeIn = true,
    containerClassName,
    ...props 
  }, ref) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(
      placeholderSrc || src
    );
    const [isLoaded, setIsLoaded] = useState(!placeholderSrc);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const combinedRef = useCombinedRefs(ref, imgRef);
    
    // Handle image load
    const handleLoad = () => {
      if (imgSrc !== src) {
        setImgSrc(src);
      }
      setIsLoaded(true);
    };
    
    // Handle image error
    const handleError = () => {
      setError(true);
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
    };
    
    // Set up intersection observer for lazy loading
    useEffect(() => {
      if (!lazyLoad || !imgRef.current) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading the actual image when it comes into view
            if (placeholderSrc && imgSrc === placeholderSrc) {
              const img = new Image();
              img.src = src as string;
              img.onload = handleLoad;
              img.onerror = handleError;
            }
            observer.disconnect();
          }
        });
      }, {
        rootMargin: '200px', // Start loading when image is 200px from viewport
        threshold: 0.01,
      });
      
      observer.observe(imgRef.current);
      
      return () => {
        observer.disconnect();
      };
    }, [lazyLoad, src, imgSrc, placeholderSrc]);
    
    // Handle direct loading without placeholder
    useEffect(() => {
      if (!placeholderSrc && !error && src !== imgSrc) {
        setImgSrc(src);
      }
    }, [src, imgSrc, placeholderSrc, error]);
    
    return (
      <div className={cn("relative overflow-hidden", containerClassName)}>
        <img
          ref={combinedRef}
          src={imgSrc}
          alt={alt}
          className={cn(
            className,
            fadeIn && "transition-opacity duration-300",
            placeholderSrc && !isLoaded && "opacity-0",
            placeholderSrc && isLoaded && "opacity-100",
            blurPlaceholder && placeholderSrc && !isLoaded && "blur-sm scale-105",
          )}
          onLoad={() => {
            if (imgSrc === src) {
              setIsLoaded(true);
            }
          }}
          onError={handleError}
          {...props}
        />
      </div>
    );
  }
);

Image.displayName = 'Image';

// Helper function to combine refs
function useCombinedRefs<T>(
  ...refs: Array<React.ForwardedRef<T> | React.RefObject<T> | null | undefined>
): React.RefCallback<T> {
  return (element: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as React.MutableRefObject<T>).current = element;
      }
    });
  };
}

export { Image };
