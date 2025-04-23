import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { 
  workflowService, 
  WorkflowTemplate 
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
import WorkflowForm from '@/components/automation/WorkflowForm';
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
import { 
  ArrowLeft,
  Save,
  FileText,
  Wand
} from 'lucide-react';

interface CreateWorkflowProps {
  template?: WorkflowTemplate;
  triggerTypes: TriggerType[];
  triggerEvents: TriggerEvent[];
  actionTypes: ActionType[];
  actionTemplates: ActionTemplate[];
}

/**
 * Create Workflow Page
 * 
 * Page for creating new workflows, optionally based on a template
 */
export default function CreateWorkflow({
  template,
  triggerTypes,
  triggerEvents,
  actionTypes,
  actionTemplates
}: CreateWorkflowProps) {
  // Router
  const router = useRouter();
  
  // Toast
  const { toast } = useToast();
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Submit workflow form
  const handleSubmitWorkflow = async (data: any) => {
    setIsSubmitting(true);
    try {
      await workflowService.createWorkflow(data);
      
      toast({
        title: 'Success',
        description: 'Workflow created successfully.',
      });
      
      // Redirect to workflows list
      router.push('/admin/automation');
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to create workflow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cancel form
  const handleCancelForm = () => {
    router.push('/admin/automation');
  };
  
  return (
    <>
      <SEOHead
        metadata={{
          title: template ? `Create Workflow from Template | Genius Online Navigator` : 'Create Workflow | Genius Online Navigator',
          description: 'Create a new automated workflow for your marketing and content operations.',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: template ? `Create Workflow from Template` : 'Create Workflow',
            description: 'Create a new automated workflow for your marketing and content operations.',
          },
        }}
        path="/admin/automation/create"
      />
      
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Button variant="ghost" onClick={handleCancelForm} className="-ml-2 text-muted-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Workflows
                </Button>
                <div>
                  <CardTitle>
                    {template ? (
                      <div className="flex items-center">
                        <Wand className="h-5 w-5 mr-2" />
                        Create Workflow from Template
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Create New Workflow
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {template ? (
                      <>Using template: <span className="font-medium">{template.name}</span></>
                    ) : (
                      'Define a new automated workflow'
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <WorkflowForm
            workflow={template?.workflow}
            triggerTypes={triggerTypes}
            triggerEvents={triggerEvents}
            actionTypes={actionTypes}
            actionTemplates={actionTemplates}
            onSubmit={handleSubmitWorkflow}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Get template ID from query params
    const { templateId } = context.query;
    
    // Fetch data
    const [triggerTypes, triggerEvents, actionTypes, actionTemplates] = await Promise.all([
      triggerService.getTriggerTypes(),
      triggerService.getTriggerEvents(),
      actionService.getActionTypes(),
      actionService.getActionTemplates()
    ]);
    
    // If template ID is provided, fetch the template
    let template;
    if (templateId && typeof templateId === 'string') {
      template = await workflowService.getWorkflowTemplate(templateId);
    }
    
    return {
      props: {
        template: template || null,
        triggerTypes,
        triggerEvents,
        actionTypes,
        actionTemplates,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty data on error
    return {
      props: {
        template: null,
        triggerTypes: [],
        triggerEvents: [],
        actionTypes: [],
        actionTemplates: [],
      },
    };
  }
}
