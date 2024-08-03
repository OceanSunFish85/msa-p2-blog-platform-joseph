// Purpose: Interface for Message object.
export interface MessageRequest {
  type: string;
  userName: string;
  content: string;
  createdAt: Date;
}

// Purpose: Interface for Message object.
export interface MessageResponse {
  Id: number;
  userEmail: string;
  content: string;
  createdAt: Date;
  userName: string;
}

// Purpose: Interface for UserCountMessage object.
export interface UserCountMessage {
  type: string;
  count: number;
}
