// Article.ts
export interface Article {
  id: string;
  title: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  summary: string;
  tags: string[];
  keywords: string[]; // 新增字段：关键词
  categoryId?: string; // 类别ID
  contentId: string; // Reference to ArticleContent
  mediaIds: string[]; // References to ArticleMedia
  status?: 'draft' | 'published' | 'archived'; // Optional status field
  views: number; // 阅读量
  commentsCount: number; // 评论数
  likes: number; // 新增字段：点赞数
}

export interface ArticleContent {
  id: string;
  htmlContent: string;
}

export interface ArticleMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  altText?: string; // Optional alt text field
  articleId: string; // Reference to the owning Article
  createdAt: Date;
}
