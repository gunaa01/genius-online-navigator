import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Info, 
  ChevronUp, 
  ChevronDown,
  Settings,
  Code
} from 'lucide-react';
import { format } from 'date-fns';
import { Workflow } from '@/services/automation/workflowService';
import { TriggerType, TriggerEvent } from '@/services/automation/triggerService';
import { ActionType, ActionTemplate } from '@/services/automation/actionService';
import TriggerForm from './TriggerForm';
import ActionForm from './ActionForm';

// Form schema
const workflowSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }).max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(false),
  triggers: z.array(
    z.object({
      id: z.string().optional(),
      type: z.string(),
      name: z.string().min(1, { message: 'Trigger name is required' }),
      config: z.record(z.any())
    })
  ).min(1, { message: 'At least one trigger is required' }),
  actions: z.array(
    z.object({
      id: z.string().optional(),
      type: z.string(),
      name: z.string().min(1, { message: 'Action name is required' }),
      config: z.record(z.any())
    })
  ).min(1, { message: 'At least one action is required' }),
  conditions: z.array(
    z.object({
      id: z.string().optional(),
      field: z.string(),
      operator: z.string(),
      value: z.union([z.string(), z.number(), z.boolean()]),
      logicalOperator: z.enum(['AND', 'OR']).optional()
    })
  ).optional()
});

type WorkflowFormValues = z.infer<typeof workflowSchema>;

