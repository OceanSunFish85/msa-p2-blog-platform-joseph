import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  addComment,
  addDislikeComment,
  addLikeComment,
  getCommentsByArticleId,
} from '../../Services/CommentService';
import { CommentListResponse } from '../../Models/Comments';
import { RootState } from '../store';

// 定义状态接口
export interface CommentState {
  comments: CommentListResponse[];
  loading: boolean;
  error: string | null;
}

// 定义初始状态
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// 创建异步操作：添加评论
export const addCommentThunk: any = createAsyncThunk(
  'comments/addComment',
  async ({ articleId, content }: { articleId: number; content: string }) => {
    const response = await addComment(articleId, content);
    return response;
  }
);

// 创建异步操作：获取文章的评论列表
export const getCommentsByArticleIdThunk: any = createAsyncThunk(
  'comments/getCommentsByArticleId',
  async (articleId: number): Promise<CommentListResponse[]> => {
    const response = await getCommentsByArticleId(articleId);
    return response;
  }
);

export const likeCommentThunk: any = createAsyncThunk(
  'comments/likeComment',
  async (commentId: number) => {
    await addLikeComment(commentId);
    return commentId;
  }
);

export const dislikeCommentThunk: any = createAsyncThunk(
  'comments/dislikeComment',
  async (commentId: number) => {
    await addDislikeComment(commentId);
    return commentId;
  }
);

// 创建 commentSlice
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    likeComment: (state, action: PayloadAction<number>) => {
      const comment = state.comments.find(
        (comment) => comment.id === action.payload
      );
      if (comment) {
        comment.likes += 1;
      }
    },
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
      // 添加评论
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
      // 获取文章的评论列表
      .addCase(getCommentsByArticleIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsByArticleIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.sort(
          (a: CommentListResponse, b: CommentListResponse) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
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
        }
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
      );
  },
});
export const { likeComment, dislikeComment } = commentSlice.actions;

export const selectComments = (state: RootState) => state.comment.comments;

export default commentSlice;
