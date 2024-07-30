import API_URL from '../Constants';
import { UserBasicInfo } from '../Models/User';
import axiosInstance from './utils/AxionInstance';

const getUserBasicInfo = async (): Promise<UserBasicInfo> => {
  const response = await axiosInstance.get<UserBasicInfo>(
    `${API_URL}/basicinfo`
  );
  return response.data;
};

const UserService = {
  getUserBasicInfo,
};

export default UserService;
