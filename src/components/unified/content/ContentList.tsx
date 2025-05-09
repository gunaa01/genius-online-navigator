import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Edit2, Trash2, Eye } from "lucide-react";

// Support both Redux implementations
import { useDispatch } from 'react-redux';
import { setContents as setContentsLegacy } from '../../../redux/contentSlice';
import { useAppDispatch } from '@/store/hooks';
import { setContents as setContentsNew } from '@/store/slices/contentSlice';

// Import API functions
import { fetchContent, GeneratedContent } from '@/api/content';

// Basic ContentList props (original ContentList had no props)
export interface ContentListProps {}

// StyledContentList props
export interface StyledContentListProps {
  items: ContentItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (slug: string) => void;
  emptyMessage?: string;
}

// Unified props with variant control
export interface UnifiedContentListProps extends Partial<StyledContentListProps> {
  variant?: 'basic' | 'styled';
  // For basic variant, we might need to fetch data
  fetchData?: boolean;
}

// Content item interface
export interface ContentItem {
  id: string;
  title: string;
  excerpt?: string;
  body?: string;
  slug?: string;
  status?: 'draft' | 'published' | 'archived';
  author?: string;
  date?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
}

export const UnifiedContentList: React.FC<UnifiedContentListProps> = ({
  variant = 'styled',
  items = [],
  onEdit,
  onDelete,
  onView,
  emptyMessage = 'No content found.',
  fetchData = true
}) => {
  // State for basic variant
  const [loading, setLoading] = useState(variant === 'basic' && fetchData);
  const [error, setError] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<ContentItem[]>(items);
  
  // Clients and dispatchers
  const supabase = useSupabaseClient();
  const legacyDispatch = useDispatch();
  const appDispatch = useAppDispatch();

  // Fetch content for basic variant
  useEffect(() => {
    if (variant === 'basic' && fetchData) {
      async function load() {
        setLoading(true);
        setError(null);
        const session = await supabase.auth.getSession();
        if (!session.data.session) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        const token = session.data.session.access_token;
        try {
          const data = await fetchContent(token);
          setLocalContent(data);
          
          // Try both dispatch methods
          try {
            appDispatch(setContentsNew(data));
          } catch (e) {
            // Fall back to legacy dispatch
            legacyDispatch(setContentsLegacy(data));
          }
        } catch (e) {
          setError('Error loading content');
        }
        setLoading(false);
      }
      load();
    }
  }, [supabase, legacyDispatch, appDispatch, variant, fetchData]);

  // Helper function for status badge variant
  const getStatusVariant = (status: string = 'draft') => {
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

  // Basic variant (original ContentList style)
  if (variant === 'basic') {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    
    return (
      <ul data-testid="ai-suggestion-list">
        {localContent.map(c => (
          <li key={c.id}>
            <strong>{c.title}</strong><br />
            {c.body || c.excerpt}
          </li>
        ))}
      </ul>
    );
  }

  // Styled variant (enhanced UI with shadcn components)
  const displayItems = fetchData ? localContent : items;
  
  if (displayItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayItems.map((item) => (
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
              {item.status && (
                <Badge variant={getStatusVariant(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{item.excerpt || item.body}</p>
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
            {onView && item.slug && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(item.slug!)}
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

// Export named components for backward compatibility
export const ContentList: React.FC = () => {
  return <UnifiedContentList variant="basic" fetchData={true} />;
};

export const StyledContentList: React.FC<StyledContentListProps> = (props) => {
  return <UnifiedContentList variant="styled" {...props} />;
};

// Default export is the unified component
export default UnifiedContentList;