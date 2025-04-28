import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Zap, 
  MessageSquare, 
  Users, 
  FileText,
  Settings,
  PenTool,
  Briefcase,
  ChevronRight
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  isNew?: boolean;
}

const innovationNavItems: NavItem[] = [
  {
    title: 'Analytics Dashboard',
    href: '/innovation/analytics-dashboard',
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: 'AI Content Generator',
    href: '/innovation/ai-content-generator',
    icon: <PenTool className="h-5 w-5" />,
  },
  {
    title: 'Social Media Dashboard',
    href: '/innovation/social-media-dashboard',
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: 'Automation Hub',
    href: '/innovation/automation-hub',
    icon: <Zap className="h-5 w-5" />,
    isNew: true
  },
  {
    title: 'Resource Management',
    href: '/innovation/resource-management',
    icon: <Users className="h-5 w-5" />,
    isNew: true
  },
  {
    title: 'Client Portal',
    href: '/innovation/client-portal',
    icon: <Briefcase className="h-5 w-5" />,
    isNew: true,
    badge: 'Beta'
  }
];

interface InnovationNavProps {
  className?: string;
  collapsed?: boolean;
}

const InnovationNav: React.FC<InnovationNavProps> = ({
  className,
  collapsed = false
}) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          {!collapsed && (
            <h2 className="text-lg font-semibold tracking-tight">
              Innovation Suite
            </h2>
          )}
          {collapsed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-input">
                    <Zap className="h-5 w-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Innovation Suite</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="space-y-1">
          {innovationNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            if (collapsed) {
              return (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        onMouseEnter={() => setHoveredItem(item.href)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="icon"
                          className="w-full justify-center"
                        >
                          {item.icon}
                          {item.isNew && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="flex items-center gap-2">
                        <p>{item.title}</p>
                        {item.badge && (
                          <Badge variant="outline" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.isNew && !item.badge && (
                          <Badge className="text-xs">New</Badge>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    hoveredItem === item.href && "bg-accent"
                  )}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                  {item.badge && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {item.isNew && !item.badge && (
                    <Badge className="ml-auto text-xs">New</Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
      <Separator />
      <div className="px-3 py-2">
        {!collapsed ? (
          <div className="flex flex-col gap-1">
            <Link to="/settings/innovation">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-5 w-5 mr-2" />
                Innovation Settings
              </Button>
            </Link>
            <Link to="/documentation/innovation">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <FileText className="h-5 w-5 mr-2" />
                Documentation
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/settings/innovation">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Innovation Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/documentation/innovation">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Documentation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default InnovationNav;
