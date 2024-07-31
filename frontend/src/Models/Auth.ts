export interface LoginResponse {
  username: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface RegisterRequest {}

export interface RegisterResponse {}

export interface ForgotPasswordRequest {}

export interface ForgotPasswordResponse {}
