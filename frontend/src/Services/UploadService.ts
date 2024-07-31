import axios from 'axios';
import axiosInstance from './utils/AxionInstance';
import API_URL from '../Constants';

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/upload/avatar', formData);
  return response.data.url;
};

export const uploadCover = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosInstance.post(
      `${API_URL}upload/cover`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Upload response:', response.data);

    return response.data.url;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.message || 'Upload failed');
  }
};

export const uploadArticleMedia = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  try {
    const response = await axios.post(
      `${API_URL}upload/articlemedia`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Upload response:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.message || 'Upload failed');
  }
};
