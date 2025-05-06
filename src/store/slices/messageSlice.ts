import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/MessageThread';

interface MessageState {
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  messages: {},
  loading: false,
  error: null,
};

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadMessagesSuccess: (state, action: PayloadAction<{ threadId: string; messages: Message[] }>) => {
      const { threadId, messages } = action.payload;
      state.messages[threadId] = messages;
      state.loading = false;
    },
    loadMessagesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    sendMessageStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    sendMessageSuccess: (state, action: PayloadAction<{ threadId: string; message: Message }>) => {
      const { threadId, message } = action.payload;
      if (!state.messages[threadId]) {
        state.messages[threadId] = [];
      }
      state.messages[threadId].push(message);
      state.loading = false;
    },
    sendMessageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // For local message sending without API calls
    sendLocalMessage: (state, action: PayloadAction<{ threadId: string; content: string; senderId: string }>) => {
      const { threadId, content, senderId } = action.payload;
      
      if (!state.messages[threadId]) {
        state.messages[threadId] = [];
      }
      
      const newMessage: Message = {
        id: uuidv4(),
        sender_id: senderId,
        content,
        timestamp: new Date().toISOString(),
      };
      
      state.messages[threadId].push(newMessage);
    },
  },
});

export const {
  startLoading,
  loadMessagesSuccess,
  loadMessagesFailure,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  sendLocalMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
