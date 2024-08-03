using System.Security.Claims;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;
        private readonly ILogger<CommentController> _logger;

        public CommentController(CommentService commentService, ILogger<CommentController> logger)
        {
            _commentService = commentService ?? throw new ArgumentNullException(nameof(commentService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddComment([FromBody] CreateCommentRequest request)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            request.AuthorEmail = userEmail;

            try
            {
                var comment = await _commentService.AddCommentAsync(request);
                return CreatedAtAction(nameof(GetCommentsByArticleId), new { articleId = comment.ArticleId }, comment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding comment");
                return StatusCode(500, new { Message = "An error occurred while adding the comment" });
            }
        }

        [HttpGet("article/{articleId}")]
        public async Task<IActionResult> GetCommentsByArticleId(int articleId)
        {
            try
            {
                var comments = await _commentService.GetCommentsByArticleIdAsync(articleId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting comments for article ID: {ArticleId}", articleId);
                return StatusCode(500, new { Message = "An error occurred while getting the comments" });
            }
        }


        [HttpPost("like/{commentId}")]
        public async Task<IActionResult> LikeComment(int commentId)
        {
            try
            {
                var success = await _commentService.LikeCommentAsync(commentId);
                if (!success)
                {
                    return NotFound(new { Message = "Comment not found" });
                }
                return Ok(new { Message = "Comment liked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error liking comment ID: {CommentId}", commentId);
                return StatusCode(500, new { Message = "An error occurred while liking the comment" });
            }
        }


        [HttpPost("dislike/{commentId}")]
        public async Task<IActionResult> DislikeComment(int commentId)
        {
            try
            {
                var success = await _commentService.DislikeCommentAsync(commentId);
                if (!success)
                {
                    return NotFound(new { Message = "Comment not found" });
                }
                return Ok(new { Message = "Comment disliked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disliking comment ID: {CommentId}", commentId);
                return StatusCode(500, new { Message = "An error occurred while disliking the comment" });
            }
        }
    }

}