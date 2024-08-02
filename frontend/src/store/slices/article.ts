import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ArticleSortOption, NewArticleRequest } from '../../Models/Article';
import {
  createArticle,
  getArticleById,
  getArticles,
} from '../../Services/ArticleService';
import { getAuthorInfoByArticleId } from '../../Services/UserService';

// 定义 slice 的初始状态
export interface ArticleState {
  articles: any[];
  detail: any;
  authorInfo: any;
  loading: boolean;
  error: string | null;
  selectedId?: number | null;
}

const initialState: ArticleState = {
  articles: [],
  detail: null,
  authorInfo: null,
  loading: false,
  error: null,
  selectedId: null,
};

// 创建异步 thunk action
export const createNewArticle: any = createAsyncThunk(
  'articles/createNewArticle',
  async (newArticleRequest: NewArticleRequest, { rejectWithValue }) => {
    try {
      const response = await createArticle(newArticleRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getArticlesThunk: any = createAsyncThunk(
  'articles/getArticles',
  async (params: {
    pageNumber: number;
    pageSize: number;
    sortBy: ArticleSortOption;
    sortOrder: 'asc' | 'desc';
  }) => {
    const response = await getArticles(params);
    console.log('response:', response);
    return response;
  }
);

export const getArticleByIdThunk: any = createAsyncThunk(
  'article/fetchArticleById',
  async (id: number, thunkAPI) => {
    try {
      const response = await getArticleById(id);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAuthorInfoThunk: any = createAsyncThunk(
  'article/fetchAuthorInfo',
  async (authorId: number) => {
    const response = await getAuthorInfoByArticleId(authorId);
    return response;
  }
);

// 创建 slice
const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setSelectedArticleId: (state, action: PayloadAction<number>) => {
      state.selectedId = action.payload;
      localStorage.setItem('selectedArticleId', action.payload.toString());
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles.push(action.payload);
      })
      .addCase(createNewArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getArticlesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArticlesThunk.fulfilled, (state, action) => {
        state.articles = action.payload;
        console.log('state.articles:', state.articles);
        state.loading = false;
      })
      .addCase(getArticlesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch articles';
      });
    builder
      .addCase(getArticleByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArticleByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(getArticleByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getAuthorInfoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuthorInfoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authorInfo = action.payload;
        console.log('state.authorInfo:', state.authorInfo);
      })
      .addCase(getAuthorInfoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 导出 reducer
export const { setSelectedArticleId } = articleSlice.actions;
export default articleSlice;
