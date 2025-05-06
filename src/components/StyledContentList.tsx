import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Edit2, Trash2, Eye } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  date?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
}

interface StyledContentListProps {
  items: ContentItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (slug: string) => void;
  emptyMessage?: string;
}

export const StyledContentList: React.FC<StyledContentListProps> = ({
  items,
  onEdit,
  onDelete,
  onView,
  emptyMessage = 'No content found.'
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                {item.date && (
                  <CardDescription className="mt-1">
                    {format(new Date(item.date), 'MMMM d, yyyy')}
                  </CardDescription>
                )}
              </div>
              <Badge variant={getStatusVariant(item.status)}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{item.excerpt}</p>
            {(item.categories?.length || item.tags?.length) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.categories?.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
                {item.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-0">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(item.slug)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item.id)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default StyledContentList;
