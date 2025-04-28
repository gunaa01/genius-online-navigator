import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeneratedContent } from '../api/content';

interface ContentState {
  contents: GeneratedContent[];
}

const initialState: ContentState = {
  contents: [],
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContents(state, action: PayloadAction<GeneratedContent[]>) {
      state.contents = action.payload;
    },
    addContent(state, action: PayloadAction<GeneratedContent>) {
      state.contents.unshift(action.payload);
    },
  },
});

export const { setContents, addContent } = contentSlice.actions;
export default contentSlice.reducer;
