// User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'admin' | 'editor' | 'viewer'; // 用户角色
  avatar?: string; // 可选：用户头像URL
  bio?: string; // 可选：用户简介
  socialLinks?: SocialLinks; // 可选：用户社交媒体链接
  status?: 'active' | 'inactive' | 'banned'; // 可选：用户状态
  lastLogin?: Date; // 可选：最后登录时间
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  [key: string]: string | undefined; // 支持其他社交媒体链接
}

export interface UserBehavior {
  id: string;
  userId: string;
  articleId: string;
  behaviorType: 'view' | 'click' | 'like' | 'comment'; // 行为类型
  timestamp: Date;
}
