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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TriggerType, TriggerEvent } from '@/services/automation/triggerService';

interface TriggerFormProps {
  control: Control<any>;
  index: number;
  triggerTypes: TriggerType[];
  triggerEvents: TriggerEvent[];
}

/**
 * Trigger Form
 * 
 * Dynamic form for configuring workflow triggers
 */
export default function TriggerForm({
  control,
  index,
  triggerTypes,
  triggerEvents
}: TriggerFormProps) {
  // Watch trigger type to conditionally render fields
  const triggerType = useWatch({
    control,
    name: `triggers.${index}.type`
  });
  
  // Update config when trigger type changes
  useEffect(() => {
    const defaultConfigs: Record<string, any> = {
      schedule: {
        schedule: {
          frequency: 'daily',
          time: '09:00'
        }
      },
      event: {
        eventType: '',
        eventSource: ''
      },
      webhook: {
        endpoint: '',
        method: 'POST',
        headers: {}
      },
      manual: {}
    };
    
    if (triggerType && defaultConfigs[triggerType]) {
      // Only set default config if it doesn't exist yet
      const currentConfig = control._getWatch(`triggers.${index}.config`);
      if (!currentConfig || Object.keys(currentConfig).length === 0) {
        control._subjects.state.next({
          name: `triggers.${index}.config`,
          type: 'change',
          value: defaultConfigs[triggerType]
        });
      }
    }
  }, [triggerType, control, index]);
  
  // Get available days of week
  const daysOfWeek = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' }
  ];
  
  return (
    <div className="space-y-4">
      {/* Trigger Name */}
      <FormField
        control={control}
        name={`triggers.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trigger Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter trigger name" {...field} />
            </FormControl>
            <FormDescription>
              A descriptive name for this trigger
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Trigger Type */}
      <FormField
        control={control}
        name={`triggers.${index}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trigger Type</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {triggerTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {triggerTypes.find(t => t.id === field.value)?.description || 'Select a trigger type'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Schedule Trigger Config */}
      {triggerType === 'schedule' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Schedule Configuration</h4>
          
          {/* Frequency */}
          <FormField
            control={control}
            name={`triggers.${index}.config.schedule.frequency`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom (Cron)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Time */}
          <FormField
            control={control}
            name={`triggers.${index}.config.schedule.time`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Date (for once) */}
          {useWatch({
            control,
            name: `triggers.${index}.config.schedule.frequency`
          }) === 'once' && (
            <FormField
              control={control}
              name={`triggers.${index}.config.schedule.date`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Days (for weekly) */}
          {useWatch({
            control,
            name: `triggers.${index}.config.schedule.frequency`
          }) === 'weekly' && (
            <FormField
              control={control}
              name={`triggers.${index}.config.schedule.days`}
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Days of Week</FormLabel>
                    <FormDescription>
                      Select which days of the week this should run
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day.value}
                        control={control}
                        name={`triggers.${index}.config.schedule.days`}
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    const newValues = checked
                                      ? [...currentValues, day.value]
                                      : currentValues.filter((value: string) => value !== day.value);
                                    field.onChange(newValues);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Day of Month (for monthly) */}
          {useWatch({
            control,
            name: `triggers.${index}.config.schedule.frequency`
          }) === 'monthly' && (
            <FormField
              control={control}
              name={`triggers.${index}.config.schedule.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Month</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day of month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Cron Expression (for custom) */}
          {useWatch({
            control,
            name: `triggers.${index}.config.schedule.frequency`
          }) === 'custom' && (
            <FormField
              control={control}
              name={`triggers.${index}.config.schedule.cronExpression`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cron Expression</FormLabel>
                  <FormControl>
                    <Input placeholder="* * * * *" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a valid cron expression (e.g., "0 9 * * 1-5" for weekdays at 9 AM)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}
      
      {/* Event Trigger Config */}
      {triggerType === 'event' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Event Configuration</h4>
          
          {/* Event Source */}
          <FormField
            control={control}
            name={`triggers.${index}.config.eventSource`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Source</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="ai-content">AI Content</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Event Type */}
          <FormField
            control={control}
            name={`triggers.${index}.config.eventType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {triggerEvents
                      .filter(event => 
                        !useWatch({
                          control,
                          name: `triggers.${index}.config.eventSource`
                        }) || 
                        event.source === useWatch({
                          control,
                          name: `triggers.${index}.config.eventSource`
                        })
                      )
                      .map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {triggerEvents.find(e => e.id === field.value)?.description || 'Select an event type'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Conditions */}
          <FormField
            control={control}
            name={`triggers.${index}.config.conditions`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conditions (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter conditions in JSON format" 
                    className="font-mono text-sm"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Optional JSON conditions to filter events (e.g., {"engagement": {"gt": 100}})
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* Webhook Trigger Config */}
      {triggerType === 'webhook' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Webhook Configuration</h4>
          
          {/* Endpoint */}
          <FormField
            control={control}
            name={`triggers.${index}.config.endpoint`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input placeholder="Generated automatically" disabled {...field} />
                </FormControl>
                <FormDescription>
                  This webhook URL will be generated when you save the workflow
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Secret */}
          <FormField
            control={control}
            name={`triggers.${index}.config.secret`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook Secret</FormLabel>
                <FormControl>
                  <Input placeholder="Generated automatically" disabled {...field} />
                </FormControl>
                <FormDescription>
                  A secret key will be generated for webhook security
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description */}
          <FormField
            control={control}
            name={`triggers.${index}.config.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what this webhook is for" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Optional description for this webhook
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* Manual Trigger Config */}
      {triggerType === 'manual' && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Manual Trigger Configuration</h4>
          
          <p className="text-sm text-muted-foreground">
            This workflow will only run when manually triggered by a user.
          </p>
          
          {/* Description */}
          <FormField
            control={control}
            name={`triggers.${index}.config.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe when this workflow should be manually triggered" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Optional instructions for when to trigger this workflow
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
