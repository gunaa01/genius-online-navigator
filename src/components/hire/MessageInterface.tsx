import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Paperclip, MoreHorizontal, Phone, Video,
  Calendar, Clock, ChevronDown, Image, File, FileBadge,
  X, Check, User, ArrowRight, Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';

// Mock data for a conversation
const mockConversation = {
  id: '123',
  recipient: {
    id: '1',
    name: 'Alex Johnson',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=250&h=250&auto=format&fit=crop&q=60&crop=faces',
    title: 'Full Stack Web Developer',
    status: 'online', // online, offline, away
    lastActive: 'Just now'
  },
  messages: [
    {
      id: '1',
      sender: 'recipient',
      text: 'Hi there! Thanks for reaching out. How can I help with your project?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      status: 'read' // sent, delivered, read
    },
    {
      id: '2',
      sender: 'user',
      text: 'Hello! I need help building an e-commerce website for my business. Do you have experience with payment processing integration?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
      status: 'read'
    },
    {
      id: '3',
      sender: 'recipient',
      text: 'Absolutely! I've worked with Stripe, PayPal, and Square. What kind of products are you selling?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
      status: 'read'
    },
    {
      id: '4',
      sender: 'user',
      text: 'Great! We sell handmade crafts and need a site that can handle about 100 products with categories and variations. Would you be available for a call to discuss the details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(), // 21 hours ago
      status: 'read'
    },
    {
      id: '5',
      sender: 'recipient',
      text: 'That sounds like a perfect fit for my skills. I'd be happy to jump on a call. Here's my availability for this week:',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      status: 'read'
    },
    {
      id: '6',
      sender: 'recipient',
      text: '• Monday: 2pm - 5pm EST\n• Tuesday: 10am - 12pm EST\n• Thursday: 1pm - 4pm EST\n• Friday: 9am - 11am EST',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      status: 'read'
    },
    {
      id: '7',
      sender: 'user',
      text: 'Thursday at 2pm EST works for me. I'll send you a calendar invite. Before our call, can you share some examples of e-commerce sites you've built?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      status: 'read'
    },
    {
      id: '8',
      sender: 'recipient',
      text: 'Perfect! I've marked my calendar. Here are links to three recent e-commerce projects:',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
      status: 'read'
    },
    {
      id: '9',
      sender: 'recipient',
      text: 'https://craftshop.example.com - Handmade pottery store\nhttps://fashion.example.com - Boutique clothing brand\nhttps://organic.example.com - Organic food delivery service',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
      status: 'read'
    },
    {
      id: '10',
      sender: 'recipient',
      text: 'Looking forward to our call on Thursday!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      status: 'read'
    }
  ],
  attachments: [
    {
      id: '1',
      name: 'Project-Requirements.pdf',
      type: 'pdf',
      size: '2.4 MB',
      url: '#'
    },
    {
      id: '2',
      name: 'Website-Mockup.png',
      type: 'image',
      size: '4.7 MB',
      url: '#'
    }
  ]
};

// Quick response templates
const quickResponses = [
  "Thanks for reaching out!",
  "I'm interested in learning more about your project.",
  "Yes, I have experience with that technology.",
  "Could we schedule a call to discuss details?",
  "I'll send you my portfolio examples.",
  "What's your timeline for this project?",
  "My rate for this type of work is $X per hour.",
  "I'm available to start next week."
];

