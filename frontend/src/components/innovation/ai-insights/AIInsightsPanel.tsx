/**
 * AI Insights Panel
 * 
 * This component provides AI-driven insights and recommendations for projects,
 * resources, and business metrics. It integrates with our feature flag system
 * for controlled rollout and supports automated actions.
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Users, 
  BarChart, 
  Zap,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Check,
  RotateCw,
  PauseCircle,
  Settings,
  Info,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';
import { ACTIONS, RESOURCES } from '@/lib/rbac';

// Types
export type InsightType = 
  | 'recommendation' 
  | 'risk' 
  | 'opportunity' 
  | 'trend' 
  | 'anomaly'
  | 'automation';

export type InsightCategory = 
  | 'project' 
  | 'resource' 
  | 'client' 
  | 'financial' 
  | 'performance'
  | 'automation';

export type InsightPriority = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'critical';

export type AutomationStatus = 
  | 'available'  // Can be automated but isn't yet
  | 'scheduled'  // Scheduled to run automatically
  | 'running'    // Currently running
  | 'completed'  // Completed successfully
  | 'failed'     // Failed to complete
  | 'paused';    // Temporarily paused

export interface InsightAction {
  id: string;
  label: string;
  action: string;
  description?: string;
  params?: Record<string, any>;
  confirmationRequired?: boolean;
  confirmationMessage?: string;
  automatable?: boolean;
  automationStatus?: AutomationStatus;
  automationSchedule?: {
    frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    nextRun?: string;
    lastRun?: string;
    runCount?: number;
  };
  estimatedImpact?: {
    metric: string;
    value: string | number;
    change: number;
    confidence: number;
  };
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  category: InsightCategory;
  priority: InsightPriority;
  createdAt: string;
  expiresAt?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  relatedEntityName?: string;
  metrics?: {
    name: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  actions?: InsightAction[];
  dismissed?: boolean;
  feedback?: 'helpful' | 'not_helpful';
  detailedFeedback?: string;
  confidence?: number;
  source?: string;
  modelVersion?: string;
  automationRecommended?: boolean;
  automationConfidence?: number;
  automationStatus?: AutomationStatus;
}

interface AIInsightsPanelProps {
  insights?: Insight[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onDismiss?: (insightId: string) => void;
  onFeedback?: (insightId: string, feedback: 'helpful' | 'not_helpful', detailedFeedback?: string) => void;
  onAction?: (action: string, params?: Record<string, any>) => void;
  onAutomate?: (insightId: string, actionId: string, schedule?: any) => Promise<boolean>;
  onCancelAutomation?: (insightId: string, actionId: string) => Promise<boolean>;
}

/**
 * Automation Schedule Dialog Component
 */
interface AutomationScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (schedule: any) => void;
  actionLabel: string;
}

