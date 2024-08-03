import axios from 'axios';
import API_URL from '../Constants';
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
} from '../Models/Auth';
import axiosInstance from './utils/AxionInstance';
// Login service
const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}authenticate/login`,
    credentials
  );
  return response.data;
};
// Change password service
const changePassword = async (data: ChangePasswordRequest) => {
  const response = await axiosInstance.post(
    `${API_URL}authenticate/change-password`,
    data
  );
  return response.data;
};

const AuthService = {
  login,
  changePassword,
};

export default AuthService;
