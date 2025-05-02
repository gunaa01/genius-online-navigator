import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, FileText } from "lucide-react";
import ContentAnalyzer from '../components/analytics/ContentAnalyzer';

const ContentAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("analyzer");

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Home className="h-4 w-4" />
        <span>/</span>
        <BarChart3 className="h-4 w-4" />
        <span>Content Analytics</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Content Analytics</h1>
      <p className="text-muted-foreground mb-6">
        Analyze and optimize your content with AI-powered insights. Get recommendations for readability, SEO, sentiment, and engagement.
      </p>
      
      <Tabs defaultValue="analyzer" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="analyzer" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content Analyzer
          </TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
          <TabsTrigger value="competitive">Competitive Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyzer" className="space-y-4">
          <ContentAnalyzer />
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Dashboard</CardTitle>
              <CardDescription>Track engagement, time on page, conversion rates, and more.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[400px] text-muted-foreground">
              Coming soon: Track engagement, time on page, conversion rates, and more.
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>Understand your audience demographics, behavior, and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[400px] text-muted-foreground">
              Coming soon: Understand your audience demographics, behavior, and preferences.
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="competitive">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Content Analysis</CardTitle>
              <CardDescription>Compare your content performance against competitors.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[400px] text-muted-foreground">
              Coming soon: Compare your content performance against competitors.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentAnalytics;
