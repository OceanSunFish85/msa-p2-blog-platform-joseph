import { Role } from './enums/Role';
import { UserStatus } from './enums/UserStatus';

export interface UserBasicInfo {
  Id?: string;
  UserName?: string;
  Email?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  Avatar?: string;
  Bio?: string;
  UserStatus: UserStatus;
  Role?: Role;
}
