// UserNotification.ts
export interface UserNotification {
  id: string;
  userId: string;
  message: string;
  type: 'comment' | 'like' | 'follow' | 'system'; // 不同类型的通知
  createdAt: Date;
  read: boolean; // 是否已读
}
