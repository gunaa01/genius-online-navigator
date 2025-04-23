import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Sparkles, BrainCircuit, Settings, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';

/**
 * AI Content Generator Dashboard
 * 
 * Central hub for AI-powered content generation tools
 * Includes templates, brand voice profiles, and generation history
 */
export default function AIContentDashboard({ 
  templates, 
  brandVoiceProfiles 
}: {
  templates: contentGenerationService.ContentTemplate[];
  brandVoiceProfiles: contentGenerationService.BrandVoiceProfile[];
}) {
  const router = useRouter();
  const { preferences } = useAccessibility();
  
  // Filter state
  const [templateFilter, setTemplateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = templateFilter === '' || 
      template.name.toLowerCase().includes(templateFilter.toLowerCase()) ||
      template.description.toLowerCase().includes(templateFilter.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(templateFilter.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category)));
  
  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    router.push(`/admin/ai-content/generator?template=${templateId}`);
  };
  
  // Handle create content
  const handleCreateContent = () => {
    router.push('/admin/ai-content/generator');
  };
  
  // Handle create brand voice
  const handleCreateBrandVoice = () => {
    router.push('/admin/ai-content/brand-voice');
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
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/ai-content`} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Content Generator",
              "description": "Generate high-quality content with AI.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>
      
      <AdminLayout
        title="AI Content Generator"
        description="Create high-quality content with AI"
        actions={
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateContent}
              aria-label="Create new content"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateBrandVoice}
              aria-label="Manage brand voice"
            >
              <Settings className="h-4 w-4 mr-2" />
              Brand Voice
            </Button>
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
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                  AI Content Generator
                </CardTitle>
                <CardDescription>
                  Create content for any purpose
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Generate blog posts, social media content, product descriptions, and more with AI.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={handleCreateContent}
                >
                  Create Content
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="h-5 w-5 mr-2 text-purple-500" />
                  Brand Voice Profiles
                </CardTitle>
                <CardDescription>
                  Maintain consistent brand voice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Create and manage brand voice profiles to ensure consistent messaging across all content.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleCreateBrandVoice}
                >
                  Manage Brand Voice
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Content Templates
                </CardTitle>
                <CardDescription>
                  Start with pre-built templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Choose from a variety of templates for different content types and purposes.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Templates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Templates Section */}
          <div id="templates-section">
            <Card>
              <CardHeader>
                <CardTitle>Content Templates</CardTitle>
                <CardDescription>
                  Start with pre-built templates for various content types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search templates..."
                        className="pl-8"
                        value={templateFilter}
                        onChange={(e) => setTemplateFilter(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category-filter" className="sr-only">
                      Filter by category
                    </Label>
                    <select
                      id="category-filter"
                      className="w-full md:w-auto h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {template.category}
                          </Badge>
                          {template.platforms.includes('all') ? (
                            <Badge variant="outline" className="text-xs">
                              All Platforms
                            </Badge>
                          ) : (
                            template.platforms.slice(0, 2).map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs capitalize">
                                {platform}
                              </Badge>
                            ))
                          )}
                          {template.platforms.length > 2 && template.platforms[0] !== 'all' && (
                            <Badge variant="outline" className="text-xs">
                              +{template.platforms.length - 2} more
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>Structure:</strong> {template.structure.split('\n').slice(0, 3).join(', ')}
                          {template.structure.split('\n').length > 3 && '...'}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="w-full">
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {filteredTemplates.length === 0 && (
                    <div className="col-span-full flex justify-center items-center h-40 border rounded-md">
                      <p className="text-muted-foreground">No templates found matching your criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Brand Voice Profiles */}
          {brandVoiceProfiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Brand Voice Profiles</CardTitle>
                <CardDescription>
                  Maintain consistent messaging across all content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {brandVoiceProfiles.map((profile) => (
                    <Card key={profile.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{profile.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {profile.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium">Style</p>
                            <p className="text-xs text-muted-foreground capitalize">{profile.style}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium">Tone Attributes</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.toneAttributes.map((attr) => (
                                <Badge key={attr} variant="outline" className="text-xs">
                                  {attr}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => router.push(`/admin/ai-content/brand-voice/${profile.id}`)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  <Card className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Create New Profile</CardTitle>
                      <CardDescription className="text-xs">
                        Define a new brand voice profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center py-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCreateBrandVoice}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Tips for creating great content with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Best Practices</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                      <span>Start with a clear goal and audience in mind</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                      <span>Use templates as a starting point, then customize</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                      <span>Provide specific keywords and context for better results</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">4</span>
                      <span>Always review and edit AI-generated content</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">5</span>
                      <span>Use brand voice profiles for consistent messaging</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Quick Links</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => router.push('/admin/ai-content/generator')}
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-primary" />
                      Create New Content
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => router.push('/admin/ai-content/brand-voice')}
                    >
                      <BrainCircuit className="h-4 w-4 mr-2 text-primary" />
                      Manage Brand Voice
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => router.push('/admin/social-media/content-optimizer')}
                    >
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      Optimize Existing Content
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
}

/**
 * Server-side data fetching for improved performance
 */
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch templates and brand voice profiles
    const templates = await contentGenerationService.getContentTemplates();
    const brandVoiceProfiles = await contentGenerationService.getBrandVoiceProfiles();
    
    return {
      props: {
        templates,
        brandVoiceProfiles,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty data on error
    return {
      props: {
        templates: [],
        brandVoiceProfiles: [],
      },
    };
  }
};
