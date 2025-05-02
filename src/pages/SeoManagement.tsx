
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Globe,
  FileText,
  Settings,
  Upload,
  Download,
  LucideIcon
} from 'lucide-react';
import { sitemapService } from '../services/sitemapService';

interface SeoCheckResult {
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'success' | 'warning' | 'error';
}

const SeoManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sitemap');
  const [url, setUrl] = useState('https://example.com');
  const [isSitemapGenerating, setIsSitemapGenerating] = useState(false);
  const [seoCheckResults, setSeoCheckResults] = useState<SeoCheckResult[]>([
    {
      title: 'Meta Titles',
      description: 'All pages have unique meta titles under 60 characters',
      icon: CheckCircle2,
      status: 'success'
    },
    {
      title: 'Meta Descriptions',
      description: '3 pages have missing meta descriptions',
      icon: AlertTriangle,
      status: 'warning'
    },
    {
      title: 'Image Alt Text',
      description: '12 images are missing alt text attributes',
      icon: AlertTriangle,
      status: 'warning'
    },
    {
      title: 'Mobile Friendly',
      description: 'Your site passes the mobile-friendly test',
      icon: CheckCircle2,
      status: 'success'
    },
    {
      title: 'SSL Certificate',
      description: 'Valid HTTPS encryption is in place',
      icon: CheckCircle2,
      status: 'success'
    }
  ]);
  
  const handleSitemapGeneration = async () => {
    try {
      setIsSitemapGenerating(true);
      await sitemapService.generateSitemap();
      setIsSitemapGenerating(false);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      setIsSitemapGenerating(false);
    }
  };
  
  const handlePingSearchEngines = async () => {
    try {
      await sitemapService.pingSitemapToSearchEngines();
    } catch (error) {
      console.error('Error pinging search engines:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>SEO Management | Genius Online Navigator</title>
        <meta name="description" content="Optimize your website's search engine visibility" />
      </Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">SEO Management</h1>
          <p className="text-muted-foreground">Optimize your website for search engines</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="url"
            placeholder="Enter website URL"
            className="w-full md:w-[300px]"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Analyze
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>SEO Optimization Needed</AlertTitle>
        <AlertDescription>
          Your website has 5 critical SEO issues that should be addressed to improve search rankings.
          <Button variant="link" className="p-0 h-auto ml-2">Fix Issues</Button>
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="overview">
            <Globe className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sitemap">
            <FileText className="h-4 w-4 mr-2" />
            XML Sitemap
          </TabsTrigger>
          <TabsTrigger value="meta">
            <Search className="h-4 w-4 mr-2" />
            Meta Tags
          </TabsTrigger>
          <TabsTrigger value="schema">
            <Settings className="h-4 w-4 mr-2" />
            Schema Markup
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seoCheckResults.map((result, index) => (
              <Card key={index} className={`
                ${result.status === 'success' ? 'border-green-200 bg-green-50' : ''}
                ${result.status === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
                ${result.status === 'error' ? 'border-red-200 bg-red-50' : ''}
              `}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{result.title}</CardTitle>
                    <result.icon className={`
                      h-5 w-5 
                      ${result.status === 'success' ? 'text-green-500' : ''}
                      ${result.status === 'warning' ? 'text-yellow-500' : ''}
                      ${result.status === 'error' ? 'text-red-500' : ''}
                    `} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sitemap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>XML Sitemap Generator</CardTitle>
              <CardDescription>
                Generate and manage your XML sitemap for better search engine indexing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <Label htmlFor="sitemap-url">Sitemap URL</Label>
                  <div className="flex mt-1">
                    <Input 
                      id="sitemap-url" 
                      value={`${url}/sitemap.xml`} 
                      readOnly 
                    />
                    <Button variant="ghost" className="ml-2">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="shrink-0 flex flex-col justify-end">
                  <Button className="w-full" onClick={handleSitemapGeneration} disabled={isSitemapGenerating}>
                    {isSitemapGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Generate Sitemap
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="excluded-urls">Excluded URLs (one per line)</Label>
                <Textarea 
                  id="excluded-urls"
                  placeholder="/thank-you&#10;/private-page&#10;/admin"
                  className="mt-1 h-[100px]"
                />
              </div>
              
              <div>
                <Label>Last Generated</Label>
                <p className="text-sm text-muted-foreground">May 1, 2025 at 10:24 AM</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={handlePingSearchEngines}>
                <Globe className="h-4 w-4 mr-2" />
                Ping Search Engines
              </Button>
              
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Custom Sitemap
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="meta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags Manager</CardTitle>
              <CardDescription>
                Optimize your title tags and meta descriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="page-url">Page URL</Label>
                <Input 
                  id="page-url" 
                  placeholder="e.g., /about-us" 
                  className="mt-1" 
                />
              </div>
              
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input 
                  id="meta-title" 
                  placeholder="Enter page title (max 60 characters)" 
                  className="mt-1" 
                />
              </div>
              
              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea 
                  id="meta-description"
                  placeholder="Enter meta description (max 160 characters)"
                  className="mt-1 h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button>Save Meta Tags</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schema Markup Generator</CardTitle>
              <CardDescription>
                Add structured data to your website for rich search results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center py-12 text-muted-foreground">
                Schema markup generation features coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeoManagement;
