import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, BarChart2, MessageSquare, Users, Settings } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

/**
 * Social Media Dashboard Page
 * 
 * Unified dashboard for managing social media across platforms
 * Includes scheduling, analytics, and engagement tracking
 */
export default function SocialMediaDashboard({ initialData }: { initialData: any }) {
  const { preferences } = useAccessibility();
  
  return (
    <>
      <Head>
        <title>Social Media Dashboard | Genius Online Navigator</title>
        <meta name="description" content="Manage and analyze your social media presence across platforms. Schedule posts, track engagement, and optimize your strategy." />
        <meta name="keywords" content="social media, dashboard, analytics, scheduling, engagement" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Social Media Dashboard | Genius Online Navigator" />
        <meta property="og:description" content="Manage and analyze your social media presence across platforms." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/social-media`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Social Media Dashboard | Genius Online Navigator" />
        <meta name="twitter:description" content="Manage and analyze your social media presence across platforms." />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Social Media Dashboard",
              "description": "Manage and analyze your social media presence across platforms.",
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
        title="Social Media Dashboard"
        description="Manage and analyze your social media presence"
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              size="sm"
              aria-label="Create new post"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              aria-label="View calendar"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        }
      >
        <div 
          id="main-content"
          className={`space-y-8 ${preferences.largeText ? 'text-lg' : ''}`}
          role="main"
          aria-label="Social Media Dashboard"
          tabIndex={-1}
        >
          {/* Platform Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,532</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Next: Today at 3:00 PM</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">
                <BarChart2 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <MessageSquare className="h-4 w-4 mr-2" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="audience">
                <Users className="h-4 w-4 mr-2" />
                Audience
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>
                    Compare performance across social media platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Performance chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>
                      Posts with highest engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-4 border-b pb-4">
                          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0"></div>
                          <div>
                            <h4 className="font-medium">Post Title {i}</h4>
                            <p className="text-sm text-muted-foreground">Platform • 2 days ago</p>
                            <div className="flex space-x-2 mt-1">
                              <span className="text-xs">❤️ 1.2k</span>
                              <span className="text-xs">💬 342</span>
                              <span className="text-xs">🔄 89</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Schedule</CardTitle>
                    <CardDescription>
                      Your scheduled posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-4 border-b pb-4">
                          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0"></div>
                          <div>
                            <h4 className="font-medium">Scheduled Post {i}</h4>
                            <p className="text-sm text-muted-foreground">Platform • Today at {i + 2}:00 PM</p>
                            <div className="flex space-x-2 mt-1">
                              <Button variant="ghost" size="sm" className="h-7 px-2">Edit</Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive">Cancel</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Calendar</CardTitle>
                  <CardDescription>
                    Schedule and manage your social media posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Calendar view will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="engagement" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Analytics</CardTitle>
                  <CardDescription>
                    Track engagement across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Engagement charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                    <CardDescription>
                      Recent comments on your posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-muted"></div>
                            <div>
                              <h4 className="text-sm font-medium">User Name</h4>
                              <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                          </div>
                          <p className="text-sm mt-2">This is a great post! I really enjoyed the content.</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Shares</CardTitle>
                    <CardDescription>
                      Recent shares of your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-muted"></div>
                            <div>
                              <h4 className="text-sm font-medium">User Name</h4>
                              <p className="text-xs text-muted-foreground">3 hours ago</p>
                            </div>
                          </div>
                          <p className="text-sm mt-2">Shared your post with their audience</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Mentions</CardTitle>
                    <CardDescription>
                      Recent mentions of your brand
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-muted"></div>
                            <div>
                              <h4 className="text-sm font-medium">User Name</h4>
                              <p className="text-xs text-muted-foreground">5 hours ago</p>
                            </div>
                          </div>
                          <p className="text-sm mt-2">Mentioned your brand in their post</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="audience" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>
                    Understand your audience across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Demographics charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Growth</CardTitle>
                    <CardDescription>
                      Track your audience growth over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Growth chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Interests</CardTitle>
                    <CardDescription>
                      Top interests of your audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Interests chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>
                    Detailed analytics across all platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Analytics dashboard will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reach</CardTitle>
                    <CardDescription>
                      Total reach across platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Reach chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Impressions</CardTitle>
                    <CardDescription>
                      Total impressions across platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Impressions chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion</CardTitle>
                    <CardDescription>
                      Conversion rates from social media
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Conversion chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
}

/**
 * Server-side data fetching for improved performance and SEO
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // In a real implementation, this would fetch data from an API
    // For now, we'll return mock data
    const initialData = {
      platforms: [
        { name: 'Twitter', followers: 12500, engagement: 2.8 },
        { name: 'Facebook', followers: 8700, engagement: 1.9 },
        { name: 'Instagram', followers: 3200, engagement: 4.7 },
        { name: 'LinkedIn', followers: 1100, engagement: 3.2 },
      ],
      scheduledPosts: [
        { id: 1, title: 'Product Update', platform: 'Twitter', scheduledFor: '2025-04-23T15:00:00' },
        { id: 2, title: 'Customer Story', platform: 'LinkedIn', scheduledFor: '2025-04-24T10:00:00' },
        { id: 3, title: 'Feature Highlight', platform: 'Instagram', scheduledFor: '2025-04-25T12:00:00' },
      ],
      topPosts: [
        { id: 1, title: 'Product Launch', platform: 'Twitter', engagement: 1200, comments: 342, shares: 89 },
        { id: 2, title: 'Customer Testimonial', platform: 'LinkedIn', engagement: 780, comments: 156, shares: 45 },
        { id: 3, title: 'Behind the Scenes', platform: 'Instagram', engagement: 950, comments: 210, shares: 32 },
      ],
    };
    
    return {
      props: {
        initialData,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty data on error
    return {
      props: {
        initialData: null,
      },
    };
  }
};
