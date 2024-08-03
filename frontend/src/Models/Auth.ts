// Objective: Define the interfaces for the authentication module.
export interface LoginResponse {
  username: string;
  email: string;
  token: string;
}

// Objective: Define the interfaces for the authentication module.
export interface LoginRequest {
  Email: string;
  Password: string;
}

// Objective: Define the interfaces for the authentication module.
export interface ChangePasswordRequest {
  CurrentPassword: string;
  NewPassword: string;
}
