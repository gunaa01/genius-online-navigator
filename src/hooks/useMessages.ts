import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/message';

interface UseMessagesProps {
  projectId?: string;
  initialMessages?: Message[];
}

export const useMessages = ({ projectId, initialMessages = [] }: UseMessagesProps = {}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const limit = 20;

  const fetchMessages = useCallback(async (reset = false) => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      // TODO: Replace with actual API call
      const response = await fetch(
        `/api/messages?projectId=${projectId}&page=${currentPage}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      
      if (reset || currentPage === 1) {
        setMessages(data.messages);
      } else {
        setMessages(prev => [...prev, ...data.messages]);
      }
      
      setHasMore(data.hasMore);
      if (!reset && data.messages.length > 0) {
        setPage(prev => prev + 1);
      } else if (reset) {
        setPage(2);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId, page]);

  const sendMessage = useCallback(async (content: string, attachments: File[] = []) => {
    if (!projectId) return null;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('projectId', projectId);
      
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/messages', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await response.json();
      setMessages(prev => [newMessage, ...prev]);
      return newMessage;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      return true;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMessages();
    }
  }, [fetchMessages, hasMore, loading]);

  useEffect(() => {
    if (projectId) {
      fetchMessages(true);
    }
  }, [projectId]);

  return {
    messages,
    loading,
    error,
    hasMore,
    sendMessage,
    deleteMessage,
    loadMore,
    refresh: () => fetchMessages(true),
  };
};

export default useMessages;
