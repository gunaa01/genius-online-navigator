import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code, 
  Copy, 
  Check, 
  ArrowRight, 
  FileJson, 
  Sparkles,
  PlusCircle,
  X,
  Database,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface StructuredDataGeneratorProps {
  url?: string;
  initialType?: string;
  onGenerate?: (code: string, type: string) => void;
}

const schemaTypes = [
  { value: 'article', label: 'Article', description: 'News, blog posts, or other content.' },
  { value: 'product', label: 'Product', description: 'Physical or digital merchandise.' },
  { value: 'local-business', label: 'Local Business', description: 'Physical store or service location.' },
  { value: 'faq', label: 'FAQ Page', description: 'Frequently asked questions.' },
  { value: 'event', label: 'Event', description: 'Upcoming events or gatherings.' },
  { value: 'how-to', label: 'How-To', description: 'Step-by-step guides and instructions.' },
  { value: 'recipe', label: 'Recipe', description: 'Food preparation instructions.' },
  { value: 'review', label: 'Review', description: 'Evaluation of a product or service.' },
  { value: 'video', label: 'Video', description: 'Video content with metadata.' },
  { value: 'course', label: 'Course', description: 'Educational programs and lessons.' },
];

const FormFields: { [key: string]: Array<{ name: string, label: string, type: string, required: boolean }> } = {
  'article': [
    { name: 'headline', label: 'Headline', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image URL', type: 'text', required: true },
    { name: 'author', label: 'Author Name', type: 'text', required: true },
    { name: 'publishDate', label: 'Publish Date', type: 'date', required: true },
    { name: 'modifiedDate', label: 'Modified Date', type: 'date', required: false },
  ],
  'product': [
    { name: 'name', label: 'Product Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image URL', type: 'text', required: true },
    { name: 'brand', label: 'Brand Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'currency', label: 'Currency Code', type: 'text', required: true },
    { name: 'availability', label: 'Availability', type: 'select', required: true, options: [
      { value: 'InStock', label: 'In Stock' },
      { value: 'OutOfStock', label: 'Out of Stock' },
      { value: 'PreOrder', label: 'Pre-Order' },
    ]},
    { name: 'sku', label: 'SKU', type: 'text', required: false },
  ],
  'faq': [
    { name: 'questions', label: 'FAQ Items', type: 'faq-items', required: true },
  ],
  'local-business': [
    { name: 'name', label: 'Business Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image URL', type: 'text', required: true },
    { name: 'address', label: 'Street Address', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'zipcode', label: 'Postal Code', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'telephone', label: 'Telephone', type: 'text', required: true },
    { name: 'priceRange', label: 'Price Range', type: 'text', required: false, placeholder: 'e.g. $$$' },
  ],
  'how-to': [
    { name: 'name', label: 'How-To Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image URL', type: 'text', required: true },
    { name: 'estimatedTime', label: 'Estimated Time', type: 'text', required: false, placeholder: 'e.g. PT30M (30 minutes)' },
    { name: 'steps', label: 'Steps', type: 'how-to-steps', required: true },
  ]
};

export default function StructuredDataGenerator({ 
  url = '', 
  initialType = 'article',
  onGenerate
}: StructuredDataGeneratorProps) {
  const [schemaType, setSchemaType] = useState(initialType);
  const [pageUrl, setPageUrl] = useState(url);
  const [formData, setFormData] = useState<{[key: string]: any}>({});
  const [faqItems, setFaqItems] = useState<Array<{question: string, answer: string}>>([
    { question: '', answer: '' }
  ]);
  const [howToSteps, setHowToSteps] = useState<Array<{name: string, text: string, image?: string}>>([
    { name: '', text: '' }
  ]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState('form');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Reset form data when schema type changes
  useEffect(() => {
    setFormData({});
    setValidationErrors({});
    if (schemaType === 'faq') {
      setFaqItems([{ question: '', answer: '' }]);
    }
    if (schemaType === 'how-to') {
      setHowToSteps([{ name: '', text: '' }]);
    }
  }, [schemaType]);
  
  // Update form field
  const updateField = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };
  
  // Add FAQ item
  const addFaqItem = () => {
    setFaqItems([...faqItems, { question: '', answer: '' }]);
  };
  
  // Remove FAQ item
  const removeFaqItem = (index: number) => {
    if (faqItems.length === 1) return;
    const newItems = [...faqItems];
    newItems.splice(index, 1);
    setFaqItems(newItems);
  };
  
  // Update FAQ item
  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const newItems = [...faqItems];
    newItems[index][field] = value;
    setFaqItems(newItems);
    
    // Clear validation error when field is updated
    const errorKey = `faqItem${index}${field}`;
    if (validationErrors[errorKey]) {
      const newErrors = { ...validationErrors };
      delete newErrors[errorKey];
      setValidationErrors(newErrors);
    }
  };
  
  // Add How-To step
  const addHowToStep = () => {
    setHowToSteps([...howToSteps, { name: '', text: '' }]);
  };
  
  // Remove How-To step
  const removeHowToStep = (index: number) => {
    if (howToSteps.length === 1) return;
    const newSteps = [...howToSteps];
    newSteps.splice(index, 1);
    setHowToSteps(newSteps);
  };
  
  // Update How-To step
  const updateHowToStep = (index: number, field: 'name' | 'text' | 'image', value: string) => {
    const newSteps = [...howToSteps];
    newSteps[index][field] = value;
    setHowToSteps(newSteps);
    
    // Clear validation error when field is updated
    const errorKey = `howToStep${index}${field}`;
    if (validationErrors[errorKey]) {
      const newErrors = { ...validationErrors };
      delete newErrors[errorKey];
      setValidationErrors(newErrors);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    let isValid = true;
    
    // General fields
    if (!pageUrl.trim()) {
      errors.pageUrl = 'Page URL is required';
      isValid = false;
    }
    
    // Type-specific fields
    const fields = FormFields[schemaType] || [];
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });
    
    // Validate FAQ items
    if (schemaType === 'faq') {
      faqItems.forEach((item, index) => {
        if (!item.question.trim()) {
          errors[`faqItem${index}question`] = 'Question is required';
          isValid = false;
        }
        if (!item.answer.trim()) {
          errors[`faqItem${index}answer`] = 'Answer is required';
          isValid = false;
        }
      });
    }
    
    // Validate How-To steps
    if (schemaType === 'how-to') {
      howToSteps.forEach((step, index) => {
        if (!step.name.trim()) {
          errors[`howToStep${index}name`] = 'Step name is required';
          isValid = false;
        }
        if (!step.text.trim()) {
          errors[`howToStep${index}text`] = 'Step text is required';
          isValid = false;
        }
      });
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  // Generate structured data
  const generateStructuredData = () => {
    if (!validateForm()) {
      setActiveSectionTab('form');
      return;
    }
    
    let structuredData: any = {
      '@context': 'https://schema.org',
    };
    
    switch (schemaType) {
      case 'article':
        structuredData = {
          ...structuredData,
          '@type': 'Article',
          headline: formData.headline,
          description: formData.description,
          image: formData.image,
          author: {
            '@type': 'Person',
            name: formData.author
          },
          publisher: {
            '@type': 'Organization',
            name: formData.publisher || 'Your Organization Name',
            logo: {
              '@type': 'ImageObject',
              url: formData.publisherLogo || formData.image
            }
          },
          datePublished: formData.publishDate,
          dateModified: formData.modifiedDate || formData.publishDate,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl
          }
        };
        break;
        
      case 'product':
        structuredData = {
          ...structuredData,
          '@type': 'Product',
          name: formData.name,
          description: formData.description,
          image: formData.image,
          brand: {
            '@type': 'Brand',
            name: formData.brand
          },
          offers: {
            '@type': 'Offer',
            price: formData.price,
            priceCurrency: formData.currency,
            availability: `https://schema.org/${formData.availability}`,
            url: pageUrl
          }
        };
        
        if (formData.sku) {
          structuredData.sku = formData.sku;
        }
        break;
        
      case 'faq':
        structuredData = {
          ...structuredData,
          '@type': 'FAQPage',
          mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        };
        break;
        
      case 'local-business':
        structuredData = {
          ...structuredData,
          '@type': 'LocalBusiness',
          name: formData.name,
          description: formData.description,
          image: formData.image,
          address: {
            '@type': 'PostalAddress',
            streetAddress: formData.address,
            addressLocality: formData.city,
            addressRegion: formData.state,
            postalCode: formData.zipcode,
            addressCountry: formData.country
          },
          telephone: formData.telephone,
          url: pageUrl
        };
        
        if (formData.priceRange) {
          structuredData.priceRange = formData.priceRange;
        }
        break;
        
      case 'how-to':
        structuredData = {
          ...structuredData,
          '@type': 'HowTo',
          name: formData.name,
          description: formData.description,
          image: formData.image,
          step: howToSteps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
            ...(step.image ? { image: step.image } : {})
          }))
        };
        
        if (formData.estimatedTime) {
          structuredData.totalTime = formData.estimatedTime;
        }
        break;
    }
    
    const generatedJson = JSON.stringify(structuredData, null, 2);
    setGeneratedCode(generatedJson);
    setActiveSectionTab('code');
    
    if (onGenerate) {
      onGenerate(generatedJson, schemaType);
    }
  };
  
  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Render form fields based on schema type
  const renderFormFields = () => {
    const fields = FormFields[schemaType] || [];
    
    return (
      <div className="space-y-4">
        {/* Page URL */}
        <div className="space-y-2">
          <Label htmlFor="page-url">Page URL <span className="text-red-500">*</span></Label>
          <Input
            id="page-url"
            placeholder="https://yourdomain.com/page"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
          />
          {validationErrors.pageUrl && (
            <p className="text-xs text-red-500">{validationErrors.pageUrl}</p>
          )}
        </div>
        
        {/* Schema-type specific fields */}
        {fields.map((field) => {
          if (field.type === 'faq-items') {
            return (
              <div key={field.name} className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>FAQ Items <span className="text-red-500">*</span></Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addFaqItem}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                
                {faqItems.map((item, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeFaqItem(index)}
                      disabled={faqItems.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`faq-question-${index}`}>
                        Question {index + 1} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`faq-question-${index}`}
                        placeholder="Enter question"
                        value={item.question}
                        onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                      />
                      {validationErrors[`faqItem${index}question`] && (
                        <p className="text-xs text-red-500">{validationErrors[`faqItem${index}question`]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`faq-answer-${index}`}>
                        Answer <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`faq-answer-${index}`}
                        placeholder="Enter answer"
                        value={item.answer}
                        onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      />
                      {validationErrors[`faqItem${index}answer`] && (
                        <p className="text-xs text-red-500">{validationErrors[`faqItem${index}answer`]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          
          if (field.type === 'how-to-steps') {
            return (
              <div key={field.name} className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>How-To Steps <span className="text-red-500">*</span></Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addHowToStep}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
                
                {howToSteps.map((step, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeHowToStep(index)}
                      disabled={howToSteps.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`step-name-${index}`}>
                        Step {index + 1} Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`step-name-${index}`}
                        placeholder="E.g., Prepare ingredients"
                        value={step.name}
                        onChange={(e) => updateHowToStep(index, 'name', e.target.value)}
                      />
                      {validationErrors[`howToStep${index}name`] && (
                        <p className="text-xs text-red-500">{validationErrors[`howToStep${index}name`]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`step-text-${index}`}>
                        Step Text <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`step-text-${index}`}
                        placeholder="Describe this step"
                        value={step.text}
                        onChange={(e) => updateHowToStep(index, 'text', e.target.value)}
                      />
                      {validationErrors[`howToStep${index}text`] && (
                        <p className="text-xs text-red-500">{validationErrors[`howToStep${index}text`]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`step-image-${index}`}>
                        Step Image URL (Optional)
                      </Label>
                      <Input
                        id={`step-image-${index}`}
                        placeholder="https://example.com/image.jpg"
                        value={step.image || ''}
                        onChange={(e) => updateHowToStep(index, 'image', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          
          if (field.type === 'select') {
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                <Select
                  value={formData[field.name] || ''}
                  onValueChange={(value) => updateField(field.name, value)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors[field.name] && (
                  <p className="text-xs text-red-500">{validationErrors[field.name]}</p>
                )}
              </div>
            );
          }
          
          if (field.type === 'textarea') {
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, e.target.value)}
                />
                {validationErrors[field.name] && (
                  <p className="text-xs text-red-500">{validationErrors[field.name]}</p>
                )}
              </div>
            );
          }
          
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                value={formData[field.name] || ''}
                onChange={(e) => updateField(field.name, field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
              />
              {validationErrors[field.name] && (
                <p className="text-xs text-red-500">{validationErrors[field.name]}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Structured Data Generator
          </CardTitle>
          <CardDescription>
            Create structured data markup to enhance your search engine results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schema-type">Schema Type</Label>
              <Select
                value={schemaType}
                onValueChange={setSchemaType}
              >
                <SelectTrigger id="schema-type">
                  <SelectValue placeholder="Select schema type" />
                </SelectTrigger>
                <SelectContent>
                  {schemaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <span>{type.label}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">{type.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={activeSectionTab} onValueChange={setActiveSectionTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="form" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Form
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2" disabled={!generatedCode}>
                  <Code className="h-4 w-4" />
                  Generated Code
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="pt-4">
                {renderFormFields()}
                
                <div className="pt-6">
                  <Button onClick={generateStructuredData} className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Structured Data
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="pt-4">
                {generatedCode && (
                  <div className="space-y-4">
                    <Alert>
                      <FileCheck className="h-4 w-4" />
                      <AlertTitle>Schema Generated Successfully</AlertTitle>
                      <AlertDescription>
                        Add this code to your website's HTML or use Google Tag Manager.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="relative">
                      <pre className="p-4 bg-muted/50 rounded-md border overflow-auto max-h-[400px]">
                        <code className="text-sm font-mono whitespace-pre">
                          {`<script type="application/ld+json">\n${generatedCode}\n</script>`}
                        </code>
                      </pre>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveSectionTab('form')}
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Edit Schema
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}