import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  addComment,
  addDislikeComment,
  addLikeComment,
  getCommentsByArticleId,
} from '../../Services/CommentService';
import { CommentListResponse } from '../../Models/Comments';
import { RootState } from '../store';

// define the state type
export interface CommentState {
  comments: CommentListResponse[];
  loading: boolean;
  error: string | null;
}

// define the initial state
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// create async operations: add comment
export const addCommentThunk: any = createAsyncThunk(
  'comments/addComment',
  async ({ articleId, content }: { articleId: number; content: string }) => {
    const response = await addComment(articleId, content);
    return response;
  }
);

// create async operations: get comments by article id
export const getCommentsByArticleIdThunk: any = createAsyncThunk(
  'comments/getCommentsByArticleId',
  async (articleId: number): Promise<CommentListResponse[]> => {
    const response = await getCommentsByArticleId(articleId);
    return response;
  }
);
// create async operations: like comment
export const likeCommentThunk: any = createAsyncThunk(
  'comments/likeComment',
  async (commentId: number) => {
    await addLikeComment(commentId);
    return commentId;
  }
);
// create async operations: dislike comment
export const dislikeCommentThunk: any = createAsyncThunk(
  'comments/dislikeComment',
  async (commentId: number) => {
    await addDislikeComment(commentId);
    return commentId;
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // like comment
    likeComment: (state, action: PayloadAction<number>) => {
      const comment = state.comments.find(
        (comment) => comment.id === action.payload
      );
      if (comment) {
        comment.likes += 1;
      }
    },
    // dislike comment
    dislikeComment: (state, action: PayloadAction<number>) => {
      const comment = state.comments.find(
        (comment) => comment.id === action.payload
      );
      if (comment) {
        comment.dislikes += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(addCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add comment';
      })

      .addCase(getCommentsByArticleIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsByArticleIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.sort(
          (a: CommentListResponse, b: CommentListResponse) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ); // sort comments by createdAt
      })
      .addCase(getCommentsByArticleIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      .addCase(
        likeCommentThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          const comment = state.comments.find(
            (comment) => comment.id === action.payload
          );
          if (comment) {
            comment.likes += 1;
          }
        } // like comment count
      )
      .addCase(
        dislikeCommentThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          const comment = state.comments.find(
            (comment) => comment.id === action.payload
          );
          if (comment) {
            comment.dislikes += 1;
          }
        }
      ); // dislike comment count
  },
});
export const { likeComment, dislikeComment } = commentSlice.actions;

export const selectComments = (state: RootState) => state.comment.comments;

export default commentSlice;
