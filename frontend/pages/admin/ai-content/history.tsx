import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import ContentHistoryList from '@/components/ai-content/ContentHistoryList';
import ContentDetail from '@/components/ai-content/ContentDetail';
import * as contentHistoryService from '@/services/ai-content/contentHistoryService';

/**
 * Content History Page
 * 
 * Page for browsing, filtering, and managing content history
 */
export default function ContentHistoryPage({
  initialItems,
  initialTotal,
  initialPage,
  initialLimit,
  initialTotalPages,
  selectedItemId
}: {
  initialItems: contentHistoryService.ContentHistoryItem[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
  initialTotalPages: number;
  selectedItemId?: string;
}) {
  const router = useRouter();
  const { preferences } = useAccessibility();
  
  // State
  const [items, setItems] = useState<contentHistoryService.ContentHistoryItem[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<contentHistoryService.ContentFilterOptions>({});
  const [selectedItem, setSelectedItem] = useState<contentHistoryService.ContentHistoryItem | null>(
    selectedItemId ? initialItems.find(item => item.id === selectedItemId) || null : null
  );
  
  // Load content history
  const loadContentHistory = async (
    newPage: number = page,
    newFilters: contentHistoryService.ContentFilterOptions = filters
  ) => {
    try {
      setLoading(true);
      
      // Fetch content history
      const result = await contentHistoryService.getContentHistory(
        newFilters,
        newPage,
        limit
      );
      
      // Update state
      setItems(result.items);
      setTotal(result.total);
      setPage(result.page);
      setTotalPages(result.totalPages);
      
      // If selected item is not in the results, clear selection
      if (selectedItem && !result.items.find(item => item.id === selectedItem.id)) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error loading content history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    loadContentHistory(newPage);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: contentHistoryService.ContentFilterOptions) => {
    setFilters(newFilters);
    loadContentHistory(1, newFilters);
  };
  
  // Handle view item
  const handleViewItem = async (id: string) => {
    try {
      // If already selected, deselect
      if (selectedItem?.id === id) {
        setSelectedItem(null);
        router.push('/admin/ai-content/history', undefined, { shallow: true });
        return;
      }
      
      // Get item details
      const item = await contentHistoryService.getContentHistoryItem(id);
      
      // Update state
      setSelectedItem(item);
      
      // Update URL
      router.push(`/admin/ai-content/history?id=${id}`, undefined, { shallow: true });
    } catch (error) {
      console.error(`Error fetching content item ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to load content details. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle edit item
  const handleEditItem = (id: string) => {
    handleViewItem(id);
  };
  
  // Handle delete item
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Delete item
      await contentHistoryService.deleteContentHistoryItem(id);
      
      // If selected item is deleted, clear selection
      if (selectedItem?.id === id) {
        setSelectedItem(null);
        router.push('/admin/ai-content/history', undefined, { shallow: true });
      }
      
      // Reload content history
      loadContentHistory();
      
      toast({
        title: 'Content Deleted',
        description: 'Content has been deleted successfully.',
      });
    } catch (error) {
      console.error(`Error deleting content item ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to delete content. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle share item
  const handleShareItem = (id: string) => {
    handleViewItem(id);
  };
  
  // Handle export item
  const handleExportItem = (id: string) => {
    handleViewItem(id);
  };
  
  // Handle update item
  const handleUpdateItem = (updatedItem: contentHistoryService.ContentHistoryItem) => {
    // Update selected item
    setSelectedItem(updatedItem);
    
    // Update item in list
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };
  
  // Handle create new content
  const handleCreateNew = () => {
    router.push('/admin/ai-content/generator');
  };
  
  // Handle back button
  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
      router.push('/admin/ai-content/history', undefined, { shallow: true });
    } else {
      router.push('/admin/ai-content');
    }
  };
  
  return (
    <>
      <Head>
        <title>Content History | Genius Online Navigator</title>
        <meta name="description" content="Browse, filter, and manage your AI-generated content history." />
        <meta name="keywords" content="content history, content management, version control, content analytics" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Content History | Genius Online Navigator" />
        <meta property="og:description" content="Browse, filter, and manage your AI-generated content history." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/ai-content/history`} />
      </Head>
      
      <AdminLayout
        title={selectedItem ? 'Content Details' : 'Content History'}
        description={selectedItem ? 'View and manage content details' : 'Browse, filter, and manage your content history'}
        actions={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {!selectedItem && (
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateNew}
                aria-label="Create new content"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            )}
          </div>
        }
      >
        <div 
          id="main-content"
          className={`space-y-8 ${preferences.largeText ? 'text-lg' : ''}`}
          role="main"
          aria-label="Content History"
          tabIndex={-1}
        >
          {selectedItem ? (
            <ContentDetail
              item={selectedItem}
              onUpdate={handleUpdateItem}
              onDelete={() => handleDeleteItem(selectedItem.id)}
            />
          ) : (
            <ContentHistoryList
              items={items}
              total={total}
              page={page}
              limit={limit}
              totalPages={totalPages}
              loading={loading}
              filters={filters}
              onPageChange={handlePageChange}
              onFilterChange={handleFilterChange}
              onViewItem={handleViewItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onShareItem={handleShareItem}
              onExportItem={handleExportItem}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
}

/**
 * Server-side data fetching for improved performance
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const page = parseInt(context.query.page as string) || 1;
    const selectedItemId = context.query.id as string;
    
    // Build filters from query params
    const filters: contentHistoryService.ContentFilterOptions = {};
    
    if (context.query.type) {
      filters.type = context.query.type as any;
    }
    
    if (context.query.platform) {
      filters.platform = context.query.platform as string;
    }
    
    if (context.query.status) {
      filters.status = context.query.status as any;
    }
    
    if (context.query.search) {
      filters.search = context.query.search as string;
    }
    
    // Fetch content history
    const result = await contentHistoryService.getContentHistory(
      filters,
      page,
      10 // Default limit
    );
    
    return {
      props: {
        initialItems: result.items,
        initialTotal: result.total,
        initialPage: result.page,
        initialLimit: result.limit,
        initialTotalPages: result.totalPages,
        selectedItemId: selectedItemId || null,
      },
    };
  } catch (error) {
    console.error('Error fetching content history:', error);
    
    // Return empty data on error
    return {
      props: {
        initialItems: [],
        initialTotal: 0,
        initialPage: 1,
        initialLimit: 10,
        initialTotalPages: 0,
        selectedItemId: null,
      },
    };
  }
};
