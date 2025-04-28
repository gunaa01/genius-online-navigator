import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { 
  workflowService, 
  Workflow,
  WorkflowTemplate 
} from '@/services/automation/workflowService';
import SEOHead from '@/components/seo/SEOHead';
import { useToast } from '@/components/ui/use-toast';
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
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  X, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Edit,
  Copy,
  Trash2,
  FileText,
  Tag,
  ArrowRight,
  Save
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form schema for template
const templateSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }).max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1, { message: 'Category is required' }),
  tags: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

/**
 * Workflow Templates
 * 
 * Page for managing workflow templates
 */
export default function WorkflowTemplates({
  initialTemplates,
  categories
}: {
  initialTemplates: WorkflowTemplate[];
  categories: string[];
}) {
  // Router
  const router = useRouter();
  
  // Toast
  const { toast } = useToast();
  
  // State
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(initialTemplates);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<WorkflowTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: categories[0] || '',
      tags: '',
    },
  });
  
  // Edit form
  const editForm = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: categories[0] || '',
      tags: '',
    },
  });
  
  // Update edit form when current template changes
  useEffect(() => {
    if (currentTemplate) {
      editForm.reset({
        name: currentTemplate.name,
        description: currentTemplate.description || '',
        category: currentTemplate.category,
        tags: currentTemplate.tags?.join(', ') || '',
      });
    }
  }, [currentTemplate, editForm]);
  
  // Load templates
  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await workflowService.getWorkflowTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workflow templates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter templates
  const filteredTemplates = templates.filter(template => {
    // Search term filter
    if (searchTerm && !template.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !template.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== 'all' && template.category !== filterCategory) {
      return false;
    }
    
    return true;
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via the filteredTemplates
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
  };
  
  // Create template
  const handleCreateTemplate = async (data: TemplateFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert tags string to array
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      await workflowService.createWorkflowTemplate({
        ...data,
        tags,
      });
      
      toast({
        title: 'Success',
        description: 'Template created successfully.',
      });
      
      setShowCreateDialog(false);
      form.reset();
      await loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create template. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Edit template
  const handleEditTemplate = (template: WorkflowTemplate) => {
    setCurrentTemplate(template);
    setShowEditDialog(true);
  };
  
  // Update template
  const handleUpdateTemplate = async (data: TemplateFormValues) => {
    if (!currentTemplate) return;
    
    setIsSubmitting(true);
    try {
      // Convert tags string to array
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      await workflowService.updateWorkflowTemplate(currentTemplate.id, {
        ...data,
        tags,
      });
      
      toast({
        title: 'Success',
        description: 'Template updated successfully.',
      });
      
      setShowEditDialog(false);
      setCurrentTemplate(null);
      await loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to update template. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete template
  const handleDeleteTemplate = (id: string) => {
    setTemplateToDelete(id);
  };
  
  // Confirm delete template
  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return;
    
    try {
      await workflowService.deleteWorkflowTemplate(templateToDelete);
      
      toast({
        title: 'Success',
        description: 'Template deleted successfully.',
      });
      
      setTemplateToDelete(null);
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Use template
  const handleUseTemplate = (id: string) => {
    router.push(`/admin/automation/create?templateId=${id}`);
  };
  
  return (
    <>
      <SEOHead
        metadata={{
          title: 'Workflow Templates | Genius Online Navigator',
          description: 'Browse and manage workflow templates for automated marketing and content operations.',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Workflow Templates',
            description: 'Browse and manage workflow templates for automated marketing and content operations.',
          },
        }}
        path="/admin/automation/templates"
      />
      
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Workflow Templates</CardTitle>
                  <CardDescription>
                    Browse and manage templates for creating workflows
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search templates..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select
                      value={filterCategory}
                      onValueChange={setFilterCategory}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {(searchTerm || filterCategory !== 'all') && (
                      <Button 
                        variant="outline" 
                        onClick={handleClearFilters}
                        type="button"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <CardDescription>
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Created: {format(parseISO(template.createdAt), 'PPP')}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditTemplate(template)}
                        aria-label="Edit template"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteTemplate(template.id)}
                        aria-label="Delete template"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Use Template
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || filterCategory !== 'all'
                    ? "Try adjusting your filters or search term"
                    : "Get started by creating your first template"}
                </p>
                {searchTerm || filterCategory !== 'all' ? (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
            <DialogDescription>
              Create a new workflow template for reuse
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateTemplate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter template name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter template description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tags, separated by commas" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional tags to help categorize and find this template
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Template
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Template Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update workflow template details
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateTemplate)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter template name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter template description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tags, separated by commas" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional tags to help categorize and find this template
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Template
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!templateToDelete} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTemplate} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Fetch initial data
    const initialTemplates = await workflowService.getWorkflowTemplates();
    
    // Get unique categories
    const categories = Array.from(new Set(initialTemplates.map(template => template.category)));
    
    // If no categories, add default ones
    if (categories.length === 0) {
      categories.push('Social Media', 'Content Creation', 'Analytics', 'Notifications', 'General');
    }
    
    return {
      props: {
        initialTemplates,
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    
    // Return empty data on error
    return {
      props: {
        initialTemplates: [],
        categories: ['Social Media', 'Content Creation', 'Analytics', 'Notifications', 'General'],
      },
    };
  }
}
