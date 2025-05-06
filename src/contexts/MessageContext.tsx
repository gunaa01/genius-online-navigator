import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Message } from '@/components/EnhancedMessageThread';

interface MessageContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  markAsRead: (messageId: string) => void;
  loading: boolean;
  error: Error | null;
  currentChannel: string | null;
  setCurrentChannel: (channelId: string | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user?.id || !currentChannel) return;

    // In a real app, you would connect to your WebSocket server
    // const ws = new WebSocket(`wss://your-api.com/ws?channel=${currentChannel}&userId=${user.id}`);
    
    // Mock WebSocket for demonstration
    const ws = {
      send: (data: string) => {
        console.log('WebSocket send:', data);
        // Simulate message delivery
        const message = JSON.parse(data);
        if (message.type === 'message') {
          const newMessage: Message = {
            id: `mock-${Date.now()}`,
            sender_id: user.id,
            sender_name: user.name || 'You',
            content: message.content,
            timestamp: new Date().toISOString(),
            status: 'sent'
          };
          setMessages(prev => [...prev, newMessage]);
        }
      },
      close: () => {}
    } as unknown as WebSocket;

    setSocket(ws);

    // Load initial messages
    const loadMessages = async () => {
      try {
        setLoading(true);
        // In a real app, fetch messages from your API
        // const response = await fetch(`/api/messages?channel=${currentChannel}`);
        // const data = await response.json();
        // setMessages(data.messages);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    return () => {
      ws.close();
    };
  }, [currentChannel, user?.id]);

  const sendMessage = useCallback(async (content: string) => {
    if (!socket || !currentChannel || !user?.id) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      sender_id: user.id,
      sender_name: user.name || 'You',
      content,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // In a real app, send via WebSocket
      // socket.send(JSON.stringify({
      //   type: 'message',
      //   channelId: currentChannel,
      //   content,
      //   userId: user.id
      // }));
      
      // Simulate server response
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? { ...msg, id: `msg-${Date.now()}`, status: 'sent' as const }
              : msg
          )
        );
      }, 500);
    } catch (err) {
      setError(err as Error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, status: 'failed' as const }
            : msg
        )
      );
    }
  }, [socket, currentChannel, user?.id]);

  const markAsRead = useCallback((messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId && msg.status !== 'read'
          ? { ...msg, status: 'read' as const }
          : msg
      )
    );
    
    // In a real app, notify the server that the message was read
    // fetch(`/api/messages/${messageId}/read`, { method: 'POST' });
  }, []);

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendMessage,
        markAsRead,
        loading,
        error,
        currentChannel,
        setCurrentChannel,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
