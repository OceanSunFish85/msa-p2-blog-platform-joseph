import { ArticleSortOption } from './enums/ArticlesSortOption';
import { ArticleStatus } from './enums/ArticleStatus';
import { MediaType } from './enums/MediaType';

// Interface for get articles params
export interface GetArticlesParams {
  pageNumber: number;
  pageSize: number;
  sortBy: ArticleSortOption;
  sortOrder: 'asc' | 'desc';
  status?: ArticleStatus;
  searchKey?: string;
}

// Interface for article media
export interface ArticleMedia {
  Id?: number;
  Type: MediaType;
  Url: string;
  AltText?: string;
}

// Interface for new article request
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

// Interface for update article request
export interface UpdateArticleRequest {
  Title: string;
  Summary: string;
  Cover: string;
  CategoryId?: number;
  HtmlContent: string;
  Status: ArticleStatus;
  Media?: ArticleMedia[];
}

// Interface for article list response
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

// Interface for article detail response
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

// Interface for summarized request
export interface SummarizedRequest {
  Inputs: string;
}

// Interface for summarized response
export interface SummarizedResponse {
  summary_text: string;
}
