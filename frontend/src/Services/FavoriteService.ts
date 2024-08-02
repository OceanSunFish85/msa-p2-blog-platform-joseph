import API_URL from '../Constants';
import axiosInstance from './utils/AxionInstance';

export const addFavorite = async (articleId: number, userEmail: string) => {
  try {
    const response = await axiosInstance.post(`${API_URL}favorites/add`, null, {
      params: { articleId, userEmail },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (articleId: number, userEmail: string) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}favorites/remove`, {
      params: { articleId, userEmail },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const checkFavorite = async (
  articleId: number,
  userEmail: string
): Promise<boolean> => {
  const response = await axiosInstance.get(`${API_URL}favorites/check`, {
    params: { articleId, userEmail },
  });
  console.log('Check favorite:', response.data.isFavorite);
  return response.data.isFavorite;
};
