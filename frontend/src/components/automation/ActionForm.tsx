import React, { useEffect } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  FileText, 
  Send, 
  MessageSquare, 
  BellRing, 
  Code, 
  Settings,
  Wand
} from 'lucide-react';
import { ActionType, ActionTemplate } from '@/services/automation/actionService';

interface ActionFormProps {
  control: Control<any>;
  index: number;
  actionTypes: ActionType[];
  actionTemplates: ActionTemplate[];
}

/**
 * Action Form
 * 
 * Dynamic form for configuring workflow actions
 */
export default function ActionForm({
  control,
  index,
  actionTypes,
  actionTemplates
}: ActionFormProps) {
  // Watch action type to conditionally render fields
  const actionType = useWatch({
    control,
    name: `actions.${index}.type`
  });
  
  // Update config when action type changes
  useEffect(() => {
    const defaultConfigs: Record<string, any> = {
      'social-media-post': {
        platforms: [],
        content: '',
        media: [],
        schedule: {
          useOptimalTime: true
        }
      },
      'ai-content-generation': {
        template: '',
        parameters: {},
        saveToHistory: true
      },
      'notification': {
        channels: ['email'],
        subject: '',
        message: '',
        recipients: []
      },
      'api-request': {
        url: '',
        method: 'GET',
        headers: {},
        body: ''
      },
      'data-transformation': {
        transformationType: 'map',
        script: ''
      }
    };
    
    if (actionType && defaultConfigs[actionType]) {
      // Only set default config if it doesn't exist yet
      const currentConfig = control._getWatch(`actions.${index}.config`);
      if (!currentConfig || Object.keys(currentConfig).length === 0) {
        control._subjects.state.next({
          name: `actions.${index}.config`,
          type: 'change',
          value: defaultConfigs[actionType]
        });
      }
    }
  }, [actionType, control, index]);
  
  // Get templates for current action type
  const filteredTemplates = actionTemplates.filter(template => template.actionType === actionType);
  
  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = actionTemplates.find(t => t.id === templateId);
    if (template) {
      // Update action name
      control._subjects.state.next({
        name: `actions.${index}.name`,
        type: 'change',
        value: template.name
      });
      
      // Update action config
      control._subjects.state.next({
        name: `actions.${index}.config`,
        type: 'change',
        value: template.config
      });
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Action Name */}
      <FormField
        control={control}
        name={`actions.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Action Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter action name" {...field} />
            </FormControl>
            <FormDescription>
              A descriptive name for this action
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Action Type */}
      <FormField
        control={control}
        name={`actions.${index}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Action Type</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {actionTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {actionTypes.find(t => t.id === field.value)?.description || 'Select an action type'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Templates */}
      {filteredTemplates.length > 0 && (
        <div className="mb-6">
          <FormLabel>Templates</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:border-primary" onClick={() => applyTemplate(template.id)}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click a template to apply its configuration
          </p>
        </div>
      )}
      
      {/* Social Media Post Action Config */}
      {actionType === 'social-media-post' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Social Media Post Configuration</h4>
          
          {/* Platforms */}
          <FormField
            control={control}
            name={`actions.${index}.config.platforms`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platforms</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Switch
                        id={`${platform}-${index}`}
                        checked={field.value?.includes(platform)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked
                            ? [...currentValues, platform]
                            : currentValues.filter((value: string) => value !== platform);
                          field.onChange(newValues);
                        }}
                      />
                      <Label htmlFor={`${platform}-${index}`} className="capitalize">
                        {platform}
                      </Label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Content */}
          <FormField
            control={control}
            name={`actions.${index}.config.content`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter post content" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Use {{variable}} syntax to include dynamic data from triggers or previous actions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Media */}
          <FormField
            control={control}
            name={`actions.${index}.config.media`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media URLs</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter media URLs (one per line)" 
                    {...field} 
                    onChange={(e) => {
                      const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
                      field.onChange(urls);
                    }}
                    value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                  />
                </FormControl>
                <FormDescription>
                  Enter one URL per line or use {{variable}} syntax
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Schedule - Optimal Time */}
          <FormField
            control={control}
            name={`actions.${index}.config.schedule.useOptimalTime`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Use Optimal Posting Time
                  </FormLabel>
                  <FormDescription>
                    Automatically determine the best time to post
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
          
          {/* Schedule - Specific Time */}
          {!useWatch({
            control,
            name: `actions.${index}.config.schedule.useOptimalTime`
          }) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`actions.${index}.config.schedule.date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name={`actions.${index}.config.schedule.time`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      )}
      
      {/* AI Content Generation Action Config */}
      {actionType === 'ai-content-generation' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">AI Content Generation Configuration</h4>
          
          {/* Template */}
          <FormField
            control={control}
            name={`actions.${index}.config.template`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Template</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content template" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="blog-post">Blog Post</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="email-newsletter">Email Newsletter</SelectItem>
                    <SelectItem value="product-description">Product Description</SelectItem>
                    <SelectItem value="custom">Custom Template</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Parameters */}
          <FormField
            control={control}
            name={`actions.${index}.config.parameters`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parameters</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter parameters in JSON format" 
                    className="font-mono text-sm min-h-[100px]"
                    {...field} 
                    value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        field.onChange(parsed);
                      } catch (error) {
                        // If not valid JSON, store as string
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Parameters for content generation in JSON format. Use {{variable}} syntax for dynamic values.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Save to History */}
          <FormField
            control={control}
            name={`actions.${index}.config.saveToHistory`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Save to Content History
                  </FormLabel>
                  <FormDescription>
                    Store generated content in your content history
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
        </div>
      )}
      
      {/* Notification Action Config */}
      {actionType === 'notification' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Notification Configuration</h4>
          
          {/* Channels */}
          <FormField
            control={control}
            name={`actions.${index}.config.channels`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Channels</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['email', 'sms', 'push', 'slack'].map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Switch
                        id={`${channel}-${index}`}
                        checked={field.value?.includes(channel)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked
                            ? [...currentValues, channel]
                            : currentValues.filter((value: string) => value !== channel);
                          field.onChange(newValues);
                        }}
                      />
                      <Label htmlFor={`${channel}-${index}`} className="capitalize">
                        {channel}
                      </Label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Subject */}
          <FormField
            control={control}
            name={`actions.${index}.config.subject`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter notification subject" {...field} />
                </FormControl>
                <FormDescription>
                  Use {{variable}} syntax to include dynamic data
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Message */}
          <FormField
            control={control}
            name={`actions.${index}.config.message`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter notification message" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Use {{variable}} syntax to include dynamic data from triggers or previous actions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Recipients */}
          <FormField
            control={control}
            name={`actions.${index}.config.recipients`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipients</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter recipients (one per line)" 
                    {...field} 
                    onChange={(e) => {
                      const recipients = e.target.value.split('\n').filter(r => r.trim() !== '');
                      field.onChange(recipients);
                    }}
                    value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                  />
                </FormControl>
                <FormDescription>
                  Enter one recipient per line or use {{variable}} syntax
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* API Request Action Config */}
      {actionType === 'api-request' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">API Request Configuration</h4>
          
          {/* URL */}
          <FormField
            control={control}
            name={`actions.${index}.config.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://api.example.com/endpoint" {...field} />
                </FormControl>
                <FormDescription>
                  The API endpoint URL. Use {{variable}} syntax for dynamic values.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Method */}
          <FormField
            control={control}
            name={`actions.${index}.config.method`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Method</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select HTTP method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Headers */}
          <FormField
            control={control}
            name={`actions.${index}.config.headers`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headers</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter headers in JSON format" 
                    className="font-mono text-sm"
                    {...field} 
                    value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        field.onChange(parsed);
                      } catch (error) {
                        // If not valid JSON, store as string
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Request headers in JSON format. Use {{variable}} syntax for dynamic values.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Body */}
          <FormField
            control={control}
            name={`actions.${index}.config.body`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request Body</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter request body" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Request body content. Use {{variable}} syntax for dynamic values.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* Data Transformation Action Config */}
      {actionType === 'data-transformation' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Data Transformation Configuration</h4>
          
          {/* Transformation Type */}
          <FormField
            control={control}
            name={`actions.${index}.config.transformationType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transformation Type</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="map"
                      id={`transform-map-${index}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`transform-map-${index}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Wand className="mb-3 h-6 w-6" />
                      <div className="text-center">
                        <h4 className="text-sm font-medium leading-none">Map</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Transform data structure
                        </p>
                      </div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="filter"
                      id={`transform-filter-${index}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`transform-filter-${index}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Code className="mb-3 h-6 w-6" />
                      <div className="text-center">
                        <h4 className="text-sm font-medium leading-none">Filter</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Filter data elements
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Script */}
          <FormField
            control={control}
            name={`actions.${index}.config.script`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transformation Script</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter JavaScript transformation code" 
                    className="font-mono text-sm min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  JavaScript code to transform data. Input data is available as 'data' variable.
                  <br />
                  Example: <code>return data.map(item => ({ id: item.id, name: item.title }));</code>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
