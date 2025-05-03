
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Share2, 
  FileText, 
  Settings, 
  Users, 
  FileBarChart, 
  Link as LinkIcon,
  Search,
  MessageSquare,
  Home,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Globe
} from 'lucide-react';

const GlobalNavigation: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);

  const toggleSubMenu = (menu: string) => {
    if (subMenuOpen === menu) {
      setSubMenuOpen(null);
    } else {
      setSubMenuOpen(menu);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainNavItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: <BarChart2 className="w-5 h-5" /> 
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: <FileBarChart className="w-5 h-5" /> 
    }
  ];

  const marketingNavItems = [
    { 
      name: 'Social Media', 
      path: '/social', 
      icon: <Share2 className="w-5 h-5" /> 
    },
    { 
      name: 'Social Dashboard', 
      path: '/social-dashboard', 
      icon: <Share2 className="w-5 h-5" /> 
    },
    { 
      name: 'Ad Campaigns', 
      path: '/ads', 
      icon: <Search className="w-5 h-5" /> 
    },
    { 
      name: 'Meta Ads', 
      path: '/meta-ads', 
      icon: <Globe className="w-5 h-5" /> 
    }
  ];

  const contentNavItems = [
    { 
      name: 'AI Content', 
      path: '/content', 
      icon: <MessageSquare className="w-5 h-5" /> 
    },
    { 
      name: 'Content Analytics', 
      path: '/content-analytics', 
      icon: <BarChart2 className="w-5 h-5" /> 
    },
    { 
      name: 'SEO', 
      path: '/seo', 
      icon: <Search className="w-5 h-5" /> 
    },
    { 
      name: 'Blog', 
      path: '/blog', 
      icon: <FileText className="w-5 h-5" /> 
    }
  ];

  const adminNavItems = [
    { 
      name: 'Team', 
      path: '/team', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Integrations', 
      path: '/integrations', 
      icon: <LinkIcon className="w-5 h-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
    { 
      name: 'Developer', 
      path: '/developer', 
      icon: <Globe className="w-5 h-5" /> 
    }
  ];

  return (
    <nav className="bg-background fixed w-full z-50 shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Globe className="h-8 w-8 text-primary mr-2" />
              <span className="font-bold text-xl text-primary hidden md:block">Genius</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Dropdown for Marketing */}
            <div className="relative group">
              <button
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-muted hover:text-primary transition-colors"
                onClick={() => toggleSubMenu('marketing')}
              >
                Marketing
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-background border rounded-md shadow-lg p-2 z-50">
                {marketingNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-primary w-full"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Dropdown for Content */}
            <div className="relative group">
              <button
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-muted hover:text-primary transition-colors"
                onClick={() => toggleSubMenu('content')}
              >
                Content
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-background border rounded-md shadow-lg p-2 z-50">
                {contentNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-primary w-full"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Dropdown for Admin */}
            <div className="relative group">
              <button
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-muted hover:text-primary transition-colors"
                onClick={() => toggleSubMenu('admin')}
              >
                Admin
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-background border rounded-md shadow-lg p-2 z-50">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-primary w-full"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* User actions on desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              Sign in
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted hover:text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
            
            {/* Marketing Section */}
            <div>
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                onClick={() => toggleSubMenu('marketing')}
              >
                <div className="flex items-center">
                  <Share2 className="w-5 h-5" />
                  <span className="ml-3">Marketing</span>
                </div>
                {subMenuOpen === 'marketing' ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              
              {subMenuOpen === 'marketing' && (
                <div className="pl-10 pr-3 py-2 space-y-2">
                  {marketingNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div>
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                onClick={() => toggleSubMenu('content')}
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5" />
                  <span className="ml-3">Content</span>
                </div>
                {subMenuOpen === 'content' ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              
              {subMenuOpen === 'content' && (
                <div className="pl-10 pr-3 py-2 space-y-2">
                  {contentNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Admin Section */}
            <div>
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                onClick={() => toggleSubMenu('admin')}
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5" />
                  <span className="ml-3">Admin</span>
                </div>
                {subMenuOpen === 'admin' ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              
              {subMenuOpen === 'admin' && (
                <div className="pl-10 pr-3 py-2 space-y-2">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile user actions */}
            <div className="pt-4 border-t border-gray-200">
              <Link 
                to="/login" 
                className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GlobalNavigation;
