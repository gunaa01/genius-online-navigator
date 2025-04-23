import { useState } from 'react';
import { 
  FileText, 
  Clock, 
  DollarSign, 
  Repeat, 
  Award, 
  Shield, 
  Check, 
  InfoIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Contract template types
export type ContractType = 
  | 'fixed_price' 
  | 'hourly_rate' 
  | 'milestone_based' 
  | 'retainer' 
  | 'custom';

// Contract template interface
export interface ContractTemplate {
  id: string;
  type: ContractType;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

// Mock data for contract templates
const contractTemplates: ContractTemplate[] = [
  {
    id: 'fixed_price_standard',
    type: 'fixed_price',
    name: 'Fixed Price',
    description: 'One-time payment for a clearly defined project with specific deliverables',
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    popular: true,
    features: [
      'Single payment upon completion',
      'Clearly defined deliverables',
      'Fixed deadline',
      'Includes revision terms',
      'Basic intellectual property rights'
    ]
  },
  {
    id: 'hourly_rate_standard',
    type: 'hourly_rate',
    name: 'Hourly Rate',
    description: 'Pay by the hour for ongoing work or projects with changing requirements',
    icon: <Clock className="h-6 w-6 text-primary" />,
    features: [
      'Weekly timesheet reporting',
      'Flexible scope',
      'Pay only for hours worked',
      'Time tracking integration',
      'Hourly rate protections'
    ]
  },
  {
    id: 'milestone_based_standard',
    type: 'milestone_based',
    name: 'Milestone Based',
    description: 'Break the project into phases with payments tied to completed milestones',
    icon: <Award className="h-6 w-6 text-primary" />,
    recommended: true,
    features: [
      'Multiple payment phases',
      'Clear deliverables per milestone',
      'Phased approval process',
      'Payment security for both parties',
      'Progress tracking'
    ]
  },
  {
    id: 'retainer_standard',
    type: 'retainer',
    name: 'Monthly Retainer',
    description: 'Regular monthly payment for ongoing services or reserved availability',
    icon: <Repeat className="h-6 w-6 text-primary" />,
    features: [
      'Monthly recurring payment',
      'Guaranteed availability',
      'Defined monthly deliverables',
      'Easy renewal terms',
      'Cancellation policy'
    ]
  },
  {
    id: 'custom_contract',
    type: 'custom',
    name: 'Custom Contract',
    description: 'Create a fully customized agreement tailored to your specific project needs',
    icon: <FileText className="h-6 w-6 text-primary" />,
    features: [
      'Full customization of terms',
      'Special clauses and conditions',
      'Custom payment structure',
      'Tailored to your requirements',
      'Legal review available'
    ]
  }
];

interface ContractTemplateSelectorProps {
  onSelect: (templateId: string) => void;
  selectedTemplateId?: string;
  serviceType?: string; // e.g., "development", "design", "writing" - for recommended templates
}

const ContractTemplateSelector = ({
  onSelect,
  selectedTemplateId,
  serviceType
}: ContractTemplateSelectorProps) => {
  const [selected, setSelected] = useState<string>(selectedTemplateId || '');

  const handleSelect = (templateId: string) => {
    setSelected(templateId);
    onSelect(templateId);
  };

  // Gets the recommended template based on service type
  // This would be more sophisticated in a real implementation
  const getRecommendedTemplate = (): string => {
    if (!serviceType) return 'milestone_based_standard'; // Default recommendation
    
    switch (serviceType.toLowerCase()) {
      case 'development':
      case 'web development':
      case 'app development':
        return 'milestone_based_standard';
      case 'design':
        return 'fixed_price_standard';
      case 'writing':
      case 'content':
        return 'fixed_price_standard';
      case 'marketing':
      case 'consulting':
        return 'retainer_standard';
      default:
        return 'milestone_based_standard';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Choose Contract Type</h2>
        <p className="text-muted-foreground">
          Select the contract type that best suits your project needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contractTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`relative cursor-pointer transition-all ${
              selected === template.id ? 
              'border-primary ring-2 ring-primary ring-opacity-50' : 
              'hover:border-primary/50'
            }`}
            onClick={() => handleSelect(template.id)}
          >
            {template.popular && (
              <Badge 
                className="absolute -top-2 -right-2 z-10"
                variant="default"
              >
                Popular
              </Badge>
            )}
            
            {(!template.popular && template.recommended) && (
              <Badge 
                className="absolute -top-2 -right-2 z-10"
                variant="secondary"
              >
                Recommended
              </Badge>
            )}
            
            {/* Radio indicator */}
            <div className="absolute top-4 right-4">
              <RadioGroup value={selected} className="hidden">
                <RadioGroupItem value={template.id} id={template.id} />
              </RadioGroup>
              
              <div className={`h-5 w-5 rounded-full border ${
                selected === template.id ? 
                'bg-primary border-primary' : 
                'border-muted-foreground'
              } flex items-center justify-center`}>
                {selected === template.id && (
                  <Check className="h-3 w-3 text-primary-foreground" />
                )}
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-start">
                {template.icon}
                <div className="ml-4">
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <InfoIcon className="h-4 w-4 mr-1" />
                        View Sample
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Preview a sample {template.name} contract</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button 
                  variant={selected === template.id ? "default" : "outline"} 
                  size="sm"
                >
                  {selected === template.id ? "Selected" : "Select"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex items-center p-4 bg-muted rounded-lg">
        <Shield className="h-5 w-5 text-muted-foreground mr-2" />
        <p className="text-sm text-muted-foreground">
          All contracts are legally binding and offer protection for both clients and freelancers. 
          <Button variant="link" className="h-auto p-0 text-sm">Learn more about our contracts</Button>
        </p>
      </div>
    </div>
  );
};

export default ContractTemplateSelector;
