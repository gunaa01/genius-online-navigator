
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, ChevronDown, 
  BarChart2, Layout, Users,
  Mail, Globe, Settings
} from 'lucide-react';

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <BarChart2 className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-xl hidden sm:block">MarketingGenius</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6 ml-10">
                <Link 
                  to="/" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/analytics" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/analytics') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Analytics
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    Tools <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute left-0 top-full w-48 py-2 bg-background rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/seo" className="block px-4 py-2 text-sm hover:bg-muted">SEO Tools</Link>
                    <Link to="/social" className="block px-4 py-2 text-sm hover:bg-muted">Social Media</Link>
                    <Link to="/email" className="block px-4 py-2 text-sm hover:bg-muted">Email Marketing</Link>
                    <Link to="/ads" className="block px-4 py-2 text-sm hover:bg-muted">Ad Campaigns</Link>
                  </div>
                </div>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
              
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-background border-b z-50">
          <div className="container px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`flex items-center gap-2 hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Layout className="h-5 w-5" />
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 hover:text-primary ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart2 className="h-5 w-5" />
                Dashboard
              </Link>
              <Link 
                to="/analytics" 
                className={`flex items-center gap-2 hover:text-primary ${isActive('/analytics') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart2 className="h-5 w-5" />
                Analytics
              </Link>
              <div className="h-px bg-border my-2"></div>
              <Link 
                to="/seo" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
                SEO Tools
              </Link>
              <Link 
                to="/social" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Globe className="h-5 w-5" />
                Social Media
              </Link>
              <Link 
                to="/email" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="h-5 w-5" />
                Email Marketing
              </Link>
              <Link 
                to="/clients" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                Client Portal
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <div className="h-px bg-border my-2"></div>
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-lg">MarketingGenius</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Your all-in-one digital marketing platform for SEO, analytics, content, and social media management.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-foreground">Integrations</Link></li>
                <li><Link to="/changelog" className="hover:text-foreground">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link to="/guides" className="hover:text-foreground">Guides</Link></li>
                <li><Link to="/webinars" className="hover:text-foreground">Webinars</Link></li>
                <li><Link to="/documentation" className="hover:text-foreground">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-foreground">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 MarketingGenius. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
