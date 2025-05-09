import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart2, 
  Zap, 
  Share2, 
  FileText, 
  Globe, 
  Users, 
  ArrowRight 
} from 'lucide-react';

const HomePage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-primary">Genius</span> Online Navigator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The all-in-one platform to manage and optimize your online presence effortlessly
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BarChart2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Comprehensive Analytics</h3>
          <p className="text-muted-foreground">
            Get detailed insights into your online performance with interactive dashboards and AI-driven suggestions.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Share2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Social Media Integration</h3>
          <p className="text-muted-foreground">
            Schedule and auto-post content to multiple platforms simultaneously with our AI content generator.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ad Campaign Management</h3>
          <p className="text-muted-foreground">
            Create, run, and monitor ad campaigns on platforms like Google Ads and Facebook Ads all from one place.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Key Features</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Globe className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Data Integration</h3>
              <p className="text-sm text-muted-foreground">
                Connect your existing admin panels or upload data directly.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">AI Content Generation</h3>
              <p className="text-sm text-muted-foreground">
                Generate blog posts, product descriptions, and ad copy using AI.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <BarChart2 className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Automated Reports</h3>
              <p className="text-sm text-muted-foreground">
                Generate detailed reports on traffic, conversions, and engagement.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Share2 className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Social Media Management</h3>
              <p className="text-sm text-muted-foreground">
                Schedule and auto-post content across multiple platforms.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Multi-User Access</h3>
              <p className="text-sm text-muted-foreground">
                Assign different roles and permissions to team members.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Zap className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">A/B Testing</h3>
              <p className="text-sm text-muted-foreground">
                Test variations of content and analyze performance.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link to="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
