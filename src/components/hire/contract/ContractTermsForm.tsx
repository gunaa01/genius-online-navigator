import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  Info, 
  Lock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ContractType } from './ContractTemplateSelector';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Schema for fixed price contract
const fixedPriceSchema = z.object({
  projectTitle: z.string().min(3, { message: "Project title must be at least 3 characters" }),
  projectDescription: z.string().min(10, { message: "Description must be at least 10 characters" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  totalAmount: z.string().min(1, { message: "Total amount is required" }),
  paymentSchedule: z.enum(["full_payment", "upfront_remainder", "milestone_based"], {
    required_error: "Payment schedule is required",
  }),
  upfrontPercentage: z.string().optional(),
  deliverables: z.string().min(10, { message: "Deliverables must be at least 10 characters" }),
  revisionLimit: z.string(),
  revisionPeriod: z.string(),
  cancellationTerms: z.string().min(1, { message: "Cancellation terms are required" }),
  intellectualProperty: z.enum(["client_ownership", "client_license", "freelancer_ownership"], {
    required_error: "Intellectual property terms are required",
  }),
  confidentiality: z.boolean(),
  disputeResolution: z.enum(["platform_mediation", "arbitration", "court"], {
    required_error: "Dispute resolution method is required",
  }),
  additionalTerms: z.string().optional(),
});

// Schema for hourly rate contract
const hourlyRateSchema = z.object({
  projectTitle: z.string().min(3, { message: "Project title must be at least 3 characters" }),
  projectDescription: z.string().min(10, { message: "Description must be at least 10 characters" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  hourlyRate: z.string().min(1, { message: "Hourly rate is required" }),
  estimatedHours: z.string(),
  maxHoursPerWeek: z.string(),
  paymentSchedule: z.enum(["weekly", "biweekly", "monthly"], {
    required_error: "Payment schedule is required",
  }),
  timeTrackingMethod: z.enum(["platform", "screenshots", "manual", "third_party"], {
    required_error: "Time tracking method is required",
  }),
  deliverables: z.string().optional(),
  reportingRequirements: z.string(),
  cancellationTerms: z.string().min(1, { message: "Cancellation terms are required" }),
  intellectualProperty: z.enum(["client_ownership", "client_license", "freelancer_ownership"], {
    required_error: "Intellectual property terms are required",
  }),
  confidentiality: z.boolean(),
  disputeResolution: z.enum(["platform_mediation", "arbitration", "court"], {
    required_error: "Dispute resolution method is required",
  }),
  additionalTerms: z.string().optional(),
});

// Combined schema with conditional validation based on contract type
const contractSchema = z.discriminatedUnion("contractType", [
  z.object({
    contractType: z.literal("fixed_price"),
    terms: fixedPriceSchema,
  }),
  z.object({
    contractType: z.literal("hourly_rate"),
    terms: hourlyRateSchema,
  }),
]);

interface ContractTermsFormProps {
  contractType: ContractType;
  serviceTitle?: string;
  serviceDescription?: string;
  freelancerName?: string;
  clientName?: string;
  onSave: (data: any) => void;
}

const ContractTermsForm = ({
  contractType,
  serviceTitle = "",
  serviceDescription = "",
  freelancerName = "",
  clientName = "",
  onSave
}: ContractTermsFormProps) => {
  const [isCustomIntellectualProperty, setIsCustomIntellectualProperty] = useState(false);
  
  // Initialize form based on contract type
  const form = useForm<z.infer<typeof fixedPriceSchema> | z.infer<typeof hourlyRateSchema>>({
    resolver: zodResolver(contractType === 'fixed_price' ? fixedPriceSchema : hourlyRateSchema),
    defaultValues: {
      projectTitle: serviceTitle,
      projectDescription: serviceDescription,
      startDate: new Date(),
      ...(contractType === 'fixed_price' ? {
        paymentSchedule: "milestone_based",
        revisionLimit: "3",
        revisionPeriod: "7",
        cancellationTerms: "50% payment if cancelled by client after work starts",
        intellectualProperty: "client_ownership",
        confidentiality: true,
        disputeResolution: "platform_mediation",
      } : {
        paymentSchedule: "weekly",
        maxHoursPerWeek: "40",
        timeTrackingMethod: "platform",
        reportingRequirements: "Weekly timesheet with task descriptions",
        cancellationTerms: "7 days notice, payment for hours worked",
        intellectualProperty: "client_ownership",
        confidentiality: true,
        disputeResolution: "platform_mediation",
      })
    },
  });

  const onSubmit = (data: any) => {
    onSave({
      contractType,
      terms: data,
      freelancerName,
      clientName,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Customize Contract Terms</h2>
        <p className="text-muted-foreground">
          Define the specific terms for your {contractType.replace('_', ' ')} contract
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Accordion type="single" collapsible defaultValue="project">
            {/* Project Details Section */}
            <AccordionItem value="project">
              <AccordionTrigger>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Project Details</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="projectTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., E-commerce Website Development" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the scope and objectives of the project" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date {contractType === 'hourly_rate' && "(Optional)"}</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  disabled={(date) => date < (form.getValues().startDate || new Date())}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Payment Terms Section */}
            <AccordionItem value="payment">
              <AccordionTrigger>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Payment Terms</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {contractType === 'fixed_price' ? (
                      <>
                        <FormField
                          control={form.control}
                          name="totalAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Project Amount</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="5000" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="paymentSchedule"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Schedule</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment schedule" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="full_payment">Full payment upon completion</SelectItem>
                                  <SelectItem value="upfront_remainder">Upfront deposit + remainder upon completion</SelectItem>
                                  <SelectItem value="milestone_based">Milestone-based payments</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How and when payments will be processed
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("paymentSchedule") === "upfront_remainder" && (
                          <FormField
                            control={form.control}
                            name="upfrontPercentage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Upfront Percentage</FormLabel>
                                <div className="flex items-center space-x-2">
                                  <FormControl>
                                    <Input className="w-20" {...field} />
                                  </FormControl>
                                  <span>%</span>
                                </div>
                                <FormDescription>
                                  Percentage paid upfront (typically 30-50%)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <FormField
                          control={form.control}
                          name="hourlyRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hourly Rate</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="75" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="estimatedHours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estimated Total Hours</FormLabel>
                                <FormControl>
                                  <Input placeholder="40" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Approximate total project hours
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="maxHoursPerWeek"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Hours Per Week</FormLabel>
                                <FormControl>
                                  <Input placeholder="20" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="paymentSchedule"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Frequency</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="timeTrackingMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time Tracking Method</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time tracking method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="platform">Platform time tracker</SelectItem>
                                  <SelectItem value="screenshots">Time tracker with screenshots</SelectItem>
                                  <SelectItem value="manual">Manual time reporting</SelectItem>
                                  <SelectItem value="third_party">Third-party time tracking tool</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How working hours will be tracked and verified
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="reportingRequirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reporting Requirements</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe how time and progress will be reported" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Deliverables Section */}
            <AccordionItem value="deliverables">
              <AccordionTrigger>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Deliverables & Expectations</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="deliverables"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Deliverables</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List all specific items, files, or services to be delivered" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Clearly define what will be delivered at the end of the project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {contractType === 'fixed_price' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="revisionLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Revision Limit</FormLabel>
                              <FormControl>
                                <Input placeholder="3" {...field} />
                              </FormControl>
                              <FormDescription>
                                Number of revision rounds included
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="revisionPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Revision Request Period (Days)</FormLabel>
                              <FormControl>
                                <Input placeholder="7" {...field} />
                              </FormControl>
                              <FormDescription>
                                Days to request revisions after delivery
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Legal Terms Section */}
            <AccordionItem value="legal">
              <AccordionTrigger>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Legal Terms</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="cancellationTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cancellation Terms</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Specify the terms if either party cancels the contract" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="intellectualProperty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center">
                              <span>Intellectual Property Rights</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      Defines who owns the work and what rights are transferred upon completion
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setIsCustomIntellectualProperty(value === "custom");
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select IP rights" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="client_ownership">Client owns all rights upon final payment</SelectItem>
                              <SelectItem value="client_license">Client receives license to use, freelancer retains ownership</SelectItem>
                              <SelectItem value="freelancer_ownership">Freelancer retains ownership with granted usage rights</SelectItem>
                              <SelectItem value="custom">Custom IP arrangement</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isCustomIntellectualProperty && (
                      <div className="pl-4 border-l-2 border-muted">
                        <FormField
                          control={form.control}
                          name="customIntellectualProperty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom IP Arrangement</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe the custom intellectual property arrangement" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="confidentiality"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Confidentiality Clause</FormLabel>
                            <FormDescription>
                              Both parties agree not to disclose confidential information
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
                    
                    <FormField
                      control={form.control}
                      name="disputeResolution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dispute Resolution Method</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select dispute resolution method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="platform_mediation">Platform Mediation</SelectItem>
                              <SelectItem value="arbitration">Binding Arbitration</SelectItem>
                              <SelectItem value="court">Court in Jurisdiction</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Additional Terms Section */}
            <AccordionItem value="additional">
              <AccordionTrigger>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Additional Terms (Optional)</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="additionalTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Terms & Conditions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add any additional terms or special conditions not covered above" 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Include any special requirements, constraints, or agreements specific to this project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-8 space-y-4">
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>Legal Binding Document</AlertTitle>
              <AlertDescription>
                This contract will be legally binding once both parties sign. We recommend reviewing all terms carefully.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">Save as Draft</Button>
              <Button type="submit">Review Contract</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContractTermsForm;
