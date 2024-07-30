import axios from 'axios';
import API_URL from '../Constants';
import { LoginRequest, LoginResponse } from '../Models/Auth';
import axiosInstance from './utils/AxionInstance';

const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}authenticate/login`,
    credentials
  );
  return response.data;
};

const refreshToken = async (token: string) => {
  const response = await axiosInstance.post(`${API_URL}/refresh-token`, {
    token,
  });
  return response.data;
};

const AuthService = {
  login,
  refreshToken,
};

export default AuthService;
