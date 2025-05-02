import React, { useState, useEffect } from 'react';
import { trackEvent } from '@/components/analytics/GA4Integration';

interface ABTestingProps<T> {
  variants: Array<{
    id: string;
    weight?: number; // Optional weight for non-equal distribution (default: 1)
    component: React.ReactNode;
    data?: T; // Optional data to pass to onVariantSelected
  }>;
  testId: string;
  persistSelection?: boolean; // Whether to persist the selected variant for the user
  onVariantSelected?: (variantId: string, variantData?: T) => void;
  onConversion?: (variantId: string, conversionType: string, conversionData?: any) => void;
}

/**
 * A/B Testing Component
 * Implements A/B testing for UI components with analytics tracking
 */
function ABTesting<T = any>({
  variants,
  testId,
  persistSelection = true,
  onVariantSelected,
  onConversion
}: ABTestingProps<T>) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize the test by selecting a variant
  useEffect(() => {
    if (!variants || variants.length === 0) return;

    // Check if we have a previously selected variant in localStorage
    if (persistSelection) {
      const storedVariant = localStorage.getItem(`ab_test_${testId}`);
      if (storedVariant) {
        setSelectedVariant(storedVariant);
        setIsInitialized(true);
        
        // Notify about the selected variant
        const variantData = variants.find(v => v.id === storedVariant)?.data;
        if (onVariantSelected) {
          onVariantSelected(storedVariant, variantData);
        }
        
        // Track impression
        trackEvent('ab_test_impression', {
          test_id: testId,
          variant_id: storedVariant,
          is_returning: true
        });
        
        return;
      }
    }

    // Select a variant based on weights
    const totalWeight = variants.reduce((sum, variant) => sum + (variant.weight || 1), 0);
    let random = Math.random() * totalWeight;
    let selectedId = variants[0].id;
    
    for (const variant of variants) {
      const weight = variant.weight || 1;
      if (random < weight) {
        selectedId = variant.id;
        break;
      }
      random -= weight;
    }

    // Store the selected variant
    setSelectedVariant(selectedId);
    if (persistSelection) {
      localStorage.setItem(`ab_test_${testId}`, selectedId);
    }
    
    // Notify about the selected variant
    const variantData = variants.find(v => v.id === selectedId)?.data;
    if (onVariantSelected) {
      onVariantSelected(selectedId, variantData);
    }
    
    // Track impression
    trackEvent('ab_test_impression', {
      test_id: testId,
      variant_id: selectedId,
      is_returning: false
    });
    
    setIsInitialized(true);
  }, [testId, variants, persistSelection, onVariantSelected]);

  // Track conversion
  const trackConversion = (conversionType: string, conversionData?: any) => {
    if (!selectedVariant) return;
    
    // Track the conversion event
    trackEvent('ab_test_conversion', {
      test_id: testId,
      variant_id: selectedVariant,
      conversion_type: conversionType,
      ...conversionData
    });
    
    // Notify about the conversion
    if (onConversion) {
      onConversion(selectedVariant, conversionType, conversionData);
    }
  };

  // Render the selected variant
  if (!isInitialized || !selectedVariant) {
    // Render nothing while initializing to avoid flickering
    return null;
  }

  const variant = variants.find(v => v.id === selectedVariant);
  if (!variant) return null;

  // Clone the component and add the trackConversion prop
  if (React.isValidElement(variant.component)) {
    return React.cloneElement(variant.component as React.ReactElement, {
      trackConversion
    });
  }

  return variant.component;
}

/**
 * A/B Test CTA Button Component
 * Pre-configured A/B test for Call-to-Action buttons
 */
export const ABTestCTA: React.FC<{
  testId: string;
  variants: Array<{
    id: string;
    text: string;
    color?: 'primary' | 'secondary' | 'destructive' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    weight?: number;
  }>;
  onClick: (variantId: string) => void;
}> = ({ testId, variants, onClick }) => {
  const handleClick = (variantId: string) => {
    onClick(variantId);
  };

  const buttonVariants = variants.map(variant => ({
    id: variant.id,
    weight: variant.weight,
    component: (
      <button
        key={variant.id}
        className={`btn btn-${variant.color || 'primary'} btn-${variant.size || 'default'}`}
        onClick={() => handleClick(variant.id)}
      >
        {variant.text}
      </button>
    )
  }));

  return <ABTesting variants={buttonVariants} testId={testId} />;
};

/**
 * A/B Test Landing Page Component
 * Pre-configured A/B test for landing pages
 */
export const ABTestLandingPage: React.FC<{
  testId: string;
  variants: Array<{
    id: string;
    component: React.ReactNode;
    weight?: number;
  }>;
  onConversion?: (variantId: string, conversionType: string) => void;
}> = ({ testId, variants, onConversion }) => {
  return (
    <ABTesting
      variants={variants}
      testId={testId}
      onVariantSelected={(variantId) => {
        console.log(`Landing page variant ${variantId} shown`);
      }}
      onConversion={onConversion}
    />
  );
};

export default ABTesting;
