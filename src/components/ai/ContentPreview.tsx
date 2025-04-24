import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { ClipboardCopy, Download, Share2 } from 'lucide-react';

interface ContentPreviewProps {
  content: string;
  isLoading: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onShare: () => void;
  onEdit: (editedContent: string) => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  isLoading,
  onCopy,
  onDownload,
  onShare,
  onEdit,
}) => {
  const [editableContent, setEditableContent] = React.useState(content);
  
  React.useEffect(() => {
    setEditableContent(content);
  }, [content]);
  
  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value);
  };
  
  const handleSaveEdit = () => {
    onEdit(editableContent);
  };
  
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Generating Content...</CardTitle>
          <CardDescription>Please wait while we create your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!content) {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Generated Content</CardTitle>
        <CardDescription>Your AI-generated content is ready</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="prose max-w-none dark:prose-invert">
              {content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="edit" className="mt-4">
            <Textarea 
              value={editableContent} 
              onChange={handleEditChange} 
              className="min-h-[300px] font-mono"
            />
            <Button 
              onClick={handleSaveEdit} 
              className="mt-2"
              variant="secondary"
            >
              Save Changes
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between pt-4">
        <Button variant="outline" size="sm" onClick={onCopy}>
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentPreview; 