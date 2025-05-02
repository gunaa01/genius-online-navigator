export interface Message {
  id: string;
  content: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  reactions?: Reaction[];
  replyToId?: string;
  threadId?: string;
  isEdited?: boolean;
  isPinned?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'other';
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
  count: number;
}
