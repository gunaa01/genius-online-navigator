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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Edit2, 
  Clock, 
  Save, 
  Share2, 
  Download, 
  BarChart2, 
  ChevronDown, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  FileText, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Calendar 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { ContentHistoryItem, ContentVersion } from '@/services/ai-content/contentHistoryService';
import * as contentHistoryService from '@/services/ai-content/contentHistoryService';

interface ContentDetailProps {
  item: ContentHistoryItem;
  onUpdate: (updatedItem: ContentHistoryItem) => void;
  onDelete: () => void;
}

/**
 * Content Detail
 * 
 * Displays detailed view of a content history item with version history
 */
export default function ContentDetail({
  item,
  onUpdate,
  onDelete
}: ContentDetailProps) {
  // State
  const [activeTab, setActiveTab] = useState('content');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [tags, setTags] = useState(item.tags.join(', '));
  const [status, setStatus] = useState(item.status);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'html' | 'markdown' | 'plain'>('pdf');
  const [isSharing, setIsSharing] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [versionNotes, setVersionNotes] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState<{
    views: { date: string; count: number }[];
    engagement: { date: string; count: number }[];
    conversions: { date: string; count: number }[];
    totalViews: number;
    totalEngagement: number;
    totalConversions: number;
  } | null>(null);
  
  // Handle save content
  const handleSaveContent = async () => {
    try {
      setIsSaving(true);
      
      // Prepare tags array
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Update content
      const updatedItem = await contentHistoryService.updateContentHistoryItem(
        item.id,
        {
          title,
          content,
          tags: tagsArray,
          status,
        },
        true, // Create new version
        versionNotes || 'Updated content'
      );
      
      // Update state
      onUpdate(updatedItem);
      setIsEditing(false);
      
      toast({
        title: 'Content Updated',
        description: 'Your content has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle export content
  const handleExportContent = async () => {
    try {
      setIsExporting(true);
      
      // Export content
      const result = await contentHistoryService.exportContent(item.id, exportFormat);
      
      if (result.url) {
        // Open URL in new tab
        window.open(result.url, '_blank');
      } else if (result.data) {
        // Copy data to clipboard
        await navigator.clipboard.writeText(result.data);
        
        toast({
          title: 'Content Copied',
          description: `Content exported as ${exportFormat.toUpperCase()} and copied to clipboard.`,
        });
      }
      
      setIsExporting(false);
    } catch (error) {
      console.error('Error exporting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to export content. Please try again.',
        variant: 'destructive',
      });
      setIsExporting(false);
    }
  };
  
  // Handle share content
  const handleShareContent = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one platform to share to.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSharing(true);
      
      // Share content
      const result = await contentHistoryService.shareContent(
        item.id,
        selectedPlatforms,
        scheduledDate || undefined
      );
      
      if (result.success) {
        toast({
          title: scheduledDate ? 'Content Scheduled' : 'Content Shared',
          description: scheduledDate
            ? `Your content has been scheduled for ${format(parseISO(scheduledDate), 'PPP p')}.`
            : `Your content has been shared to ${selectedPlatforms.join(', ')}.`,
        });
        
        // Reset state
        setSelectedPlatforms([]);
        setScheduledDate('');
        setIsSharing(false);
      } else {
        throw new Error('Failed to share content');
      }
    } catch (error) {
      console.error('Error sharing content:', error);
      toast({
        title: 'Error',
        description: 'Failed to share content. Please try again.',
        variant: 'destructive',
      });
      setIsSharing(false);
    }
  };
  
  // Handle restore version
  const handleRestoreVersion = async (version: ContentVersion) => {
    if (!confirm('Are you sure you want to restore this version? This will create a new version with the restored content.')) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Update content with version content
      const updatedItem = await contentHistoryService.updateContentHistoryItem(
        item.id,
        {
          content: version.content,
        },
        true, // Create new version
        `Restored from version created on ${format(parseISO(version.createdAt), 'PPP p')}`
      );
      
      // Update state
      onUpdate(updatedItem);
      setContent(version.content);
      setSelectedVersion(null);
      
      toast({
        title: 'Version Restored',
        description: 'The selected version has been restored successfully.',
      });
    } catch (error) {
      console.error('Error restoring version:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore version. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle load metrics
  const handleLoadMetrics = async () => {
    try {
      setShowMetrics(true);
      
      // Get metrics
      const metricsData = await contentHistoryService.getContentPerformanceMetrics(item.id);
      
      // Update state
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load performance metrics. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'outline';
      case 'archived':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold"
                placeholder="Enter title"
              />
            ) : (
              <CardTitle>{item.title}</CardTitle>
            )}
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setExportFormat('pdf'); setIsExporting(true); }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setExportFormat('docx'); setIsExporting(true); }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as DOCX
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setExportFormat('markdown'); setIsExporting(true); }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as Markdown
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setExportFormat('html'); setIsExporting(true); }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as HTML
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setExportFormat('plain'); setIsExporting(true); }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as Plain Text
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSharing(true)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  {item.metrics && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLoadMetrics}
                    >
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Metrics
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <CardDescription>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Created: {format(parseISO(item.createdAt), 'PPP')}
              </div>
              <div className="text-sm text-muted-foreground">•</div>
              <div className="flex items-center text-sm text-muted-foreground">
                Last updated: {format(parseISO(item.updatedAt), 'PPP')}
              </div>
              <div className="text-sm text-muted-foreground">•</div>
              <div className="flex items-center text-sm text-muted-foreground">
                {item.versions.length} version{item.versions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="versions">Version History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {isEditing ? (
                  <div className="w-full space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value as any)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <Badge variant={getStatusBadgeVariant(item.status) as any}>
                    {item.status}
                  </Badge>
                )}
                
                <Badge variant="outline" className="bg-muted/50">
                  {item.type}
                </Badge>
                
                {item.platform && (
                  <Badge variant="outline" className="bg-muted/50">
                    {item.platform}
                  </Badge>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[300px]"
                      placeholder="Enter content"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="version-notes">Version Notes</Label>
                    <Input
                      id="version-notes"
                      value={versionNotes}
                      onChange={(e) => setVersionNotes(e.target.value)}
                      placeholder="Enter notes for this version (optional)"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">{item.content}</div>
                  </div>
                  
                  {item.tags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="versions" className="space-y-4">
              <div className="space-y-4">
                {item.versions.map((version, index) => (
                  <Card key={version.id} className={selectedVersion?.id === version.id ? 'border-primary' : ''}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium">
                            {index === 0 ? 'Current Version' : `Version ${item.versions.length - index}`}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(version.createdAt), 'PPP p')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedVersion(selectedVersion?.id === version.id ? null : version)}
                          >
                            {selectedVersion?.id === version.id ? 'Hide' : 'View'}
                          </Button>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestoreVersion(version)}
                              disabled={isSaving}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {selectedVersion?.id === version.id && (
                      <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                          <div className="whitespace-pre-wrap text-sm">{version.content}</div>
                        </div>
                        
                        {version.notes && (
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="text-xs font-medium mb-1">Notes</h5>
                            <p className="text-xs text-muted-foreground">{version.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Export Dialog */}
      <Dialog open={isExporting} onOpenChange={setIsExporting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Content</DialogTitle>
            <DialogDescription>
              Choose a format to export your content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value as any)}
              >
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="docx">Word Document (DOCX)</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="plain">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExporting(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportContent}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={isSharing} onOpenChange={setIsSharing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Content</DialogTitle>
            <DialogDescription>
              Choose platforms to share your content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedPlatforms.includes('twitter') ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes('twitter')
                        ? prev.filter(p => p !== 'twitter')
                        : [...prev, 'twitter']
                    );
                  }}
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                
                <Button
                  variant={selectedPlatforms.includes('linkedin') ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes('linkedin')
                        ? prev.filter(p => p !== 'linkedin')
                        : [...prev, 'linkedin']
                    );
                  }}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                
                <Button
                  variant={selectedPlatforms.includes('facebook') ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes('facebook')
                        ? prev.filter(p => p !== 'facebook')
                        : [...prev, 'facebook']
                    );
                  }}
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                
                <Button
                  variant={selectedPlatforms.includes('instagram') ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes('instagram')
                        ? prev.filter(p => p !== 'instagram')
                        : [...prev, 'instagram']
                    );
                  }}
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Schedule (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  id="scheduled-date"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  placeholder="Schedule for later"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSharing(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleShareContent}
              disabled={selectedPlatforms.length === 0}
            >
              {scheduledDate ? (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Metrics Dialog */}
      <Dialog open={showMetrics} onOpenChange={setShowMetrics}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Performance Metrics</DialogTitle>
            <DialogDescription>
              View performance metrics for your content
            </DialogDescription>
          </DialogHeader>
          
          {metrics ? (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalViews}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalEngagement}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Conversions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalConversions}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Daily Performance</h3>
                <div className="border rounded-md p-4">
                  <div className="h-60 w-full">
                    {/* Placeholder for chart - in a real implementation, use a charting library */}
                    <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-md">
                      <p className="text-muted-foreground">Performance Chart</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowMetrics(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
