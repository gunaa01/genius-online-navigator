
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RealTimeMetricsCardProps {
  title: string;
  metric: number;
  suffix?: string;
  previousMetric?: number;
  change?: number;
}

const RealTimeMetricsCard: React.FC<RealTimeMetricsCardProps> = ({ title, metric, suffix = "", previousMetric, change }) => {
  const calculatedChange = change !== undefined 
    ? change 
    : previousMetric !== undefined 
      ? ((metric - previousMetric) / previousMetric) * 100
      : 0;
  
  const isPositive = calculatedChange >= 0;
  const formattedChange = Math.abs(calculatedChange).toFixed(1);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {metric}{suffix}
        </div>
        
        {previousMetric !== undefined && (
          <div className="flex items-center mt-2">
            <Badge 
              variant="outline" 
              className={
                isPositive 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {isPositive 
                ? <TrendingUp className="h-3 w-3 mr-1" /> 
                : <TrendingDown className="h-3 w-3 mr-1" />
              }
              {isPositive ? "+" : "-"}{formattedChange}%
            </Badge>
            <span className="text-xs text-muted-foreground ml-2">vs previous</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMetricsCard;
