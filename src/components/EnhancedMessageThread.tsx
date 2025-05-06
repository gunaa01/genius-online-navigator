import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';

export interface Message {
  id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

interface EnhancedMessageThreadProps {
  messages: Message[];
  onSend: (content: string) => Promise<void>;
  loading?: boolean;
  currentUserId: string;
  channelId: string;
  onMessageRead?: (messageId: string) => void;
}

const EnhancedMessageThread: React.FC<EnhancedMessageThreadProps> = ({
  messages,
  onSend,
  loading = false,
  currentUserId,
  channelId,
  onMessageRead,
}) => {
  const [content, setContent] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Mark messages as read when component mounts or updates
    messages
      .filter(msg => msg.sender_id !== currentUserId && msg.status !== 'read')
      .forEach(msg => onMessageRead?.(msg.id));
  }, [messages, currentUserId, onMessageRead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await onSend(content);
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

export default EnhancedMessageThread;
