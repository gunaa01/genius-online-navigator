import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import BrandVoiceForm from '@/components/ai-content/BrandVoiceForm';
import BrandVoiceAnalyzer from '@/components/ai-content/BrandVoiceAnalyzer';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';

/**
 * Brand Voice Management Page
 * 
 * Page for managing brand voice profiles and analyzing content for brand voice consistency
 */
export default function BrandVoiceManagementPage({
  profiles
}: {
  profiles: contentGenerationService.BrandVoiceProfile[];
}) {
  const router = useRouter();
  const { preferences } = useAccessibility();
  
  // State
  const [activeTab, setActiveTab] = useState('profiles');
  const [brandVoiceProfiles, setBrandVoiceProfiles] = useState<contentGenerationService.BrandVoiceProfile[]>(profiles);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get selected profile
  const selectedProfile = selectedProfileId 
    ? brandVoiceProfiles.find(p => p.id === selectedProfileId)
    : undefined;
  
  // Handle create profile
  const handleCreateProfile = () => {
    setSelectedProfileId(null);
    setIsCreating(true);
    setActiveTab('create');
  };
  
  // Handle edit profile
  const handleEditProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    setIsCreating(false);
    setActiveTab('create');
  };
  
  // Handle save profile
  const handleSaveProfile = async (profileData: Omit<contentGenerationService.BrandVoiceProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSaving(true);
      
      let savedProfile: contentGenerationService.BrandVoiceProfile;
      
      if (isCreating) {
        // Create new profile
        savedProfile = await contentGenerationService.createBrandVoiceProfile(profileData);
        
        toast({
          title: 'Profile Created',
          description: 'Brand voice profile created successfully.',
        });
      } else if (selectedProfileId) {
        // Update existing profile
        savedProfile = await contentGenerationService.updateBrandVoiceProfile(selectedProfileId, profileData);
        
        toast({
          title: 'Profile Updated',
          description: 'Brand voice profile updated successfully.',
        });
      } else {
        throw new Error('Invalid state: Not creating and no profile selected');
      }
      
      // Update profiles list
      setBrandVoiceProfiles(prev => {
        const index = prev.findIndex(p => p.id === savedProfile.id);
        if (index >= 0) {
          // Update existing profile
          const updated = [...prev];
          updated[index] = savedProfile;
          return updated;
        } else {
          // Add new profile
          return [...prev, savedProfile];
        }
      });
      
      // Reset state
      setIsCreating(false);
      setSelectedProfileId(null);
      setActiveTab('profiles');
    } catch (error) {
      console.error('Error saving brand voice profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save brand voice profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle delete profile
  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this brand voice profile? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      
      // Delete profile
      await contentGenerationService.deleteBrandVoiceProfile(profileId);
      
      // Update profiles list
      setBrandVoiceProfiles(prev => prev.filter(p => p.id !== profileId));
      
      toast({
        title: 'Profile Deleted',
        description: 'Brand voice profile deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting brand voice profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete brand voice profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Brand Voice Management | Genius Online Navigator</title>
        <meta name="description" content="Manage brand voice profiles and analyze content for brand voice consistency." />
        <meta name="keywords" content="brand voice, tone of voice, content consistency, brand messaging" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Brand Voice Management | Genius Online Navigator" />
        <meta property="og:description" content="Manage brand voice profiles and analyze content for brand voice consistency." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/ai-content/brand-voice`} />
      </Head>
      
      <AdminLayout
        title="Brand Voice Management"
        description="Maintain consistent messaging across all content"
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
            {activeTab === 'profiles' && (
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateProfile}
                aria-label="Create new profile"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Profile
              </Button>
            )}
          </div>
        }
      >
        <div 
          id="main-content"
          className={`space-y-8 ${preferences.largeText ? 'text-lg' : ''}`}
          role="main"
          aria-label="Brand Voice Management"
          tabIndex={-1}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="create" disabled={isSaving}>
                {isCreating ? 'Create Profile' : selectedProfileId ? 'Edit Profile' : 'Create Profile'}
              </TabsTrigger>
              <TabsTrigger value="analyzer">Content Analyzer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profiles" className="space-y-6">
              {brandVoiceProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brandVoiceProfiles.map((profile) => (
                    <Card key={profile.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{profile.name}</CardTitle>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProfile(profile.id)}
                              disabled={isDeleting}
                              aria-label={`Edit ${profile.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProfile(profile.id)}
                              disabled={isDeleting}
                              aria-label={`Delete ${profile.name}`}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>
                          {profile.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-xs font-medium">Style</p>
                          <p className="text-sm capitalize">{profile.style}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium">Tone Attributes</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {profile.toneAttributes.map((attr) => (
                              <span key={attr} className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                {attr}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {profile.values.length > 0 && (
                          <div>
                            <p className="text-xs font-medium">Values</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.values.map((value) => (
                                <span key={value} className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                  {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {profile.prohibitedWords.length > 0 && (
                          <div>
                            <p className="text-xs font-medium">Prohibited Words</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.prohibitedWords.map((word) => (
                                <span key={word} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-xs font-medium">Example Content</p>
                          <div className="mt-1 space-y-2">
                            {profile.exampleContent.slice(0, 1).map((example, index) => (
                              <p key={index} className="text-xs text-muted-foreground italic">
                                "{example.length > 100 ? `${example.substring(0, 100)}...` : example}"
                              </p>
                            ))}
                            {profile.exampleContent.length > 1 && (
                              <p className="text-xs text-muted-foreground">
                                +{profile.exampleContent.length - 1} more examples
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Profiles Found</CardTitle>
                    <CardDescription>
                      Create your first brand voice profile to maintain consistent messaging
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-8">
                    <Button onClick={handleCreateProfile}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Why Brand Voice Matters</CardTitle>
                  <CardDescription>
                    Consistent messaging builds trust and recognition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-base font-medium">Brand Recognition</h3>
                      <p className="text-sm text-muted-foreground">
                        A consistent brand voice helps customers recognize your content across different channels and platforms.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-medium">Customer Trust</h3>
                      <p className="text-sm text-muted-foreground">
                        Consistent messaging builds trust with your audience by creating a reliable and familiar experience.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-medium">Team Alignment</h3>
                      <p className="text-sm text-muted-foreground">
                        Clear brand voice guidelines help your team create content that aligns with your brand values and personality.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="create">
              <BrandVoiceForm
                profile={selectedProfile}
                onSave={handleSaveProfile}
                isSaving={isSaving}
              />
            </TabsContent>
            
            <TabsContent value="analyzer">
              <BrandVoiceAnalyzer
                brandVoiceProfiles={brandVoiceProfiles}
              />
            </TabsContent>
          </Tabs>
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
    // Fetch brand voice profiles
    const profiles = await contentGenerationService.getBrandVoiceProfiles();
    
    return {
      props: {
        profiles,
      },
    };
  } catch (error) {
    console.error('Error fetching brand voice profiles:', error);
    
    // Return empty data on error
    return {
      props: {
        profiles: [],
      },
    };
  }
};
