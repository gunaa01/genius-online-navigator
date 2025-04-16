
import React, { useState } from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles,
  FileText,
  Megaphone,
  MessageCircle,
  Mail,
  Image,
  Copy,
  Download,
  Plus,
  History,
  ArrowRight,
  CheckCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AiContent = () => {
  const [generating, setGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerateContent = () => {
    setGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setGenerating(false);
      setShowResult(true);
    }, 2000);
  };

  const contentTemplates = [
    {
      id: 1,
      title: "Blog Post",
      description: "Generate SEO-optimized blog articles",
      icon: <FileText className="h-5 w-5" />,
      popular: true
    },
    {
      id: 2,
      title: "Ad Copy",
      description: "Create compelling advertisements",
      icon: <Megaphone className="h-5 w-5" />,
      popular: false
    },
    {
      id: 3,
      title: "Social Media Post",
      description: "Eye-catching social content",
      icon: <MessageCircle className="h-5 w-5" />,
      popular: true
    },
    {
      id: 4,
      title: "Email Campaign",
      description: "Professional email marketing",
      icon: <Mail className="h-5 w-5" />,
      popular: false
    },
    {
      id: 5,
      title: "Product Description",
      description: "Compelling product copy",
      icon: <Image className="h-5 w-5" />,
      popular: false
    }
  ];

  const recentContent = [
    {
      id: 1,
      title: "Spring Collection Announcement",
      type: "Blog Post",
      date: "2025-04-15T10:30:00",
      preview: "Introducing our stunning Spring 2025 Collection..."
    },
    {
      id: 2,
      title: "Customer Feedback Request",
      type: "Email Campaign",
      date: "2025-04-12T14:15:00",
      preview: "We value your opinion! Please take a moment to share..."
    },
    {
      id: 3,
      title: "Weekend Sale Promotion",
      type: "Social Media Post",
      date: "2025-04-08T09:45:00",
      preview: "Don't miss our biggest sale of the season! This weekend only..."
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">AI Content</h1>
            <p className="text-muted-foreground">Generate professional content for your marketing needs</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <History className="mr-2 h-4 w-4" /> View History
            </Button>
          </div>
        </header>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Recent Content</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      AI Content Generator
                    </CardTitle>
                    <CardDescription>
                      Describe what you want to create and our AI will generate high-quality content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content Type</label>
                      <Select defaultValue="blog">
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="social">Social Media Post</SelectItem>
                          <SelectItem value="ad">Advertisement Copy</SelectItem>
                          <SelectItem value="email">Email Campaign</SelectItem>
                          <SelectItem value="product">Product Description</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title/Topic</label>
                      <Input placeholder="E.g., '10 Digital Marketing Tips for Small Businesses'" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Key Points to Include</label>
                      <Textarea placeholder="Enter key information, keywords, or points you want to include" className="min-h-24" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tone</label>
                        <Select defaultValue="professional">
                          <SelectTrigger>
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual & Friendly</SelectItem>
                            <SelectItem value="persuasive">Persuasive</SelectItem>
                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                            <SelectItem value="informative">Informative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Length</label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short (100-200 words)</SelectItem>
                            <SelectItem value="medium">Medium (300-500 words)</SelectItem>
                            <SelectItem value="long">Long (600-1000 words)</SelectItem>
                            <SelectItem value="detailed">Detailed (1000+ words)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="mr-2">Save Draft</Button>
                    <Button onClick={handleGenerateContent} disabled={generating}>
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                {showResult && (
                  <Card className="card-shadow mt-8 transition-all animate-fade-in">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">10 Digital Marketing Tips for Small Businesses</CardTitle>
                      <CardDescription>Generated content • April 16, 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert">
                        <p>In today's digital landscape, small businesses need effective marketing strategies to stand out from the competition. Here are ten proven digital marketing tips that can help your small business thrive:</p>
                        
                        <h3>1. Optimize Your Website for Search Engines</h3>
                        <p>Ensure your website is SEO-friendly by using relevant keywords, creating quality content, and improving page loading speed. This will help your business rank higher in search results and drive organic traffic.</p>
                        
                        <h3>2. Leverage Social Media Platforms</h3>
                        <p>Identify which social media platforms your target audience uses most and establish a strong presence there. Consistent posting and engagement can build brand awareness and customer loyalty.</p>
                        
                        <h3>3. Invest in Content Marketing</h3>
                        <p>Regularly publish valuable content that addresses your customers' pain points and questions. Blog posts, videos, and infographics can position your business as an industry authority.</p>
                        
                        <p className="text-muted-foreground text-center mt-4">... 7 more tips not shown in preview ...</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                        </Button>
                      </div>
                      <Button variant="default" size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" /> Save to Library
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>

              <div>
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Templates</CardTitle>
                    <CardDescription>Quick-start your content creation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contentTemplates
                        .filter(template => template.popular)
                        .map((template) => (
                          <div key={template.id} className="flex items-center p-3 rounded-lg border hover:border-primary/60 hover:bg-secondary/40 cursor-pointer transition-colors">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              {template.icon}
                            </div>
                            <div>
                              <p className="font-medium">{template.title}</p>
                              <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-shadow mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Credits</CardTitle>
                    <CardDescription>Your content generation allowance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Credits remaining</span>
                      <span className="text-lg font-bold">45 / 100</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Credits reset on May 1, 2025. Need more? Upgrade your plan.</p>
                    <Button variant="outline" className="w-full">
                      <ArrowRight className="mr-2 h-4 w-4" /> Upgrade to Pro
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentTemplates.map((template) => (
                <Card key={template.id} className="card-shadow hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {template.icon}
                      </div>
                      {template.popular && (
                        <Badge variant="secondary">Popular</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-primary" />
                        AI-optimized structure
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-primary" />
                        Industry-specific vocabulary
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-primary" />
                        Customizable tone and style
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              <Card className="card-shadow border-dashed flex flex-col justify-center items-center p-6">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Create Custom Template</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Design your own template for repeated content needs
                </p>
                <Button variant="outline">
                  Create Template
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-8">
              <h3 className="text-lg font-medium">Recently Generated Content</h3>
              
              {recentContent.map((content) => (
                <Card key={content.id} className="card-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <Badge variant="outline">{content.type}</Badge>
                    </div>
                    <CardDescription>
                      Generated on {new Date(content.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{content.preview}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" /> Edit & Regenerate
                    </Button>
                    <Button size="sm">
                      View Full Content
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="flex justify-center">
                <Button variant="outline">View All Content</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AiContent;
