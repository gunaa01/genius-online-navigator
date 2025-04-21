import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { apiFetch } from '../../utils/apiFetch';

export interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  content: string;
  timestamp?: string;
}

const Messages: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [error, handleError] = useApiError();

  useEffect(() => {
    apiFetch(`/api/hiring/messages/${applicationId}`)
      .then(async res => {
        if (await handleError(res)) return;
        setMessages(await res.json());
      });
  }, [applicationId, handleError]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch('/api/hiring/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: applicationId, sender_id: 'me', content })
    });
    if (await handleError(res)) return;
    setContent('');
    apiFetch(`/api/hiring/messages/${applicationId}`)
      .then(async res => {
        if (await handleError(res)) return;
        setMessages(await res.json());
      });
  };

  return (
    <div>
      <h2>Application Messages</h2>
      {error && <div className="error">{error}</div>}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}><b>{msg.sender_id}:</b> {msg.content}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="Type a message" required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messages;
