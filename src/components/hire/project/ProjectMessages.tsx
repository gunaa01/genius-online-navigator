import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  MoreVertical, 
  Search,
  ChevronDown,
  Clock,
  CheckCheck,
  FileText,
  Loader2,
  AlertTriangle,
  Info,
  Filter
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Message interface
interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  isOnline?: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'spreadsheet' | 'archive' | 'other';
  size: string;
  url: string;
  thumbnailUrl?: string;
}

interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
  replyTo?: {
    id: string;
    content: string;
    sender: User;
  };
}

// Mock users
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop',
    role: 'Freelancer',
    isOnline: true
  },
  {
    id: 'user-2',
    name: 'Michael Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop',
    role: 'Client',
    isOnline: true
  },
  {
    id: 'user-3',
    name: 'Jane Doe',
    avatarUrl: '',
    role: 'Designer',
    isOnline: false
  },
  {
    id: 'user-4',
    name: 'John Smith',
    avatarUrl: '',
    role: 'Developer',
    isOnline: false
  }
];

// Mock messages
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    content: 'Hi team, I've just uploaded the latest wireframes for the homepage. Please take a look and let me know your thoughts.',
    sender: mockUsers[0],
    timestamp: '2025-04-20T10:30:00Z',
    isRead: true,
    attachments: [
      {
        id: 'attachment-1',
        name: 'homepage-wireframes.fig',
        type: 'image',
        size: '4.2 MB',
        url: '#',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Homepage+Wireframe'
      }
    ]
  },
  {
    id: 'msg-2',
    content: 'These look great! I especially like the new navigation layout. When do you think you'll have the product page wireframes ready?',
    sender: mockUsers[1],
    timestamp: '2025-04-20T11:15:00Z',
    isRead: true
  },
  {
    id: 'msg-3',
    content: 'I should have those ready by tomorrow afternoon. I'm working on the mobile versions today.',
    sender: mockUsers[0],
    timestamp: '2025-04-20T11:20:00Z',
    isRead: true
  },
  {
    id: 'msg-4',
    content: 'I've reviewed the wireframes and added some comments in Figma. Can we discuss the checkout flow in more detail?',
    sender: mockUsers[3],
    timestamp: '2025-04-20T14:45:00Z',
    isRead: true
  },
  {
    id: 'msg-5',
    content: 'Sure, I'm available for a call tomorrow at 10am if that works for everyone.',
    sender: mockUsers[0],
    timestamp: '2025-04-20T15:00:00Z',
    isRead: true
  },
  {
    id: 'msg-6',
    content: 'Works for me. I'll send a calendar invite.',
    sender: mockUsers[1],
    timestamp: '2025-04-20T15:10:00Z',
    isRead: true
  },
  {
    id: 'msg-7',
    content: 'Here are the product page wireframes as promised. I've included both desktop and mobile versions.',
    sender: mockUsers[0],
    timestamp: '2025-04-21T14:30:00Z',
    isRead: false,
    attachments: [
      {
        id: 'attachment-2',
        name: 'product-page-wireframes.fig',
        type: 'image',
        size: '5.8 MB',
        url: '#',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Product+Page+Wireframe'
      }
    ]
  },
  {
    id: 'msg-8',
    content: 'Thanks for sharing these! I'll review them this afternoon.',
    sender: mockUsers[1],
    timestamp: '2025-04-21T14:45:00Z',
    isRead: false,
    replyTo: {
      id: 'msg-7',
      content: 'Here are the product page wireframes as promised. I've included both desktop and mobile versions.',
      sender: mockUsers[0]
    }
  },
  {
    id: 'msg-9',
    content: 'I've added the latest project timeline to our shared folder. Please review the milestones and let me know if you have any concerns.',
    sender: mockUsers[2],
    timestamp: '2025-04-21T16:20:00Z',
    isRead: false,
    attachments: [
      {
        id: 'attachment-3',
        name: 'project-timeline.xlsx',
        type: 'spreadsheet',
        size: '320 KB',
        url: '#'
      }
    ]
  }
];

interface ProjectMessagesProps {
  projectId: string;
  isFreelancer?: boolean;
}

