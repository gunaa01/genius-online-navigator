import React, { useState } from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  History,
  Sparkles,
  Settings
} from "lucide-react";
import { ContentForm } from '@/components/ai-content/ContentForm';
import AIContentGenerator from '@/components/AIContentGenerator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const AiContent = () => {
  const [generatorVariant, setGeneratorVariant] = useState<'basic' | 'advanced' | 'innovation'>('basic');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Basic content generator uses ContentForm
  const renderBasicGenerator = () => (
    <div className="lg:col-span-3">
      <ContentForm
        mode="ai-assisted"
        onGenerate={async (prompt) => {
          // Integrate AI content generation logic here
          return 'AI generated content for: ' + prompt;
        }}
        onSubmit={(content) => {
          // Save AI-generated content logic here
          console.log('Submitting AI content:', content);
        }}
      />
    </div>
  );

  // Advanced generator uses AIContentGenerator component
  const renderAdvancedGenerator = () => (
    <div className="lg:col-span-3">
      <AIContentGenerator />
    </div>
  );

  // Check which variant to render
  const renderContentGenerator = () => {
    switch(generatorVariant) {
      case 'advanced':
        return renderAdvancedGenerator();
      case 'innovation':
        // Innovation variant would render the innovation version or specialized implementation
        return (
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Innovation AI Content Generator</CardTitle>
                <CardDescription>
                  Advanced AI-powered content generation with specialized features
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* We would import and render the innovation version here */}
                <div className="p-6 text-center">
                  <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Innovation Content Generator</h3>
                  <p className="text-muted-foreground mb-4">
                    This is a placeholder for the innovation variant of the AI content generator.
                  </p>
                  <Button>
                    Enable Innovation Features
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderBasicGenerator();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">AI Content</h1>
            <p className="text-muted-foreground">Generate professional content for your marketing needs</p>
          </div>
          <div className="flex gap-2 items-center">
            <Select 
              value={generatorVariant} 
              onValueChange={(value: any) => setGeneratorVariant(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select generator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="innovation">Innovation</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button>
              <History className="mr-2 h-4 w-4" /> History
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {renderContentGenerator()}

          <div>
            <Card className="card-shadow mb-6">
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

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">AI Features</CardTitle>
                <CardDescription>Available AI-powered tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 border rounded-md flex items-center">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17.5 8A6.5 6.5 0 0 1 11 2.5"></path><path d="M5.5 15A6.5 6.5 0 0 0 12 20.5"></path><path d="M3 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path><path d="M14 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path><path d="M7 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path><path d="M18 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path><path d="M11 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path><path d="m7 3-4 4"></path><path d="M17 8a5 5 0 0 0-10 0"></path><path d="M8 14a3 3 0 0 0-1.79-2.74"></path><path d="m13 8 9 9"></path><path d="M20.75 11.5A6.5 6.5 0 0 1 22 15"></path></svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Plagiarism Checker</p>
                    <p className="text-xs text-muted-foreground">Verify content originality</p>
                  </div>
                </div>
                <div className="p-2 border rounded-md flex items-center">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M18 21a8 8 0 0 0-16 0"></path><path d="M10 14h4"></path><path d="M8 10h8"></path><circle cx="10" cy="4" r="2"></circle><circle cx="14" cy="4" r="2"></circle><path d="m22 18-4 4"></path><path d="m18 18 4 4"></path></svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">SEO Optimizer</p>
                    <p className="text-xs text-muted-foreground">Improve content visibility</p>
                  </div>
                </div>
                <div className="p-2 border rounded-md flex items-center">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 7h-3a2 2 0 0 1-2-2V2"></path><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"></path><path d="M3 15h6"></path><path d="M3 18h6"></path><path d="M3 21h8"></path></svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Content Templates</p>
                    <p className="text-xs text-muted-foreground">Use pre-defined structures</p>
                  </div>
                </div>
                <div className="p-2 border rounded-md flex items-center">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z"></path><path d="M14 7v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z"></path><path d="M21 3v16a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z"></path></svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Analytics</p>
                    <p className="text-xs text-muted-foreground">Track content performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AiContent;
