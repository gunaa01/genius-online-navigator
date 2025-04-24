import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  LogOut,
  User,
  Bell,
  Home,
  BarChart2,
  Layers,
  MessageSquare,
  PenTool,
  Users,
  HelpCircle,
} from 'lucide-react';

/**
 * Main layout component with navigation and content area
 * Implements accessibility features for WCAG 2.1 AA compliance
 */
const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Close sidebar automatically on mobile
      if (window.innerWidth < 768 && sidebarOpen) {
        dispatch(toggleSidebar());
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [dispatch, sidebarOpen]);

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Skip link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 bg-card border-r border-border`}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h1 className="text-xl font-bold">Genius Navigator</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleSidebar}
              className="md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2" role="menu">
              <NavItem icon={<Home />} href="/dashboard" label="Dashboard" />
              <NavItem icon={<BarChart2 />} href="/analytics" label="Analytics" />
              <NavItem icon={<Layers />} href="/ad-campaigns" label="Ad Campaigns" />
              <NavItem icon={<MessageSquare />} href="/social-media" label="Social Media" />
              <NavItem icon={<PenTool />} href="/ai-content" label="AI Content" />
              <NavItem icon={<Users />} href="/team" label="Team" />
              <NavItem icon={<Settings />} href="/settings" label="Settings" />
              <NavItem icon={<HelpCircle />} href="/docs" label="Help & Docs" />
            </ul>
          </nav>
          
          {/* User info */}
          <div className="border-t border-border p-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.firstName} />
                <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={`flex flex-col flex-1 ${sidebarOpen ? 'md:ml-64' : ''} transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleSidebar}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={sidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Theme toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleThemeToggle}
                    aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
                  >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {theme === 'dark' ? "Light mode" : "Dark mode"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content area */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          tabIndex={-1} // Makes it focusable for skip link
          role="main"
          aria-label="Main content"
        >
          <Outlet />
        </main>
        
        {/* Screen reader announcements */}
        <div 
          id="a11y-live-region" 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        ></div>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-30 bg-black/50" 
          onClick={handleToggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

// Navigation item component
interface NavItemProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, href, label }) => {
  return (
    <li role="menuitem">
      <a
        href={href}
        className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </a>
    </li>
  );
};

export default Layout;
