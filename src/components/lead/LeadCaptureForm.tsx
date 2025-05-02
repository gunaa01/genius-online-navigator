import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

// Define form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  message: z.string().optional(),
  leadSource: z.string().optional(),
  interests: z.array(z.string()).optional(),
  marketingConsent: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadCaptureFormProps {
  title?: string;
  description?: string;
  crmProvider?: 'hubspot' | 'mailchimp' | 'none';
  apiKey?: string;
  listId?: string;
  redirectUrl?: string;
  fields?: Array<keyof FormValues>;
  customFields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'select' | 'checkbox' | 'textarea';
    required?: boolean;
    options?: string[];
  }>;
  buttonText?: string;
  successMessage?: string;
  variant?: 'default' | 'inline' | 'popup' | 'embedded';
  className?: string;
  onSubmit?: (data: FormValues) => Promise<boolean>;
  testMode?: boolean;
}

/**
 * Lead Capture Form Component with CRM Integration
 * Supports HubSpot and Mailchimp integration
 */
const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  title = 'Contact Us',
  description = 'Fill out the form below and we\'ll get back to you as soon as possible.',
  crmProvider = 'none',
  apiKey,
  listId,
  redirectUrl,
  fields = ['firstName', 'lastName', 'email', 'message'],
  customFields = [],
  buttonText = 'Submit',
  successMessage = 'Thank you for your submission! We\'ll be in touch shortly.',
  variant = 'default',
  className = '',
  onSubmit,
  testMode = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      message: '',
      leadSource: '',
      interests: [],
      marketingConsent: false,
    },
  });

  // Handle form submission
  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // If in test mode, simulate API call
      if (testMode) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Form submitted in test mode:', data);
        setIsSubmitted(true);
        setIsSubmitting(false);
        return;
      }

      // Use custom onSubmit handler if provided
      if (onSubmit) {
        const success = await onSubmit(data);
        if (success) {
          setIsSubmitted(true);
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        } else {
          setSubmissionError('There was an error submitting your form. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      // Otherwise handle submission based on CRM provider
      let success = false;

      switch (crmProvider) {
        case 'hubspot':
          success = await submitToHubspot(data);
          break;
        case 'mailchimp':
          success = await submitToMailchimp(data);
          break;
        case 'none':
          // Just log the data if no CRM is specified
          console.log('Form submitted (no CRM):', data);
          success = true;
          break;
      }

      if (success) {
        setIsSubmitted(true);
        toast.success(successMessage);
        
        // Redirect if URL is provided
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      } else {
        setSubmissionError('There was an error submitting your form. Please try again.');
        toast.error('Form submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionError('An unexpected error occurred. Please try again later.');
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit to HubSpot
  const submitToHubspot = async (data: FormValues): Promise<boolean> => {
    if (!apiKey) {
      console.error('HubSpot API key is required');
      return false;
    }

    try {
      // This would be replaced with actual HubSpot API call
      // Example implementation:
      /*
      const response = await fetch('https://api.hsforms.com/submissions/v3/integration/submit/YOUR_PORTAL_ID/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: [
            { name: 'firstname', value: data.firstName },
            { name: 'lastname', value: data.lastName },
            { name: 'email', value: data.email },
            { name: 'phone', value: data.phone || '' },
            { name: 'company', value: data.company || '' },
            { name: 'jobtitle', value: data.jobTitle || '' },
            { name: 'message', value: data.message || '' },
          ],
          context: {
            pageUri: window.location.href,
            pageName: document.title
          },
          legalConsentOptions: {
            consent: {
              consentToProcess: true,
              text: 'I agree to allow [company name] to store and process my personal data.',
              communications: [
                {
                  value: data.marketingConsent,
                  subscriptionTypeId: 999,
                  text: 'I agree to receive marketing communications from [company name].'
                }
              ]
            }
          }
        })
      });
      
      return response.ok;
      */
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted to HubSpot:', data);
      return true;
    } catch (error) {
      console.error('HubSpot submission error:', error);
      return false;
    }
  };

  // Submit to Mailchimp
  const submitToMailchimp = async (data: FormValues): Promise<boolean> => {
    if (!apiKey || !listId) {
      console.error('Mailchimp API key and List ID are required');
      return false;
    }

    try {
      // This would be replaced with actual Mailchimp API call
      // Example implementation:
      /*
      const response = await fetch(`https://proxy-server.example.com/mailchimp/lists/${listId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}`
        },
        body: JSON.stringify({
          email_address: data.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: data.firstName,
            LNAME: data.lastName,
            PHONE: data.phone || '',
            COMPANY: data.company || '',
            JOBTITLE: data.jobTitle || '',
          },
          tags: data.interests
        })
      });
      
      return response.ok;
      */
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted to Mailchimp:', data);
      return true;
    } catch (error) {
      console.error('Mailchimp submission error:', error);
      return false;
    }
  };

  // Render form based on variant
  const renderForm = () => {
    if (isSubmitted) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Thank You!</h3>
          <p className="text-muted-foreground">{successMessage}</p>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.includes('firstName') && (
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {fields.includes('lastName') && (
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {fields.includes('email') && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {fields.includes('phone') && (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {fields.includes('company') && (
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {fields.includes('jobTitle') && (
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Marketing Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {fields.includes('message') && (
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How can we help you?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Render custom fields */}
          {customFields.map((customField) => (
            <div key={customField.name}>
              <Label htmlFor={customField.name}>{customField.label}</Label>
              {customField.type === 'select' ? (
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {customField.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : customField.type === 'textarea' ? (
                <Textarea id={customField.name} placeholder={customField.label} />
              ) : (
                <Input
                  id={customField.name}
                  type={customField.type}
                  placeholder={customField.label}
                  required={customField.required}
                />
              )}
            </div>
          ))}

          <FormField
            control={form.control}
            name="marketingConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketing Communications</FormLabel>
                  <FormDescription>
                    I agree to receive marketing communications and updates.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {submissionError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {submissionError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </form>
      </Form>
    );
  };

  // Render based on variant
  switch (variant) {
    case 'inline':
      return (
        <div className={className}>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {renderForm()}
        </div>
      );
    
    case 'popup':
      // This would be rendered in a Dialog/Modal component
      return (
        <div className={className}>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {renderForm()}
        </div>
      );
    
    case 'embedded':
      return (
        <div className={`bg-muted/50 p-6 rounded-lg ${className}`}>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {renderForm()}
        </div>
      );
    
    case 'default':
    default:
      return (
        <Card className={className}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderForm()}
          </CardContent>
        </Card>
      );
  }
};

export default LeadCaptureForm;