interface WorkflowFormProps {
  workflow?: Workflow;
  triggerTypes: TriggerType[];
  triggerEvents: TriggerEvent[];
  actionTypes: ActionType[];
  actionTemplates: ActionTemplate[];
  onSubmit: (data: WorkflowFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Workflow Form
 * 
 * Form for creating and editing workflows
 */
export default function WorkflowForm({
  workflow,
  triggerTypes,
  triggerEvents,
  actionTypes,
  actionTemplates,
  onSubmit,
  onCancel,
  isSubmitting
}: WorkflowFormProps) {
  // Form
  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: workflow?.name || '',
      description: workflow?.description || '',
      isActive: workflow?.isActive || false,
      triggers: workflow?.triggers || [],
      actions: workflow?.actions || [],
      conditions: workflow?.conditions || []
    }
  });
  
  // Field arrays
  const { fields: triggerFields, append: appendTrigger, remove: removeTrigger } = 
    useFieldArray({ control: form.control, name: 'triggers' });
  
  const { fields: actionFields, append: appendAction, remove: removeAction, move: moveAction } = 
    useFieldArray({ control: form.control, name: 'actions' });
  
  const { fields: conditionFields, append: appendCondition, remove: removeCondition } = 
    useFieldArray({ control: form.control, name: 'conditions' });
  
  // Active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // Handle form submission
  const handleSubmit = (data: WorkflowFormValues) => {
    onSubmit(data);
  };
  
  // Add trigger
  const handleAddTrigger = () => {
    appendTrigger({
      type: 'schedule',
      name: 'New Trigger',
      config: {
        schedule: {
          frequency: 'daily',
          time: '09:00'
        }
      }
    });
  };
  
  // Add action
  const handleAddAction = () => {
    appendAction({
      type: 'social-media-post',
      name: 'New Action',
      config: {}
    });
  };
  
  // Move action up
  const handleMoveActionUp = (index: number) => {
    if (index > 0) {
      moveAction(index, index - 1);
    }
  };
  
  // Move action down
  const handleMoveActionDown = (index: number) => {
    if (index < actionFields.length - 1) {
      moveAction(index, index + 1);
    }
  };
  
  // Add condition
  const handleAddCondition = () => {
    appendCondition({
      field: '',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    });
  };
  
  // Validation errors
  const triggerErrors = form.formState.errors.triggers;
  const actionErrors = form.formState.errors.actions;
  
  // Check if tabs have errors
  const hasGeneralErrors = form.formState.errors.name || form.formState.errors.description;
  const hasTriggersErrors = triggerErrors && triggerErrors.length > 0;
  const hasActionsErrors = actionErrors && actionErrors.length > 0;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="general" className="relative">
                General
                {hasGeneralErrors && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                    <AlertCircle className="h-3 w-3" />
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="triggers" className="relative">
                Triggers
                {hasTriggersErrors && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                    <AlertCircle className="h-3 w-3" />
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="actions" className="relative">
                Actions
                {hasActionsErrors && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                    <AlertCircle className="h-3 w-3" />
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>
                    Basic information about your workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workflow Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter workflow name" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for your workflow
                        </FormDescription>
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
                            placeholder="Enter workflow description" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Optional description of what this workflow does
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <FormDescription>
                            Enable or disable this workflow
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Triggers Tab */}
            <TabsContent value="triggers">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Triggers</CardTitle>
                  <CardDescription>
                    Define when your workflow should run
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {triggerFields.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        No triggers added yet. Add a trigger to define when your workflow should run.
                      </p>
                      <Button type="button" onClick={handleAddTrigger}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Trigger
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Accordion type="multiple" defaultValue={triggerFields.map((_, i) => `trigger-${i}`)}>
                        {triggerFields.map((field, index) => (
                          <AccordionItem key={field.id} value={`trigger-${index}`} className="border rounded-md">
                            <AccordionTrigger className="px-4">
                              <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {form.watch(`triggers.${index}.name`) || `Trigger ${index + 1}`}
                                  </span>
                                </div>
                                <Badge variant="outline">
                                  {form.watch(`triggers.${index}.type`)}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="space-y-4">
                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeTrigger(index)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                                
                                <TriggerForm
                                  control={form.control}
                                  index={index}
                                  triggerTypes={triggerTypes}
                                  triggerEvents={triggerEvents}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                      
                      <div className="flex justify-center">
                        <Button type="button" variant="outline" onClick={handleAddTrigger}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Trigger
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {triggerErrors && triggerErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Please fix the errors in your triggers
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Actions Tab */}
            <TabsContent value="actions">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Actions</CardTitle>
                  <CardDescription>
                    Define what your workflow should do when triggered
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {actionFields.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        No actions added yet. Add an action to define what your workflow should do.
                      </p>
                      <Button type="button" onClick={handleAddAction}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Action
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Accordion type="multiple" defaultValue={actionFields.map((_, i) => `action-${i}`)}>
                        {actionFields.map((field, index) => (
                          <AccordionItem key={field.id} value={`action-${index}`} className="border rounded-md">
                            <AccordionTrigger className="px-4">
                              <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {form.watch(`actions.${index}.name`) || `Action ${index + 1}`}
                                  </span>
                                </div>
                                <Badge variant="outline">
                                  {form.watch(`actions.${index}.type`)}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <div className="flex space-x-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMoveActionUp(index)}
                                      disabled={index === 0}
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMoveActionDown(index)}
                                      disabled={index === actionFields.length - 1}
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeAction(index)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                                
                                <ActionForm
                                  control={form.control}
                                  index={index}
                                  actionTypes={actionTypes}
                                  actionTemplates={actionTemplates}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                      
                      <div className="flex justify-center">
                        <Button type="button" variant="outline" onClick={handleAddAction}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Action
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {actionErrors && actionErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Please fix the errors in your actions
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
              
              {/* Conditions Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Advanced Conditions</CardTitle>
                  <CardDescription>
                    Optional conditions to control when actions should run
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {conditionFields.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        No conditions added yet. Add conditions to control when your actions should run.
                      </p>
                      <Button type="button" variant="outline" onClick={handleAddCondition}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conditionFields.map((field, index) => (
                        <Card key={field.id} className="border">
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Condition {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCondition(index)}
                                className="text-red-500 hover:text-red-600 h-8 px-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <FormField
                                control={form.control}
                                name={`conditions.${index}.field`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Field</FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select field" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="trigger.time">Trigger Time</SelectItem>
                                        <SelectItem value="trigger.day">Trigger Day</SelectItem>
                                        <SelectItem value="trigger.data.engagement">Engagement</SelectItem>
                                        <SelectItem value="trigger.data.sentiment">Sentiment</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`conditions.${index}.operator`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Operator</FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select operator" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="equals">Equals</SelectItem>
                                        <SelectItem value="not_equals">Not Equals</SelectItem>
                                        <SelectItem value="greater_than">Greater Than</SelectItem>
                                        <SelectItem value="less_than">Less Than</SelectItem>
                                        <SelectItem value="contains">Contains</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`conditions.${index}.value`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {index < conditionFields.length - 1 && (
                                <FormField
                                  control={form.control}
                                  name={`conditions.${index}.logicalOperator`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Logic</FormLabel>
                                      <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="AND/OR" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="AND">AND</SelectItem>
                                          <SelectItem value="OR">OR</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <div className="flex justify-center">
                        <Button type="button" variant="outline" onClick={handleAddCondition}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Condition
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : workflow ? 'Update Workflow' : 'Create Workflow'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
