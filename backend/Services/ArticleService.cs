using System.Linq;
using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ArticleService
    {
        private readonly BlogWebDbContext _context;
        private readonly ILogger<ArticleService> _logger;

        public ArticleService(BlogWebDbContext context, ILogger<ArticleService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<int> CreateArticleAsync(NewArticleRequest newArticleRequest)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // create and save article content
                    var articleContent = new ArticleContent
                    {
                        HtmlContent = newArticleRequest.HtmlContent
                    };
                    _context.ArticleContents.Add(articleContent);
                    await _context.SaveChangesAsync();

                    // create and save article
                    var article = new Article
                    {
                        Title = newArticleRequest.Title,
                        AuthorEmail = newArticleRequest.AuthorEmail,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        Summary = newArticleRequest.Summary,
                        Cover = newArticleRequest.Cover,
                        CategoryId = newArticleRequest.CategoryId,
                        ContentId = articleContent.Id,
                        Status = newArticleRequest.Status,
                        Views = 0,
                        CommentsCount = 0,
                        Likes = 0
                    };
                    _context.Articles.Add(article);
                    await _context.SaveChangesAsync();

                    // create and save article media
                    if (newArticleRequest.Media != null)
                    {
                        foreach (var mediaDto in newArticleRequest.Media)
                        {
                            var articleMedia = new ArticleMedia
                            {
                                Type = mediaDto.Type,
                                Url = mediaDto.Url,
                                AltText = mediaDto.AltText,
                                ArticleId = article.Id,
                                CreatedAt = DateTime.UtcNow
                            };
                            _context.ArticleMedias.Add(articleMedia);
                        }
                        await _context.SaveChangesAsync();
                    }

                    // save changes to the database
                    await transaction.CommitAsync();

                    return article.Id;
                }
                catch (Exception ex)
                {
                    // catch any exception and rollback the transaction
                    await transaction.RollbackAsync();
                    // record the exception
                    // Log.Error(ex, "Error creating article");
                    throw;
                }
            }
        }

        public async Task<bool> EditArticleAsync(int id, EditArticleRequest editArticleRequest)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // get article
                    var article = await _context.Articles.FirstOrDefaultAsync(a => a.Id == id);

                    if (article == null)
                    {
                        return false;
                    }

                    // get article content
                    var articleContent = await _context.ArticleContents.FirstOrDefaultAsync(c => c.Id == article.ContentId);
                    if (articleContent == null)
                    {
                        return false;
                    }

                    // update article content
                    if (!string.IsNullOrEmpty(editArticleRequest.HtmlContent))
                    {
                        articleContent.HtmlContent = editArticleRequest.HtmlContent;
                        _context.ArticleContents.Update(articleContent);
                    }

                    // update article
                    if (!string.IsNullOrEmpty(editArticleRequest.Title))
                    {
                        article.Title = editArticleRequest.Title;
                    }
                    if (!string.IsNullOrEmpty(editArticleRequest.Summary))
                    {
                        article.Summary = editArticleRequest.Summary;
                    }
                    if (!string.IsNullOrEmpty(editArticleRequest.Cover))
                    {
                        article.Cover = editArticleRequest.Cover;
                    }
                    if (editArticleRequest.CategoryId != null)
                    {
                        article.CategoryId = editArticleRequest.CategoryId.Value;
                    }
                    if (editArticleRequest.Status != null)
                    {
                        article.Status = editArticleRequest.Status;
                    }
                    article.UpdatedAt = DateTime.UtcNow;

                    _context.Articles.Update(article);
                    await _context.SaveChangesAsync();

                    // save changes to the database
                    await transaction.CommitAsync();

                    return true;
                }
                catch (Exception ex)
                {
                    // catch any exception and rollback the transaction
                    await transaction.RollbackAsync();
                    // record the exception
                    _logger.LogError(ex, "Error editing article");
                    throw;
                }
            }
        }

        public async Task<bool> DeleteArticleAsync(int articleId, string userEmail)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // get article
                    var article = await _context.Articles
                        .FirstOrDefaultAsync(a => a.Id == articleId && a.AuthorEmail == userEmail);

                    if (article == null)
                    {
                        return false;
                    }

                    // delete article content
                    var content = await _context.ArticleContents.FindAsync(article.ContentId);
                    if (content != null)
                    {
                        _context.ArticleContents.Remove(content);
                    }

                    // delete article media
                    var mediaList = await _context.ArticleMedias
                        .Where(m => m.ArticleId == articleId)
                        .ToListAsync();
                    if (mediaList.Any())
                    {
                        _context.ArticleMedias.RemoveRange(mediaList);
                    }

                    // delete article
                    _context.Articles.Remove(article);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return true;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error deleting article");
                    throw;
                }
            }
        }





        public async Task<ArticleDetailResponse?> GetArticleByIdAsync(int id)
        {
            // get article by id
            var article = await _context.Articles
                .SingleOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                return null;
            }

            var articleContent = await _context.ArticleContents
                .SingleOrDefaultAsync(c => c.Id == article.ContentId);

            var articleMedia = await _context.ArticleMedias
                .Where(m => m.ArticleId == id)
                .ToListAsync();

            return new ArticleDetailResponse
            {
                Id = article.Id,
                Title = article.Title,
                AuthorEmail = article.AuthorEmail,
                Summary = article.Summary,
                Cover = article.Cover,
                CategoryId = article.CategoryId,
                HtmlContent = articleContent?.HtmlContent,
                Status = article.Status,
                Views = article.Views,
                CommentsCount = article.CommentsCount,
                Likes = article.Likes,
                CreatedAt = article.CreatedAt,
                Media = articleMedia.Select(m => new ArticleMediaDto
                {
                    Id = m.Id,
                    Type = m.Type,
                    Url = m.Url,
                    AltText = m.AltText
                }).ToList()
            };
        }



        public List<ArticleListResponse> GetArticles(int pageNumber, int pageSize, string sortBy, string sortOrder, string searchKey)
        {
            var validSortOptions = new List<string> { ArticleSortOption.Comments, ArticleSortOption.Views, ArticleSortOption.Likes, ArticleSortOption.Date };
            if (!validSortOptions.Contains(sortBy))
            {
                throw new ArgumentException("Invalid sortBy option.");
            }

            if (sortOrder.ToLower() != "asc" && sortOrder.ToLower() != "desc")
            {
                throw new ArgumentException("Invalid sortOrder option.");
            }

            var query = from article in _context.Articles
                        join content in _context.ArticleContents
                        on article.ContentId equals content.Id
                        where article.Status == ArticleStatus.Published // Add filter for Published status
                        select new { article, content.HtmlContent };

            if (!string.IsNullOrEmpty(searchKey))
            {
                query = query.Where(a => a.article.Title.Contains(searchKey) || a.article.Summary.Contains(searchKey));
            }
            // Apply sorting
            switch (sortBy)
            {
                case ArticleSortOption.Comments:
                    query = sortOrder.ToLower() == "asc" ? query.OrderBy(a => a.article.CommentsCount) : query.OrderByDescending(a => a.article.CommentsCount);
                    break;
                case ArticleSortOption.Views:
                    query = sortOrder.ToLower() == "asc" ? query.OrderBy(a => a.article.Views) : query.OrderByDescending(a => a.article.Views);
                    break;
                case ArticleSortOption.Likes:
                    query = sortOrder.ToLower() == "asc" ? query.OrderBy(a => a.article.Likes) : query.OrderByDescending(a => a.article.Likes);
                    break;
                case ArticleSortOption.Date:
                default:
                    query = sortOrder.ToLower() == "asc" ? query.OrderBy(a => a.article.CreatedAt) : query.OrderByDescending(a => a.article.CreatedAt);
                    break;
            }

            // Apply pagination
            var pagedArticles = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new ArticleListResponse
                {
                    Id = a.article.Id,
                    Title = a.article.Title,
                    AuthorEmail = a.article.AuthorEmail,
                    Summary = a.article.Summary,
                    Cover = a.article.Cover,
                    CategoryId = a.article.CategoryId,
                    Status = a.article.Status,
                    Views = a.article.Views,
                    CommentsCount = a.article.CommentsCount,
                    Likes = a.article.Likes,
                    CreatedAt = a.article.CreatedAt
                })
                .ToList();

            return pagedArticles;
        }

        public async Task<string?> GetAuthorEmailByArticleIdAsync(int articleId)
        {
            _logger.LogInformation($"Fetching article with ID: {articleId}");

            var articleEmail = await _context.Articles
                .Where(a => a.Id == articleId)
                .Select(a => a.AuthorEmail)
                .SingleOrDefaultAsync();

            if (articleEmail == null)
            {
                _logger.LogWarning($"Article with ID {articleId} not found");
                return null;
            }

            _logger.LogInformation($"Author email for article ID {articleId}: {articleEmail}");
            return articleEmail;
        }

        public async Task IncrementViewsAsync(int articleId)
        {
            var article = await _context.Articles.SingleOrDefaultAsync(a => a.Id == articleId);

            if (article == null)
            {
                _logger.LogWarning($"Article with ID {articleId} not found");
                throw new Exception("Article not found");
            }

            article.Views += 1;

            // Save changes to the database
            await _context.SaveChangesAsync();
        }

        public async Task HandleFavoritCount(int articleId, int action)
        {
            var article = await _context.Articles.SingleOrDefaultAsync(a => a.Id == articleId);

            if (article == null)
            {
                _logger.LogWarning($"Article with ID {articleId} not found");
                throw new Exception("Article not found");
            }

            if (action == 1) // Add favorite
            {
                article.Likes += 1;
            }
            else if (action == 0) // Remove favorite
            {
                article.Likes = Math.Max(0, article.Likes - 1);
            }
            else
            {
                throw new ArgumentException("Invalid action");
            }

            await _context.SaveChangesAsync();
        }


        public async Task IncrementCommentsCountAsync(int articleId)
        {
            var article = await _context.Articles.SingleOrDefaultAsync(a => a.Id == articleId);

            if (article == null)
            {
                _logger.LogWarning($"Article with ID {articleId} not found");
                throw new Exception("Article not found");
            }

            article.CommentsCount += 1;

            _context.Articles.Update(article);
            await _context.SaveChangesAsync();
        }

        public List<ArticleListResponse> GetUserArticles(
            string userEmail,
            ArticleStatus status,
            string searchKey,
            int pageNumber,
            int pageSize,
            string sortBy,
            string sortOrder)
        {
            var validSortOptions = new List<string> { ArticleSortOption.Comments, ArticleSortOption.Views, ArticleSortOption.Likes, ArticleSortOption.Date };
            if (!validSortOptions.Contains(sortBy))
            {
                throw new ArgumentException("Invalid sortBy option.");
            }

            if (sortOrder.ToLower() != "asc" && sortOrder.ToLower() != "desc")
            {
                throw new ArgumentException("Invalid sortOrder option.");
            }

            var query = from article in _context.Articles
                        join content in _context.ArticleContents
                        on article.ContentId equals content.Id
                        where article.AuthorEmail == userEmail && article.Status == status
                        select new { article, content.HtmlContent };

            if (!string.IsNullOrEmpty(searchKey))
            {
                query = query.Where(a => a.article.Title.Contains(searchKey) || a.article.Summary.Contains(searchKey));
            }

            // Apply sorting
            switch (sortBy)
            {
                case ArticleSortOption.Comments:
                    query = sortOrder.ToLower() == "asc" ? query.OrderBy(a => a.article.CommentsCount) : query.OrderByDescending(a => a.article.CommentsCount);
                    break;
                case ArticleSortOption.Views:
                    query = sortOrder.ToLower() == "asc" ? query.OrderBy(a => a.article.Views) : query.OrderByDescending(a => a.article.Views);
                    break;
                case ArticleSortOption.Likes:
                    query = sortOrder.ToLower() == "asc" ? query.OrderBy(a => a.article.Likes) : query.OrderByDescending(a => a.article.Likes);
                    break;
                case ArticleSortOption.Date:
                default:
                    query = sortOrder.ToLower() == "asc" ? query.OrderBy(a => a.article.CreatedAt) : query.OrderByDescending(a => a.article.CreatedAt);
                    break;
            }

            // Apply pagination
            var pagedArticles = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new ArticleListResponse
                {
                    Id = a.article.Id,
                    Title = a.article.Title,
                    AuthorEmail = a.article.AuthorEmail,
                    Summary = a.article.Summary,
                    Cover = a.article.Cover,
                    CategoryId = a.article.CategoryId,
                    Status = a.article.Status,
                    Views = a.article.Views,
                    CommentsCount = a.article.CommentsCount,
                    Likes = a.article.Likes,
                    CreatedAt = a.article.CreatedAt
                })
                .ToList();

            return pagedArticles;
        }

        public List<ArticleListResponse> GetTopArticles(int topCount)
        {
            return _context.Articles
                           .Where(a => !string.IsNullOrEmpty(a.Summary) && !string.IsNullOrEmpty(a.Cover))
                           .OrderByDescending(a => a.Views)
                           .Take(topCount)
                           .Select(a => new ArticleListResponse
                           {
                               Id = a.Id,
                               Title = a.Title,
                               AuthorEmail = a.AuthorEmail,
                               Summary = a.Summary,
                               Cover = a.Cover,
                               CategoryId = a.CategoryId,
                               Status = a.Status,
                               Views = a.Views,
                               CommentsCount = a.CommentsCount,
                               Likes = a.Likes,
                               CreatedAt = a.CreatedAt
                           })
                           .ToList();
        }
    }

}