import { Role } from './enums/Role';
import { UserStatus } from './enums/UserStatus';

// Interface for user login request
export interface UserBasicInfo {
  id?: string;
  userName?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  bio?: string;
  userStatus: UserStatus;
  role?: Role;
}

// Interface for user login request
export interface EditProfileRequest {
  UserName?: string;
  Bio?: string;
  Avatar?: string;
}

// Interface for user login request
export interface AuthorInfo {
  userName: string;
  avatar: string;
  email: string;
  bio: string;
}
