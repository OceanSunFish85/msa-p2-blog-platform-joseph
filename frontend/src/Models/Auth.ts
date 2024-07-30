export interface LoginResponse {
  Username: string;
  Email: string;
  Token: string;
}

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface RegisterRequest {}

export interface RegisterResponse {}

export interface ForgotPasswordRequest {}

export interface ForgotPasswordResponse {}
