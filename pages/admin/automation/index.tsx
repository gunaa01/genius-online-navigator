import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  workflowService, 
  Workflow 
} from '@/services/automation/workflowService';
import { 
  triggerService, 
  TriggerType, 
  TriggerEvent 
} from '@/services/automation/triggerService';
import { 
  actionService, 
  ActionType, 
  ActionTemplate 
} from '@/services/automation/actionService';
import WorkflowList from '@/components/automation/WorkflowList';
import WorkflowForm from '@/components/automation/WorkflowForm';
import WorkflowRuns from '@/components/automation/WorkflowRuns';
import SEOHead from '@/components/seo/SEOHead';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Automation Module Dashboard
 * 
 * Main page for the Automation Module, allowing users to create, manage, and monitor workflows
 */
export default function AutomationDashboard({
  initialWorkflows,
  triggerTypes,
  triggerEvents,
  actionTypes,
  actionTemplates
}: {
  initialWorkflows: Workflow[];
  triggerTypes: TriggerType[];
  triggerEvents: TriggerEvent[];
  actionTypes: ActionType[];
  actionTemplates: ActionTemplate[];
}) {
  // Router
  const router = useRouter();
  
  // Toast
  const { toast } = useToast();
  
  // State
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'runs'>('list');
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const [workflowRuns, setWorkflowRuns] = useState<any[]>([]);
  const [runsLoading, setRunsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load workflows
  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const data = await workflowService.getWorkflows();
      setWorkflows(data);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workflows. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load workflow runs
  const loadWorkflowRuns = async (workflowId: string) => {
    setRunsLoading(true);
    try {
      const data = await workflowService.getWorkflowRuns(workflowId);
      setWorkflowRuns(data);
    } catch (error) {
      console.error('Error loading workflow runs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workflow runs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRunsLoading(false);
    }
  };
  
  // Create workflow
  const handleCreateWorkflow = () => {
    setCurrentWorkflow(null);
    setCurrentView('create');
  };
  
  // Edit workflow
  const handleEditWorkflow = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      setCurrentWorkflow(workflow);
      setCurrentView('edit');
    }
  };
  
  // Duplicate workflow
  const handleDuplicateWorkflow = async (id: string) => {
    setLoading(true);
    try {
      const result = await workflowService.duplicateWorkflow(id);
      toast({
        title: 'Success',
        description: 'Workflow duplicated successfully.',
      });
      await loadWorkflows();
    } catch (error) {
      console.error('Error duplicating workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to duplicate workflow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete workflow
  const handleDeleteWorkflow = (id: string) => {
    setWorkflowToDelete(id);
  };
  
  // Confirm delete workflow
  const confirmDeleteWorkflow = async () => {
    if (!workflowToDelete) return;
    
    setLoading(true);
    try {
      await workflowService.deleteWorkflow(workflowToDelete);
      toast({
        title: 'Success',
        description: 'Workflow deleted successfully.',
      });
      await loadWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workflow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setWorkflowToDelete(null);
    }
  };
  
  // Toggle workflow active state
  const handleToggleActive = async (id: string, isActive: boolean) => {
    setLoading(true);
    try {
      await workflowService.updateWorkflow(id, { isActive });
      toast({
        title: 'Success',
        description: `Workflow ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
      await loadWorkflows();
    } catch (error) {
      console.error('Error updating workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to update workflow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Run workflow
  const handleRunWorkflow = async (id: string) => {
    try {
      await workflowService.runWorkflow(id);
      toast({
        title: 'Success',
        description: 'Workflow execution started.',
      });
    } catch (error) {
      console.error('Error running workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to run workflow. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // View workflow runs
  const handleViewRuns = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      setCurrentWorkflow(workflow);
      loadWorkflowRuns(id);
      setCurrentView('runs');
    }
  };
  
  // Submit workflow form
  const handleSubmitWorkflow = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (currentView === 'create') {
        await workflowService.createWorkflow(data);
        toast({
          title: 'Success',
          description: 'Workflow created successfully.',
        });
      } else {
        await workflowService.updateWorkflow(currentWorkflow!.id, data);
        toast({
          title: 'Success',
          description: 'Workflow updated successfully.',
        });
      }
      await loadWorkflows();
      setCurrentView('list');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to save workflow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cancel form
  const handleCancelForm = () => {
    setCurrentView('list');
  };
  
  // Back to list from runs
  const handleBackFromRuns = () => {
    setCurrentView('list');
  };
  
  // Refresh runs
  const handleRefreshRuns = () => {
    if (currentWorkflow) {
      loadWorkflowRuns(currentWorkflow.id);
    }
  };
  
  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <WorkflowList
            workflows={workflows}
            loading={loading}
            onCreateWorkflow={handleCreateWorkflow}
            onEditWorkflow={handleEditWorkflow}
            onDuplicateWorkflow={handleDuplicateWorkflow}
            onDeleteWorkflow={handleDeleteWorkflow}
            onToggleActive={handleToggleActive}
            onRunWorkflow={handleRunWorkflow}
            onViewRuns={handleViewRuns}
          />
        );
      case 'create':
      case 'edit':
        return (
          <WorkflowForm
            workflow={currentWorkflow || undefined}
            triggerTypes={triggerTypes}
            triggerEvents={triggerEvents}
            actionTypes={actionTypes}
            actionTemplates={actionTemplates}
            onSubmit={handleSubmitWorkflow}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        );
      case 'runs':
        return (
          <WorkflowRuns
            workflowId={currentWorkflow!.id}
            workflowName={currentWorkflow!.name}
            runs={workflowRuns}
            loading={runsLoading}
            onRefresh={handleRefreshRuns}
            onBack={handleBackFromRuns}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <SEOHead
        metadata={{
          title: 'Automation Dashboard | Genius Online Navigator',
          description: 'Create and manage automated workflows for your marketing and content operations.',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Automation Dashboard',
            description: 'Create and manage automated workflows for your marketing and content operations.',
          },
        }}
        path="/admin/automation"
      />
      
      <main className="container mx-auto py-6 px-4 md:px-6">
        {renderContent()}
      </main>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!workflowToDelete} onOpenChange={(open) => !open && setWorkflowToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workflow
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteWorkflow} className="bg-red-500 hover:bg-red-600">
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
    const initialWorkflows = await workflowService.getWorkflows();
    const triggerTypes = await triggerService.getTriggerTypes();
    const triggerEvents = await triggerService.getTriggerEvents();
    const actionTypes = await actionService.getActionTypes();
    const actionTemplates = await actionService.getActionTemplates();
    
    return {
      props: {
        initialWorkflows,
        triggerTypes,
        triggerEvents,
        actionTypes,
        actionTemplates,
      },
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    
    // Return empty data on error
    return {
      props: {
        initialWorkflows: [],
        triggerTypes: [],
        triggerEvents: [],
        actionTypes: [],
        actionTemplates: [],
      },
    };
  }
}