const ProjectMessages = ({ projectId, isFreelancer = false }: ProjectMessagesProps) => {
  // State for messages
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'attachments'>('all');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch messages (mock implementation)
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, we'd filter messages by project
        // For now, we'll just use our mock data
        setMessages(mockMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [projectId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Filter messages
  const filteredMessages = messages.filter(message => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        message.content.toLowerCase().includes(query) ||
        message.sender.name.toLowerCase().includes(query) ||
        message.attachments?.some(attachment => 
          attachment.name.toLowerCase().includes(query)
        ) ||
        false
      );
    }
    
    // Filter by type
    if (filterBy === 'unread') {
      return !message.isRead;
    } else if (filterBy === 'attachments') {
      return !!message.attachments?.length;
    }
    
    return true;
  });
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    
    // Create new message
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      sender: mockUsers[0], // Current user (freelancer)
      timestamp: new Date().toISOString(),
      isRead: false,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content,
        sender: replyingTo.sender
      } : undefined,
      attachments: attachments.length > 0 ? attachments.map(file => ({
        id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' :
              file.type.includes('pdf') || file.type.includes('doc') ? 'document' :
              file.type.includes('sheet') || file.type.includes('excel') ? 'spreadsheet' :
              file.type.includes('zip') || file.type.includes('rar') ? 'archive' :
              'other',
        size: file.size < 1024 
          ? `${file.size} B` 
          : file.size < 1024 * 1024 
            ? `${(file.size / 1024).toFixed(1)} KB` 
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: '#',
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      })) : undefined
    };
    
    // Add message to list
    setMessages(prev => [...prev, newMsg]);
    
    // Clear input
    setNewMessage('');
    setReplyingTo(null);
    setAttachments([]);
  };
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };
  
  // Handle attachment removal
  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle reply
  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };
  
  // Handle cancel reply
  const handleCancelReply = () => {
    setReplyingTo(null);
  };
  
  // Get icon for attachment type
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <Paperclip className="h-4 w-4 text-slate-500" />;
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] border rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium">Project Messages</h3>
          <Badge variant="outline" className="ml-2">
            {messages.filter(m => !m.isRead).length} unread
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select
            value={filterBy}
            onValueChange={(value) => setFilterBy(value as 'all' | 'unread' | 'attachments')}
          >
            <SelectTrigger className="w-[130px] h-9">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="attachments">With Attachments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" />
            <span className="text-lg">Loading messages...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No messages found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 
                `No messages matching "${searchQuery}"` : 
                filterBy === 'unread' ? 
                  'No unread messages' : 
                  filterBy === 'attachments' ? 
                    'No messages with attachments' : 
                    'Start the conversation by sending a message'
              }
            </p>
          </div>
        ) : (
          filteredMessages.map((message, index) => {
            const isCurrentUser = message.sender.id === mockUsers[0].id;
            const showDate = index === 0 || new Date(message.timestamp).toDateString() !== new Date(filteredMessages[index - 1].timestamp).toDateString();
            
            return (
              <div key={message.id}>
                {/* Date separator */}
                {showDate && (
                  <div className="flex items-center justify-center my-6">
                    <Separator className="flex-grow" />
                    <span className="mx-4 text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Separator className="flex-grow" />
                  </div>
                )}
                
                {/* Message */}
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`max-w-[80%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                    {/* Reply reference */}
                    {message.replyTo && (
                      <div className="bg-muted/50 p-2 rounded-t-md border-l-2 border-primary text-sm mb-1 ml-2">
                        <div className="flex items-center">
                          <span className="font-medium text-xs">{message.replyTo.sender.name}</span>
                        </div>
                        <p className="text-muted-foreground line-clamp-1">{message.replyTo.content}</p>
                      </div>
                    )}
                    
                    {/* Message content */}
                    <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {message.sender.avatarUrl ? (
                          <AvatarImage src={message.sender.avatarUrl} alt={message.sender.name} />
                        ) : (
                          <AvatarFallback>{message.sender.name.substring(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div>
                        <div className={`flex items-center ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
                          <span className="font-medium text-sm">{message.sender.name}</span>
                          {message.sender.role && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {message.sender.role}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatTimestamp(message.timestamp)}
                          </span>
                          {isCurrentUser && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="ml-2">
                                    <CheckCheck className={`h-4 w-4 ${message.isRead ? 'text-blue-500' : 'text-muted-foreground'}`} />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{message.isRead ? 'Read' : 'Delivered'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        
                        <div className={`p-3 rounded-md ${
                          isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map(attachment => (
                              <div 
                                key={attachment.id}
                                className={`flex items-center p-2 rounded-md border ${
                                  isCurrentUser ? 'bg-primary/10' : 'bg-muted/80'
                                }`}
                              >
                                {attachment.type === 'image' && attachment.thumbnailUrl ? (
                                  <div className="w-10 h-10 rounded bg-white overflow-hidden mr-3 flex-shrink-0">
                                    <img 
                                      src={attachment.thumbnailUrl} 
                                      alt={attachment.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                                    {getAttachmentIcon(attachment.type)}
                                  </div>
                                )}
                                
                                <div className="flex-grow min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {attachment.size}
                                  </p>
                                </div>
                                
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Message actions */}
                        <div className={`flex items-center mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => handleReply(message)}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {/* End of messages marker for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Composer */}
      <div className="border-t p-4">
        {/* Reply indicator */}
        {replyingTo && (
          <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md mb-2 border-l-2 border-primary">
            <div className="flex-grow">
              <div className="flex items-center">
                <span className="text-xs font-medium">Replying to {replyingTo.sender.name}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{replyingTo.content}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6"
              onClick={handleCancelReply}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Attachment previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="flex items-center p-2 rounded-md border bg-muted/50"
              >
                {file.type.startsWith('image/') ? (
                  <div className="w-8 h-8 rounded bg-white overflow-hidden mr-2">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center mr-2">
                    <FileText className="h-4 w-4" />
                  </div>
                )}
                
                <div className="mr-2">
                  <p className="text-xs font-medium truncate max-w-[100px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file.size < 1024 
                      ? `${file.size} B` 
                      : file.size < 1024 * 1024 
                        ? `${(file.size / 1024).toFixed(1)} KB` 
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Message input */}
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type your message..."
            className="flex-grow min-h-[80px] resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            <Button
              className="rounded-full h-9 w-9"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && attachments.length === 0}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMessages;
