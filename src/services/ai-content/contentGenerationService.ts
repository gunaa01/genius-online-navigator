import { enhancedApiClient, mockApiResponse } from '@/services/apiClient';

/**
 * Content Template
 */
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  structure: string;
  placeholders: string[];
  platforms: string[];
  tags: string[];
}

/**
 * Content Generation Request
 */
export interface ContentGenerationRequest {
  topic: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'enthusiastic' | 'informative' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
  platform?: string;
  templateId?: string;
  industry?: string;
  audience?: string;
  brandVoice?: {
    style?: string;
    values?: string[];
    prohibitedWords?: string[];
  };
  includeCta?: boolean;
  includeHashtags?: boolean;
  seoOptimize?: boolean;
}

/**
 * Generated Content
 */
export interface GeneratedContent {
  id: string;
  content: string;
  title?: string;
  hashtags?: string[];
  keywords?: string[];
  seoScore?: number;
  readabilityScore?: number;
  engagementScore?: number;
  brandVoiceScore?: number;
  metadata: {
    generatedAt: string;
    model: string;
    requestId: string;
    topic: string;
    platform?: string;
    tone?: string;
  };
  variations?: string[];
}

/**
 * Brand Voice Profile
 */
export interface BrandVoiceProfile {
  id: string;
  name: string;
  description: string;
  style: string;
  toneAttributes: string[];
  values: string[];
  prohibitedWords: string[];
  exampleContent: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Get content templates
 * @param category Filter by category
 * @param platform Filter by platform
 * @returns List of content templates
 */
export const getContentTemplates = async (
  category?: string,
  platform?: string
): Promise<ContentTemplate[]> => {
  try {
    const response = await enhancedApiClient.get('/ai-content/templates', {
      params: { category, platform },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content templates:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: 'product-announcement',
        name: 'Product Announcement',
        description: 'Announce a new product or feature',
        category: 'marketing',
        structure: 'Introduction\nProduct Details\nBenefits\nAvailability\nCall to Action',
        placeholders: ['[PRODUCT_NAME]', '[KEY_FEATURES]', '[BENEFITS]', '[AVAILABILITY_DATE]', '[CTA]'],
        platforms: ['all'],
        tags: ['product', 'announcement', 'marketing'],
      },
      {
        id: 'how-to-guide',
        name: 'How-To Guide',
        description: 'Step-by-step instructions for completing a task',
        category: 'educational',
        structure: 'Introduction\nProblem Statement\nSolution Overview\nStep-by-Step Guide\nConclusion\nCall to Action',
        placeholders: ['[TOPIC]', '[PROBLEM]', '[SOLUTION]', '[STEPS]', '[CONCLUSION]', '[CTA]'],
        platforms: ['blog', 'linkedin'],
        tags: ['guide', 'tutorial', 'educational'],
      },
      {
        id: 'customer-testimonial',
        name: 'Customer Testimonial',
        description: 'Showcase a customer success story',
        category: 'social',
        structure: 'Introduction\nCustomer Background\nChallenge\nSolution\nResults\nQuote\nCall to Action',
        placeholders: ['[CUSTOMER_NAME]', '[CUSTOMER_BACKGROUND]', '[CHALLENGE]', '[SOLUTION]', '[RESULTS]', '[QUOTE]', '[CTA]'],
        platforms: ['all'],
        tags: ['testimonial', 'success', 'customer'],
      },
      {
        id: 'industry-insights',
        name: 'Industry Insights',
        description: 'Share insights and trends about your industry',
        category: 'thought-leadership',
        structure: 'Introduction\nTrend Overview\nData Points\nAnalysis\nImplications\nConclusion\nCall to Action',
        placeholders: ['[INDUSTRY]', '[TREND]', '[DATA_POINTS]', '[ANALYSIS]', '[IMPLICATIONS]', '[CONCLUSION]', '[CTA]'],
        platforms: ['linkedin', 'twitter', 'blog'],
        tags: ['insights', 'trends', 'thought-leadership'],
      },
      {
        id: 'event-promotion',
        name: 'Event Promotion',
        description: 'Promote an upcoming event',
        category: 'marketing',
        structure: 'Introduction\nEvent Details\nBenefits of Attending\nSpeakers/Highlights\nRegistration Information\nCall to Action',
        placeholders: ['[EVENT_NAME]', '[EVENT_DATE]', '[EVENT_LOCATION]', '[BENEFITS]', '[SPEAKERS]', '[REGISTRATION_LINK]', '[CTA]'],
        platforms: ['all'],
        tags: ['event', 'promotion', 'marketing'],
      },
    ]);
  }
};

