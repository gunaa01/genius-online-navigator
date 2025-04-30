
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

interface RealTimeMetricsCardProps {
  title: string;
  metric: number;
  previousMetric?: number;
  format?: 'number' | 'percentage' | 'currency';
  precision?: number;
  prefix?: string;
  suffix?: string;
  isLive?: boolean;
  updateInterval?: number;
  fetchData?: () => Promise<number>;
}

export default function RealTimeMetricsCard({
  title,
  metric,
  previousMetric,
  format = 'number',
  precision = 0,
  prefix = '',
  suffix = '',
  isLive = false,
  updateInterval = 60000,
  fetchData
}: RealTimeMetricsCardProps) {
  const [currentMetric, setCurrentMetric] = useState<number>(metric);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Calculate percentage change
  const percentChange = previousMetric 
    ? ((currentMetric - previousMetric) / previousMetric) * 100 
    : 0;
  
  // Format the metric value based on the format prop
  const formatValue = (value: number): string => {
    switch (format) {
      case 'percentage':
        return `${prefix}${value.toFixed(precision)}${suffix}`;
      case 'currency':
        return `${prefix}${value.toLocaleString(undefined, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        })}${suffix}`;
      default:
        return `${prefix}${value.toLocaleString(undefined, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        })}${suffix}`;
    }
  };
  
  // Update metrics in real-time if enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLive && fetchData) {
      interval = setInterval(async () => {
        setIsLoading(true);
        try {
          const newValue = await fetchData();
          setCurrentMetric(newValue);
          setLastUpdated(new Date());
        } catch (error) {
          console.error("Failed to fetch updated metric:", error);
        } finally {
          setIsLoading(false);
        }
      }, updateInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, updateInterval, fetchData]);
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <div className="flex items-center">
            <h3 className="text-2xl font-bold">
              {formatValue(currentMetric)}
            </h3>
            {isLoading && (
              <Loader2 className="h-4 w-4 ml-2 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        
        {previousMetric && (
          <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            percentChange > 0 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : percentChange < 0 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}>
            {percentChange > 0 ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : percentChange < 0 ? (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            ) : null}
            {Math.abs(percentChange).toFixed(1)}%
          </div>
        )}
      </div>
      
      {isLive && (
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </Card>
  );
}
