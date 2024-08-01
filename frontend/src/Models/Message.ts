export interface MessageRequest {
  type: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface MessageResponse {
  Id: number;
  userEmail: string;
  content: string;
  createdAt: Date;
  userName: string;
}

export interface UserCountMessage {
  type: string;
  count: number;
}
