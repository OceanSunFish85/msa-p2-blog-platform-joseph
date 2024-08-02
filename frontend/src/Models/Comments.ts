export interface CommentListResponse {
  id: number;
  content: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  authorEmail: string;
  authorName: string;
  authorAvatar: string;
}
