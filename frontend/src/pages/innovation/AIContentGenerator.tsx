import { useState } from 'react';
import { 
  Wand2, 
  FileText, 
  MessageSquare, 
  Image as ImageIcon, 
  Share2, 
  Save, 
  Copy, 
  RefreshCw,
  Sparkles,
  Send,
  Info,
  BarChart,
  Settings,
  Plus,
  Check,
  X
} from 'lucide-react';

import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Content types
const contentTypes = [
  { id: 'blog', name: 'Blog Post', icon: <FileText className="h-5 w-5" /> },
  { id: 'social', name: 'Social Media Post', icon: <Share2 className="h-5 w-5" /> },
  { id: 'email', name: 'Email', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'ad', name: 'Ad Copy', icon: <BarChart className="h-5 w-5" /> }
];

// Tones
const tones = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual' },
  { id: 'friendly', name: 'Friendly' },
  { id: 'persuasive', name: 'Persuasive' },
  { id: 'humorous', name: 'Humorous' }
];

// Sample generated content
const sampleContent = {
  blog: `# How AI is Transforming Project Management

In today's fast-paced business environment, project managers are constantly seeking ways to improve efficiency, reduce costs, and deliver better results. Artificial intelligence (AI) has emerged as a game-changing technology that's revolutionizing how projects are planned, executed, and monitored.

## The Current State of Project Management

Traditional project management often involves:

- Manual tracking of tasks and deadlines
- Reactive problem-solving when issues arise
- Time-consuming reporting and documentation
- Subjective decision-making based on limited data

These approaches, while functional, leave significant room for improvement in terms of efficiency and effectiveness.

## How AI is Changing the Game

### 1. Intelligent Task Allocation

AI algorithms can analyze team members' skills, workload, and past performance to suggest optimal task assignments. This ensures that the right people are working on the right tasks, maximizing productivity and quality.

### 2. Predictive Analytics

One of the most powerful applications of AI in project management is its ability to predict potential issues before they occur. By analyzing historical project data, AI can identify patterns that precede problems, allowing project managers to take preventive action.

For example, if certain types of tasks consistently fall behind schedule when assigned to specific team combinations, AI can flag this risk early in the planning stage.

### 3. Automated Reporting

AI can automatically gather project data, generate reports, and distribute them to stakeholders. This not only saves time but also ensures that reports are consistent, accurate, and delivered on schedule.

### 4. Enhanced Decision-Making

By processing vast amounts of project data, AI can provide insights that might not be obvious to human project managers. These data-driven recommendations can lead to better decision-making throughout the project lifecycle.

## Real-World Benefits

Organizations implementing AI-powered project management tools are reporting:

- 25-40% reduction in project planning time
- 20-30% improvement in resource utilization
- 15-25% decrease in project delays
- 30-50% reduction in time spent on administrative tasks

## The Future of AI in Project Management

As AI technology continues to evolve, we can expect even more sophisticated applications in project management. These might include:

- Natural language processing for project documentation and communication
- Virtual project management assistants that can handle routine tasks autonomously
- Advanced risk prediction models that consider external factors like market conditions
- Emotional intelligence capabilities to help manage team dynamics

## Conclusion

AI is not replacing project managers—it's empowering them. By automating routine tasks, providing data-driven insights, and predicting potential issues, AI allows project managers to focus on what humans do best: strategic thinking, creative problem-solving, and building relationships with team members and stakeholders.

Organizations that embrace AI-powered project management tools today will be well-positioned to deliver projects more efficiently and effectively in the increasingly competitive business landscape of tomorrow.`,

  social: `🚀 Exciting news! We've just launched our AI-powered project management features!

Say goodbye to manual task tracking and hello to intelligent automation. Our new AI tools can:

✅ Predict potential project delays before they happen
✅ Automatically assign tasks to the right team members
✅ Generate comprehensive reports in seconds
✅ Provide data-driven recommendations for better decision-making

Early users are reporting 30% less time spent on admin tasks and 25% fewer project delays!

Want to see how it works? Click the link in our bio to schedule a demo. #ProjectManagement #AIInnovation #ProductivityTools`,

  email: `Subject: Introducing AI-Powered Project Management Tools - Special Early Access

Dear [Client Name],

I hope this email finds you well. I'm reaching out with some exciting news that I believe will be particularly relevant to your team's project management needs.

We've recently developed a suite of AI-powered project management tools designed specifically for teams like yours who manage complex projects with multiple stakeholders. Based on our previous conversations about the challenges your team has been facing, I think these new features could be a game-changer for your workflow.

Our new AI tools can:

• Predict potential bottlenecks before they impact your timeline
• Automatically prioritize tasks based on project dependencies
• Provide data-driven insights for resource allocation
• Generate comprehensive reports tailored to different stakeholders

Several of our clients in the [Client's Industry] sector have been part of our beta testing program, and they're reporting an average 30% reduction in administrative work and a 25% improvement in on-time project delivery.

As a valued client, I'd like to offer you exclusive early access to these features before our general release next month. I've reserved a spot for your team in our priority onboarding schedule, which includes personalized training and setup assistance at no additional cost.

Would you be available for a 30-minute demo next Tuesday or Wednesday afternoon? I'd be happy to show you how these tools could be customized for your specific project workflows.

Looking forward to your response,

[Your Name]
Senior Account Manager
Genius Online Navigator
Phone: [Your Phone Number]`,

  ad: `Transform Your Project Management with AI

Stop firefighting. Start predicting.

Our AI-powered platform helps project managers:
• Cut admin time by 40%
• Reduce delays by 30%
• Improve resource allocation by 25%

"We completed our last three projects ahead of schedule and under budget after implementing this solution." - Sarah T., CTO

Limited-time offer: Get 3 months free when you sign up for an annual plan.

[Try Free for 14 Days] [Schedule Demo]`
};

