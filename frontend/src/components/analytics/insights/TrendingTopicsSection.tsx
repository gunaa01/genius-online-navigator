import React, { useState } from 'react';
import { InsightTrend } from '@/services/ai/insightsService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Filter, ExternalLink } from 'lucide-react';
import ExportDialog from './ExportDialog';

interface TrendingTopicsSectionProps {
  trends: InsightTrend[];
}

/**
 * Trending Topics Section Component
 * 
 * Displays trending topics identified from user feedback
 */
const TrendingTopicsSection: React.FC<TrendingTopicsSectionProps> = ({ trends }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'volume' | 'sentiment' | 'change'>('volume');
  const [selectedTrend, setSelectedTrend] = useState<InsightTrend | null>(null);

  // Filter trends by category
  const filteredTrends = selectedCategory 
    ? trends.filter(trend => trend.category === selectedCategory)
    : trends;

  // Sort trends
  const sortedTrends = [...filteredTrends].sort((a, b) => {
    if (sortBy === 'volume') return b.volume - a.volume;
    if (sortBy === 'sentiment') return b.sentiment - a.sentiment;
    return b.change - a.change;
  });

  // Get unique categories
  const categories = Array.from(new Set(trends.map(trend => trend.category)));

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Prepare export columns
  const exportColumns = [
    { header: 'Topic', dataKey: 'name' },
    { header: 'Description', dataKey: 'description' },
    { header: 'Sentiment', dataKey: 'sentiment' },
    { header: 'Volume', dataKey: 'volume' },
    { header: 'Category', dataKey: 'category' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold">Trending Topics</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
          
          <div className="border-l pl-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className={sortBy === 'volume' ? 'text-primary' : ''}
              onClick={() => setSortBy('volume')}
            >
              Volume
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={sortBy === 'sentiment' ? 'text-primary' : ''}
              onClick={() => setSortBy('sentiment')}
            >
              Sentiment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={sortBy === 'change' ? 'text-primary' : ''}
              onClick={() => setSortBy('change')}
            >
              Change
            </Button>
          </div>
          <ExportDialog
            data={sortedTrends}
            columns={exportColumns}
            defaultFilename="trending_topics"
            title="Export Trending Topics"
            description="Export trending topics data in your preferred format"
            trigger={
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTrends.map(trend => (
          <Card key={trend.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">
                  {trend.category}
                </Badge>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    trend.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </span>
                  {trend.change > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{trend.name}</CardTitle>
              <CardDescription className="line-clamp-2">{trend.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-center">
                  <div className="text-2xl font-bold">{trend.volume}</div>
                  <div className="text-xs text-gray-500">Mentions</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    trend.sentiment > 0 ? 'text-green-600' : 
                    trend.sentiment < 0 ? 'text-red-600' : 'text-yellow-500'
                  }`}>
                    {(trend.sentiment * 100).toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">Sentiment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{(trend.confidence * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">Top Keywords</div>
                <div className="flex flex-wrap gap-1">
                  {trend.keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedTrend(trend)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {sortedTrends.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No trending topics found</h3>
          <p className="text-gray-500">
            {selectedCategory 
              ? `No trends found in the ${selectedCategory} category.` 
              : 'No trends found for the selected filters.'}
          </p>
        </div>
      )}

      {/* Trend Details Dialog */}
      <Dialog open={!!selectedTrend} onOpenChange={(open) => !open && setSelectedTrend(null)}>
        <DialogContent className="max-w-4xl">
          {selectedTrend && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedTrend.category}</Badge>
                  <span className={`text-sm font-medium ${
                    selectedTrend.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedTrend.change > 0 ? '+' : ''}{selectedTrend.change}%
                  </span>
                </div>
                <DialogTitle className="text-xl mt-2">{selectedTrend.name}</DialogTitle>
                <DialogDescription>{selectedTrend.description}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="feedback">Related Feedback</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Volume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedTrend.volume}</div>
                        <div className="text-xs text-gray-500">mentions</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Sentiment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${
                          selectedTrend.sentiment > 0 ? 'text-green-600' : 
                          selectedTrend.sentiment < 0 ? 'text-red-600' : 'text-yellow-500'
                        }`}>
                          {(selectedTrend.sentiment * 100).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedTrend.sentiment > 0.3 ? 'Positive' : 
                           selectedTrend.sentiment < -0.3 ? 'Negative' : 'Neutral'}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Confidence</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{(selectedTrend.confidence * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">confidence score</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Timeframe</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold capitalize">{selectedTrend.period}</div>
                        <div className="text-xs text-gray-500">period</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-md">Keywords</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={selectedTrend.keywords.map((keyword, index) => ({
                                keyword,
                                count: selectedTrend.volume * (1 - (index * 0.15))
                              }))}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="keyword" type="category" width={100} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-md">Sentiment Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Positive', value: Math.max(0, selectedTrend.sentiment > 0 ? selectedTrend.sentiment * selectedTrend.volume : 0) },
                                  { name: 'Neutral', value: selectedTrend.volume * 0.5 },
                                  { name: 'Negative', value: Math.max(0, selectedTrend.sentiment < 0 ? Math.abs(selectedTrend.sentiment) * selectedTrend.volume : 0) }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {[0, 1, 2].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['#4ade80', '#facc15', '#f87171'][index]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="feedback" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      This trend is associated with {selectedTrend.feedbackIds.length} feedback items.
                      Here are some representative examples:
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Mock feedback items */}
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-md">
                              {i === 1 ? "Navigation is confusing" : 
                               i === 2 ? "Can't find important features" : 
                               "Menu structure needs improvement"}
                            </CardTitle>
                            <Badge variant={i === 1 ? "destructive" : i === 2 ? "outline" : "secondary"}>
                              {i === 1 ? "Negative" : i === 2 ? "Neutral" : "Suggestion"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            {i === 1 ? 
                              "I find the navigation menu very confusing. It's hard to find the features I need, and I often have to click through multiple menus to find what I'm looking for." : 
                             i === 2 ? 
                              "The menu structure could be improved. I had trouble finding the export functionality and had to search for it." : 
                              "I think the navigation would be better if it was organized by task rather than by feature category. This would make it easier to find what I need."}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-xs text-gray-500">
                              User ID: {i === 1 ? "U-7842" : i === 2 ? "U-5631" : "U-9012"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {i === 1 ? "3 days ago" : i === 2 ? "1 week ago" : "2 days ago"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline">
                      View All Related Feedback
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Analysis</CardTitle>
                      <CardDescription>
                        Automated analysis of this trend and its implications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Summary</h4>
                        <p className="text-sm text-gray-600">
                          This trend indicates significant user frustration with the navigation structure.
                          The high volume and negative sentiment suggest this is a critical issue affecting
                          user experience. The confidence score of {(selectedTrend.confidence * 100).toFixed(0)}% 
                          indicates strong reliability in this analysis.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Impact Assessment</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm font-medium">User Experience</div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">High Impact</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Retention</div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Medium Impact</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Conversion</div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">High Impact</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Actions</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>Conduct user testing sessions focused on navigation</li>
                          <li>Redesign the main navigation menu with clearer categories</li>
                          <li>Implement a search function to help users find features</li>
                          <li>Add a "recently used" section for quick access to common features</li>
                          <li>Create guided tours for new users to learn the interface</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setSelectedTrend(null)}>
                  Close
                </Button>
                <Button>
                  Create Action Item
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrendingTopicsSection;
