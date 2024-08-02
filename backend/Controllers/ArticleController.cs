using System.Security.Claims;
using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; // Add this line

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticleController : ControllerBase
{
    private readonly ArticleService _articleService;
    private readonly ILogger<ArticleController> _logger; // Add this line

    public ArticleController(ArticleService articleService, ILogger<ArticleController> logger) // Add ILogger<ArticleController> logger parameter
    {
        _articleService = articleService;
        _logger = logger; // Assign the logger parameter to the _logger field
    }

    [Authorize]
    [HttpPost("new-article")]
    public async Task<ActionResult<int>> CreateArticle(NewArticleRequest newArticleRequest)
    {
        // 从 JWT 令牌中获取用户的电子邮件地址
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        _logger.LogInformation("User Email from token: {UserEmail}", userEmail);
        if (userEmail != null)
        {
            newArticleRequest.AuthorEmail = userEmail;
        }
        var createdArticleId = await _articleService.CreateArticleAsync(newArticleRequest);
        return CreatedAtAction(nameof(GetArticleById), new { id = createdArticleId }, createdArticleId);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Article>> GetArticleById(int id)
    {
        var article = await _articleService.GetArticleByIdAsync(id);
        if (article == null)
        {
            return NotFound();
        }

        return Ok(article);
    }

    [HttpGet("articles")]
    public IActionResult GetArticles(
    int pageNumber = 1,
    int pageSize = 10,
    string sortBy = ArticleSortOption.Date,
    string sortOrder = "desc")
    {
        var articles = _articleService.GetArticles(pageNumber, pageSize, sortBy, sortOrder);
        return Ok(articles);
    }

    [HttpPost("increment-views/{articleId}")]
    public async Task<IActionResult> IncrementViews(int articleId)
    {
        try
        {
            await _articleService.IncrementViewsAsync(articleId);
            return Ok(new { Message = "Views incremented successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing views for article ID: {ArticleId}", articleId);
            return StatusCode(500, new { Message = "An error occurred while incrementing views" });
        }
    }

    [HttpPost("favorite/{articleId}")]
    [Authorize]
    public async Task<IActionResult> HandleFavorite(int articleId, [FromBody] int action)
    {
        try
        {
            await _articleService.HandleFavoritCount(articleId, action);

            return Ok(new { Message = action == 1 ? "Article favorited successfully" : "Article unfavorited successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling favorite action for article ID: {ArticleId}", articleId);
            return StatusCode(500, new { Message = "An error occurred while handling favorite action" });
        }
    }

    [HttpPost("increment-comments/{articleId}")]
    public async Task<IActionResult> IncrementCommentsCount(int articleId)
    {
        try
        {
            await _articleService.IncrementCommentsCountAsync(articleId);
            return Ok(new { Message = "Comments count incremented successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing comments count for article ID: {ArticleId}", articleId);
            return StatusCode(500, new { Message = "An error occurred while incrementing the comments count" });
        }
    }
    [HttpGet("user-articles")]
    [Authorize]
    public IActionResult GetUserArticles(
        ArticleStatus status,
        string searchKey = null,
        int pageNumber = 1,
        int pageSize = 10,
        string sortBy = ArticleSortOption.Date,
        string sortOrder = "desc")
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        var articles = _articleService.GetUserArticles(userEmail, status, searchKey, pageNumber, pageSize, sortBy, sortOrder);
        return Ok(articles);
    }
}