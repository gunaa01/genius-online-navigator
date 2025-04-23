import React, { useState } from 'react';
import { ActionableInsight, insightsService } from '@/services/ai/insightsService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertTriangle, CheckCircle2, Clock, Filter, LightbulbIcon, XCircle } from 'lucide-react';

interface ActionableInsightsSectionProps {
  insights: ActionableInsight[];
}

/**
 * Actionable Insights Section Component
 * 
 * Displays actionable insights with prioritized recommendations
 */
const ActionableInsightsSection: React.FC<ActionableInsightsSectionProps> = ({ insights }) => {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<ActionableInsight | null>(null);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<'new' | 'in-progress' | 'implemented' | 'dismissed'>('new');
  const [statusNote, setStatusNote] = useState<string>('');

  // Filter insights by priority and status
  const filteredInsights = insights.filter(insight => {
    if (selectedPriority && insight.priority !== selectedPriority) return false;
    if (selectedStatus && insight.status !== selectedStatus) return false;
    return true;
  });

  // Sort insights by priority (critical first)
  const sortedInsights = [...filteredInsights].sort((a, b) => {
    const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'new': 
        return { color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-4 w-4 mr-1" /> };
      case 'in-progress': 
        return { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="h-4 w-4 mr-1" /> };
      case 'implemented': 
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-4 w-4 mr-1" /> };
      case 'dismissed': 
        return { color: 'bg-gray-100 text-gray-800', icon: <XCircle className="h-4 w-4 mr-1" /> };
      default: 
        return { color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedInsight) return;
    
    try {
      await insightsService.updateInsightStatus(selectedInsight.id, newStatus);
      
      // Update local state
      const updatedInsight = { ...selectedInsight, status: newStatus };
      setSelectedInsight(updatedInsight);
      
      // Close dialog
      setStatusUpdateDialog(false);
      setStatusNote('');
    } catch (error) {
      console.error('Error updating insight status:', error);
      // Handle error (could show a toast notification)
    }
  };

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold">Actionable Insights</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Priority:</span>
          </div>
          
          <Button 
            variant={selectedPriority === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPriority(null)}
          >
            All
          </Button>
          
          {['critical', 'high', 'medium', 'low'].map(priority => (
            <Button
              key={priority}
              variant={selectedPriority === priority ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority(priority)}
              className={selectedPriority === priority ? '' : getPriorityColor(priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Button>
          ))}
          
          <div className="border-l pl-2 ml-2 flex items-center space-x-2">
            <span className="text-sm text-gray-500">Status:</span>
            
            <Button 
              variant={selectedStatus === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedStatus(null)}
            >
              All
            </Button>
            
            {['new', 'in-progress', 'implemented', 'dismissed'].map(status => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedInsights.map(insight => (
          <Card key={insight.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className={getPriorityColor(insight.priority)}>
                  {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
                </Badge>
                <Badge className={getStatusInfo(insight.status).color}>
                  <div className="flex items-center">
                    {getStatusInfo(insight.status).icon}
                    {insight.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{insight.title}</CardTitle>
              <CardDescription className="line-clamp-2">{insight.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Impact</span>
                    <span className="text-sm text-gray-500">ROI: {insight.roi}%</span>
                  </div>
                  <Progress value={insight.roi} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500">User Experience</div>
                    <div className="text-sm font-medium">{insight.impact.userExperience}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Retention</div>
                    <div className="text-sm font-medium">{insight.impact.retention}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Engagement</div>
                    <div className="text-sm font-medium">{insight.impact.engagement}%</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">Suggested Actions</div>
                  <ul className="text-sm space-y-1">
                    {insight.suggestedActions.slice(0, 2).map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1 h-1 rounded-full bg-primary mt-1.5 mr-2"></span>
                        <span className="line-clamp-1">{action}</span>
                      </li>
                    ))}
                    {insight.suggestedActions.length > 2 && (
                      <li className="text-xs text-primary">
                        +{insight.suggestedActions.length - 2} more actions
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedInsight(insight)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {sortedInsights.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <LightbulbIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No actionable insights found</h3>
          <p className="text-gray-500">
            {selectedPriority || selectedStatus
              ? 'No insights match your current filters.'
              : 'No actionable insights are available at this time.'}
          </p>
        </div>
      )}

      {/* Insight Details Dialog */}
      <Dialog open={!!selectedInsight} onOpenChange={(open) => !open && setSelectedInsight(null)}>
        <DialogContent className="max-w-4xl">
          {selectedInsight && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(selectedInsight.priority)}>
                    {selectedInsight.priority.charAt(0).toUpperCase() + selectedInsight.priority.slice(1)} Priority
                  </Badge>
                  <Badge className={getStatusInfo(selectedInsight.status).color}>
                    <div className="flex items-center">
                      {getStatusInfo(selectedInsight.status).icon}
                      {selectedInsight.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                  </Badge>
                </div>
                <DialogTitle className="text-xl mt-2">{selectedInsight.title}</DialogTitle>
                <DialogDescription>{selectedInsight.description}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
                  <TabsTrigger value="actions">Suggested Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-md">ROI Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center">
                          <div className="relative w-40 h-40">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl font-bold">{selectedInsight.roi}%</div>
                                <div className="text-sm text-gray-500">ROI Score</div>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'ROI', value: selectedInsight.roi },
                                    { name: 'Remaining', value: 100 - selectedInsight.roi }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  startAngle={90}
                                  endAngle={-270}
                                  dataKey="value"
                                >
                                  <Cell fill="#3b82f6" />
                                  <Cell fill="#e5e7eb" />
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-4 text-sm text-gray-600">
                            <p>
                              This insight has a {selectedInsight.roi >= 75 ? 'high' : selectedInsight.roi >= 50 ? 'medium' : 'low'} ROI score, 
                              indicating {selectedInsight.roi >= 75 ? 'significant' : selectedInsight.roi >= 50 ? 'moderate' : 'some'} potential 
                              value relative to the estimated effort.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-md">Effort Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={90} data={[
                              {
                                subject: 'Development',
                                value: selectedInsight.effort.development,
                                fullMark: 100
                              },
                              {
                                subject: 'Design',
                                value: selectedInsight.effort.design,
                                fullMark: 100
                              },
                              {
                                subject: 'Testing',
                                value: selectedInsight.effort.testing,
                                fullMark: 100
                              }
                            ]}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              <Radar name="Effort" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">Development</div>
                            <div className="text-lg">{selectedInsight.effort.development}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">Design</div>
                            <div className="text-lg">{selectedInsight.effort.design}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">Testing</div>
                            <div className="text-lg">{selectedInsight.effort.testing}%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Related Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedInsight.relatedTrends.map((trendId, index) => (
                          <div key={trendId} className="flex items-start p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">
                                {index === 0 ? 'Navigation Confusion' : 
                                 index === 1 ? 'Mobile Responsiveness Issues' : 
                                 'Export Functionality Problems'}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {index === 0 ? 'Users are reporting difficulty finding key features in the navigation menu' : 
                                 index === 1 ? 'Increasing feedback about the application not working well on mobile devices' : 
                                 'Users are experiencing problems when exporting data to CSV or PDF formats'}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {index === 0 ? '78 mentions' : 
                               index === 1 ? '42 mentions' : 
                               '38 mentions'}
                            </div>
                          </div>
                        ))}
                        
                        {selectedInsight.relatedTrends.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            No related trends found for this insight
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="impact" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Impact Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: 'User Experience',
                                value: selectedInsight.impact.userExperience
                              },
                              {
                                name: 'Retention',
                                value: selectedInsight.impact.retention
                              },
                              {
                                name: 'Engagement',
                                value: selectedInsight.impact.engagement
                              }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Impact Score" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">User Experience Impact</h4>
                          <p className="text-sm text-gray-600">
                            {selectedInsight.impact.userExperience >= 80 ? 
                              'This insight has a critical impact on user experience. Addressing it would significantly improve how users interact with the platform.' : 
                            selectedInsight.impact.userExperience >= 60 ? 
                              'This insight has a substantial impact on user experience. Implementing it would noticeably improve usability.' : 
                              'This insight has a moderate impact on user experience. It would provide some improvements to usability.'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Retention Impact</h4>
                          <p className="text-sm text-gray-600">
                            {selectedInsight.impact.retention >= 80 ? 
                              'This insight could significantly improve user retention rates by addressing a major pain point that causes users to leave.' : 
                            selectedInsight.impact.retention >= 60 ? 
                              'This insight would have a positive effect on user retention by improving overall satisfaction.' : 
                              'This insight may have a small to moderate effect on user retention.'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Engagement Impact</h4>
                          <p className="text-sm text-gray-600">
                            {selectedInsight.impact.engagement >= 80 ? 
                              'This insight could dramatically increase user engagement by making key features more accessible or enjoyable to use.' : 
                            selectedInsight.impact.engagement >= 60 ? 
                              'This insight would likely increase how often users interact with the platform.' : 
                              'This insight may lead to some increase in user engagement metrics.'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Suggested Actions</CardTitle>
                      <CardDescription>
                        AI-recommended steps to address this insight
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedInsight.suggestedActions.map((action, index) => (
                          <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{action}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {index === 0 ? 'High impact, moderate effort' : 
                                 index === 1 ? 'Medium impact, low effort' : 
                                 index === 2 ? 'High impact, high effort' : 
                                 'Medium impact, medium effort'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Implementation Notes</h4>
                        <p className="text-sm text-gray-600">
                          These actions are prioritized based on their potential impact and implementation effort. 
                          Consider starting with the high-impact, low-effort items for quick wins, then moving to 
                          more complex tasks. Coordinate with the relevant teams to ensure proper implementation.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Insight ID: {selectedInsight.id}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setSelectedInsight(null)}>
                    Close
                  </Button>
                  <Button onClick={() => setStatusUpdateDialog(true)}>
                    Update Status
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialog} onOpenChange={setStatusUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Change the status of this insight to track its implementation progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup 
              value={newStatus} 
              onValueChange={(value) => setNewStatus(value as 'new' | 'in-progress' | 'implemented' | 'dismissed')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="status-new" />
                <Label htmlFor="status-new" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  New
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-progress" id="status-in-progress" />
                <Label htmlFor="status-in-progress" className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                  In Progress
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="implemented" id="status-implemented" />
                <Label htmlFor="status-implemented" className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Implemented
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dismissed" id="status-dismissed" />
                <Label htmlFor="status-dismissed" className="flex items-center">
                  <XCircle className="h-4 w-4 mr-2 text-gray-500" />
                  Dismissed
                </Label>
              </div>
            </RadioGroup>
            
            <div className="mt-4">
              <Label htmlFor="status-note" className="text-sm font-medium">
                Note (optional)
              </Label>
              <Textarea
                id="status-note"
                placeholder="Add a note about this status change..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionableInsightsSection;
