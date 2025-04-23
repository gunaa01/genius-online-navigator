import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, History } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import GeneratorForm from '@/components/ai-content/GeneratorForm';
import ContentPreview from '@/components/ai-content/ContentPreview';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';

/**
 * AI Content Generator Page
 * 
 * Main page for generating content with AI
 * Includes form for parameters and preview of generated content
 */
export default function ContentGeneratorPage({
  templates,
  brandVoiceProfiles,
  initialTemplate
}: {
  templates: contentGenerationService.ContentTemplate[];
  brandVoiceProfiles: contentGenerationService.BrandVoiceProfile[];
  initialTemplate?: contentGenerationService.ContentTemplate;
}) {
  const router = useRouter();
  const { preferences } = useAccessibility();
  
  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<contentGenerationService.GeneratedContent | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<contentGenerationService.ContentTemplate | undefined>(initialTemplate);
  
  // Handle content generation
  const handleContentGenerated = (content: contentGenerationService.GeneratedContent) => {
    setGeneratedContent(content);
    
    // Scroll to preview
    setTimeout(() => {
      document.getElementById('content-preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Handle regenerate content
  const handleRegenerateContent = () => {
    // Scroll to form
    document.getElementById('generator-form')?.scrollIntoView({ behavior: 'smooth' });
    
    toast({
      title: 'Ready to Regenerate',
      description: 'Make any changes to the parameters and generate again.',
    });
  };
  
  // Handle save content
  const handleSaveContent = (content: string) => {
    if (generatedContent) {
      // In a real implementation, this would save to the database
      // For now, just update the local state
      setGeneratedContent({
        ...generatedContent,
        content
      });
      
      toast({
        title: 'Content Saved',
        description: 'Your content has been saved successfully.',
      });
    }
  };
  
  return (
    <>
      <Head>
        <title>AI Content Generator | Genius Online Navigator</title>
        <meta name="description" content="Generate high-quality content with AI. Create blog posts, social media content, product descriptions, and more." />
        <meta name="keywords" content="AI content generator, content creation, AI writing, content templates" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Content Generator | Genius Online Navigator" />
        <meta property="og:description" content="Generate high-quality content with AI." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/ai-content/generator`} />
      </Head>
      
      <AdminLayout
        title="AI Content Generator"
        description="Create high-quality content with AI"
        actions={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {generatedContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/ai-content/history')}
                aria-label="View history"
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            )}
          </div>
        }
      >
        <div 
          id="main-content"
          className={`space-y-8 ${preferences.largeText ? 'text-lg' : ''}`}
          role="main"
          aria-label="AI Content Generator"
          tabIndex={-1}
        >
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Template: {selectedTemplate.name}</CardTitle>
                <CardDescription>
                  {selectedTemplate.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Structure</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {selectedTemplate.structure}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium mr-2">Platforms:</span>
                    {selectedTemplate.platforms.map((platform) => (
                      <span key={platform} className="text-sm text-muted-foreground">
                        {platform === 'all' ? 'All Platforms' : platform}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(undefined)}
                  >
                    Change Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Select a Template</CardTitle>
                <CardDescription>
                  Choose a template or start from scratch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedTemplate(undefined)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">Start from Scratch</CardTitle>
                      <CardDescription>
                        Create content without a template
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Full flexibility to create any type of content
                      </p>
                    </CardContent>
                  </Card>
                  
                  {templates.slice(0, 5).map((template) => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {template.structure.split('\n').slice(0, 2).join(', ')}
                          {template.structure.split('\n').length > 2 && '...'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {templates.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="link"
                      onClick={() => router.push('/admin/ai-content')}
                    >
                      View All Templates
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <div id="generator-form">
            <GeneratorForm
              template={selectedTemplate}
              brandVoiceProfiles={brandVoiceProfiles}
              onContentGenerated={handleContentGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>
          
          {generatedContent && (
            <div id="content-preview">
              <ContentPreview
                generatedContent={generatedContent}
                onRegenerateContent={handleRegenerateContent}
                onSaveContent={handleSaveContent}
                isRegenerating={isGenerating}
              />
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}

/**
 * Server-side data fetching for improved performance
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Get template ID from query params
    const { template: templateId } = context.query;
    
    // Fetch templates and brand voice profiles
    const templates = await contentGenerationService.getContentTemplates();
    const brandVoiceProfiles = await contentGenerationService.getBrandVoiceProfiles();
    
    // Find selected template if provided
    let initialTemplate;
    if (templateId && typeof templateId === 'string') {
      initialTemplate = templates.find(t => t.id === templateId);
      
      if (!initialTemplate) {
        // If template not found in initial list, try to fetch it directly
        try {
          initialTemplate = await contentGenerationService.getContentTemplateById(templateId);
        } catch (error) {
          console.error(`Template with ID ${templateId} not found:`, error);
        }
      }
    }
    
    return {
      props: {
        templates,
        brandVoiceProfiles,
        initialTemplate: initialTemplate || null,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty data on error
    return {
      props: {
        templates: [],
        brandVoiceProfiles: [],
        initialTemplate: null,
      },
    };
  }
};
