import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ArticleListResponse,
  ArticleSortOption,
  GetArticlesParams,
  NewArticleRequest,
  UpdateArticleRequest,
} from '../../Models/Article';
import {
  createArticle,
  deleteArticle,
  editArticle,
  getArticleById,
  getArticles,
  getUserArticles,
} from '../../Services/ArticleService';
import { getAuthorInfoByArticleId } from '../../Services/UserService';

// 定义 slice 的初始状态
export interface ArticleState {
  articles: any[];
  userArticles: any[];
  detail: any;
  authorInfo: any;
  searchMessage: string | '';
  loading: boolean;
  error: string | null;
  selectedId?: number | null;
}

const initialState: ArticleState = {
  articles: [],
  userArticles: [],
  detail: null,
  authorInfo: null,
  searchMessage: '',
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

export const updateArticleThunk: any = createAsyncThunk(
  'articles/updateArticle',
  async (params: { id: number; data: UpdateArticleRequest }) => {
    const response = await editArticle(params.id, params.data);
    return response;
  }
);

export const getArticlesThunk: any = createAsyncThunk<
  ArticleListResponse[],
  GetArticlesParams
>('articles/getArticles', async (params) => {
  const response = await getArticles(params);
  console.log('response:', response);
  return response;
});

export const getUserArticlesThunk: any = createAsyncThunk<
  ArticleListResponse[],
  GetArticlesParams
>('articles/fetchUserArticles', async (params) => {
  const response = await getUserArticles(params);
  return response;
});

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

export const deleteArticleThunk: any = createAsyncThunk(
  'articles/deleteArticle',
  async (id: number) => {
    await deleteArticle(id);
    return id;
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
    setSearchMessage: (state, action: PayloadAction<string>) => {
      state.searchMessage = action.payload;
      console.log('state.searchMessage:', state.searchMessage);
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
      .addCase(getUserArticlesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserArticlesThunk.fulfilled, (state, action) => {
        state.userArticles = action.payload;
        console.log('state.articles:', state.userArticles);
        state.loading = false;
      })
      .addCase(getUserArticlesThunk.rejected, (state, action) => {
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
    builder
      .addCase(updateArticleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticleThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateArticleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update article';
      });
    builder
      .addCase(deleteArticleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticleThunk.fulfilled, (state, action) => {
        state.loading = false;
        // 你可以在这里更新你的状态来删除文章
        // 例如：state.articles = state.articles.filter(article => article.id !== action.payload);
      })
      .addCase(deleteArticleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete article';
      });
  },
});

// 导出 reducer
export const { setSelectedArticleId, setSearchMessage } = articleSlice.actions;
export default articleSlice;
