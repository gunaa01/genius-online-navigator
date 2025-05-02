
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, Settings, Link } from "lucide-react";

interface SEOToolsCardProps {
  title: string;
  description?: string;
  toolType: 'analyzer' | 'optimizer' | 'monitor' | 'research';
}

export default function SEOToolsCard({ title, description, toolType }: SEOToolsCardProps) {
  const getIcon = () => {
    switch (toolType) {
      case 'analyzer':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'optimizer':
        return <Zap className="h-5 w-5 text-green-500" />;
      case 'monitor':
        return <Settings className="h-5 w-5 text-amber-500" />;
      case 'research':
        return <Link className="h-5 w-5 text-purple-500" />;
      default:
        return <Search className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getToolTypeLabel = () => {
    switch (toolType) {
      case 'analyzer':
        return { label: 'Analyzer', color: 'bg-blue-100 text-blue-800' };
      case 'optimizer':
        return { label: 'Optimizer', color: 'bg-green-100 text-green-800' };
      case 'monitor':
        return { label: 'Monitor', color: 'bg-amber-100 text-amber-800' };
      case 'research':
        return { label: 'Research', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Tool', color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  const toolTypeInfo = getToolTypeLabel();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-md">
              {getIcon()}
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge variant="outline" className={`${toolTypeInfo.color}`}>
            {toolTypeInfo.label}
          </Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Usage</span>
            <span className="font-medium">24/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '24%' }}></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" size="sm">
          View Details
        </Button>
        <Button size="sm">
          Launch Tool
        </Button>
      </CardFooter>
    </Card>
  );
}