/**
 * Get content template by ID
 * @param id Template ID
 * @returns Content template
 */
export const getContentTemplateById = async (id: string): Promise<ContentTemplate> => {
  try {
    const response = await enhancedApiClient.get(`/ai-content/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching content template ${id}:`, error);
    
    // Return mock data for development
    const templates = await getContentTemplates();
    const template = templates.find(t => t.id === id);
    
    if (!template) {
      throw new Error(`Template with ID ${id} not found`);
    }
    
    return template;
  }
};

/**
 * Generate content based on request parameters
 * @param request Content generation request
 * @returns Generated content
 */
export const generateContent = async (
  request: ContentGenerationRequest
): Promise<GeneratedContent> => {
  try {
    const response = await enhancedApiClient.post('/ai-content/generate', request);
    return response.data;
  } catch (error) {
    console.error('Error generating content:', error);
    
    // Return mock data for development
    const shortContent = `Check out our latest ${request.topic} that helps you save time! #ProductivityTips`;
    
    const mediumContent = `We're excited to announce our newest ${request.topic} that helps you save time and boost productivity! Try it today and let us know what you think. #ProductivityTips #Innovation`;
    
    const longContent = `We're thrilled to unveil our latest innovation: a game-changing ${request.topic} designed to streamline your workflow and boost productivity!

After months of development and customer feedback, this new capability helps you accomplish more in less time by automating repetitive tasks and providing intelligent suggestions.

Have you tried it yet? We'd love to hear your thoughts in the comments below!

#ProductivityTips #Innovation #WorkSmarter #DigitalTransformation`;

    // Determine content based on requested length
    let content = '';
    switch (request.length) {
      case 'short':
        content = shortContent;
        break;
      case 'long':
        content = longContent;
        break;
      case 'medium':
      default:
        content = mediumContent;
        break;
    }
    
    // Generate mock hashtags if requested
    const hashtags = request.includeHashtags ? [
      'ProductivityTips',
      'Innovation',
      'WorkSmarter',
      request.topic.replace(/\s+/g, ''),
    ] : undefined;
    
    return mockApiResponse({
      id: `gen-${Date.now()}`,
      content,
      title: request.topic.charAt(0).toUpperCase() + request.topic.slice(1),
      hashtags,
      keywords: request.keywords || [request.topic],
      seoScore: 85,
      readabilityScore: 92,
      engagementScore: 78,
      brandVoiceScore: 90,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gpt-4',
        requestId: `req-${Date.now()}`,
        topic: request.topic,
        platform: request.platform,
        tone: request.tone,
      },
      variations: [
        `Introducing our innovative ${request.topic} that will revolutionize how you work!`,
        `New ${request.topic} alert! Discover how this can transform your productivity.`,
        `Just launched: Our ${request.topic} that our customers have been asking for.`,
      ],
    });
  }
};

/**
 * Generate content variations
 * @param contentId Original content ID
 * @param count Number of variations to generate
 * @returns List of content variations
 */
export const generateContentVariations = async (
  contentId: string,
  count: number = 3
): Promise<string[]> => {
  try {
    const response = await enhancedApiClient.post(`/ai-content/variations/${contentId}`, {
      count,
    });
    return response.data.variations;
  } catch (error) {
    console.error(`Error generating variations for content ${contentId}:`, error);
    
    // Return mock data for development
    return mockApiResponse([
      'Introducing our innovative solution that will revolutionize how you work!',
      'New feature alert! Discover how this can transform your productivity.',
      'Just launched: The solution that our customers have been asking for.',
      'Excited to share our latest innovation that helps you work smarter, not harder.',
    ]);
  }
};

/**
 * Get brand voice profiles
 * @returns List of brand voice profiles
 */