const AutomationScheduleDialog: React.FC<AutomationScheduleDialogProps> = ({
  isOpen,
  onClose,
  onSchedule,
  actionLabel
}) => {
  const [frequency, setFrequency] = useState<'once' | 'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [time, setTime] = useState('09:00');
  const [dayOfWeek, setDayOfWeek] = useState('1'); // Monday
  const [dayOfMonth, setDayOfMonth] = useState('1');
  
  const handleSchedule = () => {
    const schedule = {
      frequency,
      time,
      ...(frequency === 'weekly' ? { dayOfWeek: parseInt(dayOfWeek) } : {}),
      ...(frequency === 'monthly' ? { dayOfMonth: parseInt(dayOfMonth) } : {})
    };
    
    onSchedule(schedule);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Automation</DialogTitle>
          <DialogDescription>
            Set up when to automatically run "{actionLabel}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select 
              value={frequency} 
              onValueChange={(value) => setFrequency(value as any)}
            >
              <SelectTrigger id="frequency" className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {frequency !== 'once' && frequency !== 'hourly' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
          
          {frequency === 'weekly' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day-of-week" className="text-right">
                Day
              </Label>
              <Select 
                value={dayOfWeek} 
                onValueChange={setDayOfWeek}
              >
                <SelectTrigger id="day-of-week" className="col-span-3">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                  <SelectItem value="0">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {frequency === 'monthly' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day-of-month" className="text-right">
                Day
              </Label>
              <Select 
                value={dayOfMonth} 
                onValueChange={setDayOfMonth}
              >
                <SelectTrigger id="day-of-month" className="col-span-3">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Detailed Feedback Dialog Component
 */
interface DetailedFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  insightTitle: string;
}

const DetailedFeedbackDialog: React.FC<DetailedFeedbackDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  insightTitle
}) => {
  const [feedback, setFeedback] = useState('');
  
  const handleSubmit = () => {
    onSubmit(feedback);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provide Detailed Feedback</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our AI insights
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="insight-title" className="text-sm font-medium">
              Insight
            </Label>
            <p className="text-sm text-muted-foreground mt-1">{insightTitle}</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="feedback" className="text-sm font-medium">
              Your Feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="What was helpful or unhelpful about this insight? How could it be improved?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!feedback.trim()}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * AI Insights Panel Component
 */
const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights: propInsights,
  isLoading = false,
  onRefresh,
  onDismiss,
  onFeedback,
  onAction,
  onAutomate,
  onCancelAutomation
}) => {
  const { isEnabled } = useFeatureFlags();
  const { toast } = useToast();
  const { canAccess } = useRBAC();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);
  const [insights, setInsights] = useState<Insight[]>(propInsights || mockInsights);
  const [automationScheduleDialogOpen, setAutomationScheduleDialogOpen] = useState(false);
  const [detailedFeedbackDialogOpen, setDetailedFeedbackDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<InsightAction | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [detailedFeedback, setDetailedFeedback] = useState('');
  
  // Update insights when props change
  useEffect(() => {
    if (propInsights) {
      setInsights(propInsights);
    }
  }, [propInsights]);

  // Filter insights based on active tab
  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'all') return !insight.dismissed;
    return insight.category === activeTab && !insight.dismissed;
  });

  // Handle insight dismissal
  const handleDismiss = (insightId: string) => {
    if (onDismiss) {
      onDismiss(insightId);
    } else {
      // For demo, just update local state
      setInsights(insights.map(insight => 
        insight.id === insightId 
          ? { ...insight, dismissed: true } 
          : insight
      ));
    }
  };

  // Handle insight feedback
  const handleFeedback = (insightId: string, feedback: 'helpful' | 'not_helpful') => {
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;
    
    setSelectedInsight(insight);
    
    if (isEnabled('detailed-feedback') && !insight.detailedFeedback) {
      setDetailedFeedbackDialogOpen(true);
    } else {
      submitFeedback(insightId, feedback);
    }
  };
  
  // Submit feedback with optional detailed feedback
  const submitFeedback = (insightId: string, feedback: 'helpful' | 'not_helpful', detailedFeedback?: string) => {
    if (onFeedback) {
      onFeedback(insightId, feedback, detailedFeedback);
    } else {
      // For demo, just update local state
      setInsights(insights.map(insight => 
        insight.id === insightId 
          ? { ...insight, feedback, detailedFeedback: detailedFeedback || insight.detailedFeedback } 
          : insight
      ));
    }
    
    toast({
      title: "Feedback submitted",
      description: "Thank you for helping us improve our AI insights",
    });
  };

  // Handle detailed feedback submission
  const handleDetailedFeedbackSubmit = (feedback: string) => {
    if (!selectedInsight) return;
    
    setDetailedFeedback(feedback);
    submitFeedback(selectedInsight.id, selectedInsight.feedback || 'helpful', feedback);
  };

  // Handle insight action
  const handleAction = (action: string, params?: Record<string, any>) => {
    if (onAction) {
      onAction(action, params);
    } else {
      // For demo, just log the action
      console.log('Action triggered:', action, params);
      
      toast({
        title: "Action triggered",
        description: `Successfully executed: ${action}`,
      });
    }
  };

  // Handle automation
  const handleAutomate = async (insight: Insight, action: InsightAction) => {
    setSelectedInsight(insight);
    setSelectedAction(action);
    setAutomationScheduleDialogOpen(true);
  };
  
  // Handle automation schedule
  const handleAutomationSchedule = async (schedule: any) => {
    if (!selectedInsight || !selectedAction) return;
    
    try {
      if (onAutomate) {
        const success = await onAutomate(selectedInsight.id, selectedAction.id, schedule);
        
        if (success) {
          toast({
            title: "Automation scheduled",
            description: `${selectedAction.label} will run automatically as scheduled`,
          });
          
          // Update local state
          setInsights(insights.map(insight => 
            insight.id === selectedInsight.id 
              ? { 
                  ...insight, 
                  actions: insight.actions?.map(a => 
                    a.id === selectedAction.id 
                      ? { 
                          ...a, 
                          automationStatus: 'scheduled',
                          automationSchedule: {
                            ...a.automationSchedule,
                            frequency: schedule.frequency,
                            nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
                          }
                        } 
                      : a
                  )
                } 
              : insight
          ));
        } else {
          toast({
            title: "Automation failed",
            description: "Unable to schedule automation",
            variant: "destructive",
          });
        }
      } else {
        // For demo, just update local state
        setInsights(insights.map(insight => 
          insight.id === selectedInsight.id 
            ? { 
                ...insight, 
                actions: insight.actions?.map(a => 
                  a.id === selectedAction.id 
                    ? { 
                        ...a, 
                        automationStatus: 'scheduled',
                        automationSchedule: {
                          ...a.automationSchedule,
                          frequency: schedule.frequency,
                          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
                        }
                      } 
                    : a
                )
              } 
            : insight
        ));
        
        toast({
          title: "Automation scheduled",
          description: `${selectedAction.label} will run automatically as scheduled`,
        });
      }
    } catch (error) {
      console.error('Error scheduling automation:', error);
      toast({
        title: "Automation failed",
        description: "Unable to schedule automation",
        variant: "destructive",
      });
    }
  };

  // Handle cancel automation
  const handleCancelAutomation = async (insight: Insight, action: InsightAction) => {
    try {
      if (onCancelAutomation) {
        const success = await onCancelAutomation(insight.id, action.id);
        
        if (success) {
          toast({
            title: "Automation cancelled",
            description: `${action.label} will no longer run automatically`,
          });
          
          // Update local state
          setInsights(insights.map(i => 
            i.id === insight.id 
              ? { 
                  ...i, 
                  actions: i.actions?.map(a => 
                    a.id === action.id 
                      ? { ...a, automationStatus: 'available', automationSchedule: undefined } 
                      : a
                  )
                } 
              : i
          ));
        } else {
          toast({
            title: "Cancellation failed",
            description: "Unable to cancel automation",
            variant: "destructive",
          });
        }
      } else {
        // For demo, just update local state
        setInsights(insights.map(i => 
          i.id === insight.id 
            ? { 
                ...i, 
                actions: i.actions?.map(a => 
                  a.id === action.id 
                    ? { ...a, automationStatus: 'available', automationSchedule: undefined } 
                    : a
                )
              } 
            : i
        ));
        
        toast({
          title: "Automation cancelled",
          description: `${action.label} will no longer run automatically`,
        });
      }
    } catch (error) {
      console.error('Error cancelling automation:', error);
      toast({
        title: "Cancellation failed",
        description: "Unable to cancel automation",
        variant: "destructive",
      });
    }
  };

  // Toggle expanded insight
  const toggleExpand = (insightId: string) => {
    setExpandedInsightId(expandedInsightId === insightId ? null : insightId);
  };

  // Get icon for insight type
  const getInsightTypeIcon = (type: InsightType) => {
    switch (type) {
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'opportunity':
        return <Zap className="h-5 w-5 text-green-500" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'automation':
        return <Play className="h-5 w-5 text-primary" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  // Get badge for insight priority
  const getPriorityBadge = (priority: InsightPriority) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  // Get icon for automation status
  const getAutomationStatusIcon = (status: AutomationStatus) => {
    switch (status) {
      case 'available':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'running':
        return <RotateCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Render action buttons for an insight
  const renderActionButtons = (insight: Insight, action: InsightAction) => {
    const canAutomate = isEnabled('ai-automation') && 
                       action.automatable && 
                       canAccess(RESOURCES.AUTOMATION, ACTIONS.CREATE);
    
    // If already scheduled, show cancel button
    if (action.automationStatus === 'scheduled') {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Next: {action.automationSchedule?.nextRun ? formatDate(action.automationSchedule.nextRun) : 'Soon'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCancelAutomation(insight, action);
            }}
            className="h-7 px-2"
          >
            Cancel
          </Button>
        </div>
      );
    }
    
    // If running, show a spinner
    if (action.automationStatus === 'running') {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground flex items-center">
            <RotateCw className="h-3 w-3 mr-1 animate-spin" />
            Running...
          </span>
        </div>
      );
    }
    
    // Default: show execute and automate buttons
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="default"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleAction(action.action, action.params);
          }}
          className="h-7"
        >
          Execute
        </Button>
        
        {canAutomate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAutomate(insight, action);
                  }}
                  className="h-7 w-7 p-0"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Schedule automation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  // Render an insight card
  const renderInsightCard = (insight: Insight) => {
    const isExpanded = expandedInsightId === insight.id;
    
    return (
      <Card key={insight.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-2">
              {getInsightTypeIcon(insight.type)}
              <div>
                <CardTitle className="text-base">{insight.title}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {insight.relatedEntityName && (
                    <span className="font-medium">{insight.relatedEntityName} • </span>
                  )}
                  <span className="text-xs">
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getPriorityBadge(insight.priority)}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(insight.id)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm mb-4">{insight.description}</p>
          
          {/* Metrics */}
          {insight.metrics && insight.metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {insight.metrics.map((metric, index) => (
                <div key={index} className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">{metric.name}</div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-lg font-semibold">{metric.value}</div>
                    {metric.change !== undefined && (
                      <div className={`text-xs font-medium ${
                        metric.trend === 'up' ? 'text-green-500' : 
                        metric.trend === 'down' ? 'text-red-500' : 
                        'text-muted-foreground'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Confidence indicator */}
          {insight.confidence !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>AI Confidence</span>
                <span>{insight.confidence}%</span>
              </div>
              <Progress value={insight.confidence} className="h-1.5" />
            </div>
          )}
          
          {/* Actions */}
          {insight.actions && insight.actions.length > 0 && (
            <Collapsible
              open={isExpanded}
              onOpenChange={() => toggleExpand(insight.id)}
              className="mt-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  Recommended Actions
                  {insight.automationRecommended && (
                    <Badge variant="outline" className="ml-2 bg-blue-50">
                      Automation Recommended
                    </Badge>
                  )}
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="mt-2">
                {insight.actions.map((action) => (
                  <div
                    key={action.id}
                    className="border rounded-md p-3 mb-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm flex items-center">
                          {action.automationStatus && (
                            <span className="mr-1.5">{getAutomationStatusIcon(action.automationStatus)}</span>
                          )}
                          {action.label}
                        </div>
                        {action.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {action.description}
                          </p>
                        )}
                        
                        {/* Estimated impact */}
                        {action.estimatedImpact && (
                          <div className="mt-2 text-xs flex items-center">
                            <span className="text-muted-foreground mr-1">Impact:</span>
                            <span className="font-medium">{action.estimatedImpact.metric}</span>
                            <span className={`ml-1 ${
                              action.estimatedImpact.change > 0 ? 'text-green-500' : 
                              action.estimatedImpact.change < 0 ? 'text-red-500' : 
                              'text-muted-foreground'
                            }`}>
                              {action.estimatedImpact.change > 0 ? '+' : ''}{action.estimatedImpact.change}%
                            </span>
                            <span className="text-muted-foreground ml-1">
                              ({action.estimatedImpact.confidence}% confidence)
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {renderActionButtons(insight, action)}
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 flex justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback(insight.id, 'helpful')}
              className={`h-8 ${insight.feedback === 'helpful' ? 'text-green-500' : ''}`}
              disabled={!!insight.feedback}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback(insight.id, 'not_helpful')}
              className={`h-8 ${insight.feedback === 'not_helpful' ? 'text-red-500' : ''}`}
              disabled={!!insight.feedback}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Not Helpful
            </Button>
          </div>
          
          {insight.modelVersion && (
            <div className="text-xs text-muted-foreground">
              Model: v{insight.modelVersion}
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>AI Insights</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <CardDescription>
            AI-powered insights and recommendations to optimize your workflow
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="project">Projects</TabsTrigger>
              <TabsTrigger value="resource">Resources</TabsTrigger>
              <TabsTrigger value="client">Clients</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              {isEnabled('ai-automation') && (
                <TabsTrigger value="automation">Automation</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredInsights.length > 0 ? (
                filteredInsights.map(renderInsightCard)
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No insights available</h3>
                  <p className="text-muted-foreground">
                    Check back later for AI-powered recommendations
                  </p>
                </div>
              )}
            </TabsContent>
            
            {['project', 'resource', 'client', 'financial', 'performance', 'automation'].map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredInsights.length > 0 ? (
                  filteredInsights.map(renderInsightCard)
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No {category} insights</h3>
                    <p className="text-muted-foreground">
                      Check back later for AI-powered recommendations
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Automation Schedule Dialog */}
      {selectedAction && (
        <AutomationScheduleDialog
          isOpen={automationScheduleDialogOpen}
          onClose={() => setAutomationScheduleDialogOpen(false)}
          onSchedule={handleAutomationSchedule}
          actionLabel={selectedAction.label}
        />
      )}
      
      {/* Detailed Feedback Dialog */}
      {selectedInsight && (
        <DetailedFeedbackDialog
          isOpen={detailedFeedbackDialogOpen}
          onClose={() => setDetailedFeedbackDialogOpen(false)}
          onSubmit={handleDetailedFeedbackSubmit}
          insightTitle={selectedInsight.title}
        />
      )}
    </>
  );
};

// Mock data for demonstration
const mockInsights: Insight[] = [
  {
    id: 'insight-1',
    title: 'Resource allocation optimization opportunity',
    description: 'Team members on the Website Redesign project are overallocated. Consider redistributing workload.',
    type: 'recommendation',
    category: 'resource',
    priority: 'high',
    createdAt: '2025-04-21T10:30:00Z',
    relatedEntityId: 'project-1',
    relatedEntityType: 'project',
    relatedEntityName: 'Website Redesign',
    metrics: [
      {
        name: 'Team Utilization',
        value: '127%',
        change: 12,
        trend: 'up'
      },
      {
        name: 'Risk of Delay',
        value: '68%',
        change: 15,
        trend: 'up'
      },
      {
        name: 'Team Members Affected',
        value: '3'
      }
    ],
    actions: [
      {
        label: 'View Resource Allocation',
        action: 'navigate',
        params: { path: '/resource-management', filter: 'project-1' }
      },
      {
        label: 'Auto-balance Team',
        action: 'auto_balance',
        params: { projectId: 'project-1' }
      }
    ]
  },
  {
    id: 'insight-2',
    title: 'Budget risk detected for Marketing Campaign',
    description: 'Current spending trajectory indicates the Marketing Campaign project will exceed budget by 15%.',
    type: 'risk',
    category: 'financial',
    priority: 'critical',
    createdAt: '2025-04-22T08:15:00Z',
    relatedEntityId: 'project-2',
    relatedEntityType: 'project',
    relatedEntityName: 'Marketing Campaign',
    metrics: [
      {
        name: 'Budget Variance',
        value: '+15%',
        change: 5,
        trend: 'up'
      },
      {
        name: 'Projected Overspend',
        value: '$12,500'
      },
      {
        name: 'Cost Performance Index',
        value: '0.87',
        change: -8,
        trend: 'down'
      }
    ],
    actions: [
      {
        label: 'View Budget Details',
        action: 'navigate',
        params: { path: '/projects/project-2/budget' }
      },
      {
        label: 'Cost-cutting Suggestions',
        action: 'cost_cutting_suggestions',
        params: { projectId: 'project-2' }
      }
    ]
  },
  {
    id: 'insight-3',
    title: 'Client engagement opportunity',
    description: 'Acme Corporation hasn\'t received an update in 14 days. Consider scheduling a check-in.',
    type: 'opportunity',
    category: 'client',
    priority: 'medium',
    createdAt: '2025-04-20T14:45:00Z',
    relatedEntityId: 'client-1',
    relatedEntityType: 'client',
    relatedEntityName: 'Acme Corporation',
    metrics: [
      {
        name: 'Days Since Last Update',
        value: '14'
      },
      {
        name: 'Client Satisfaction',
        value: '85%',
        change: -5,
        trend: 'down'
      }
    ],
    actions: [
      {
        label: 'Schedule Check-in',
        action: 'schedule_meeting',
        params: { clientId: 'client-1', type: 'check-in' }
      },
      {
        label: 'Send Status Update',
        action: 'send_update',
        params: { clientId: 'client-1' }
      }
    ]
  },
  {
    id: 'insight-4',
    title: 'Project milestone at risk',
    description: 'The "Design Approval" milestone for Website Redesign is likely to be delayed based on current progress.',
    type: 'risk',
    category: 'project',
    priority: 'high',
    createdAt: '2025-04-22T09:30:00Z',
    relatedEntityId: 'project-1',
    relatedEntityType: 'project',
    relatedEntityName: 'Website Redesign',
    metrics: [
      {
        name: 'Current Progress',
        value: '65%'
      },
      {
        name: 'Expected Delay',
        value: '5 days'
      },
      {
        name: 'Tasks Behind Schedule',
        value: '4'
      }
    ],
    actions: [
      {
        label: 'View Critical Path',
        action: 'navigate',
        params: { path: '/projects/project-1/timeline', view: 'critical-path' }
      },
      {
        label: 'Adjust Timeline',
        action: 'adjust_timeline',
        params: { projectId: 'project-1', milestoneId: 'milestone-3' }
      }
    ]
  },
  {
    id: 'insight-5',
    title: 'Positive trend in team productivity',
    description: 'The development team has increased their velocity by 12% over the last sprint.',
    type: 'trend',
    category: 'performance',
    priority: 'low',
    createdAt: '2025-04-19T11:20:00Z',
    metrics: [
      {
        name: 'Velocity Increase',
        value: '12%',
        change: 12,
        trend: 'up'
      },
      {
        name: 'Tasks Completed',
        value: '28',
        change: 8,
        trend: 'up'
      },
      {
        name: 'Quality Score',
        value: '94%',
        change: 3,
        trend: 'up'
      }
    ],
    actions: [
      {
        label: 'View Team Analytics',
        action: 'navigate',
        params: { path: '/team/analytics' }
      }
    ]
  }
];

export default AIInsightsPanel;
