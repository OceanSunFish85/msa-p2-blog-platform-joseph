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
                    // 创建并保存文章内容
                    var articleContent = new ArticleContent
                    {
                        HtmlContent = newArticleRequest.HtmlContent
                    };
                    _context.ArticleContents.Add(articleContent);
                    await _context.SaveChangesAsync();

                    // 创建并保存文章
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

                    // 创建并保存文章媒体
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

                    // 提交事务
                    await transaction.CommitAsync();

                    return article.Id;
                }
                catch (Exception ex)
                {
                    // 回滚事务
                    await transaction.RollbackAsync();
                    // 记录异常
                    // Log.Error(ex, "Error creating article");
                    throw;
                }
            }
        }

        public async Task<ArticleDetailResponse?> GetArticleByIdAsync(int id)
        {
            // 获取文章及其内容
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

        public List<ArticleListResponse> GetArticles(int pageNumber, int pageSize, string sortBy, string sortOrder)
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

    }

}