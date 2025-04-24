import axios from 'axios';
import type { ContentFormValues } from '../components/ai/ContentForm';

// Interface for content generation response
interface GenerateContentResponse {
  content: string;
  metadata: {
    contentType: string;
    wordCount: number;
    characters: number;
    estimatedReadTime: string;
    seoScore?: number;
  };
}

// Error interface
interface ApiError {
  message: string;
  code: string;
}

// Mock data for development (remove in production)
const mockResponse = (formValues: ContentFormValues): GenerateContentResponse => {
  const { contentType, topic, keywords, tone, length } = formValues;
  
  let wordCount = 0;
  switch (length) {
    case 'short': wordCount = Math.floor(Math.random() * 100) + 100; break;
    case 'medium': wordCount = Math.floor(Math.random() * 200) + 300; break;
    case 'long': wordCount = Math.floor(Math.random() * 500) + 800; break;
    default: wordCount = 300;
  }
  
  const readTime = Math.ceil(wordCount / 200); // Average reading speed
  
  return {
    content: `# ${topic}\n\nThis is a mock ${contentType} about ${topic} written in a ${tone} tone. ${keywords ? `It includes keywords like ${keywords}.` : ''}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    metadata: {
      contentType,
      wordCount,
      characters: wordCount * 5,
      estimatedReadTime: `${readTime} min${readTime > 1 ? 's' : ''}`,
      seoScore: Math.floor(Math.random() * 30) + 70
    }
  };
};

// Main API class for AI services
class AIService {
  private baseUrl: string;
  private apiKey: string | null;
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_AI_API_URL || 'https://api.example.com/ai';
    this.apiKey = import.meta.env.VITE_AI_API_KEY || null;
  }
  
  /**
   * Generate content based on form values
   */
  async generateContent(formValues: ContentFormValues): Promise<GenerateContentResponse> {
    try {
      // For development without API, return mock data
      if (!this.apiKey || import.meta.env.DEV) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return mockResponse(formValues);
      }
      
      // Real API call
      const response = await axios.post<GenerateContentResponse>(
        `${this.baseUrl}/generate`, 
        formValues,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error generating content:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiError;
        throw new Error(apiError.message || 'Failed to generate content');
      }
      
      throw new Error('Failed to connect to AI service');
    }
  }
  
  /**
   * Improve existing content with AI suggestions
   */
  async improveContent(content: string, focus: 'seo' | 'readability' | 'engagement' = 'readability'): Promise<string> {
    try {
      // Mock implementation for development
      if (!this.apiKey || import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `${content}\n\n[AI Improved for ${focus}]: This content has been enhanced for better ${focus}.`;
      }
      
      // Real API call
      const response = await axios.post<{ improvedContent: string }>(
        `${this.baseUrl}/improve`,
        { content, focus },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.improvedContent;
    } catch (error) {
      console.error('Error improving content:', error);
      throw new Error('Failed to improve content');
    }
  }
  
  /**
   * Analyze content for SEO and readability metrics
   */
  async analyzeContent(content: string, keywords?: string): Promise<{
    seoScore: number;
    readabilityScore: number;
    suggestions: string[];
  }> {
    try {
      // Mock implementation for development
      if (!this.apiKey || import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          seoScore: Math.floor(Math.random() * 30) + 70,
          readabilityScore: Math.floor(Math.random() * 20) + 80,
          suggestions: [
            "Add more heading tags to structure your content",
            "Consider using more keywords in the first paragraph",
            "Your content could be more engaging with examples"
          ]
        };
      }
      
      // Real API call
      const response = await axios.post(
        `${this.baseUrl}/analyze`,
        { content, keywords },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw new Error('Failed to analyze content');
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();
export default aiService; 