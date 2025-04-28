import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Calendar, Clock, File, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

export interface ContentHistoryItem {
  id: string;
  title: string;
  contentType: string;
  createdAt: Date;
  preview: string;
  wordCount: number;
}

interface ContentHistoryProps {
  history: ContentHistoryItem[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const ContentHistory: React.FC<ContentHistoryProps> = ({
  history,
  onSelect,
  onDelete,
  isLoading = false,
}) => {
  // Handle empty state or loading
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content History</CardTitle>
          <CardDescription>Loading your previous content...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content History</CardTitle>
          <CardDescription>
            Your generation history will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6 text-muted-foreground">
          <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No content history yet</p>
          <p className="text-sm">Generate your first content to see it here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content History</CardTitle>
        <CardDescription>Your previously generated content</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {history.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium line-clamp-1" title={item.title}>
                    {item.title}
                  </h3>
                  <Badge variant="outline">{item.contentType}</Badge>
                </div>
                
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{format(item.createdAt, 'MMM d, yyyy')}</span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span>{format(item.createdAt, 'h:mm a')}</span>
                </div>
                
                <p className="text-sm line-clamp-2 text-muted-foreground">
                  {item.preview}
                </p>
                
                <div className="text-xs text-muted-foreground">
                  {item.wordCount} words
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    onClick={() => onSelect(item.id)}
                    variant="default"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </React.Fragment>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ContentHistory; 