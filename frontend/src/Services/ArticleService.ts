import axiosInstance from './utils/AxionInstance';
import API_URL from '../Constants';
import {
  ArticleDetailResponse,
  ArticleListResponse,
  ArticleSortOption,
  NewArticleRequest,
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

interface GetArticlesParams {
  pageNumber: number;
  pageSize: number;
  sortBy: ArticleSortOption;
  sortOrder: 'asc' | 'desc';
}

export const getArticles = async (
  params: GetArticlesParams
): Promise<ArticleListResponse[]> => {
  try {
    const response = await axios.get<ArticleListResponse[]>(
      `${API_URL}article/articles`,
      {
        params: {
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
