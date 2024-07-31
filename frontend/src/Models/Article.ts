import { ArticleStatus } from './enums/ArticleStatus';
import { MediaType } from './enums/MediaType';

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
