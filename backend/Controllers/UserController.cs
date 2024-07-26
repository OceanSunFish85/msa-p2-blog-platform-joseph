using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // 确保此控制器需要认证
    public class UserController : ControllerBase
    {
        private readonly BlogWebDbContext _context;
        private readonly ILogger<UserController> _logger;

        public UserController(BlogWebDbContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            _logger.LogInformation("User ID from token: {UserId}", userEmail);

            if (userEmail == null)
            {
                _logger.LogWarning("User ID not found in claims");
                return Unauthorized(new { Message = "User is not authorized" });
            }

            var user = await _context.Users
                .Where(u => u.Email == userEmail)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email
                    // 添加其他字段
                })
                .SingleOrDefaultAsync();

            if (user == null)
            {
                _logger.LogWarning("User not found in database for User ID: {UserId}", userEmail);
                return NotFound(new { Message = "User not found" });
            }

            _logger.LogInformation("User found: {User}", user);
            return Ok(user);
        }
    }
}
