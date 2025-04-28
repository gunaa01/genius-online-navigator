import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

// Form schema for content generation
const contentFormSchema = z.object({
  contentType: z.string({
    required_error: "Please select a content type",
  }),
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }),
  keywords: z.string().optional(),
  tone: z.string().optional(),
  length: z.string({
    required_error: "Please select content length",
  }),
});

export type ContentFormValues = z.infer<typeof contentFormSchema>;

interface ContentFormProps {
  onSubmit: (values: ContentFormValues) => void;
  isLoading: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      contentType: "blog",
      topic: "",
      keywords: "",
      tone: "professional",
      length: "medium",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate AI Content</CardTitle>
        <CardDescription>
          Describe what type of content you want to create
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="social">Social Media Post</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="ad">Advertisement</SelectItem>
                      <SelectItem value="product">Product Description</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    What kind of content do you want to generate?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your topic" {...field} />
                  </FormControl>
                  <FormDescription>
                    The main subject of your content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO keywords, comma separated" {...field} />
                  </FormControl>
                  <FormDescription>
                    Key terms to include in your content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The writing style for your content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Length</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How long should your content be?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Content"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContentForm; 