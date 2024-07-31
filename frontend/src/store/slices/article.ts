import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ArticleSortOption, NewArticleRequest } from '../../Models/Article';
import { createArticle, getArticles } from '../../Services/ArticleService';

// 定义 slice 的初始状态
export interface ArticleState {
  articles: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articles: [],
  loading: false,
  error: null,
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

// 创建 slice
const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
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
  },
});

// 导出 reducer
export default articleSlice;
