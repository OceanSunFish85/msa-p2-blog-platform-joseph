export interface LoginResponse {
  username: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface ChangePasswordRequest {
  CurrentPassword: string;
  NewPassword: string;
}
