import { apiClient } from '@/services/api/apiClient';

export interface SentimentAnalysisResult {
  score: number;        // -1 to 1 (negative to positive)
  magnitude: number;    // 0 to +inf (strength of emotion)
  label: 'positive' | 'negative' | 'neutral' | 'mixed';
}

export interface KeywordExtractionResult {
  keywords: Array<{
    text: string;
    relevance: number;  // 0 to 1
    count: number;
  }>;
}

export interface FeedbackCategorization {
  primaryCategory: string;
  secondaryCategories: string[];
  confidence: number;   // 0 to 1
}

export interface FeedbackPriorityScore {
  score: number;        // 0 to 1
  reasoning: string;
  suggestedPriority: 'low' | 'medium' | 'high' | 'critical';
}

export interface FeedbackAnalysisResult {
  sentiment: SentimentAnalysisResult;
  keywords: KeywordExtractionResult;
  categorization: FeedbackCategorization;
  priority: FeedbackPriorityScore;
  actionable: boolean;
  suggestedResponse?: string;
  relatedFeedbackIds?: string[];
}

/**
 * Service for analyzing user feedback using AI techniques
 */
class FeedbackAnalysisService {
  /**
   * Analyze feedback text to extract sentiment, keywords, and categorization
   * 
   * @param text The feedback text to analyze
   * @param context Additional context about where the feedback was submitted
   * @returns Analysis results including sentiment, keywords, and categorization
   */
  public async analyzeFeedback(
    text: string, 
    context?: {
      featureId?: string;
      featureName?: string;
      path?: string;
      feedbackType?: string;
    }
  ): Promise<FeedbackAnalysisResult> {
    try {
      const response = await apiClient.post<FeedbackAnalysisResult>(
        '/feedback/analyze', 
        { text, context }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      
      // Return fallback analysis if the API fails
      return this.getFallbackAnalysis(text);
    }
  }
  
  /**
   * Get similar feedback items based on content similarity
   * 
   * @param feedbackId The ID of the feedback to find similar items for
   * @param limit Maximum number of similar items to return
   * @returns Array of similar feedback IDs with similarity scores
   */
  public async getSimilarFeedback(
    feedbackId: string,
    limit: number = 5
  ): Promise<Array<{ id: string; similarity: number }>> {
    try {
      const response = await apiClient.get(`/feedback/${feedbackId}/similar`, {
        params: { limit }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting similar feedback:', error);
      return [];
    }
  }
  
  /**
   * Generate a response to user feedback using AI
   * 
   * @param feedbackId The ID of the feedback to generate a response for
   * @returns Suggested response text
   */
  public async generateFeedbackResponse(
    feedbackId: string
  ): Promise<string> {
    try {
      const response = await apiClient.get(`/feedback/${feedbackId}/generate-response`);
      return response.data.response;
    } catch (error) {
      console.error('Error generating feedback response:', error);
      return '';
    }
  }
  
  /**
   * Provide a basic fallback analysis when the API is unavailable
   * Uses simple rule-based approach instead of AI
   * 
   * @param text The feedback text to analyze
   * @returns Basic analysis results
   */
  private getFallbackAnalysis(text: string): FeedbackAnalysisResult {
    const lowerText = text.toLowerCase();
    
    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'helpful', 'useful'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'dislike', 'difficult', 'confusing'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    const sentimentScore = (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount);
    
    // Simple keyword extraction
    const words = lowerText.split(/\W+/).filter(word => word.length > 3);
    const wordCounts: Record<string, number> = {};
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    const keywords = Object.entries(wordCounts)
      .map(([text, count]) => ({ 
        text, 
        count, 
        relevance: Math.min(count / 10, 1) 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Simple categorization
    let primaryCategory = 'general';
    if (lowerText.includes('bug') || lowerText.includes('error') || lowerText.includes('issue')) {
      primaryCategory = 'bug';
    } else if (lowerText.includes('feature') || lowerText.includes('add') || lowerText.includes('would be nice')) {
      primaryCategory = 'feature request';
    } else if (lowerText.includes('confusing') || lowerText.includes('difficult') || lowerText.includes('hard to')) {
      primaryCategory = 'usability';
    }
    
    return {
      sentiment: {
        score: sentimentScore,
        magnitude: Math.abs(sentimentScore) * 2,
        label: sentimentScore > 0.3 ? 'positive' : 
               sentimentScore < -0.3 ? 'negative' : 'neutral'
      },
      keywords: {
        keywords
      },
      categorization: {
        primaryCategory,
        secondaryCategories: [],
        confidence: 0.6
      },
      priority: {
        score: lowerText.includes('urgent') || lowerText.includes('critical') ? 0.9 : 0.5,
        reasoning: 'Fallback priority calculation',
        suggestedPriority: lowerText.includes('urgent') || lowerText.includes('critical') ? 
                          'high' : 'medium'
      },
      actionable: lowerText.length > 20
    };
  }
}

export const feedbackAnalysisService = new FeedbackAnalysisService();