// Sample templates
const templates = [
  { 
    id: 'template-1', 
    name: 'Product Launch Announcement', 
    type: 'social',
    description: 'Announce a new product or feature launch on social media'
  },
  { 
    id: 'template-2', 
    name: 'Weekly Newsletter', 
    type: 'email',
    description: 'Regular update email for subscribers or clients'
  },
  { 
    id: 'template-3', 
    name: 'Case Study', 
    type: 'blog',
    description: 'Showcase a client success story with results and process'
  },
  { 
    id: 'template-4', 
    name: 'Limited-Time Offer', 
    type: 'ad',
    description: 'Promote a special discount or time-sensitive offer'
  }
];

// Sample content history
const contentHistory = [
  {
    id: 'content-1',
    title: 'AI in Project Management Blog Post',
    type: 'blog',
    createdAt: '2025-04-20T14:30:00Z',
    score: 92
  },
  {
    id: 'content-2',
    title: 'New Feature Announcement',
    type: 'social',
    createdAt: '2025-04-18T10:15:00Z',
    score: 88
  },
  {
    id: 'content-3',
    title: 'Monthly Newsletter',
    type: 'email',
    createdAt: '2025-04-15T09:45:00Z',
    score: 95
  }
];

const AIContentGenerator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [prompt, setPrompt] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentScore, setContentScore] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  // Advanced settings
  const [wordCount, setWordCount] = useState(500);
  const [creativity, setCreativity] = useState(70);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [includeStats, setIncludeStats] = useState(true);
  
  // Handle content generation
  const handleGenerateContent = () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setGeneratedContent('');
    setContentScore(null);
    
    // Simulate API call delay
    setTimeout(() => {
      // Get sample content based on selected type
      const content = sampleContent[contentType as keyof typeof sampleContent] || '';
      
      // Simulate typing effect
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < content.length) {
          setGeneratedContent(prev => prev + content.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsGenerating(false);
          setContentScore(Math.floor(Math.random() * 11) + 85); // Random score between 85-95
        }
      }, 10);
    }, 1500);
  };
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setContentType(template.type);
      setPrompt(`Create a ${template.name.toLowerCase()} that ${template.description.toLowerCase()}`);
    }
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>AI Content Generator | Genius Online Navigator</title>
        <meta name="description" content="Generate high-quality content for blogs, social media, emails, and ads using AI." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Content Generator</h1>
          <p className="text-muted-foreground">Create high-quality content in seconds with AI assistance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Content Credits Available</AlertTitle>
        <AlertDescription>
          You have 45 content generation credits remaining this month. Need more?
          <Button variant="link" className="p-0 h-auto">Upgrade your plan</Button>
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        {/* Create Content Tab */}
        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar with settings */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={contentType} 
                    onValueChange={setContentType}
                    className="space-y-2"
                  >
                    {contentTypes.map(type => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                        <Label htmlFor={`type-${type.id}`} className="flex items-center cursor-pointer">
                          <div className="mr-2">{type.icon}</div>
                          {type.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tone & Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={tone}
                    onValueChange={setTone}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Word Count</Label>
                      <span className="text-sm text-muted-foreground">{wordCount} words</span>
                    </div>
                    <Slider 
                      value={[wordCount]} 
                      min={100} 
                      max={2000} 
                      step={50}
                      onValueChange={(value) => setWordCount(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Creativity Level</Label>
                      <span className="text-sm text-muted-foreground">{creativity}%</span>
                    </div>
                    <Slider 
                      value={[creativity]} 
                      min={0} 
                      max={100} 
                      step={10}
                      onValueChange={(value) => setCreativity(value[0])}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-cta">Include Call-to-Action</Label>
                    <Switch 
                      id="include-cta" 
                      checked={includeCTA}
                      onCheckedChange={setIncludeCTA}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-stats">Include Statistics</Label>
                    <Switch 
                      id="include-stats" 
                      checked={includeStats}
                      onCheckedChange={setIncludeStats}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content area */}
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What would you like to create?</CardTitle>
                  <CardDescription>
                    Describe your content needs and add any specific requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Content Brief</Label>
                    <Textarea
                      id="prompt"
                      placeholder="e.g., Write a blog post about how AI is transforming project management. Include benefits and real-world examples."
                      className="min-h-[120px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords (optional)</Label>
                    <Input
                      id="keywords"
                      placeholder="e.g., AI, project management, automation, efficiency"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate keywords with commas. These will be incorporated into your content.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={!prompt || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {(generatedContent || isGenerating) && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Generated Content</CardTitle>
                    {contentScore !== null && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Quality Score: {contentScore}/100
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="relative min-h-[300px] border rounded-md p-4 whitespace-pre-wrap">
                      {generatedContent || (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">Generating content...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" disabled={!generatedContent}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="outline" disabled={!generatedContent}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    <Button variant="outline" disabled={!generatedContent}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map(template => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {contentTypes.find(t => t.id === template.type)?.icon}
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template.id);
                      setActiveTab('create');
                    }}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed cursor-pointer hover:shadow-md">
              <CardHeader className="flex items-center justify-center h-full py-8">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <CardTitle className="text-base">Create New Template</CardTitle>
                <CardDescription>Save your own custom templates</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content History</CardTitle>
              <CardDescription>Your previously generated content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentHistory.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      {contentTypes.find(t => t.id === item.type)?.icon}
                      
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created on {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Score: {item.score}
                      </Badge>
                      
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIContentGenerator;
