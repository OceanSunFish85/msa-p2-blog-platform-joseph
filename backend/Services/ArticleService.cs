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
            var articleContent = new ArticleContent
            {
                HtmlContent = newArticleRequest.HtmlContent
            };
            _context.ArticleContents.Add(articleContent);
            await _context.SaveChangesAsync();

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

            return article;
        }

        public async Task<NewArticleRequest> GetArticleByIdAsync(int id)
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

            return new NewArticleRequest
            {
                Title = article.Title,
                AuthorEmail = article.AuthorEmail,
                Summary = article.Summary,
                Cover = article.Cover,
                CategoryId = article.CategoryId,
                HtmlContent = articleContent?.HtmlContent,
                Status = article.Status,
                Media = articleMedia.Select(m => new ArticleMediaDto
                {
                    Type = m.Type,
                    Url = m.Url,
                    AltText = m.AltText
                }).ToList()
            };
        }
    }

}