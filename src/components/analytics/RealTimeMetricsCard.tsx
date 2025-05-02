
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

interface RealTimeMetricsCardProps {
  title: string;
  metric: number;
  previousMetric?: number;
  format?: 'number' | 'percentage' | 'currency';
  precision?: number;
  prefix?: string;
  suffix?: string;
  isLive?: boolean;
  updateInterval?: number; // in milliseconds
  fetchData?: () => Promise<number>;
}

const RealTimeMetricsCard = ({
  title,
  metric,
  previousMetric,
  format = 'number',
  precision = 0,
  prefix = '',
  suffix = '',
  isLive = false,
  updateInterval = 60000, // default 1 minute
  fetchData
}: RealTimeMetricsCardProps) => {
  const [currentMetric, setCurrentMetric] = useState(metric);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  useEffect(() => {
    setCurrentMetric(metric);
  }, [metric]);
  
  useEffect(() => {
    if (!isLive || !fetchData) return;
    
    const updateData = async () => {
      setIsLoading(true);
      try {
        const newValue = await fetchData();
        setCurrentMetric(newValue);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching updated metric:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial update
    updateData();
    
    // Set interval for updates
    const interval = setInterval(updateData, updateInterval);
    
    return () => clearInterval(interval);
  }, [isLive, fetchData, updateInterval]);
  
  // Format the metric based on type
  const formatMetric = (value: number) => {
    let formattedValue;
    
    switch (format) {
      case 'percentage':
        formattedValue = value.toFixed(precision);
        break;
      case 'currency':
        formattedValue = value.toLocaleString('en-US', {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        });
        break;
      default:
        formattedValue = value >= 1000000
          ? (value / 1000000).toFixed(1) + 'M'
          : value >= 1000
            ? (value / 1000).toFixed(1) + 'K'
            : value.toFixed(precision);
    }
    
    return `${prefix}${formattedValue}${suffix}`;
  };
  
  // Calculate percent change
  const percentChange = previousMetric 
    ? ((currentMetric - previousMetric) / previousMetric) * 100
    : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
            ) : (
              <h2 className="text-3xl font-bold">{formatMetric(currentMetric)}</h2>
            )}
          </div>
          
          {previousMetric !== undefined && (
            <Badge 
              variant={percentChange >= 0 ? "outline" : "destructive"} 
              className={percentChange >= 0 ? "bg-green-50 text-green-700 border-green-200" : ""}
            >
              {percentChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </Badge>
          )}
        </div>
        
        {isLive && lastUpdated && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMetricsCard;
