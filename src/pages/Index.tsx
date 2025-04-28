
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight, BarChart2, Code2, Lightbulb, Share2, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Genius Online Navigator
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
              The all-in-one AI-powered platform that helps businesses manage and optimize 
              their online presence effortlessly.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to grow your online business in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart2 className="h-10 w-10 text-primary" />}
              title="Advanced Analytics"
              description="Get AI-powered insights and detailed reports on your website performance."
            />
            <FeatureCard
              icon={<Share2 className="h-10 w-10 text-primary" />}
              title="Social Media Integration"
              description="Schedule and auto-post content across multiple platforms simultaneously."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Ad Management"
              description="Create, run, and monitor ad campaigns with smart budget optimization."
            />
            <FeatureCard
              icon={<Code2 className="h-10 w-10 text-primary" />}
              title="Data Integration"
              description="Connect with your existing admin panels or import data via CSV."
            />
            <FeatureCard
              icon={<Lightbulb className="h-10 w-10 text-primary" />}
              title="AI Content Generation"
              description="Generate blog posts, product descriptions, and ad copy tailored to your audience."
            />
            <FeatureCard
              icon={<ArrowRight className="h-10 w-10 text-primary" />}
              title="Multi-User Access"
              description="Collaborate with your team with customizable roles and permissions."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">Ready to transform your online business?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mb-8">
              Join thousands of businesses that are growing with Genius Online Navigator.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/40 py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold">Genius</h3>
              <p className="text-muted-foreground mt-2">© 2025 Genius. All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-muted-foreground hover:text-foreground">About</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Features</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="border-border/40 h-full">
    <CardHeader>
      {icon}
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardContent>
  </Card>
);

export default Index;
