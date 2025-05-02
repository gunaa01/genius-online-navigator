
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  Send, 
  Search, 
  Globe, 
  Users, 
  Mail, 
  PieChart, 
  Zap, 
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import MarketingLayout from '@/components/layouts/MarketingLayout';

export default function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Your Complete Digital Marketing Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          All your SEO, analytics, content, and social media management tools in one powerful platform
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Book a Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Comprehensive Marketing Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SEO Optimization</h3>
              <p className="text-muted-foreground">
                Auto-generate XML sitemaps, schema markup integration, and meta optimization tools
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Tracking</h3>
              <p className="text-muted-foreground">
                Integrated Google Analytics 4, heatmaps, and UTM parameter tracking
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Media</h3>
              <p className="text-muted-foreground">
                Auto-posting to multiple platforms and performance tracking
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Marketing</h3>
              <p className="text-muted-foreground">
                Drip campaigns, responsive templates, and GDPR-compliant list management
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration Tools</h3>
              <p className="text-muted-foreground">
                Client portals with role-based access for seamless teamwork
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lead Generation</h3>
              <p className="text-muted-foreground">
                Pop-up forms with CRM integration and A/B testing for CTAs
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary/5 border-0">
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to grow your online presence?</h2>
              <p className="text-muted-foreground mb-6 md:mb-0 max-w-lg">
                Get all the digital marketing tools you need in one place. Start optimizing your campaigns today.
              </p>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 px-8 whitespace-nowrap">
              Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </section>
    </MarketingLayout>
  );
}
