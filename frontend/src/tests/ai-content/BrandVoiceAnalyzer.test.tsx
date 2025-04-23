import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BrandVoiceAnalyzer from '@/components/ai-content/BrandVoiceAnalyzer';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';
import { toast } from '@/components/ui/use-toast';

// Mock dependencies
vi.mock('@/services/ai-content/contentGenerationService', () => ({
  analyzeBrandVoiceConsistency: vi.fn(),
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock data
const mockBrandVoiceProfiles = [
  {
    id: 'bv-1',
    name: 'Professional',
    description: 'Professional and authoritative tone',
    style: 'formal',
    toneAttributes: ['professional', 'authoritative', 'clear'],
    values: ['expertise', 'trust'],
    prohibitedWords: ['slang', 'jargon'],
    exampleContent: ['Example professional content'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'bv-2',
    name: 'Casual',
    description: 'Casual and friendly tone',
    style: 'casual',
    toneAttributes: ['friendly', 'conversational', 'approachable'],
    values: ['authenticity', 'simplicity'],
    prohibitedWords: ['complex', 'technical'],
    exampleContent: ['Example casual content'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// Mock analysis result
const mockAnalysisResult = {
  score: 85,
  matchedAttributes: ['professional', 'clear'],
  unmatchedAttributes: ['authoritative'],
  prohibitedWords: [{ word: 'jargon', index: 10 }],
  suggestions: ['Consider using more authoritative language'],
};

describe('BrandVoiceAnalyzer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders brand voice analyzer correctly', () => {
    render(
      <BrandVoiceAnalyzer brandVoiceProfiles={mockBrandVoiceProfiles} />
    );

    // Check if component title is rendered
    expect(screen.getByText('Brand Voice Analyzer')).toBeInTheDocument();
    
    // Check if brand voice dropdown is rendered
    expect(screen.getByRole('combobox', { name: 'Brand Voice Profile' })).toBeInTheDocument();
    
    // Check if content textarea is rendered
    expect(screen.getByRole('textbox', { name: 'Content to Analyze' })).toBeInTheDocument();
    
    // Check if analyze button is rendered and disabled initially
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });
    expect(analyzeButton).toBeInTheDocument();
    expect(analyzeButton).toBeDisabled();
  });

  it('enables analyze button when content and brand voice are provided', () => {
    render(
      <BrandVoiceAnalyzer brandVoiceProfiles={mockBrandVoiceProfiles} />
    );

    // Select brand voice
    const brandVoiceSelect = screen.getByRole('combobox', { name: 'Brand Voice Profile' });
    fireEvent.click(brandVoiceSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Professional' }));
    
    // Enter content
    const contentTextarea = screen.getByRole('textbox', { name: 'Content to Analyze' });
    fireEvent.change(contentTextarea, { target: { value: 'Sample content to analyze' } });
    
    // Check if analyze button is enabled
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });
    expect(analyzeButton).not.toBeDisabled();
  });

  it('shows selected profile details when profile is selected', () => {
    render(
      <BrandVoiceAnalyzer brandVoiceProfiles={mockBrandVoiceProfiles} />
    );

    // Select brand voice
    const brandVoiceSelect = screen.getByRole('combobox', { name: 'Brand Voice Profile' });
    fireEvent.click(brandVoiceSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Professional' }));
    
    // Check if profile details are shown
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Professional and authoritative tone')).toBeInTheDocument();
    expect(screen.getByText('professional')).toBeInTheDocument();
    expect(screen.getByText('authoritative')).toBeInTheDocument();
    expect(screen.getByText('clear')).toBeInTheDocument();
  });

  it('analyzes content successfully', async () => {
    // Mock successful analysis
    (contentGenerationService.analyzeBrandVoiceConsistency as any).mockResolvedValueOnce(mockAnalysisResult);
    
    render(
      <BrandVoiceAnalyzer brandVoiceProfiles={mockBrandVoiceProfiles} />
    );

    // Select brand voice
    const brandVoiceSelect = screen.getByRole('combobox', { name: 'Brand Voice Profile' });
    fireEvent.click(brandVoiceSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Professional' }));
    
    // Enter content
    const contentTextarea = screen.getByRole('textbox', { name: 'Content to Analyze' });
    fireEvent.change(contentTextarea, { target: { value: 'Sample content to analyze' } });
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });
    fireEvent.click(analyzeButton);
    
    // Check if service was called with correct params
    expect(contentGenerationService.analyzeBrandVoiceConsistency).toHaveBeenCalledWith(
      'Sample content to analyze',
      'bv-1'
    );
    
    // Wait for analysis results to be displayed
    await waitFor(() => {
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
      expect(screen.getByText('85/100')).toBeInTheDocument();
      expect(screen.getByText('professional')).toBeInTheDocument();
      expect(screen.getByText('authoritative')).toBeInTheDocument();
      expect(screen.getByText('jargon')).toBeInTheDocument();
      expect(screen.getByText('Consider using more authoritative language')).toBeInTheDocument();
    });
    
    // Check if toast was shown
    expect(toast).toHaveBeenCalledWith({
      title: 'Analysis Complete',
      description: 'Your content has been analyzed for brand voice consistency.',
    });
  });

  it('handles analysis error correctly', async () => {
    // Mock analysis error
    (contentGenerationService.analyzeBrandVoiceConsistency as any).mockRejectedValueOnce(
      new Error('Analysis failed')
    );
    
    render(
      <BrandVoiceAnalyzer brandVoiceProfiles={mockBrandVoiceProfiles} />
    );

    // Select brand voice
    const brandVoiceSelect = screen.getByRole('combobox', { name: 'Brand Voice Profile' });
    fireEvent.click(brandVoiceSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Professional' }));
    
    // Enter content
    const contentTextarea = screen.getByRole('textbox', { name: 'Content to Analyze' });
    fireEvent.change(contentTextarea, { target: { value: 'Sample content to analyze' } });
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });
    fireEvent.click(analyzeButton);
    
    // Wait for error toast to be shown
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to analyze content. Please try again.',
        variant: 'destructive',
      });
    });
  });

  it('validates inputs before analysis', async () => {
    render(
      <BrandVoiceAnalyzer brandVoiceProfiles={mockBrandVoiceProfiles} />
    );

    // Try to analyze without content
    const brandVoiceSelect = screen.getByRole('combobox', { name: 'Brand Voice Profile' });
    fireEvent.click(brandVoiceSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Professional' }));
    
    // Analyze button should be disabled
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });
    expect(analyzeButton).toBeDisabled();
    
    // Enter content but clear brand voice
    const contentTextarea = screen.getByRole('textbox', { name: 'Content to Analyze' });
    fireEvent.change(contentTextarea, { target: { value: 'Sample content to analyze' } });
    
    // Force click analyze without brand voice (simulating a bug or edge case)
    // This would normally be disabled in the UI but we're testing the validation logic
    fireEvent.click(analyzeButton);
    
    // Service should not be called
    expect(contentGenerationService.analyzeBrandVoiceConsistency).not.toHaveBeenCalled();
  });
});
