// Comment.ts
export interface Comment {
  id: string;
  articleId: string; // 关联文章ID
  userId: string; // 评论用户ID
  content: string; // 评论内容
  createdAt: Date; // 评论创建时间
  updatedAt: Date; // 评论更新时间
  parentId?: string; // 父评论ID（用于支持评论回复）
}
