
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  Rocket, 
  FileText, 
  Share2, 
  Search, 
  Mail, 
  User, 
  ArrowRight 
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Genius Online Navigator | Digital Marketing Platform</title>
        <meta name="description" content="An all-in-one digital marketing platform for managing SEO, social media, analytics, and content." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/90 to-primary px-4 py-20 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Elevate Your Digital Marketing
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white/90">
            An all-in-one platform to streamline your SEO, social media, content, 
            and analytics in one powerful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link to="/login">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            All Your Marketing Needs in One Place
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">SEO Optimization</h3>
              <p className="text-muted-foreground mb-4">
                Boost your search ranking with automated sitemaps, schema markup, and optimization tools.
              </p>
              <Link to="/seo" className="text-primary hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Social Media</h3>
              <p className="text-muted-foreground mb-4">
                Schedule and auto-post content across all your social media platforms from one dashboard.
              </p>
              <Link to="/social" className="text-primary hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Get actionable insights with detailed analytics and performance tracking for all channels.
              </p>
              <Link to="/analytics" className="text-primary hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Content Creation</h3>
              <p className="text-muted-foreground mb-4">
                Create SEO-optimized content with AI assistance and schedule publishing across channels.
              </p>
              <Link to="/content" className="text-primary hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ad Campaigns</h3>
              <p className="text-muted-foreground mb-4">
                Manage Google Ads and Meta Ads with performance tracking and optimization suggestions.
              </p>
              <Link to="/ads" className="text-primary hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Marketing</h3>
              <p className="text-muted-foreground mb-4">
                Create, automate, and track email campaigns with customizable templates and analytics.
              </p>
              <Link to="/email" className="text-primary hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-muted py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Digital Strategy?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
            Join thousands of marketers who save time and drive better results with Genius Online Navigator.
          </p>
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90"
            asChild
          >
            <Link to="/signup">Start Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
