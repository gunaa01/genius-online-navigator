import React, { useRef, useEffect } from 'react';
import { Message } from './MessageThread';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StyledMessageThreadProps {
  messages: Message[];
  onSend: (content: string) => void;
  sending?: boolean;
  currentUserId: string;
  teamMembers?: { id: string; name: string; avatar?: string }[];
  title?: string;
}

const StyledMessageThread: React.FC<StyledMessageThreadProps> = ({ 
  messages, 
  onSend, 
  sending = false, 
  currentUserId,
  teamMembers = [],
  title = "Team Chat"
}) => {
  const [content, setContent] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

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
            const senderName = getTeamMemberName(msg.sender_id);
            
            return (
              <div 
                key={msg.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={getTeamMemberAvatar(msg.sender_id) || ""} />
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
};

export default StyledMessageThread;
