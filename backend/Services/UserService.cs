using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using Microsoft.Extensions.Logging;
using System.Linq;
using backend.Models;
using backend.Entities;

namespace backend.Services
{
    public class UserService
    {
        private readonly BlogWebDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(BlogWebDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<UserBasicInfo> GetUserBasicInfoAsync(string email)
        {
            _logger.LogInformation("Getting user profile for email: {Email}", email);

            var user = await _context.Users
                .Where(u => u.Email == email)
                .Select(u => new UserBasicInfo
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    Avatar = u.Avatar,
                    Bio = u.Bio,
                    UserStatus = Enum.Parse<UserStatus>(u.UserStatus.ToString()),
                    Role = u.Role,
                })
                .SingleOrDefaultAsync();

            if (user == null)
            {
                _logger.LogWarning("User not found in database for email: {Email}", email);
                return null;
            }

            _logger.LogInformation("User found: {User}", user);
            return user;
        }
        public async Task<UserBasicInfo> UpdateUserAsync(string email, EditProfileRequest editProfileRequest)
        {
            _logger.LogInformation("Updating user profile for email: {Email}", email);

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                _logger.LogWarning("User not found in database for email: {Email}", email);
                return null;
            }

            if (!string.IsNullOrWhiteSpace(editProfileRequest.UserName))
            {
                user.UserName = editProfileRequest.UserName;
            }
            if (!string.IsNullOrWhiteSpace(editProfileRequest.Bio))
            {
                user.Bio = editProfileRequest.Bio;
            }
            if (!string.IsNullOrWhiteSpace(editProfileRequest.Avatar))
            {
                user.Avatar = editProfileRequest.Avatar;
            }

            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User profile updated: {User}", user);

            // 返回 UserBasicInfo 对象
            return new UserBasicInfo
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                Avatar = user.Avatar,
                Bio = user.Bio,
                UserStatus = user.UserStatus,
                Role = user.Role
            };
        }
    }
}
