
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, PaperclipIcon, Smile } from 'lucide-react';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ProjectMessagesProps {
  projectId: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: {
      id: 'client1',
      name: 'John Smith',
      avatar: '/assets/avatars/client1.jpg'
    },
    content: 'Hi team, I was wondering if we could discuss the timeline for the next phase?',
    timestamp: new Date(2023, 9, 15, 9, 30),
    isRead: true
  },
  {
    id: '2',
    sender: {
      id: 'user',
      name: 'You',
      avatar: '/assets/avatars/user.jpg'
    },
    content: 'Sure, John! We can schedule a call for tomorrow at 2pm if that works for you?',
    timestamp: new Date(2023, 9, 15, 10, 45),
    isRead: true
  },
  {
    id: '3',
    sender: {
      id: 'client1',
      name: 'John Smith',
      avatar: '/assets/avatars/client1.jpg'
    },
    content: 'That would be perfect. Could you also send me the latest designs before the call?',
    timestamp: new Date(2023, 9, 15, 11, 15),
    isRead: true
  },
  {
    id: '4',
    sender: {
      id: 'user',
      name: 'You',
      avatar: '/assets/avatars/user.jpg'
    },
    content: 'Will do! I\'ll have them ready for you by the end of today.',
    timestamp: new Date(2023, 9, 15, 11, 20),
    isRead: true
  }
];

const ProjectMessages: React.FC<ProjectMessagesProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: {
          id: 'user',
          name: 'You',
          avatar: '/assets/avatars/user.jpg'
        },
        content: newMessage.trim(),
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-muted p-3">
        <h3 className="text-lg font-medium">Project Messages</h3>
        <p className="text-sm text-muted-foreground">4 participants</p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender.id === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.sender.id === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[80%]`}>
                <Avatar className="h-8 w-8">
                  {message.sender.avatar ? (
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                  ) : (
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <Card className={`p-3 ${message.sender.id === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                    <p>{message.content}</p>
                  </Card>
                  <div className={`text-xs text-muted-foreground mt-1 ${message.sender.id === 'user' ? 'text-right' : ''}`}>
                    {message.sender.id !== 'user' && <span className="font-medium mr-1">{message.sender.name}</span>}
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-3">
        <form onSubmit={handleSubmitMessage} className="flex gap-2">
          <Button 
            type="button"
            size="icon"
            variant="ghost"
            className="shrink-0"
          >
            <PaperclipIcon className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button 
            type="button"
            size="icon"
            variant="ghost"
            className="shrink-0"
          >
            <Smile className="h-5 w-5" />
            <span className="sr-only">Add emoji</span>
          </Button>
          <Button type="submit" size="icon" className="shrink-0">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProjectMessages;
