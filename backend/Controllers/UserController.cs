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

        public UserController(UserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [Authorize]
        [HttpGet("profile")]
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

            var user = await _userService.GetUserProfileAsync(userEmail);

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

            var success = await _userService.UpdateUserAsync(userEmail, editProfileRequest);

            if (!success)
            {
                return NotFound(new { Message = "User not found" });
            }

            return Ok(new { Message = "User profile updated successfully" });
        }
    }
}
