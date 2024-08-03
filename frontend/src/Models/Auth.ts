import { Role } from './enums/Role';
import { UserStatus } from './enums/UserStatus';

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
// Objective: Define the interfaces for the authentication module.
export interface RegistrationRequest {
  email: string;
  username: string;
  password: string;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
  userStatus?: UserStatus;
}
