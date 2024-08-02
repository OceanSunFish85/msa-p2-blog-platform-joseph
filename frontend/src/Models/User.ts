import { Role } from './enums/Role';
import { UserStatus } from './enums/UserStatus';

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

export interface EditProfileRequest {
  UserName?: string;
  Bio?: string;
  Avatar?: string;
}

export interface AuthorInfo {
  userName: string;
  avatar: string;
  email: string;
  bio: string;
}
