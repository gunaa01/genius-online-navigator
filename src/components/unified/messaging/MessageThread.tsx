import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Base Message interface
export interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp?: string;
  sender_name?: string;
  sender_avatar?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

// Basic MessageThread props
export interface MessageThreadProps {
  messages: Message[];
  onSend: (content: string) => void;
  sending?: boolean;
}

// StyledMessageThread props
export interface StyledMessageThreadProps extends MessageThreadProps {
  currentUserId: string;
  teamMembers?: { id: string; name: string; avatar?: string }[];
  title?: string;
}

// EnhancedMessageThread props
export interface EnhancedMessageThreadProps {
  messages: Message[];
  onSend: (content: string) => Promise<void>;
  loading?: boolean;
  currentUserId: string;
  channelId: string;
  onMessageRead?: (messageId: string) => void;
}

// Unified props with variant control
export interface UnifiedMessageThreadProps {
  variant?: 'basic' | 'styled' | 'enhanced';
  messages: Message[];
  onSend: ((content: string) => void) | ((content: string) => Promise<void>);
  sending?: boolean;
  loading?: boolean;
  currentUserId?: string;
  teamMembers?: { id: string; name: string; avatar?: string }[];
  title?: string;
  channelId?: string;
  onMessageRead?: (messageId: string) => void;
}

export const UnifiedMessageThread: React.FC<UnifiedMessageThreadProps> = ({
  variant = 'styled',
  messages,
  onSend,
  sending = false,
  loading = false,
  currentUserId = '',
  teamMembers = [],
  title = 'Team Chat',
  channelId = '',
  onMessageRead
}) => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Mark messages as read for enhanced variant
    if (variant === 'enhanced' && onMessageRead) {
      messages
        .filter(msg => msg.sender_id !== currentUserId && msg.status !== 'read')
        .forEach(msg => onMessageRead(msg.id));
    }
  }, [messages, currentUserId, onMessageRead, variant]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || (variant === 'enhanced' && isSending)) return;
    
    if (variant === 'enhanced') {
      setIsSending(true);
      try {
        await (onSend as (content: string) => Promise<void>)(content);
        setContent('');
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsSending(false);
      }
    } else {
      (onSend as (content: string) => void)(content);
      setContent('');
    }
  };

  // Helper functions
  const getTeamMemberName = (senderId: string) => {
    const member = teamMembers.find(m => m.id === senderId);
    return member ? member.name : senderId;
  };

  const getTeamMemberAvatar = (senderId: string) => {
    const member = teamMembers.find(m => m.id === senderId);
    return member?.avatar;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Basic variant (original MessageThread style)
  if (variant === 'basic') {
    return (
      <div className="message-thread">
        <div className="messages">
          {messages.map(msg => (
            <div key={msg.id} className="message">
              <b>{msg.sender_id}:</b> {msg.content}
              {msg.timestamp && <span style={{ fontSize: 10, color: '#888', marginLeft: 8 }}>{msg.timestamp}</span>}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Type a message"
            disabled={sending}
            required
          />
          <button type="submit" disabled={sending || !content.trim()}>Send</button>
        </form>
      </div>
    );
  }

  // Styled variant
  if (variant === 'styled') {
    return (
      <Card className="w-full h-full flex flex-col shadow-md">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[400px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <User className="h-12 w-12 mb-2 opacity-30" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(msg => {
              const isCurrentUser = msg.sender_id === currentUserId;
              const senderName = msg.sender_name || getTeamMemberName(msg.sender_id);
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={msg.sender_avatar || getTeamMemberAvatar(msg.sender_id) || ""} />
                      <AvatarFallback className={isCurrentUser ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}>
                        {getInitials(senderName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={`rounded-lg px-3 py-2 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <div className="text-xs font-medium mb-1">{senderName}</div>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 px-1">
                        {formatMessageTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t p-3">
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <Input
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-grow"
              required
            />
            <Button type="submit" disabled={sending || !content.trim()} size="sm">
              <Send className="h-4 w-4 mr-1" /> Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    );
  }

  // Enhanced variant
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 self-end">
                      <AvatarImage src={msg.sender_avatar} alt={msg.sender_name} />
                      <AvatarFallback>{msg.sender_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    {!isCurrentUser && (
                      <div className="font-semibold text-sm">{msg.sender_name}</div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs opacity-70">
                        {formatTime(msg.timestamp)}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs">
                          {msg.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
                          {msg.status === 'sent' && '✓'}
                          {msg.status === 'delivered' && '✓✓'}
                          {msg.status === 'read' && '✓✓✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            disabled={loading || isSending}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!content.trim() || loading || isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Export named components for backward compatibility
export const MessageThread: React.FC<MessageThreadProps> = (props) => {
  return <UnifiedMessageThread variant="basic" {...props} />;
};

export const StyledMessageThread: React.FC<StyledMessageThreadProps> = (props) => {
  return <UnifiedMessageThread variant="styled" {...props} />;
};

export const EnhancedMessageThread: React.FC<EnhancedMessageThreadProps> = (props) => {
  return <UnifiedMessageThread variant="enhanced" {...props} />;
};

// Default export is the unified component
export default UnifiedMessageThread;