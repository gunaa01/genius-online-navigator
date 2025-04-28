import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { 
  Calendar, 
  Eye, 
  Heart, 
  BarChart2, 
  Edit2, 
  Trash2, 
  Share2, 
  Download, 
  Search, 
  Filter, 
  X, 
  Clock 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ContentHistoryItem, ContentFilterOptions } from '@/services/ai-content/contentHistoryService';

interface ContentHistoryListProps {
  items: ContentHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  filters: ContentFilterOptions;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: ContentFilterOptions) => void;
  onViewItem: (id: string) => void;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onShareItem: (id: string) => void;
  onExportItem: (id: string) => void;
}

/**
 * Content History List
 * 
 * Displays a list of content history items with filtering and pagination
 */
export default function ContentHistoryList({
  items,
  total,
  page,
  limit,
  totalPages,
  loading,
  filters,
  onPageChange,
  onFilterChange,
  onViewItem,
  onEditItem,
  onDeleteItem,
  onShareItem,
  onExportItem
}: ContentHistoryListProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  
  // Handle search
  const handleSearch = () => {
    onFilterChange({
      ...filters,
      search: searchTerm
    });
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    onFilterChange({});
  };
  
  // Handle filter change
  const handleFilterChange = (key: keyof ContentFilterOptions, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
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
          <CardTitle>Content History</CardTitle>
          <CardDescription>
            Browse, filter, and manage your content history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search content..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <Button onClick={handleSearch} className="shrink-0">
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="type-filter">Content Type</Label>
                <Select
                  value={filters.type || ''}
                  onValueChange={(value) => handleFilterChange('type', value || undefined)}
                >
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="ad">Ad</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => handleFilterChange('status', value || undefined)}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="platform-filter">Platform</Label>
                <Select
                  value={filters.platform || ''}
                  onValueChange={(value) => handleFilterChange('platform', value || undefined)}
                >
                  <SelectTrigger id="platform-filter">
                    <SelectValue placeholder="All platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All platforms</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                    <div className="p-4 md:col-span-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium line-clamp-1">{item.title}</h3>
                        <Badge variant={getStatusBadgeVariant(item.status) as any}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="bg-muted/50">
                          {item.type}
                        </Badge>
                        {item.platform && (
                          <Badge variant="outline" className="bg-muted/50">
                            {item.platform}
                          </Badge>
                        )}
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Created: {format(parseISO(item.createdAt), 'MMM d, yyyy')}</span>
                        <span className="mx-2">•</span>
                        <span>{item.versions.length} version{item.versions.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col justify-between h-full">
                      {item.metrics && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="flex flex-col items-center">
                            <Eye className="h-4 w-4 mb-1 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.metrics.views || 0}</span>
                            <span className="text-xs text-muted-foreground">Views</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Heart className="h-4 w-4 mb-1 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.metrics.engagement || 0}</span>
                            <span className="text-xs text-muted-foreground">Engagements</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <BarChart2 className="h-4 w-4 mb-1 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.metrics.conversions || 0}</span>
                            <span className="text-xs text-muted-foreground">Conversions</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onViewItem(item.id)}
                          aria-label={`View ${item.title}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onEditItem(item.id)}
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onShareItem(item.id)}
                          aria-label={`Share ${item.title}`}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onExportItem(item.id)}
                          aria-label={`Export ${item.title}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => onDeleteItem(item.id)}
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No content found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {Object.keys(filters).length > 0
                ? "Try adjusting your filters or search term"
                : "Start generating content to build your history"}
            </p>
            {Object.keys(filters).length > 0 && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
