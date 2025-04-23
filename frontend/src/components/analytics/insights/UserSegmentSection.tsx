import React, { useState } from 'react';
import { UserSegmentInsight } from '@/services/ai/insightsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Users, Filter, ArrowRight } from 'lucide-react';
import ExportDialog from './ExportDialog';

interface UserSegmentSectionProps {
  segments: UserSegmentInsight[];
}

/**
 * User Segment Section Component
 * 
 * Displays insights for different user segments
 */
const UserSegmentSection: React.FC<UserSegmentSectionProps> = ({ segments }) => {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Get sentiment color
  const getSentimentColor = (value: number) => {
    if (value >= 0.2) return '#4ade80';
    if (value <= -0.2) return '#f87171';
    return '#facc15';
  };

  // Get sentiment label
  const getSentimentLabel = (value: number) => {
    if (value >= 0.5) return 'Very Positive';
    if (value >= 0.2) return 'Positive';
    if (value >= -0.2) return 'Neutral';
    if (value >= -0.5) return 'Negative';
    return 'Very Negative';
  };

  // Get selected segment data
  const getSelectedSegment = () => {
    if (!selectedSegment) return segments[0];
    return segments.find(segment => segment.segmentId === selectedSegment) || segments[0];
  };

  // Format segment size data for chart
  const getSegmentSizeData = () => {
    return segments.map(segment => ({
      name: segment.segmentName,
      value: segment.size
    }));
  };

  // Format segment sentiment data for chart
  const getSegmentSentimentData = () => {
    return segments.map(segment => ({
      name: segment.segmentName,
      sentiment: segment.sentiment,
      score: Math.round((segment.sentiment + 1) * 50) // Convert -1 to 1 scale to 0-100
    }));
  };

  // Prepare export columns for segment overview
  const segmentOverviewExportColumns = [
    { header: 'Segment', dataKey: 'segmentName' },
    { header: 'Size', dataKey: 'size' },
    { header: 'Percentage', dataKey: 'percentage' },
    { header: 'Sentiment Score', dataKey: 'sentiment' },
    { header: 'Growth Rate', dataKey: 'growth' }
  ];

  // Prepare export columns for segment needs
  const segmentNeedsExportColumns = [
    { header: 'Segment', dataKey: 'segment' },
    { header: 'Need', dataKey: 'need' }
  ];

  // Prepare export columns for segment recommendations
  const segmentRecommendationsExportColumns = [
    { header: 'Segment', dataKey: 'segment' },
    { header: 'Recommendation', dataKey: 'recommendation' }
  ];

  // Format segment needs for export
  const segmentNeedsForExport = segments.flatMap(segment => 
    segment.uniqueNeeds.map((need, index) => ({
      id: `${segment.segmentId}-${index}`,
      segment: segment.segmentName,
      need
    }))
  );

  // Format segment recommendations for export
  const segmentRecommendationsForExport = segments.flatMap(segment => 
    segment.recommendedActions.map((recommendation, index) => ({
      id: `${segment.segmentId}-${index}`,
      segment: segment.segmentName,
      recommendation
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold">User Segment Insights</h2>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Segment:</span>
          <select
            value={selectedSegment || ''}
            onChange={(e) => setSelectedSegment(e.target.value || null)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="">All Segments</option>
            {segments.map(segment => (
              <option key={segment.segmentId} value={segment.segmentId}>
                {segment.segmentName}
              </option>
            ))}
          </select>
        </div>
        
        <ExportDialog
          data={segments}
          columns={segmentOverviewExportColumns}
          defaultFilename="user_segments_overview"
          title="Export User Segments Overview"
          description="Export user segments data in your preferred format"
          trigger={
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Segment Distribution</CardTitle>
            <CardDescription>User distribution across segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getSegmentSizeData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {segments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Segment Sentiment</CardTitle>
            <CardDescription>Sentiment comparison across segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getSegmentSentimentData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [value, 'Sentiment Score']} />
                  <Bar dataKey="score" name="Sentiment">
                    {getSegmentSentimentData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Segment Overview</CardTitle>
            <CardDescription>Key metrics for all segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {segments.map(segment => (
                <div 
                  key={segment.segmentId} 
                  className={`p-3 rounded-lg ${
                    selectedSegment === segment.segmentId ? 'bg-primary/10 border border-primary/30' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{segment.segmentName}</h3>
                    <Badge variant="outline">
                      {segment.size} users
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full ${getSentimentColor(segment.sentiment)}`}></div>
                    <span className="text-xs ml-1">
                      {getSentimentLabel(segment.sentiment)}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {segment.uniqueNeeds.length} unique needs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Segment Details</TabsTrigger>
          <TabsTrigger value="needs">Unique Needs</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{getSelectedSegment().segmentName}</CardTitle>
              <CardDescription>
                Detailed analysis of the {getSelectedSegment().segmentName.toLowerCase()} segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Segment Profile</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Segment Size:</span>
                      <span className="font-medium">{getSelectedSegment().size} users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Sentiment Score:</span>
                      <span className={`font-medium ${getSentimentColor(getSelectedSegment().sentiment)}`}>
                        {Math.round((getSelectedSegment().sentiment + 1) * 50)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Sentiment Label:</span>
                      <span className={`font-medium ${getSentimentColor(getSelectedSegment().sentiment)}`}>
                        {getSentimentLabel(getSelectedSegment().sentiment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Unique Needs:</span>
                      <span className="font-medium">{getSelectedSegment().uniqueNeeds.length}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-6 mb-4">Top Feedback</h3>
                  <div className="space-y-2">
                    {getSelectedSegment().topFeedback.map((feedback, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Segment Comparison</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={[
                        {
                          subject: 'Size',
                          value: getSelectedSegment().size / Math.max(...segments.map(s => s.size)) * 100,
                          fullMark: 100
                        },
                        {
                          subject: 'Sentiment',
                          value: Math.round((getSelectedSegment().sentiment + 1) * 50),
                          fullMark: 100
                        },
                        {
                          subject: 'Needs',
                          value: getSelectedSegment().uniqueNeeds.length / Math.max(...segments.map(s => s.uniqueNeeds.length)) * 100,
                          fullMark: 100
                        },
                        {
                          subject: 'Feedback',
                          value: getSelectedSegment().topFeedback.length / Math.max(...segments.map(s => s.topFeedback.length)) * 100,
                          fullMark: 100
                        },
                        {
                          subject: 'Actions',
                          value: getSelectedSegment().recommendedActions.length / Math.max(...segments.map(s => s.recommendedActions.length)) * 100,
                          fullMark: 100
                        }
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name={getSelectedSegment().segmentName} dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Segment Insights</h3>
                    <p className="text-sm text-gray-600">
                      {getSelectedSegment().segmentName === 'Enterprise Users' ? 
                        'Enterprise users prioritize advanced features, security, and team collaboration. They have higher expectations for reliability and are less price-sensitive than other segments.' : 
                       getSelectedSegment().segmentName === 'Small Business Users' ? 
                        'Small business users are more price-conscious and value simplicity and ease of use. They prefer streamlined workflows and quick setup processes.' : 
                       getSelectedSegment().segmentName === 'New Users (< 30 days)' ? 
                        'New users need more guidance and educational content. They often struggle with navigation and understanding complex features. Onboarding is critical for this segment.' : 
                        'This segment has unique needs and preferences that should be addressed with targeted features and improvements.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="needs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unique Needs by Segment</CardTitle>
              <CardDescription>
                Specific requirements and preferences for each user segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {segments.map(segment => (
                  <Card key={segment.segmentId}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md">{segment.segmentName}</CardTitle>
                        <Badge variant="outline">
                          {segment.size} users
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {segment.uniqueNeeds.map((need, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                              {index + 1}
                            </span>
                            <span>{need}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Need Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Different user segments have distinct needs that should be addressed with targeted features and improvements.
                  Understanding these unique requirements helps prioritize development efforts and create a more personalized experience.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Need Category
                        </th>
                        {segments.map(segment => (
                          <th key={segment.segmentId} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {segment.segmentName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Security & Privacy
                        </td>
                        {segments.map(segment => (
                          <td key={segment.segmentId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {segment.segmentName === 'Enterprise Users' ? 'Critical' : 
                             segment.segmentName === 'Small Business Users' ? 'Important' : 
                             segment.segmentName === 'New Users (< 30 days)' ? 'Low Priority' : 
                             segment.segmentName === 'Power Users' ? 'Medium Priority' : 'Varies'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Ease of Use
                        </td>
                        {segments.map(segment => (
                          <td key={segment.segmentId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {segment.segmentName === 'Enterprise Users' ? 'Medium Priority' : 
                             segment.segmentName === 'Small Business Users' ? 'Critical' : 
                             segment.segmentName === 'New Users (< 30 days)' ? 'Critical' : 
                             segment.segmentName === 'Power Users' ? 'Low Priority' : 'Varies'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Advanced Features
                        </td>
                        {segments.map(segment => (
                          <td key={segment.segmentId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {segment.segmentName === 'Enterprise Users' ? 'Important' : 
                             segment.segmentName === 'Small Business Users' ? 'Low Priority' : 
                             segment.segmentName === 'New Users (< 30 days)' ? 'Not Needed' : 
                             segment.segmentName === 'Power Users' ? 'Critical' : 'Varies'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Cost Sensitivity
                        </td>
                        {segments.map(segment => (
                          <td key={segment.segmentId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {segment.segmentName === 'Enterprise Users' ? 'Low' : 
                             segment.segmentName === 'Small Business Users' ? 'High' : 
                             segment.segmentName === 'New Users (< 30 days)' ? 'Medium' : 
                             segment.segmentName === 'Power Users' ? 'Medium' : 'Varies'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>
                AI-generated recommendations for each user segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {segments.map(segment => (
                  <div key={segment.segmentId} className="space-y-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{segment.segmentName}</h3>
                      <Badge className="ml-2" variant={
                        segment.sentiment > 0.2 ? "success" : 
                        segment.sentiment < -0.2 ? "destructive" : "default"
                      }>
                        {getSentimentLabel(segment.sentiment)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {segment.recommendedActions.map((action, index) => (
                        <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{action}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {index === 0 ? 'High impact, recommended priority' : 
                               index === 1 ? 'Medium impact, consider implementing' : 
                               'Potential improvement opportunity'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Create Action Items <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    
                    {segment !== segments[segments.length - 1] && (
                      <div className="border-t border-gray-200 my-4"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Implementation Strategy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  When implementing these recommendations, consider the following approach:
                </p>
                
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>
                    <span className="font-medium">Prioritize high-impact actions for segments with negative sentiment</span> - 
                    Address pain points for dissatisfied segments first to improve retention.
                  </li>
                  <li>
                    <span className="font-medium">Look for overlapping needs across segments</span> - 
                    Identify recommendations that benefit multiple segments to maximize ROI.
                  </li>
                  <li>
                    <span className="font-medium">Balance short-term fixes with long-term improvements</span> - 
                    Mix quick wins with strategic enhancements for sustained growth.
                  </li>
                  <li>
                    <span className="font-medium">Validate with user research</span> - 
                    Confirm these AI-generated insights with direct user feedback before major investments.
                  </li>
                  <li>
                    <span className="font-medium">Measure impact after implementation</span> - 
                    Track sentiment changes and engagement metrics to evaluate effectiveness.
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSegmentSection;
