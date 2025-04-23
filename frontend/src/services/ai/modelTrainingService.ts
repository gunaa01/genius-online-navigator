import { apiClient } from '@/services/api/apiClient';

export interface TrainingMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc?: number;
  confusionMatrix?: number[][];
  lossHistory?: number[];
}

export interface ModelVersion {
  id: string;
  modelType: string;
  version: string;
  createdAt: string;
  trainedBy: string;
  status: 'training' | 'deployed' | 'archived' | 'failed';
  metrics?: TrainingMetrics;
  datasetSize: number;
  description?: string;
  parameters?: Record<string, any>;
}

export interface TrainingDataset {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  recordCount: number;
  features: string[];
  labels: string[];
  dataDistribution?: Record<string, number>;
  version: string;
}

export interface TrainingJob {
  id: string;
  modelType: string;
  datasetId: string;
  status: 'queued' | 'training' | 'evaluating' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  createdModelVersion?: string;
  parameters: Record<string, any>;
  metrics?: TrainingMetrics;
  logs?: string[];
}

export interface FeedbackRecord {
  id: string;
  insightId: string;
  userId: string;
  feedbackType: 'helpful' | 'not_helpful' | 'inaccurate' | 'other';
  rating?: number;
  comment?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  usedForTraining: boolean;
}

/**
 * Service for managing AI model training and feedback collection
 */
