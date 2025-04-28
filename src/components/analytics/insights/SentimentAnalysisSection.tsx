import React, { useState } from 'react';
import { SentimentAnalysis } from '@/services/ai/insightsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, Filter } from 'lucide-react';
import ExportDialog from './ExportDialog';

interface SentimentAnalysisSectionProps {
  sentimentData: SentimentAnalysis;
  timeframe: 'day' | 'week' | 'month' | 'quarter';
}

/**
 * Sentiment Analysis Section Component
 * 
 * Displays sentiment analysis visualizations for user feedback
 */
const SentimentAnalysisSection: React.FC<SentimentAnalysisSectionProps> = ({ 
  sentimentData, 
  timeframe 
}) => {
  const [timeView, setTimeView] = useState<'daily' | 'weekly' | 'monthly'>(
    timeframe === 'day' ? 'daily' : 
    timeframe === 'week' ? 'weekly' : 'monthly'
  );

  // Chart colors
  const COLORS = ['#4ade80', '#facc15', '#f87171', '#60a5fa', '#c084fc'];
  const SENTIMENT_COLORS = {
    positive: '#4ade80',
    neutral: '#facc15',
    negative: '#f87171'
  };

  // Get sentiment color
  const getSentimentColor = (value: number) => {
    if (value >= 0.2) return SENTIMENT_COLORS.positive;
    if (value <= -0.2) return SENTIMENT_COLORS.negative;
    return SENTIMENT_COLORS.neutral;
  };

  // Get sentiment icon
  const getSentimentIcon = (value: number) => {
    if (value >= 0.2) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value <= -0.2) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  // Get sentiment label
  const getSentimentLabel = (value: number) => {
    if (value >= 0.5) return 'Very Positive';
    if (value >= 0.2) return 'Positive';
    if (value >= -0.2) return 'Neutral';
    if (value >= -0.5) return 'Negative';
    return 'Very Negative';
  };

  // Format sentiment value for display
  const formatSentiment = (value: number) => {
    // Convert -1 to 1 scale to 0 to 100 scale
    const normalized = Math.round((value + 1) * 50);
    return normalized;
  };

  // Get time series data based on selected view
  const getTimeSeriesData = () => {
    switch (timeView) {
      case 'daily':
        return sentimentData.byTimeframe.daily;
      case 'weekly':
        return sentimentData.byTimeframe.weekly;
      case 'monthly':
        return sentimentData.byTimeframe.monthly;
      default:
        return sentimentData.byTimeframe.daily;
    }
  };

  // Format category data for charts
  const getCategoryData = () => {
    return Object.entries(sentimentData.byCategory).map(([category, value]) => ({
      category,
      sentiment: value,
      score: formatSentiment(value)
    }));
  };

  // Format feature data for charts
  const getFeatureData = () => {
    return Object.entries(sentimentData.byFeature).map(([feature, value]) => ({
      feature,
      sentiment: value,
      score: formatSentiment(value)
    })).sort((a, b) => b.sentiment - a.sentiment);
  };

  // Prepare export columns for timeseries data
  const timeseriesExportColumns = [
    { header: 'Date', dataKey: 'date' },
    { header: 'Sentiment Score', dataKey: 'sentiment' }
  ];

  // Prepare export columns for distribution data
  const distributionExportColumns = [
    { header: 'Sentiment Type', dataKey: 'name' },
    { header: 'Percentage', dataKey: 'value' }
  ];

  // Prepare export columns for insights
  const insightsExportColumns = [
    { header: 'Insight', dataKey: 'text' }
  ];

  // Format insights for export
  const insightsForExport = sentimentData.insights.map((insight, index) => ({
    id: index + 1,
    text: insight
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Time View:</span>
          <Button
            variant={timeView === 'daily' ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeView('daily')}
          >
            Daily
          </Button>
          <Button
            variant={timeView === 'weekly' ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeView('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={timeView === 'monthly' ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeView('monthly')}
          >
            Monthly
          </Button>
          <ExportDialog
            data={getTimeSeriesData()}
            columns={timeseriesExportColumns}
            defaultFilename="sentiment_timeseries"
            title="Export Sentiment Timeseries"
            description="Export sentiment trend data in your preferred format"
            trigger={
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Sentiment</CardTitle>
            <CardDescription>Average sentiment across all feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-40">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${
                      sentimentData.overall >= 0.2 ? 'text-green-600' : 
                      sentimentData.overall <= -0.2 ? 'text-red-600' : 'text-yellow-500'
                    }`}>
                      {formatSentiment(sentimentData.overall)}
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sentiment', value: formatSentiment(sentimentData.overall) },
                        { name: 'Remaining', value: 100 - formatSentiment(sentimentData.overall) }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill={getSentimentColor(sentimentData.overall)} />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center mt-2">
                {getSentimentIcon(sentimentData.overall)}
                <span className={`ml-1 text-sm font-medium ${
                  sentimentData.overall >= 0.2 ? 'text-green-600' : 
                  sentimentData.overall <= -0.2 ? 'text-red-600' : 'text-yellow-500'
                }`}>
                  {getSentimentLabel(sentimentData.overall)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sentiment Trend</CardTitle>
            <CardDescription>How sentiment has changed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getTimeSeriesData()}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[-1, 1]} tickFormatter={(value) => formatSentiment(value)} />
                  <Tooltip 
                    formatter={(value) => [formatSentiment(value as number), 'Sentiment Score']} 
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <defs>
                    <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="sentiment" 
                    stroke="#60a5fa" 
                    fillOpacity={1} 
                    fill="url(#sentimentGradient)" 
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#8884d8"
                    yAxisId="right"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="features">By Feature</TabsTrigger>
          <TabsTrigger value="distribution">Sentiment Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment by Category</CardTitle>
              <CardDescription>
                How sentiment varies across different feedback categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getCategoryData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      domain={[-1, 1]} 
                      tickFormatter={(value) => formatSentiment(value)} 
                    />
                    <YAxis dataKey="category" type="category" width={80} />
                    <Tooltip 
                      formatter={(value) => [formatSentiment(value as number), 'Sentiment Score']} 
                    />
                    <Bar dataKey="sentiment" name="Sentiment">
                      {getCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {getCategoryData().map((item) => (
                  <div key={item.category} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    {getSentimentIcon(item.sentiment)}
                    <div>
                      <div className="font-medium">{item.category}</div>
                      <div className={`text-sm ${
                        item.sentiment >= 0.2 ? 'text-green-600' : 
                        item.sentiment <= -0.2 ? 'text-red-600' : 'text-yellow-500'
                      }`}>
                        {getSentimentLabel(item.sentiment)}
                      </div>
                    </div>
                    <div className="ml-auto font-bold">{item.score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment by Feature</CardTitle>
              <CardDescription>
                How users feel about specific features of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getFeatureData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      domain={[-1, 1]} 
                      tickFormatter={(value) => formatSentiment(value)} 
                    />
                    <YAxis dataKey="feature" type="category" width={100} />
                    <Tooltip 
                      formatter={(value) => [formatSentiment(value as number), 'Sentiment Score']} 
                    />
                    <Bar dataKey="sentiment" name="Sentiment">
                      {getFeatureData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Feature Sentiment Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-md font-medium text-green-600 mb-2">Most Positive Features</h4>
                    <ul className="space-y-2">
                      {getFeatureData()
                        .filter(item => item.sentiment > 0)
                        .slice(0, 3)
                        .map(item => (
                          <li key={item.feature} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span>{item.feature}</span>
                            <Badge variant="outline" className="bg-green-100">
                              {item.score}
                            </Badge>
                          </li>
                        ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-red-600 mb-2">Most Negative Features</h4>
                    <ul className="space-y-2">
                      {getFeatureData()
                        .filter(item => item.sentiment < 0)
                        .slice(0, 3)
                        .map(item => (
                          <li key={item.feature} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <span>{item.feature}</span>
                            <Badge variant="outline" className="bg-red-100">
                              {item.score}
                            </Badge>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>
                Distribution of sentiment across all feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium mb-4 text-center">Overall Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Very Positive', value: 15 },
                            { name: 'Positive', value: 30 },
                            { name: 'Neutral', value: 25 },
                            { name: 'Negative', value: 20 },
                            { name: 'Very Negative', value: 10 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[0, 1, 2, 3, 4].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-4 text-center">Sentiment Radar</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={[
                        {
                          subject: 'Dashboard',
                          A: formatSentiment(sentimentData.byFeature['Dashboard'] || 0),
                          fullMark: 100
                        },
                        {
                          subject: 'Reports',
                          A: formatSentiment(sentimentData.byFeature['Reports'] || 0),
                          fullMark: 100
                        },
                        {
                          subject: 'Navigation',
                          A: formatSentiment(sentimentData.byFeature['Navigation'] || 0),
                          fullMark: 100
                        },
                        {
                          subject: 'Mobile App',
                          A: formatSentiment(sentimentData.byFeature['Mobile App'] || 0),
                          fullMark: 100
                        },
                        {
                          subject: 'Search',
                          A: formatSentiment(sentimentData.byFeature['Search'] || 0),
                          fullMark: 100
                        }
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Sentiment" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Sentiment Analysis Summary</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    The overall sentiment score of {formatSentiment(sentimentData.overall)} indicates a 
                    {sentimentData.overall > 0.2 ? ' positive' : 
                     sentimentData.overall < -0.2 ? ' negative' : ' neutral'} trend in user feedback.
                    {sentimentData.overall > 0.5 ? ' Users are highly satisfied with the platform overall.' : 
                     sentimentData.overall > 0.2 ? ' Users are generally satisfied with the platform.' : 
                     sentimentData.overall > -0.2 ? ' Users have mixed feelings about the platform.' : 
                     sentimentData.overall > -0.5 ? ' Users are expressing some dissatisfaction with the platform.' : 
                     ' Users are expressing significant dissatisfaction with the platform.'}
                  </p>
                  
                  <p>
                    The most positive feedback is related to 
                    {getFeatureData().filter(f => f.sentiment > 0).slice(0, 2).map(f => f.feature).join(' and ')}, 
                    while the most negative feedback concerns 
                    {getFeatureData().filter(f => f.sentiment < 0).slice(0, 2).map(f => f.feature).join(' and ')}.
                  </p>
                  
                  <p>
                    Sentiment trends over time show 
                    {timeView === 'daily' ? ' daily fluctuations' : 
                     timeView === 'weekly' ? ' weekly patterns' : ' monthly trends'} 
                    with an overall 
                    {getTimeSeriesData()[getTimeSeriesData().length - 1].sentiment > 
                     getTimeSeriesData()[0].sentiment ? ' improving' : ' declining'} trend.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SentimentAnalysisSection;
