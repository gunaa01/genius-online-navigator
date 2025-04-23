import { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Trash2, 
  GripVertical,
  Info,
  AlertCircle,
  CheckCircle,
  ArrowUpDown
} from 'lucide-react';
import { format } from 'date-fns';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define the milestone schema
const milestoneSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  paymentTrigger: z.enum(["completion", "approval", "date"], {
    required_error: "Payment trigger is required",
  }),
  deliverables: z.string().min(5, { message: "Deliverables must be at least 5 characters" }),
});

// Define the milestones array schema
const milestonesSchema = z.object({
  milestones: z.array(milestoneSchema).min(1, { message: "At least one milestone is required" }),
  totalAmount: z.string(),
});

// Milestone type
export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  amount: string;
  paymentTrigger: "completion" | "approval" | "date";
  deliverables: string;
  status?: "pending" | "in_progress" | "completed" | "paid";
}

interface MilestoneEditorProps {
  initialMilestones?: Milestone[];
  contractTotal?: string;
  onSave: (milestones: Milestone[], totalAmount: string) => void;
  projectStartDate?: Date;
  projectEndDate?: Date;
}

const MilestoneEditor = ({
  initialMilestones = [],
  contractTotal = "",
  onSave,
  projectStartDate = new Date(),
  projectEndDate,
}: MilestoneEditorProps) => {
  const [error, setError] = useState<string | null>(null);
  
  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof milestonesSchema>>({
    resolver: zodResolver(milestonesSchema),
    defaultValues: {
      milestones: initialMilestones.length > 0 ? initialMilestones : [
        {
          id: crypto.randomUUID(),
          title: "Project Kickoff",
          description: "Initial project setup and requirements gathering",
          dueDate: new Date(new Date().setDate(projectStartDate.getDate() + 3)),
          amount: contractTotal ? (parseInt(contractTotal.replace(/\D/g, '')) * 0.25).toString() : "500",
          paymentTrigger: "approval",
          deliverables: "Project plan, timeline, and initial requirements document",
          status: "pending"
        }
      ],
      totalAmount: contractTotal || "2000",
    }
  });
  
  // Use fieldArray to handle the dynamic milestones array
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  // Calculate the sum of all milestone amounts
  const calculateTotalAmount = () => {
    const milestones = form.getValues().milestones;
    return milestones.reduce((sum, milestone) => {
      const amount = parseFloat(milestone.amount.replace(/\D/g, '')) || 0;
      return sum + amount;
    }, 0);
  };

  // Update total when milestone amounts change
  const updateTotalAmount = () => {
    const total = calculateTotalAmount();
    form.setValue("totalAmount", total.toString());
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof milestonesSchema>) => {
    // Verify that milestone amounts add up to the total contract amount
    const totalMilestoneAmount = calculateTotalAmount();
    const contractTotalValue = parseInt(contractTotal.replace(/\D/g, '')) || 0;

    if (contractTotal && totalMilestoneAmount !== contractTotalValue) {
      setError(`Milestone payments (${totalMilestoneAmount}) don't match the contract total (${contractTotalValue})`);
      return;
    }

    setError(null);
    onSave(data.milestones as Milestone[], data.totalAmount);
  };

  // Add a new milestone
  const addMilestone = () => {
    const milestones = form.getValues().milestones;
    const lastMilestone = milestones[milestones.length - 1];
    const lastDueDate = lastMilestone ? new Date(lastMilestone.dueDate) : new Date();
    
    // Set the new due date to 7 days after the last milestone
    const newDueDate = new Date(lastDueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    // Calculate a reasonable default amount (remaining divided by 2)
    const totalAmount = parseInt(form.getValues().totalAmount.replace(/\D/g, '')) || 0;
    const currentTotal = calculateTotalAmount();
    const remaining = totalAmount - currentTotal;
    const defaultAmount = Math.max(Math.floor(remaining / 2), 0).toString();

    append({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      dueDate: newDueDate,
      amount: defaultAmount,
      paymentTrigger: "approval",
      deliverables: "",
      status: "pending"
    } as any);
  };

  // Handle drag and drop reordering
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Project Milestones</h2>
        <p className="text-muted-foreground">
          Define the key milestones, deliverables, and payment schedule for your project
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Overview</CardTitle>
                <CardDescription>
                  Track milestone payments against total contract value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormField
                      control={form.control}
                      name="totalAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center">
                              <span>Total Contract Amount</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      This should match the total contract value
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-9" 
                                placeholder="5000" 
                                {...field} 
                                readOnly={!!contractTotal}
                              />
                            </div>
                          </FormControl>
                          {!!contractTotal && (
                            <FormDescription>
                              Set from contract total amount
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium mb-2">Milestone Payment Allocation</span>
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Allocated</span>
                        <span className="text-sm font-medium">${calculateTotalAmount()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                        <div 
                          className={`h-full ${
                            calculateTotalAmount() > parseInt(form.getValues().totalAmount.replace(/\D/g, '')) 
                              ? 'bg-destructive' 
                              : 'bg-primary'
                          }`}
                          style={{ 
                            width: `${Math.min(
                              calculateTotalAmount() / (parseInt(form.getValues().totalAmount.replace(/\D/g, '')) || 1) * 100, 
                              100
                            )}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Remaining</span>
                        <span className="text-sm font-medium">
                          ${Math.max((parseInt(form.getValues().totalAmount.replace(/\D/g, '')) || 0) - calculateTotalAmount(), 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Milestone Details</h3>
                <Button type="button" onClick={updateTotalAmount} variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Update Total
                </Button>
              </div>
              
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="milestones">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="relative"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="absolute left-4 top-4 cursor-move opacity-50 hover:opacity-100"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              
                              <CardHeader className="pl-12">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Badge className="mb-2">Milestone {index + 1}</Badge>
                                    <FormField
                                      control={form.control}
                                      name={`milestones.${index}.title`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input 
                                              placeholder="Milestone title" 
                                              className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0" 
                                              {...field} 
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`milestones.${index}.dueDate`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col">
                                        <FormLabel>Due Date</FormLabel>
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
                                              disabled={(date) => {
                                                // Disable dates before project start or after project end
                                                if (date < projectStartDate) return true;
                                                if (projectEndDate && date > projectEndDate) return true;
                                                return false;
                                              }}
                                            />
                                          </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name={`milestones.${index}.amount`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Payment Amount</FormLabel>
                                        <FormControl>
                                          <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                              className="pl-9" 
                                              placeholder="1000" 
                                              {...field} 
                                              onChange={(e) => {
                                                field.onChange(e);
                                                // We could update the total here but that might be confusing
                                                // for the user while they're still typing
                                              }}
                                              onBlur={(e) => {
                                                field.onBlur();
                                                updateTotalAmount();
                                              }}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Describe what this milestone represents" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.deliverables`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Deliverables</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="List specific items to be delivered in this milestone" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.paymentTrigger`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Payment Trigger</FormLabel>
                                      <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select when payment is released" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="completion">On Delivery (Freelancer marks complete)</SelectItem>
                                          <SelectItem value="approval">On Approval (Client accepts deliverables)</SelectItem>
                                          <SelectItem value="date">On Due Date (Automatic on date)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormDescription>
                                        When payment for this milestone is released
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addMilestone}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Payment Protection</AlertTitle>
              <AlertDescription>
                All milestone payments are held in escrow until deliverables are approved, providing security for both parties.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">Save Milestones</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MilestoneEditor;
