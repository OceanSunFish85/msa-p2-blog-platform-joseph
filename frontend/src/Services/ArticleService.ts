import axiosInstance from './utils/AxionInstance';
import API_URL from '../Constants';
import {
  ArticleDetailResponse,
  ArticleListResponse,
  ArticleSortOption,
  GetArticlesParams,
  NewArticleRequest,
  UpdateArticleRequest,
} from '../Models/Article';
import axios from 'axios';

export const createArticle = async (newArticleRequest: NewArticleRequest) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}article/new-article`,
      newArticleRequest
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error creating article:',
        error.response?.data || error.message
      );
    } else {
      console.error('Unexpected error creating article:', error);
    }
    throw error;
  }
};
// 编辑文章的服务
export const editArticle = async (
  id: number,
  editArticleRequest: UpdateArticleRequest
) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}article/edit-article/${id}`,
      editArticleRequest
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error editing article:',
        error.response?.data || error.message
      );
    } else {
      console.error('Unexpected error editing article:', error);
    }
    throw error;
  }
};

export const deleteArticle = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_URL}article/delete-article/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error deleting article:',
        error.response?.data || error.message
      );
    } else {
      console.error('Unexpected error deleting article:', error);
    }
    throw error;
  }
};

export const getArticles = async (
  params: GetArticlesParams
): Promise<ArticleListResponse[]> => {
  try {
    const response = await axios.get<ArticleListResponse[]>(
      `${API_URL}article/articles`,
      {
        params: {
          searchKey: params.searchKey,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const getUserArticles = async (
  params: GetArticlesParams
): Promise<ArticleListResponse[]> => {
  try {
    const response = await axiosInstance.get<ArticleListResponse[]>(
      `${API_URL}article/user-articles`,
      {
        params: {
          searchKey: params.searchKey,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          status: params.status,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user articles:', error);
    throw error;
  }
};

export const getArticleById = async (
  id: number
): Promise<ArticleDetailResponse> => {
  try {
    const response = await axios.get<ArticleDetailResponse>(
      `${API_URL}article/${id}`
    );
    console.log('response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching article detail:', error);
    throw error;
  }
};

export const incrementArticleViewCount = async (articleId: number) => {
  try {
    const response = await axios.post(
      `${API_URL}article/increment-views/${articleId}`
    );
    console.log('Increment view count response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error incrementing article view count:', error);
    throw error;
  }
};

export const handleArticleLikeCount = async (id: number, action: number) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}favorite//${id}`,
      action
    );
    return response.data;
  } catch (error) {
    console.error('Error liking article:', error);
    throw error;
  }
};

export const incrementCommentsCount = async (articleId: number) => {
  const response = await axios.post(
    `${API_URL}article/increment-comments/${articleId}`
  );
  return response.data;
};

export const getTopArticles = async () => {
  try {
    const response = await axiosInstance.get<ArticleListResponse[]>(
      `${API_URL}article/top-articles`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching top articles:', error);
    throw error;
  }
};
