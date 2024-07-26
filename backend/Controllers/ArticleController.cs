using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticleController : ControllerBase
{
    private readonly ArticleService _articleService;

    public ArticleController(ArticleService articleService)
    {
        _articleService = articleService;
    }

    [HttpPost]
    public async Task<ActionResult<Article>> CreateArticle(NewArticleRequest newArticleRequest)
    {
        var createdArticle = await _articleService.CreateArticleAsync(newArticleRequest);
        return CreatedAtAction(nameof(GetArticleById), new { id = createdArticle.Id }, createdArticle);
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
}