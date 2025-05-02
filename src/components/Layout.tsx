
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  Share2, 
  DollarSign, 
  FileText, 
  Settings, 
  Users, 
  FileBarChart, 
  Link as LinkIcon,
  Globe, 
  Search,
  Facebook,
  LogOut
} from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-1 rounded">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Genius Navigator</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              JD
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex h-screen pt-14">
        {/* Side Navigation */}
        <aside className="w-16 md:w-64 fixed h-full bg-white border-r border-gray-200 pt-4 z-10">
          <nav className="flex flex-col h-full">
            <ul className="space-y-2 px-2">
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/') || isActive('/dashboard') 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Home className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/analytics" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/analytics') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <BarChart2 className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Analytics</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/social" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/social') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Share2 className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Social Media</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/ads" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/ads') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <DollarSign className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Ad Campaigns</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/meta-ads" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/meta-ads') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Facebook className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Meta Ads</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/content" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/content') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Content</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/seo" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/seo') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Search className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">SEO Management</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/reports" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/reports') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <FileBarChart className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Reports</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/integrations" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/integrations') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <LinkIcon className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Integrations</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/team" 
                  className={`flex items-center p-2 rounded-md ${
                    isActive('/team') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:inline">Team</span>
                </Link>
              </li>
            </ul>
            
            <div className="mt-auto px-2 pb-4">
              <Link 
                to="/settings" 
                className={`flex items-center p-2 rounded-md ${
                  isActive('/settings') ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5 md:mr-3" />
                <span className="hidden md:inline">Settings</span>
              </Link>
              
              <Link 
                to="/login" 
                className="flex items-center p-2 rounded-md hover:bg-gray-100 text-red-500"
              >
                <LogOut className="h-5 w-5 md:mr-3" />
                <span className="hidden md:inline">Logout</span>
              </Link>
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="ml-16 md:ml-64 w-full p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
