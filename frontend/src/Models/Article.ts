import { ArticleStatus } from './enums/ArticleStatus';
import { MediaType } from './enums/MediaType';

export interface GetArticlesParams {
  pageNumber: number;
  pageSize: number;
  sortBy: ArticleSortOption;
  sortOrder: 'asc' | 'desc';
  status?: ArticleStatus;
  searchKey?: string;
}

export interface ArticleMedia {
  Id?: number;
  Type: MediaType;
  Url: string;
  AltText?: string;
}

// 新建文章请求数据结构
export interface NewArticleRequest {
  Title: string;
  AuthorEmail: string;
  Summary: string;
  Cover: string;
  CategoryId?: number;
  HtmlContent: string;
  Status: ArticleStatus;
  Media?: ArticleMedia[];
}

export interface UpdateArticleRequest {
  Title: string;
  Summary: string;
  Cover: string;
  CategoryId?: number;
  HtmlContent: string;
  Status: ArticleStatus;
  Media?: ArticleMedia[];
}

export enum ArticleSortOption {
  Comments = 'CommentsCount',
  Views = 'Views',
  Likes = 'Likes',
  Date = 'CreatedAt',
}

export interface ArticleListResponse {
  id: number;
  title: string;
  authorEmail: string;
  summary: string;
  cover: string;
  categoryId: number;
  status: string;
  views: number;
  commentsCount: number;
  likes: number;
  createdAt: string;
}

export interface ArticleDetailResponse {
  id: number;
  title: string;
  authorEmail: string;
  summary: string;
  cover: string;
  categoryId?: number | null;
  status: ArticleStatus;
  views: number;
  commentsCount: number;
  likes: number;
  createdAt: Date;
  htmlContent: string;
  media?: ArticleMedia[] | null;
}

export interface SummarizedRequest {
  Inputs: string;
}

export interface SummarizedResponse {
  summary_text: string;
}