class ModelTrainingService {
  /**
   * Get all model versions
   * 
   * @param modelType Type of model to filter by
   * @returns List of model versions
   */
  public async getModelVersions(modelType?: string): Promise<ModelVersion[]> {
    try {
      const response = await apiClient.get<ModelVersion[]>('/ai/models', {
        params: { modelType }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching model versions:', error);
      return [];
    }
  }
  
  /**
   * Get details of a specific model version
   * 
   * @param versionId ID of the model version
   * @returns Model version details
   */
  public async getModelVersion(versionId: string): Promise<ModelVersion | null> {
    try {
      const response = await apiClient.get<ModelVersion>(`/ai/models/${versionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching model version ${versionId}:`, error);
      return null;
    }
  }
  
  /**
   * Get all available training datasets
   * 
   * @returns List of training datasets
   */
  public async getTrainingDatasets(): Promise<TrainingDataset[]> {
    try {
      const response = await apiClient.get<TrainingDataset[]>('/ai/datasets');
      return response.data;
    } catch (error) {
      console.error('Error fetching training datasets:', error);
      return [];
    }
  }
  
  /**
   * Get details of a specific training dataset
   * 
   * @param datasetId ID of the dataset
   * @returns Dataset details
   */
  public async getTrainingDataset(datasetId: string): Promise<TrainingDataset | null> {
    try {
      const response = await apiClient.get<TrainingDataset>(`/ai/datasets/${datasetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dataset ${datasetId}:`, error);
      return null;
    }
  }
  
  /**
   * Start a new model training job
   * 
   * @param modelType Type of model to train
   * @param datasetId ID of the dataset to use for training
   * @param parameters Training parameters
   * @returns Created training job
   */
  public async startTrainingJob(
    modelType: string,
    datasetId: string,
    parameters: Record<string, any> = {}
  ): Promise<TrainingJob | null> {
    try {
      const response = await apiClient.post<TrainingJob>('/ai/training-jobs', {
        modelType,
        datasetId,
        parameters
      });
      return response.data;
    } catch (error) {
      console.error('Error starting training job:', error);
      return null;
    }
  }
  
  /**
   * Get status of a training job
   * 
   * @param jobId ID of the training job
   * @returns Training job status
   */
  public async getTrainingJobStatus(jobId: string): Promise<TrainingJob | null> {
    try {
      const response = await apiClient.get<TrainingJob>(`/ai/training-jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching training job ${jobId}:`, error);
      return null;
    }
  }
  
  /**
   * Cancel a training job
   * 
   * @param jobId ID of the training job to cancel
   * @returns Success status
   */
  public async cancelTrainingJob(jobId: string): Promise<boolean> {
    try {
      await apiClient.post(`/ai/training-jobs/${jobId}/cancel`);
      return true;
    } catch (error) {
      console.error(`Error canceling training job ${jobId}:`, error);
      return false;
    }
  }
  
  /**
   * Deploy a model version to production
   * 
   * @param versionId ID of the model version to deploy
   * @returns Success status
   */
  public async deployModelVersion(versionId: string): Promise<boolean> {
    try {
      await apiClient.post(`/ai/models/${versionId}/deploy`);
      return true;
    } catch (error) {
      console.error(`Error deploying model version ${versionId}:`, error);
      return false;
    }
  }
  
  /**
   * Archive a model version (remove from production)
   * 
   * @param versionId ID of the model version to archive
   * @returns Success status
   */
  public async archiveModelVersion(versionId: string): Promise<boolean> {
    try {
      await apiClient.post(`/ai/models/${versionId}/archive`);
      return true;
    } catch (error) {
      console.error(`Error archiving model version ${versionId}:`, error);
      return false;
    }
  }
  
  /**
   * Submit feedback for an AI insight
   * 
   * @param insightId ID of the insight
   * @param feedbackType Type of feedback
   * @param rating Optional numeric rating
   * @param comment Optional comment
   * @returns Created feedback record
   */
  public async submitInsightFeedback(
    insightId: string,
    feedbackType: 'helpful' | 'not_helpful' | 'inaccurate' | 'other',
    rating?: number,
    comment?: string
  ): Promise<FeedbackRecord | null> {
    try {
      const response = await apiClient.post<FeedbackRecord>('/ai/feedback', {
        insightId,
        feedbackType,
        rating,
        comment,
        timestamp: new Date().toISOString(),
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting insight feedback:', error);
      return null;
    }
  }
  
  /**
   * Get feedback records for an insight
   * 
   * @param insightId ID of the insight
   * @returns List of feedback records
   */
  public async getInsightFeedback(insightId: string): Promise<FeedbackRecord[]> {
    try {
      const response = await apiClient.get<FeedbackRecord[]>(`/ai/feedback`, {
        params: { insightId }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedback for insight ${insightId}:`, error);
      return [];
    }
  }
  
  /**
   * Create a new training dataset from collected feedback
   * 
   * @param name Name of the dataset
   * @param description Description of the dataset
   * @param feedbackIds IDs of feedback records to include
   * @returns Created dataset
   */
  public async createDatasetFromFeedback(
    name: string,
    description: string,
    feedbackIds: string[]
  ): Promise<TrainingDataset | null> {
    try {
      const response = await apiClient.post<TrainingDataset>('/ai/datasets', {
        name,
        description,
        feedbackIds
      });
      return response.data;
    } catch (error) {
      console.error('Error creating dataset from feedback:', error);
      return null;
    }
  }
  
  /**
   * Get model performance metrics over time
   * 
   * @param modelType Type of model
   * @param timeRange Time range to get metrics for
   * @returns Performance metrics over time
   */
  public async getModelPerformanceHistory(
    modelType: string,
    timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<Array<{ date: string; metrics: TrainingMetrics }>> {
    try {
      const response = await apiClient.get<Array<{ date: string; metrics: TrainingMetrics }>>(
        '/ai/performance-history',
        {
          params: { modelType, timeRange }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching performance history for ${modelType}:`, error);
      return [];
    }
  }
  
  /**
   * Get feedback distribution statistics
   * 
   * @param modelType Type of model
   * @param timeRange Time range to get statistics for
   * @returns Feedback distribution statistics
   */
  public async getFeedbackDistribution(
    modelType: string,
    timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<Record<string, number>> {
    try {
      const response = await apiClient.get<Record<string, number>>(
        '/ai/feedback-distribution',
        {
          params: { modelType, timeRange }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedback distribution for ${modelType}:`, error);
      return {};
    }
  }
}

export const modelTrainingService = new ModelTrainingService();
