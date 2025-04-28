import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Copy, Check, Edit, Save, Download, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';

interface ContentPreviewProps {
  generatedContent: contentGenerationService.GeneratedContent;
  onRegenerateContent: () => void;
  onSaveContent: (content: string) => void;
  isRegenerating: boolean;
}

/**
 * Content Preview Component
 * 
 * Displays generated content with editing capabilities and metrics
 */
export default function ContentPreview({
  generatedContent,
  onRegenerateContent,
  onSaveContent,
  isRegenerating
}: ContentPreviewProps) {
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(generatedContent.content);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedContent : generatedContent.content);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    toast({
      title: 'Copied',
      description: 'Content copied to clipboard.',
    });
  };
  
  // Handle save edited content
  const handleSaveEdit = () => {
    onSaveContent(editedContent);
    setIsEditing(false);
    
    toast({
      title: 'Saved',
      description: 'Your edits have been saved.',
    });
  };
  
  // Handle download content
  const handleDownload = () => {
    const content = isEditing ? editedContent : generatedContent.content;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedContent.title || 'generated-content'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded',
      description: 'Content downloaded as text file.',
    });
  };
  
  // Get score color
  const getScoreColor = (score: number = 0) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Get progress color
  const getProgressColor = (score: number = 0) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              AI-generated content based on your parameters
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              aria-label="Copy content"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              aria-label="Download content"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              size="sm"
              onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
              aria-label={isEditing ? 'Save edits' : 'Edit content'}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            {generatedContent.title && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{generatedContent.title}</h3>
              </div>
            )}
            
            {isEditing ? (
              <Textarea
                className="min-h-[300px] font-mono text-sm"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              <div className="border rounded-md p-4 min-h-[300px] whitespace-pre-wrap">
                {generatedContent.content}
              </div>
            )}
            
            {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="variations" className="space-y-4">
            {generatedContent.variations && generatedContent.variations.length > 0 ? (
              <div className="space-y-4">
                {generatedContent.variations.map((variation, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium">Variation {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditedContent(variation);
                          setIsEditing(true);
                          setActiveTab('preview');
                        }}
                      >
                        Use This
                      </Button>
                    </div>
                    <p className="text-sm">{variation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-[300px] border rounded-md">
                <p className="text-muted-foreground">No variations available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedContent.seoScore !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">SEO Score</h4>
                    <span className={`font-medium ${getScoreColor(generatedContent.seoScore)}`}>
                      {generatedContent.seoScore}/100
                    </span>
                  </div>
                  <Progress value={generatedContent.seoScore} className={getProgressColor(generatedContent.seoScore)} />
                </div>
              )}
              
              {generatedContent.readabilityScore !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Readability</h4>
                    <span className={`font-medium ${getScoreColor(generatedContent.readabilityScore)}`}>
                      {generatedContent.readabilityScore}/100
                    </span>
                  </div>
                  <Progress value={generatedContent.readabilityScore} className={getProgressColor(generatedContent.readabilityScore)} />
                </div>
              )}
              
              {generatedContent.engagementScore !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Engagement</h4>
                    <span className={`font-medium ${getScoreColor(generatedContent.engagementScore)}`}>
                      {generatedContent.engagementScore}/100
                    </span>
                  </div>
                  <Progress value={generatedContent.engagementScore} className={getProgressColor(generatedContent.engagementScore)} />
                </div>
              )}
              
              {generatedContent.brandVoiceScore !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Brand Voice</h4>
                    <span className={`font-medium ${getScoreColor(generatedContent.brandVoiceScore)}`}>
                      {generatedContent.brandVoiceScore}/100
                    </span>
                  </div>
                  <Progress value={generatedContent.brandVoiceScore} className={getProgressColor(generatedContent.brandVoiceScore)} />
                </div>
              )}
            </div>
            
            {generatedContent.keywords && generatedContent.keywords.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Metadata</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Generated:</span>{' '}
                  {new Date(generatedContent.metadata.generatedAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Model:</span>{' '}
                  {generatedContent.metadata.model}
                </div>
                <div>
                  <span className="font-medium">Topic:</span>{' '}
                  {generatedContent.metadata.topic}
                </div>
                {generatedContent.metadata.platform && (
                  <div>
                    <span className="font-medium">Platform:</span>{' '}
                    {generatedContent.metadata.platform}
                  </div>
                )}
                {generatedContent.metadata.tone && (
                  <div>
                    <span className="font-medium">Tone:</span>{' '}
                    {generatedContent.metadata.tone}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onRegenerateContent}
          disabled={isRegenerating}
        >
          {isRegenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Regenerate
            </>
          )}
        </Button>
        
        {isEditing && (
          <Button
            variant="default"
            onClick={handleSaveEdit}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
