import axios from 'axios';
import API_URL from '../Constants';
import axiosInstance from './utils/AxionInstance';
import { CommentListResponse } from '../Models/Comments';

// Add comment to article
export const addComment = async (
  articleId: number,
  content: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${API_URL}comment`, {
      articleId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments by article id
export const getCommentsByArticleId = async (
  articleId: number
): Promise<CommentListResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}comment/article/${articleId}`);
    console.log('comment list:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Like comment
export const addLikeComment = async (commentId: number): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}comment/like/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

// Dislike comment
export const addDislikeComment = async (commentId: number): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}comment/dislike/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error disliking comment:', error);
    throw error;
  }
};
