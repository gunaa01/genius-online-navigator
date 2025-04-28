import React, { useState } from 'react';
import { KeywordAnalysis } from '@/services/ai/insightsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Treemap, WordCloud
} from 'recharts';
import { Search, TrendingUp, Filter, ArrowUpRight } from 'lucide-react';
import ExportDialog from './ExportDialog';

interface KeywordAnalysisSectionProps {
  keywordData: KeywordAnalysis;
}

/**
 * Keyword Analysis Section Component
 * 
 * Displays keyword analysis from user feedback
 */
const KeywordAnalysisSection: React.FC<KeywordAnalysisSectionProps> = ({ keywordData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Get sentiment color
  const getSentimentColor = (value: number) => {
    if (value >= 0.2) return '#4ade80';
    if (value <= -0.2) return '#f87171';
    return '#facc15';
  };

  // Filter keywords by search term
  const filterKeywords = (keywords: Array<{ keyword: string; count: number; sentiment?: number }>) => {
    if (!searchTerm) return keywords;
    return keywords.filter(item => 
      item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get keywords for selected category
  const getCategoryKeywords = () => {
    if (!selectedCategory) return [];
    return keywordData.keywordsByCategory[selectedCategory] || [];
  };

  // Format data for word cloud
  const getWordCloudData = () => {
    return keywordData.topKeywords.map(item => ({
      text: item.keyword,
      value: item.count,
      sentiment: item.sentiment
    }));
  };

  // Get unique categories
  const categories = Object.keys(keywordData.keywordsByCategory);

  // Prepare export columns for top keywords
  const topKeywordsExportColumns = [
    { header: 'Keyword', dataKey: 'keyword' },
    { header: 'Mentions', dataKey: 'count' },
    { header: 'Sentiment Score', dataKey: 'sentiment' },
    { header: 'Sentiment', dataKey: 'sentimentLabel' }
  ];

  // Prepare export columns for rising keywords
  const risingKeywordsExportColumns = [
    { header: 'Keyword', dataKey: 'keyword' },
    { header: 'Mentions', dataKey: 'count' },
    { header: 'Growth (%)', dataKey: 'growth' },
    { header: 'Sentiment Score', dataKey: 'sentiment' },
    { header: 'Sentiment', dataKey: 'sentimentLabel' }
  ];

  // Prepare export columns for insights
  const insightsExportColumns = [
    { header: 'Insight', dataKey: 'text' }
  ];

  // Format top keywords for export
  const topKeywordsForExport = keywordData.topKeywords.map(keyword => ({
    ...keyword,
    sentimentLabel: getSentimentLabel(keyword.sentiment)
  }));

  // Format rising keywords for export
  const risingKeywordsForExport = keywordData.risingKeywords.map(keyword => ({
    ...keyword,
    sentimentLabel: getSentimentLabel(keyword.sentiment)
  }));

  // Format insights for export
  const insightsForExport = keywordData.insights.map((insight, index) => ({
    id: index + 1,
    text: insight
  }));

  // Get sentiment label
  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 0.6) return 'Positive';
    if (sentiment >= 0.4) return 'Neutral';
    return 'Negative';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold">Keyword Analysis</h2>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Keywords</CardTitle>
            <CardDescription>Most frequently mentioned terms in feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filterKeywords(keywordData.topKeywords).slice(0, 10)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" name="Mentions">
                    {keywordData.topKeywords.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.sentiment ? getSentimentColor(entry.sentiment) : COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rising Keywords</CardTitle>
            <CardDescription>Terms with increasing mention frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filterKeywords(keywordData.risingKeywords).slice(0, 10)}
                  margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="keyword" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" name="Mentions" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="change" name="% Change" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="wordcloud" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wordcloud">Word Cloud</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wordcloud" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Cloud</CardTitle>
              <CardDescription>
                Visual representation of keyword frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                {/* Note: This is a placeholder for a word cloud visualization */}
                {/* In a real implementation, you would use a word cloud library */}
                <div className="relative w-full h-full">
                  {getWordCloudData().map((item, index) => {
                    // Create a simple word cloud layout
                    const size = 14 + (item.value / 10);
                    const left = 10 + (index % 5) * 20;
                    const top = 10 + Math.floor(index / 5) * 20;
                    
                    return (
                      <div 
                        key={item.text}
                        className="absolute"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          fontSize: `${size}px`,
                          color: getSentimentColor(item.sentiment || 0),
                          transform: `rotate(${Math.random() * 30 - 15}deg)`,
                          opacity: 0.7 + (item.value / 200)
                        }}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Keyword Insights</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    The most frequently mentioned keywords are related to core platform features and user experience elements.
                    Terms like "{keywordData.topKeywords[0]?.keyword}", "{keywordData.topKeywords[1]?.keyword}", and "{keywordData.topKeywords[2]?.keyword}"
                    dominate the conversation, indicating these are areas of significant user focus.
                  </p>
                  
                  <p>
                    Rising terms such as "{keywordData.risingKeywords[0]?.keyword}" (↑{keywordData.risingKeywords[0]?.change}%) and 
                    "{keywordData.risingKeywords[1]?.keyword}" (↑{keywordData.risingKeywords[1]?.change}%) suggest emerging topics
                    that may require attention or represent new opportunities.
                  </p>
                  
                  <p>
                    Keywords with positive sentiment include "{keywordData.topKeywords.find(k => k.sentiment > 0.3)?.keyword}" and 
                    "{keywordData.topKeywords.filter(k => k.sentiment > 0.3)[1]?.keyword}", while terms with negative sentiment include
                    "{keywordData.topKeywords.find(k => k.sentiment < -0.3)?.keyword}" and 
                    "{keywordData.topKeywords.filter(k => k.sentiment < -0.3)[1]?.keyword}".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keywords by Category</CardTitle>
              <CardDescription>
                Top keywords grouped by feedback category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button 
                  variant={selectedCategory === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
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
              </div>
              
              {selectedCategory ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filterKeywords(getCategoryKeywords()).slice(0, 10)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="keyword" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="count" name="Mentions" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{selectedCategory} Category Insights</h3>
                    <p className="text-sm text-gray-600">
                      In the {selectedCategory} category, the most common keywords reflect user concerns about
                      {selectedCategory === 'Bug' ? ' technical issues and errors.' : 
                       selectedCategory === 'Feature' ? ' functionality and capabilities.' : 
                       selectedCategory === 'UX' ? ' usability and interface design.' : 
                       selectedCategory === 'Performance' ? ' speed and responsiveness.' : 
                       ' various aspects of the platform.'}
                      These keywords can help prioritize {selectedCategory.toLowerCase()} fixes and improvements.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map(category => (
                    <Card key={category}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-md">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {keywordData.keywordsByCategory[category]?.slice(0, 8).map(item => (
                            <Badge key={item.keyword} variant="secondary" className="text-sm">
                              {item.keyword} ({item.count})
                            </Badge>
                          ))}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-4 text-primary"
                          onClick={() => setSelectedCategory(category)}
                        >
                          View All
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Sentiment Analysis</CardTitle>
              <CardDescription>
                Sentiment associated with top keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filterKeywords(keywordData.topKeywords).slice(0, 15)}
                    margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sentiment" name="Sentiment">
                      {keywordData.topKeywords.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment || 0)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-green-600 mb-2">Most Positive Keywords</h3>
                  <div className="space-y-2">
                    {keywordData.topKeywords
                      .filter(item => item.sentiment > 0.2)
                      .sort((a, b) => b.sentiment - a.sentiment)
                      .slice(0, 5)
                      .map(item => (
                        <div key={item.keyword} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="font-medium">{item.keyword}</span>
                          <div className="flex items-center">
                            <span className="text-green-600 mr-2">{(item.sentiment * 100).toFixed(0)}</span>
                            <Badge variant="outline" className="bg-green-100">
                              {item.count} mentions
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-red-600 mb-2">Most Negative Keywords</h3>
                  <div className="space-y-2">
                    {keywordData.topKeywords
                      .filter(item => item.sentiment < -0.2)
                      .sort((a, b) => a.sentiment - b.sentiment)
                      .slice(0, 5)
                      .map(item => (
                        <div key={item.keyword} className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="font-medium">{item.keyword}</span>
                          <div className="flex items-center">
                            <span className="text-red-600 mr-2">{(item.sentiment * 100).toFixed(0)}</span>
                            <Badge variant="outline" className="bg-red-100">
                              {item.count} mentions
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Keyword Sentiment Insights</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    Keywords with the most positive sentiment are often associated with new features, improvements, and aspects of the
                    platform that users find helpful or intuitive. These represent strengths to highlight and build upon.
                  </p>
                  
                  <p>
                    Keywords with negative sentiment typically relate to pain points, bugs, or areas where the user experience
                    falls short of expectations. These represent opportunities for targeted improvements.
                  </p>
                  
                  <p>
                    The sentiment analysis reveals that terms related to "{keywordData.topKeywords.find(k => k.sentiment > 0.5)?.keyword}" have
                    the most positive associations, while "{keywordData.topKeywords.find(k => k.sentiment < -0.5)?.keyword}" has the most
                    negative sentiment, suggesting this should be a priority area for improvement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ExportDialog
        data={topKeywordsForExport}
        columns={topKeywordsExportColumns}
        defaultFilename="top_keywords"
        title="Export Top Keywords"
        description="Export top keywords data in your preferred format"
        trigger={
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        }
      />
      <ExportDialog
        data={risingKeywordsForExport}
        columns={risingKeywordsExportColumns}
        defaultFilename="rising_keywords"
        title="Export Rising Keywords"
        description="Export rising keywords data in your preferred format"
        trigger={
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        }
      />
      <ExportDialog
        data={insightsForExport}
        columns={insightsExportColumns}
        defaultFilename="keyword_insights"
        title="Export Keyword Insights"
        description="Export key keyword insights in your preferred format"
        trigger={
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        }
      />
    </div>
  );
};

export default KeywordAnalysisSection;
