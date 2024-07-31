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

        public async Task<Article> CreateArticleAsync(NewArticleRequest newArticleRequest)
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

                    return article;
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

        public async Task<ArticleResponse?> GetArticleByIdAsync(int id)
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

            return new ArticleResponse
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
                Media = articleMedia.Select(m => new ArticleMediaDto
                {
                    Id = m.Id,
                    Type = m.Type,
                    Url = m.Url,
                    AltText = m.AltText
                }).ToList()
            };
        }

    }

}