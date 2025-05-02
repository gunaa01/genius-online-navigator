
import React from 'react';
import MarketingLayout from '@/components/layouts/MarketingLayout';
import SEOToolsCard from '@/components/seo/SEOToolsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BarChart2, FileText, Globe, Tag, Link as LinkIcon } from 'lucide-react';

export default function SEOPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">SEO Tools</h1>
            <p className="text-muted-foreground">Optimize your website for better search engine rankings</p>
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search tools..." className="pl-9" />
            </div>
            <Button>
              New Analysis
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-background border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-md">
                <BarChart2 className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Domain Rating</p>
                <p className="text-2xl font-semibold">72/100</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-md">
                <Globe className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organic Traffic</p>
                <p className="text-2xl font-semibold">14.8k</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-md">
                <Tag className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Keywords</p>
                <p className="text-2xl font-semibold">864</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-md">
                <LinkIcon className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Backlinks</p>
                <p className="text-2xl font-semibold">3,241</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* SEO Tools */}
        <h2 className="text-xl font-semibold mb-4">Popular Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SEOToolsCard
            title="Site Audit"
            description="Comprehensive technical SEO audit of your website"
            toolType="analyzer"
          />
          
          <SEOToolsCard
            title="Keyword Research"
            description="Find high-value keywords for your content strategy"
            toolType="research"
          />
          
          <SEOToolsCard
            title="Backlink Analysis"
            description="Analyze your backlink profile and find opportunities"
            toolType="monitor"
          />
          
          <SEOToolsCard
            title="On-Page Optimizer"
            description="Optimize individual pages for target keywords"
            toolType="optimizer"
          />
          
          <SEOToolsCard
            title="Rank Tracking"
            description="Monitor your keyword rankings over time"
            toolType="monitor"
          />
          
          <SEOToolsCard
            title="Content Analysis"
            description="Analyze and optimize your content for SEO"
            toolType="analyzer"
          />
        </div>
        
        {/* Recent Reports */}
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        <div className="bg-muted/40 rounded-lg border p-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-muted-foreground text-sm">
                <th className="py-3 px-4">Report Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="py-3 px-4 font-medium">Homepage SEO Analysis</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    On-Page Analysis
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">May 1, 2025</td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-3 px-4 font-medium">Competitor Analysis</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2 text-purple-500" />
                    Research
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">Apr 28, 2025</td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-3 px-4 font-medium">Backlink Profile Check</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-amber-500" />
                    Backlink Analysis
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm px-2 py-1 rounded-full bg-amber-100 text-amber-800">In Progress</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">May 2, 2025</td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </MarketingLayout>
  );
}
