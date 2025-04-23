import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import { AlertTriangle, RefreshCw, Copy, ChevronDown, ChevronUp, ExternalLink, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

// Error reporting service interface
interface ErrorReportingService {
  captureException: (error: Error, context?: Record<string, any>) => void;
  captureMessage: (message: string, context?: Record<string, any>) => void;
}

// Mock error reporting service (replace with actual implementation)
const errorReportingService: ErrorReportingService = {
  captureException: (error: Error, context?: Record<string, any>) => {
    console.error('Reporting error to service:', error, context);
    // In production, this would send to Sentry, LogRocket, etc.
  },
  captureMessage: (message: string, context?: Record<string, any>) => {
    console.error('Reporting message to service:', message, context);
    // In production, this would send to Sentry, LogRocket, etc.
  }
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetCondition?: any;
  errorReportingService?: ErrorReportingService;
  componentName?: string;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorStack: string | null;
  componentStack: string | null;
  eventId: string | null;
  userFeedback: string;
}

// Toast component for copy feedback
const CopyToast: React.FC = () => {
  const { toast } = useToast();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        toast({
          title: "Copied to clipboard",
          description: "Error details have been copied to your clipboard",
        });
      }}
    >
      Show Toast
    </Button>
  );
};

/**
 * ErrorBoundary component to catch JavaScript errors in child components,
 * log those errors, and display a fallback UI.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 * 
 * With custom fallback:
 * <ErrorBoundary fallback={<CustomErrorComponent />}>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 * 
 * With component name for better error tracking:
 * <ErrorBoundary componentName="UserDashboard">
 *   <UserDashboard />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorStack: null,
      componentStack: null,
      eventId: null,
      userFeedback: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorStack: error.stack || null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Extract component stack from errorInfo
    const componentStack = errorInfo.componentStack || '';
    
    // Generate a unique ID for this error instance
    const eventId = `error-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Update state with error details
    this.setState({
      errorInfo,
      componentStack,
      eventId
    });
    
    // Log the error to console with detailed information
    console.error(
      `[ErrorBoundary] Error in ${this.props.componentName || 'component'}:`, 
      error, 
      errorInfo,
      `Event ID: ${eventId}`
    );
    
    // Report to error service
    const reportingService = this.props.errorReportingService || errorReportingService;
    reportingService.captureException(error, {
      componentName: this.props.componentName,
      componentStack,
      eventId,
      location: window.location.href,
      timestamp: new Date().toISOString()
    });
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // If resetCondition changes, reset the error boundary
    if (this.state.hasError && prevProps.resetCondition !== this.props.resetCondition) {
      this.setState({ 
        hasError: false, 
        error: null,
        errorInfo: null,
        errorStack: null,
        componentStack: null,
        eventId: null,
        userFeedback: ''
      });
    }
  }

  resetErrorBoundary = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorStack: null,
      componentStack: null,
      eventId: null,
      userFeedback: ''
    });
  };

  handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ userFeedback: e.target.value });
  };

  submitFeedback = () => {
    const { error, eventId, userFeedback } = this.state;
    
    if (!userFeedback.trim()) return;
    
    // Report feedback to error service
    const reportingService = this.props.errorReportingService || errorReportingService;
    reportingService.captureMessage(`User feedback for error: ${error?.message}`, {
      feedback: userFeedback,
      eventId,
      componentName: this.props.componentName,
      timestamp: new Date().toISOString()
    });
    
    // Clear feedback
    this.setState({ userFeedback: '' });
    
    // Show confirmation (would use toast in a real implementation)
    alert('Thank you for your feedback!');
  };

  copyErrorToClipboard = () => {
    const { error, componentStack, eventId } = this.state;
    
    const errorText = `
Error ID: ${eventId}
Component: ${this.props.componentName || 'Unknown'}
Message: ${error?.message || 'Unknown error'}
URL: ${window.location.href}
Time: ${new Date().toLocaleTimeString()}

Error Stack:
${error?.stack || 'No stack trace available'}

Component Stack:
${componentStack || 'No component stack available'}
    `.trim();
    
    navigator.clipboard.writeText(errorText)
      .then(() => {
        console.log('Error details copied to clipboard');
        // Would use toast in a real implementation
      })
      .catch(err => {
        console.error('Failed to copy error details:', err);
      });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card className="w-full max-w-2xl mx-auto my-8 border-destructive/50">
          <CardHeader className="bg-destructive/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              {this.state.eventId && (
                <Badge variant="outline" className="font-mono text-xs">
                  ID: {this.state.eventId}
                </Badge>
              )}
            </div>
            <CardDescription>
              We encountered an error while rendering {this.props.componentName ? `the ${this.props.componentName} component` : 'this component'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2">Error Message:</div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md overflow-auto max-h-[100px] mb-4">
              <p className="font-mono">{this.state.error?.message || 'Unknown error'}</p>
            </div>
            
            {(this.props.showDetails !== false) && (
              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="debug">Debug</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      The application encountered an unexpected error. You can try to recover by clicking the "Try Again" button below, or reload the page.
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Bug className="h-4 w-4" />
                      <span>Technical Information:</span>
                    </div>
                    
                    <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Component: {this.props.componentName || 'Unknown'}</li>
                      <li>Error Type: {this.state.error?.name || 'Unknown'}</li>
                      <li>Time: {new Date().toLocaleTimeString()}</li>
                      <li>Browser: {navigator.userAgent}</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="feedback" className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please help us improve by describing what you were doing when this error occurred:
                    </p>
                    
                    <Textarea
                      placeholder="What were you trying to do when this error happened?"
                      value={this.state.userFeedback}
                      onChange={this.handleFeedbackChange}
                      className="min-h-[100px] mb-4"
                    />
                    
                    <Button 
                      onClick={this.submitFeedback}
                      disabled={!this.state.userFeedback.trim()}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="debug" className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Stack Trace</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={this.copyErrorToClipboard}
                        className="h-8"
                      >
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        Copy Details
                      </Button>
                    </div>
                    
                    <Collapsible className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">Error Stack</div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent>
                        <div className="text-xs font-mono bg-muted/50 p-3 rounded-md overflow-auto max-h-[200px] whitespace-pre-wrap mt-1">
                          {this.state.errorStack || 'No stack trace available'}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <Collapsible className="w-full mt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">Component Stack</div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent>
                        <div className="text-xs font-mono bg-muted/50 p-3 rounded-md overflow-auto max-h-[200px] whitespace-pre-wrap mt-1">
                          {this.state.componentStack || 'No component stack available'}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <div className="mt-4 pt-4 border-t">
                      <a 
                        href="https://docs.geniusonlinenavigator.com/errors" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs flex items-center text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        View Error Documentation
                      </a>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
            <Button 
              onClick={this.resetErrorBoundary}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
