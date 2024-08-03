import API_URL from '../Constants';
import { AuthorInfo, EditProfileRequest, UserBasicInfo } from '../Models/User';
import axiosInstance from './utils/AxionInstance';

// Get user basic info
export const getUserBasicInfo = async (): Promise<UserBasicInfo> => {
  const response = await axiosInstance.get<UserBasicInfo>(
    `${API_URL}user/basicinfo`
  );
  return response.data;
};

// Update user profile
export const updateUserProfile = async (
  profileData: EditProfileRequest
): Promise<UserBasicInfo> => {
  const response = await axiosInstance.put(
    `${API_URL}user/profile`,
    profileData
  );
  console.log('Update user response:', response.data);
  return response.data;
};

// Get author info by article id
export const getAuthorInfoByArticleId = async (authorId: number) => {
  const response = await axiosInstance.get<AuthorInfo>(
    `${API_URL}user/author/${authorId}`
  );
  console.log('Author info:', response.data);
  return response.data;
};
