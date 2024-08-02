using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CommentService
    {
        private readonly BlogWebDbContext _context;
        private readonly ILogger<CommentService> _logger;

        public CommentService(BlogWebDbContext context, ILogger<CommentService> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // 增加评论
        public async Task<Comment> AddCommentAsync(CreateCommentRequest request)
        {
            var comment = new Comment
            {
                Content = request.Content,
                CreatedAt = DateTime.UtcNow,
                AuthorEmail = request.AuthorEmail,
                ArticleId = request.ArticleId,
                Likes = 0,
                Dislikes = 0
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return comment;
        }

        // 获取文章的评论列表
        public async Task<IEnumerable<CommentListResponse>> GetCommentsByArticleIdAsync(int articleId)
        {
            return await _context.Comments
                .Where(c => c.ArticleId == articleId)
                .Join(_context.Users, // 进行联接操作
                    comment => comment.AuthorEmail,
                    user => user.Email,
                    (comment, user) => new CommentListResponse
                    {
                        Id = comment.Id,
                        Content = comment.Content,
                        CreatedAt = comment.CreatedAt,
                        Likes = comment.Likes,
                        Dislikes = comment.Dislikes,
                        AuthorEmail = comment.AuthorEmail,
                        AuthorName = user.UserName, // 从用户表中获取作者的用户名
                        AuthorAvatar = user.Avatar // 从用户表中获取作者的头像
                    })
                .ToListAsync();
        }

        // 喜欢评论
        public async Task<bool> LikeCommentAsync(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null) return false;

            comment.Likes += 1;
            await _context.SaveChangesAsync();
            return true;
        }

        // 不喜欢评论
        public async Task<bool> DislikeCommentAsync(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null) return false;

            comment.Dislikes += 1;
            await _context.SaveChangesAsync();
            return true;
        }
    }

}