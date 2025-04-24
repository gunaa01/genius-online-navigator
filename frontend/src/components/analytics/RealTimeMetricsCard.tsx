import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

interface RealTimeMetricsCardProps {
  title: string;
  description?: string;
  metric: number;
  previousMetric?: number;
  format?: 'number' | 'currency' | 'percentage';
  precision?: number;
  prefix?: string;
  suffix?: string;
  target?: number;
  updateInterval?: number; // in milliseconds
  isLive?: boolean;
  fetchData?: () => Promise<number>;
  error?: string;
  onRefresh?: () => void;
}

export default function RealTimeMetricsCard({
  title,
  description,
  metric,
  previousMetric,
  format = 'number',
  precision = 0,
  prefix = '',
  suffix = '',
  target,
  updateInterval = 30000, // Default to 30 seconds
  isLive = false,
  fetchData,
  error,
  onRefresh,
}: RealTimeMetricsCardProps) {
  const [currentMetric, setCurrentMetric] = useState<number>(metric);
  const [previousValue, setPreviousValue] = useState<number>(previousMetric || metric);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentError, setCurrentError] = useState<string | undefined>(error);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date>(new Date());

  // Handle live updates
  useEffect(() => {
    if (!isLive || !fetchData) return;

    const updateMetric = async () => {
      try {
        setLoading(true);
        const newValue = await fetchData();
        setPreviousValue(currentMetric);
        setCurrentMetric(newValue);
        setLastUpdatedAt(new Date());
        setCurrentError(undefined);
      } catch (err) {
        setCurrentError(err instanceof Error ? err.message : 'Failed to update metric');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    updateMetric();

    // Set up interval
    const intervalId = setInterval(updateMetric, updateInterval);

    // Clean up
    return () => clearInterval(intervalId);
  }, [isLive, fetchData, updateInterval, currentMetric]);

  // Update metric when prop changes
  useEffect(() => {
    if (metric !== currentMetric && !isLive) {
      setPreviousValue(currentMetric);
      setCurrentMetric(metric);
    }
  }, [metric, isLive, currentMetric]);

  // Format the metric value
  const formatValue = (value: number): string => {
    let formattedValue: string;

    switch (format) {
      case 'currency':
        formattedValue = value.toLocaleString('en-US', { 
          minimumFractionDigits: precision,
          maximumFractionDigits: precision 
        });
        break;
      case 'percentage':
        formattedValue = value.toLocaleString('en-US', { 
          minimumFractionDigits: precision,
          maximumFractionDigits: precision 
        });
        // Add % if not already in suffix
        if (!suffix.includes('%')) {
          suffix = '%';
        }
        break;
      default:
        formattedValue = value.toLocaleString('en-US', { 
          minimumFractionDigits: precision,
          maximumFractionDigits: precision 
        });
    }

    return `${prefix}${formattedValue}${suffix}`;
  };

  // Calculate percentage change
  const calculateChange = (): number | null => {
    if (previousValue === undefined || previousValue === 0) return null;
    return ((currentMetric - previousValue) / previousValue) * 100;
  };

  const change = calculateChange();
  const changeText = change !== null ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%` : '';
  const isPositiveChange = change !== null && change > 0;
  const isNegativeChange = change !== null && change < 0;
  const isNeutralChange = change !== null && change === 0;

  // Format the relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
      return;
    }

    if (fetchData) {
      try {
        setLoading(true);
        const newValue = await fetchData();
        setPreviousValue(currentMetric);
        setCurrentMetric(newValue);
        setLastUpdatedAt(new Date());
        setCurrentError(undefined);
      } catch (err) {
        setCurrentError(err instanceof Error ? err.message : 'Failed to update metric');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          {(isLive || onRefresh || fetchData) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {currentError ? (
          <Alert variant="destructive" className="mb-2 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{currentError}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            <div className="flex items-baseline">
              <div className="text-2xl font-bold leading-none tracking-tight">
                {formatValue(currentMetric)}
              </div>
              
              {(isPositiveChange || isNegativeChange || isNeutralChange) && (
                <Badge 
                  variant={isPositiveChange ? "success" : isNegativeChange ? "destructive" : "outline"}
                  className="ml-2 h-5"
                >
                  <div className="flex items-center text-xs">
                    {isPositiveChange && <TrendingUp className="mr-1 h-3 w-3" />}
                    {isNegativeChange && <TrendingDown className="mr-1 h-3 w-3" />}
                    {isNeutralChange && <Minus className="mr-1 h-3 w-3" />}
                    {changeText}
                  </div>
                </Badge>
              )}
            </div>
            
            {target !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.min(100, Math.round((currentMetric / target) * 100))}%</span>
                </div>
                <Progress 
                  value={Math.min(100, (currentMetric / target) * 100)} 
                  className="h-2" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {formatValue(currentMetric)}</span>
                  <span>Target: {formatValue(target)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {isLive && (
        <CardFooter className="pt-0">
          <div className="flex items-center text-xs text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center cursor-help">
                  <Info className="h-3 w-3 mr-1" />
                  Last updated {formatRelativeTime(lastUpdatedAt)}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Updates every {updateInterval / 1000} seconds</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 