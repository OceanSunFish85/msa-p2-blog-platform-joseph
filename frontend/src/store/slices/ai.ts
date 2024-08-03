import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { generateSummary } from '../../Services/AIService';

// Define a type for the slice state
export interface AIState {
  summary: string;
  isLoading: boolean;
  error: string | null;
}
// Define the initial state using that type
const initialState: AIState = {
  summary: '',
  isLoading: false,
  error: null,
};
// Define a thunk that dispatches those actions
export const generateSummaryThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('ai/generateSummary', async (articleContent: string, { rejectWithValue }) => {
  try {
    const summary = await generateSummary({ Inputs: articleContent });
    console.log('Summary:', summary);
    return summary;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
// Define the slice using the initial state
const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateSummaryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        generateSummaryThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.summary = action.payload;
        }
      )
      .addCase(
        generateSummaryThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || 'Failed to generate summary';
        }
      );
  },
});

export default aiSlice;
