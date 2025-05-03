
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Layout, Globe, MessageSquare, Share2 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Genius</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Your all-in-one platform for marketing automation, analytics, and content management
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center px-6 py-3 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            to="/analytics" 
            className="inline-flex items-center px-6 py-3 rounded-md font-medium bg-muted hover:bg-muted/80 transition-colors"
          >
            Explore Analytics
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Link
          to="/dashboard"
          className="flex flex-col items-center p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
        >
          <Layout className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-medium mb-2">Dashboard</h3>
          <p className="text-center text-muted-foreground">Get a complete overview of your marketing efforts</p>
        </Link>
        
        <Link
          to="/analytics"
          className="flex flex-col items-center p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
        >
          <BarChart2 className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-medium mb-2">Analytics</h3>
          <p className="text-center text-muted-foreground">Detailed insights and performance metrics</p>
        </Link>
        
        <Link
          to="/social"
          className="flex flex-col items-center p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
        >
          <Share2 className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-medium mb-2">Social Media</h3>
          <p className="text-center text-muted-foreground">Manage all your social platforms from one place</p>
        </Link>
        
        <Link
          to="/content"
          className="flex flex-col items-center p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
        >
          <MessageSquare className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-medium mb-2">AI Content</h3>
          <p className="text-center text-muted-foreground">Generate engaging content with AI assistance</p>
        </Link>
      </div>
      
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Explore More Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Reports', path: '/reports', description: 'Comprehensive reporting tools' },
            { name: 'Ad Campaigns', path: '/ads', description: 'Manage and optimize your ads' },
            { name: 'Social Dashboard', path: '/social-dashboard', description: 'Monitor social performance' },
            { name: 'Content Analytics', path: '/content-analytics', description: 'Content performance metrics' },
            { name: 'SEO Management', path: '/seo', description: 'Optimize your search rankings' },
            { name: 'Meta Ads', path: '/meta-ads', description: 'Facebook and Instagram ad management' },
            { name: 'Team Management', path: '/team', description: 'Collaborate with your team' },
            { name: 'Integrations', path: '/integrations', description: 'Connect with other tools' },
            { name: 'Developer', path: '/developer', description: 'Access developer tools' }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
