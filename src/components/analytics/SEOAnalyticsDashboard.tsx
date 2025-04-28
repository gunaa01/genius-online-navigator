import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Search,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
  Flame,
  BarChart3,
  LineChart,
  Globe,
  Link as LinkIcon,
  FileText,
  List,
  ArrowUpRight
} from "lucide-react";
import RealTimeMetricsCard from './RealTimeMetricsCard';

// Mock keyword data
const mockKeywords = [
  { keyword: "digital marketing tools", position: 3, previousPosition: 5, volume: 4800, difficulty: 68 },
  { keyword: "marketing automation platform", position: 7, previousPosition: 12, volume: 2900, difficulty: 58 },
  { keyword: "social media management", position: 8, previousPosition: 7, volume: 8700, difficulty: 74 },
  { keyword: "content creation software", position: 5, previousPosition: 8, volume: 3400, difficulty: 61 },
  { keyword: "best seo tools", position: 12, previousPosition: 18, volume: 12500, difficulty: 82 },
  { keyword: "productivity apps", position: 21, previousPosition: 35, volume: 9200, difficulty: 76 },
  { keyword: "marketing analytics dashboard", position: 4, previousPosition: 6, volume: 1800, difficulty: 52 },
  { keyword: "email marketing software", position: 15, previousPosition: 14, volume: 6300, difficulty: 72 },
  { keyword: "customer journey analytics", position: 9, previousPosition: 11, volume: 2200, difficulty: 59 },
];

// Mock page data
const mockPages = [
  { url: "/blog/digital-marketing-trends-2023", organic: 4250, previousOrganic: 3620, keywords: 68, avgPosition: 8.3 },
  { url: "/features/analytics-dashboard", organic: 3180, previousOrganic: 2850, keywords: 42, avgPosition: 6.7 },
  { url: "/blog/social-media-strategy-guide", organic: 5120, previousOrganic: 5360, keywords: 87, avgPosition: 9.2 },
  { url: "/solutions/small-business", organic: 2740, previousOrganic: 2120, keywords: 53, avgPosition: 12.4 },
  { url: "/blog/email-marketing-best-practices", organic: 3860, previousOrganic: 3210, keywords: 71, avgPosition: 7.8 },
  { url: "/pricing", organic: 1960, previousOrganic: 1840, keywords: 24, avgPosition: 5.3 },
];

interface SEOAnalyticsDashboardProps {
  enableRealTime?: boolean;
}

export default function SEOAnalyticsDashboard({
  enableRealTime = false
}: SEOAnalyticsDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState("30days");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredKeywords = mockKeywords.filter(item => 
    item.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPages = mockPages.filter(item =>
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SEO Analytics</h2>
          <p className="text-muted-foreground">
            Monitor your search engine visibility and organic performance
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealTimeMetricsCard
          title="Organic Traffic"
          metric={24692}
          previousMetric={21348}
          suffix=" visitors"
          isLive={enableRealTime}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 24692 * (0.98 + Math.random() * 0.04);
          }}
        />
        
        <RealTimeMetricsCard
          title="Keyword Rankings"
          metric={187}
          previousMetric={165}
          isLive={enableRealTime}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 187 * (0.98 + Math.random() * 0.04);
          }}
        />
        
        <RealTimeMetricsCard
          title="Average Position"
          metric={12.4}
          previousMetric={14.7}
          precision={1}
          isLive={enableRealTime}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 12.4 * (0.97 + Math.random() * 0.06);
          }}
        />
        
        <RealTimeMetricsCard
          title="Impressions"
          metric={356789}
          previousMetric={324567}
          isLive={enableRealTime}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 356789 * (0.98 + Math.random() * 0.04);
          }}
        />
      </div>
      
      <Tabs defaultValue="rankings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rankings" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Rankings
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Top Pages
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Competitors
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rankings">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>
                Track your positions for target keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search keywords..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th className="px-4 py-3">Keyword</th>
                      <th className="px-4 py-3 text-right">Position</th>
                      <th className="px-4 py-3 text-right">Change</th>
                      <th className="px-4 py-3 text-right">Volume</th>
                      <th className="px-4 py-3 text-right">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeywords.map((keyword, index) => {
                      const positionChange = keyword.previousPosition - keyword.position;
                      
                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">
                            {keyword.keyword}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {keyword.position}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end">
                              {positionChange > 0 ? (
                                <>
                                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                                  <span className="text-green-500">+{positionChange}</span>
                                </>
                              ) : positionChange < 0 ? (
                                <>
                                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                  <span className="text-red-500">{positionChange}</span>
                                </>
                              ) : (
                                <span>0</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">{keyword.volume.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end">
                              {keyword.difficulty > 70 ? (
                                <Flame className="mr-1 h-4 w-4 text-red-500" />
                              ) : null}
                              {keyword.difficulty}/100
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Pages with the highest organic traffic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th className="px-4 py-3">URL</th>
                      <th className="px-4 py-3 text-right">Organic Traffic</th>
                      <th className="px-4 py-3 text-right">Change</th>
                      <th className="px-4 py-3 text-right">Keywords</th>
                      <th className="px-4 py-3 text-right">Avg. Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPages.map((page, index) => {
                      const trafficChange = ((page.organic - page.previousOrganic) / page.previousOrganic) * 100;
                      
                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{page.url}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {page.organic.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end">
                              {trafficChange > 0 ? (
                                <>
                                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                                  <span className="text-green-500">+{trafficChange.toFixed(1)}%</span>
                                </>
                              ) : trafficChange < 0 ? (
                                <>
                                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                  <span className="text-red-500">{trafficChange.toFixed(1)}%</span>
                                </>
                              ) : (
                                <span>0%</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">{page.keywords}</td>
                          <td className="px-4 py-3 text-right">{page.avgPosition.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Organic Traffic Trends</CardTitle>
              <CardDescription>
                How your organic search traffic has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Trend Visualization Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're working on interactive trend charts that will show organic traffic, 
                    keyword positions, impressions, and click-through rates over time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
              <CardDescription>
                Compare your SEO performance with competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Competitor Analysis Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're building a comprehensive competitor analysis tool to help you 
                    track keyword overlaps, content gaps, and ranking opportunities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 