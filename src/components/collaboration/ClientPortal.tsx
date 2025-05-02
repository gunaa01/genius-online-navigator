import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { FileUploader } from '@/components/ui/file-uploader';
import { toast } from 'sonner';
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  BarChart2, 
  Clock, 
  CheckSquare, 
  Upload,
  Download,
  ExternalLink,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useMessages } from '@/hooks/useMessages';
import { formatDate } from '@/lib/utils';

/**
 * Client Portal Component
 * Provides a centralized hub for client collaboration, including:
 * - Project timeline and progress tracking
 * - File sharing and document management
 * - Messaging and communication
 * - Performance analytics dashboards
 * - Task management and approvals
 */
const ClientPortal: React.FC = () => {
  const { user } = useAuth();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { messages, sendMessage, isLoading: messagesLoading } = useMessages();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // Select first project by default when projects load
  useEffect(() => {
    if (projects?.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    
    try {
      await sendMessage({
        projectId: selectedProject.id,
        message: newMessage,
        senderId: user.id,
        timestamp: new Date().toISOString()
      });
      
      setNewMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    if (!files.length || !selectedProject) return;
    
    setUploadingFile(true);
    
    try {
      // Mock API call for file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploadingFile(false);
    }
  };
  
  // Calculate project progress
  const calculateProgress = (project: any) => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    
    const completedTasks = project.tasks.filter((task: any) => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };
  
  // Format project timeline phases
  const formatTimelinePhases = (project: any) => {
    if (!project || !project.timeline) return [];
    
    return project.timeline.map((phase: any) => ({
      ...phase,
      formattedStartDate: formatDate(phase.startDate),
      formattedEndDate: formatDate(phase.endDate),
      isActive: new Date(phase.startDate) <= new Date() && new Date(phase.endDate) >= new Date(),
      isCompleted: new Date(phase.endDate) < new Date() && phase.status === 'completed'
    }));
  };
  
  // Calculate remaining time for project
  const calculateRemainingTime = (project: any) => {
    if (!project || !project.endDate) return '';
    
    const endDate = new Date(project.endDate);
    const today = new Date();
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };
  
  if (projectsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading client projects...</div>;
  }
  
  if (!selectedProject) {
    return <div className="flex items-center justify-center h-screen">No projects found</div>;
  }
  
  const projectProgress = calculateProgress(selectedProject);
  const timelinePhases = formatTimelinePhases(selectedProject);
  const remainingTime = calculateRemainingTime(selectedProject);
  const projectMessages = messages?.filter((msg: any) => msg.projectId === selectedProject.id) || [];
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{selectedProject.name}</h1>
          <p className="text-gray-500">{selectedProject.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Team
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live
          </Button>
        </div>
      </div>
      
      {/* Project Selector (if multiple projects) */}
      {projects.length > 1 && (
        <div className="mb-6">
          <Label htmlFor="project-select">Select Project</Label>
          <select
            id="project-select"
            className="w-full p-2 border rounded-md"
            value={selectedProject.id}
            onChange={(e) => {
              const project = projects.find((p: any) => p.id === e.target.value);
              if (project) setSelectedProject(project);
            }}
          >
            {projects.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Project Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={projectProgress} className="h-2" />
              <p className="text-2xl font-bold">{projectProgress}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                <span>
                  {formatDate(selectedProject.startDate)} - {formatDate(selectedProject.endDate)}
                </span>
              </div>
              <p className="text-2xl font-bold">{remainingTime}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Phase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timelinePhases.find((phase: any) => phase.isActive) ? (
                <>
                  <p className="text-2xl font-bold">
                    {timelinePhases.find((phase: any) => phase.isActive)?.name}
                  </p>
                  <p className="text-gray-500">
                    {timelinePhases.find((phase: any) => phase.isActive)?.description}
                  </p>
                </>
              ) : (
                <p className="text-xl">No active phase</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="files">Files & Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Summary of your marketing campaign progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Project Description */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p>{selectedProject.description}</p>
                </div>
                
                {/* Key Metrics */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProject.metrics?.map((metric: any) => (
                      <div key={metric.id} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-500 text-sm">{metric.name}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <div className={`text-sm ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Updates */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Recent Updates</h3>
                  <div className="space-y-4">
                    {selectedProject.updates?.slice(0, 3).map((update: any) => (
                      <div key={update.id} className="border-b pb-4">
                        <div className="flex justify-between mb-1">
                          <p className="font-medium">{update.title}</p>
                          <p className="text-gray-500 text-sm">{formatDate(update.date)}</p>
                        </div>
                        <p className="text-gray-600">{update.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Timeline and milestones for your marketing campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {timelinePhases.map((phase: any, index: number) => (
                  <div key={phase.id} className="relative pl-8 pb-8">
                    {/* Timeline connector */}
                    {index < timelinePhases.length - 1 && (
                      <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    
                    {/* Status indicator */}
                    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      phase.isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : phase.isActive 
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {phase.isCompleted ? (
                        <CheckSquare className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    
                    {/* Phase content */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-medium ${
                          phase.isActive ? 'text-blue-600' : ''
                        }`}>
                          {phase.name}
                          {phase.isActive && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full">
                              Current
                            </span>
                          )}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {phase.formattedStartDate} - {phase.formattedEndDate}
                        </span>
                      </div>
                      <p className="text-gray-600">{phase.description}</p>
                      
                      {/* Deliverables */}
                      {phase.deliverables && phase.deliverables.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Deliverables:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                            {phase.deliverables.map((deliverable: any) => (
                              <li key={deliverable.id}>
                                {deliverable.name}
                                {deliverable.status === 'completed' && (
                                  <span className="ml-2 text-green-500">✓</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Files & Documents Tab */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Files & Documents</CardTitle>
              <CardDescription>Share and access project documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                  <FileUploader
                    onUpload={handleFileUpload}
                    isUploading={uploadingFile}
                    maxSize={10} // 10MB
                    allowedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']}
                  />
                </div>
                
                {/* Document Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center justify-center h-20">
                    <div className="text-center">
                      <FileText className="h-6 w-6 mx-auto mb-1" />
                      <span>Project Documents</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center justify-center h-20">
                    <div className="text-center">
                      <BarChart2 className="h-6 w-6 mx-auto mb-1" />
                      <span>Reports & Analytics</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center justify-center h-20">
                    <div className="text-center">
                      <Calendar className="h-6 w-6 mx-auto mb-1" />
                      <span>Content Calendar</span>
                    </div>
                  </Button>
                </div>
                
                {/* Recent Files */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Files</h3>
                  <div className="space-y-2">
                    {selectedProject.files?.map((file: any) => (
                      <div 
                        key={file.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {file.size} • Uploaded {formatDate(file.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card className="flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with your marketing team</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-40">Loading messages...</div>
                ) : projectMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <MessageSquare className="h-10 w-10 mb-2" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start a conversation with your marketing team</p>
                  </div>
                ) : (
                  projectMessages.map((message: any) => (
                    <div 
                      key={message.id}
                      className={`flex ${
                        message.senderId === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`flex max-w-[80%] ${
                        message.senderId === user.id ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <Avatar className={`${
                          message.senderId === user.id ? 'ml-2' : 'mr-2'
                        } flex-shrink-0`}>
                          <AvatarImage src={message.sender.avatar} />
                          <AvatarFallback>
                            {message.sender.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`p-3 rounded-lg ${
                            message.senderId === user.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            {message.message}
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${
                            message.senderId === user.id ? 'text-right' : 'text-left'
                          }`}>
                            {formatDate(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full space-x-2">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Track the performance of your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Analytics content would go here - could include charts, metrics, etc. */}
              <div className="text-center py-12">
                <BarChart2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Analytics Dashboard</p>
                <p className="text-gray-500">
                  Detailed analytics for this project are available in the main analytics dashboard.
                </p>
                <Button className="mt-4">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Analytics Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortal;