export const getBrandVoiceProfiles = async (): Promise<BrandVoiceProfile[]> => {
  try {
    const response = await enhancedApiClient.get('/ai-content/brand-voices');
    return response.data;
  } catch (error) {
    console.error('Error fetching brand voice profiles:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: 'professional',
        name: 'Professional',
        description: 'Formal and authoritative tone for business communications',
        style: 'formal',
        toneAttributes: ['authoritative', 'credible', 'clear', 'concise'],
        values: ['expertise', 'reliability', 'professionalism'],
        prohibitedWords: ['slang', 'jargon', 'buzzwords'],
        exampleContent: [
          'We are pleased to announce the launch of our new enterprise solution.',
          'Our research indicates significant improvements in productivity when implementing these strategies.',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'friendly',
        name: 'Friendly',
        description: 'Warm and approachable tone for customer communications',
        style: 'casual',
        toneAttributes: ['warm', 'approachable', 'helpful', 'conversational'],
        values: ['customer-focus', 'helpfulness', 'accessibility'],
        prohibitedWords: ['technical jargon', 'complex terminology'],
        exampleContent: [
          'Hey there! We're excited to share our latest update with you.',
          'We'd love to hear your thoughts on our new feature. Drop us a comment below!',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'innovative',
        name: 'Innovative',
        description: 'Forward-thinking and dynamic tone for thought leadership',
        style: 'enthusiastic',
        toneAttributes: ['dynamic', 'forward-thinking', 'bold', 'visionary'],
        values: ['innovation', 'creativity', 'leadership'],
        prohibitedWords: ['outdated', 'traditional', 'conventional'],
        exampleContent: [
          'We're revolutionizing the industry with our groundbreaking approach.',
          'Our cutting-edge technology is transforming how businesses operate in the digital age.',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }
};

/**
 * Create brand voice profile
 * @param profile Brand voice profile
 * @returns Created profile
 */
export const createBrandVoiceProfile = async (
  profile: Omit<BrandVoiceProfile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<BrandVoiceProfile> => {
  try {
    const response = await enhancedApiClient.post('/ai-content/brand-voices', profile);
    return response.data;
  } catch (error) {
    console.error('Error creating brand voice profile:', error);
    throw error;
  }
};

/**
 * Update brand voice profile
 * @param id Profile ID
 * @param profile Updated profile data
 * @returns Updated profile
 */
export const updateBrandVoiceProfile = async (
  id: string,
  profile: Partial<Omit<BrandVoiceProfile, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<BrandVoiceProfile> => {
  try {
    const response = await enhancedApiClient.put(`/ai-content/brand-voices/${id}`, profile);
    return response.data;
  } catch (error) {
    console.error(`Error updating brand voice profile ${id}:`, error);
    throw error;
  }
};

/**
 * Delete brand voice profile
 * @param id Profile ID
 * @returns Success status
 */
export const deleteBrandVoiceProfile = async (
  id: string
): Promise<{ success: boolean }> => {
  try {
    const response = await enhancedApiClient.delete(`/ai-content/brand-voices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting brand voice profile ${id}:`, error);
    throw error;
  }
};

/**
 * Analyze content for brand voice consistency
 * @param content Content to analyze
 * @param brandVoiceId Brand voice profile ID
 * @returns Analysis results
 */
export const analyzeBrandVoiceConsistency = async (
  content: string,
  brandVoiceId: string
): Promise<{
  score: number;
  matchedAttributes: string[];
  unmatchedAttributes: string[];
  prohibitedWords: { word: string; index: number }[];
  suggestions: string[];
}> => {
  try {
    const response = await enhancedApiClient.post('/ai-content/analyze-brand-voice', {
      content,
      brandVoiceId,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing brand voice consistency:', error);
    
    // Return mock data for development
    return mockApiResponse({
      score: 85,
      matchedAttributes: ['clear', 'concise', 'authoritative'],
      unmatchedAttributes: ['credible'],
      prohibitedWords: [
        { word: 'jargon', index: content.indexOf('jargon') },
      ],
      suggestions: [
        'Add more data points to increase credibility',
        'Replace "jargon" with more specific terminology',
        'Consider adding industry examples to strengthen authority',
      ],
    });
  }
};

/**
 * Generate SEO-optimized content
 * @param topic Content topic
 * @param keywords Target keywords
 * @param length Content length
 * @returns SEO-optimized content
 */
export const generateSeoContent = async (
  topic: string,
  keywords: string[],
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<{
  content: string;
  title: string;
  metaDescription: string;
  keywordDensity: { keyword: string; count: number; density: number }[];
  readabilityScore: number;
  seoScore: number;
  suggestions: string[];
}> => {
  try {
    const response = await enhancedApiClient.post('/ai-content/seo-optimize', {
      topic,
      keywords,
      length,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating SEO-optimized content:', error);
    
    // Return mock data for development
    const shortContent = `Learn how ${topic} can improve your business efficiency. Our ${keywords[0]} solutions are designed to help you achieve more with less effort.`;
    
    const mediumContent = `Discover how ${topic} is transforming businesses today. Our innovative ${keywords[0]} solutions are designed to streamline your operations and boost productivity. With advanced ${keywords[1]} capabilities, you can focus on what matters most to your business.`;
    
    const longContent = `Are you looking to improve your business efficiency with ${topic}? Look no further.

Our cutting-edge ${keywords[0]} solutions are specifically designed to help businesses like yours overcome common challenges and achieve better results. By implementing our ${keywords[1]} technology, you can streamline operations, reduce costs, and improve customer satisfaction.

Many businesses struggle with ${keywords[2]} issues, but our approach provides a comprehensive solution that addresses these pain points directly. Our clients have reported up to 30% improvement in efficiency after implementing our solutions.

Ready to transform your business with ${topic}? Contact us today for a free consultation.`;

    // Determine content based on requested length
    let content = '';
    switch (length) {
      case 'short':
        content = shortContent;
        break;
      case 'long':
        content = longContent;
        break;
      case 'medium':
      default:
        content = mediumContent;
        break;
    }
    
    return mockApiResponse({
      content,
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}: Boost Your Business with ${keywords[0]}`,
      metaDescription: `Learn how our ${keywords[0]} solutions can help your business leverage ${topic} to improve efficiency and productivity.`,
      keywordDensity: keywords.map((keyword, index) => ({
        keyword,
        count: 3 - index,
        density: (3 - index) / (content.length / 100),
      })),
      readabilityScore: 85,
      seoScore: 92,
      suggestions: [
        'Add more instances of the primary keyword',
        'Include the keyword in H2 headings',
        'Add internal links to related content',
        'Include a call-to-action',
      ],
    });
  }
};

/**
 * Personalize content for target audience
 * @param content Original content
 * @param audience Target audience
 * @param industry Target industry
 * @returns Personalized content
 */
export const personalizeContent = async (
  content: string,
  audience: string,
  industry?: string
): Promise<{
  content: string;
  audienceRelevanceScore: number;
  industryRelevanceScore: number;
  personalizationChanges: { original: string; personalized: string }[];
}> => {
  try {
    const response = await enhancedApiClient.post('/ai-content/personalize', {
      content,
      audience,
      industry,
    });
    return response.data;
  } catch (error) {
    console.error('Error personalizing content:', error);
    
    // Return mock data for development
    // Create a personalized version based on audience
    let personalizedContent = content;
    
    if (audience === 'executives') {
      personalizedContent = content.replace(/improve/g, 'optimize ROI').replace(/solution/g, 'strategic solution');
    } else if (audience === 'technical') {
      personalizedContent = content.replace(/improve/g, 'technically enhance').replace(/solution/g, 'technical implementation');
    } else if (audience === 'marketing') {
      personalizedContent = content.replace(/improve/g, 'drive engagement').replace(/solution/g, 'marketing solution');
    }
    
    return mockApiResponse({
      content: personalizedContent,
      audienceRelevanceScore: 88,
      industryRelevanceScore: industry ? 85 : 70,
      personalizationChanges: [
        { original: 'improve', personalized: personalizedContent.includes('optimize ROI') ? 'optimize ROI' : personalizedContent.includes('technically enhance') ? 'technically enhance' : 'drive engagement' },
        { original: 'solution', personalized: personalizedContent.includes('strategic solution') ? 'strategic solution' : personalizedContent.includes('technical implementation') ? 'technical implementation' : 'marketing solution' },
      ],
    });
  }
};
