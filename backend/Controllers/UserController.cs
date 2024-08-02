using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // 确保此控制器需要认证
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ILogger<UserController> _logger;
        private readonly ArticleService _articleService;

        public UserController(UserService userService, ILogger<UserController> logger, ArticleService articleService)
        {
            _userService = userService;
            _logger = logger;
            _articleService = articleService;
        }


        [Authorize]
        [HttpGet("basicinfo")]
        public async Task<IActionResult> GetUserProfile()
        {
            // 从 JWT 令牌中获取用户的电子邮件地址
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            _logger.LogInformation("User Email from token: {UserEmail}", userEmail);

            if (userEmail == null)
            {
                _logger.LogWarning("User Email not found in claims");
                return Unauthorized(new { Message = "User is not authorized" });
            }

            var user = await _userService.GetUserBasicInfoAsync(userEmail);

            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            return Ok(user);
        }
        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] EditProfileRequest editProfileRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            _logger.LogInformation("User Email from token: {UserEmail}", userEmail);

            if (userEmail == null)
            {
                _logger.LogWarning("User Email not found in claims");
                return Unauthorized(new { Message = "User is not authorized" });
            }

            var updatedUser = await _userService.UpdateUserAsync(userEmail, editProfileRequest);

            if (updatedUser == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            return Ok(new
            {
                updatedUser
            });
        }
        [HttpGet("author/{articleId}")]
        public async Task<IActionResult> GetAuthorInfoByArticleId(int articleId)
        {
            _logger.LogInformation($"Fetching author info for article ID: {articleId}");

            var authorEmail = await _articleService.GetAuthorEmailByArticleIdAsync(articleId);
            if (authorEmail == null)
            {
                return NotFound(new { Message = "Article or Author not found" });
            }

            var authorInfo = await _userService.GetUserBasicInfoAsync(authorEmail);
            if (authorInfo == null)
            {
                return NotFound(new { Message = "Author not found" });
            }

            return Ok(new
            {
                authorInfo.UserName,
                authorInfo.Avatar,
                authorInfo.Email,
                authorInfo.Bio
            });
        }


    }
}