const MessageInterface = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const [conversation, setConversation] = useState(mockConversation);
  const [newMessage, setNewMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [activeTab, setActiveTab] = useState('messages');
  const [isSchedulingCall, setIsSchedulingCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);
  
  // In a real app, fetch conversation based on freelancerId
  useEffect(() => {
    // Fetch conversation data
    // For now, we'll use mock data
  }, [freelancerId]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: (conversation.messages.length + 1).toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg as any]
    }));
    
    setNewMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                   date.getMonth() === now.getMonth() && 
                   date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return format(date, "h:mm a");
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };
  
  const insertQuickResponse = (response: string) => {
    setNewMessage(prev => {
      if (prev.trim()) {
        return `${prev} ${response}`;
      }
      return response;
    });
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Helmet>
        <title>Message with {conversation.recipient.name} | Genius For Hire</title>
      </Helmet>
      
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild className="h-8 px-2">
              <Link to="/hire">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
                onClick={() => setIsSchedulingCall(true)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Call
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Audio Call</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Video className="h-4 w-4 mr-2" />
                    <span>Video Call</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container px-4 py-0 flex-grow flex flex-col md:flex-row">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-grow flex flex-col"
        >
          <div className="py-4 flex items-center border-b">
            <div className="flex items-center flex-grow">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={conversation.recipient.image} alt={conversation.recipient.name} />
                <AvatarFallback>{conversation.recipient.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{conversation.recipient.name}</h3>
                  <div className={`ml-2 h-2 w-2 rounded-full ${
                    conversation.recipient.status === 'online' ? 'bg-green-500' : 
                    conversation.recipient.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
                <p className="text-sm text-muted-foreground">{conversation.recipient.title}</p>
              </div>
            </div>
            
            <TabsList className="ml-auto">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="messages" className="flex-grow flex flex-col p-0 mt-0">
            {/* Messages */}
            <div className="flex-grow overflow-y-auto px-1 py-4">
              <div className="space-y-4">
                {conversation.messages.map((message) => {
                  const isUser = message.sender === 'user';
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[80%]">
                        {!isUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={conversation.recipient.image} alt={conversation.recipient.name} />
                            <AvatarFallback>{conversation.recipient.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`rounded-lg p-3 ${
                          isUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-foreground'
                        }`}>
                          <p className="whitespace-pre-line">{message.text}</p>
                          <div className={`text-xs mt-1 ${
                            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {formatMessageDate(message.timestamp)}
                            {isUser && (
                              <span className="ml-2">
                                {message.status === 'read' 
                                  ? <Check className="h-3 w-3 inline" /> 
                                  : message.status === 'delivered' 
                                  ? <Check className="h-3 w-3 inline" />
                                  : null}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {isUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>ME</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Quick responses */}
            <div className="px-4 py-2 border-t">
              <div className="flex items-center overflow-x-auto pb-2 no-scrollbar">
                <span className="text-sm font-medium mr-2 text-muted-foreground shrink-0">Quick responses:</span>
                {quickResponses.map((response, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm" 
                    className="mr-2 whitespace-nowrap text-sm"
                    onClick={() => insertQuickResponse(response)}
                  >
                    {response}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Message input */}
            <div className="border-t p-4">
              <div className="flex items-end gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-10 resize-none flex-grow"
                  rows={3}
                />
                <div className="flex flex-col gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Image className="h-4 w-4 mr-2" />
                        <span>Send Image</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <File className="h-4 w-4 mr-2" />
                        <span>Send Document</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileBadge className="h-4 w-4 mr-2" />
                        <span>Send Project Files</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button 
                    size="icon" 
                    disabled={!newMessage.trim()}
                    onClick={handleSendMessage}
                    className="h-10 w-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="flex-grow p-4 mt-0">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Shared Files</h3>
              <p className="text-sm text-muted-foreground mb-4">Files and documents shared in this conversation</p>
              
              {conversation.attachments.length > 0 ? (
                <div className="space-y-2">
                  {conversation.attachments.map((file) => (
                    <div key={file.id} className="flex items-center border rounded-lg p-3">
                      {file.type === 'image' ? (
                        <Image className="h-10 w-10 text-muted-foreground" />
                      ) : (
                        <File className="h-10 w-10 text-muted-foreground" />
                      )}
                      <div className="ml-3 flex-grow">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.size}</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <File className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No files have been shared yet</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Upload New File</h3>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">Drag and drop files here or click to browse</p>
                <Button>Upload File</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="flex-grow p-4 mt-0">
            <div className="space-y-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-3">
                  <AvatarImage src={conversation.recipient.image} alt={conversation.recipient.name} />
                  <AvatarFallback>{conversation.recipient.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{conversation.recipient.name}</h2>
                <p className="text-muted-foreground">{conversation.recipient.title}</p>
                
                <div className="mt-4 flex justify-center gap-2">
                  <Button variant="outline" asChild>
                    <Link to={`/hire/freelancer/${conversation.recipient.id}`}>
                      View Full Profile
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Hire Now
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Conversation Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Started on</span>
                    <span className="text-sm font-medium">
                      {format(new Date(conversation.messages[0].timestamp), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Messages</span>
                    <span className="text-sm font-medium">{conversation.messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Files shared</span>
                    <span className="text-sm font-medium">{conversation.attachments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last activity</span>
                    <span className="text-sm font-medium">
                      {formatMessageDate(conversation.messages[conversation.messages.length - 1].timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Contact Options</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Audio Call
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsSchedulingCall(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Schedule meeting dialog */}
      <Dialog open={isSchedulingCall} onOpenChange={setIsSchedulingCall}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule a Call</DialogTitle>
            <DialogDescription>
              Set up a time to talk with {conversation.recipient.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input type="time" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Call Type</label>
              <Select defaultValue="video">
                <SelectTrigger>
                  <SelectValue placeholder="Select call type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="audio">Audio Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Topic</label>
              <Input placeholder="e.g., Project Discussion, Interview, etc." />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea 
                placeholder="Add any additional information about the meeting..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2" onClick={() => setIsSchedulingCall(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSchedulingCall(false)}>
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Mobile devices style adjustments */}
      <style jsx>{`
        @media (max-width: 768px) {
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageInterface;
