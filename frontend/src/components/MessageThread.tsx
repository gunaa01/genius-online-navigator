import React from 'react';

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp?: string;
}

interface MessageThreadProps {
  messages: Message[];
  onSend: (content: string) => void;
  sending?: boolean;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, onSend, sending }) => {
  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

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
};

export default MessageThread;
