using backend.Enums;

namespace backend.Models
{
    public class UserBasicInfo
    {
        public string? Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Avatar { get; set; }
        public string? Bio { get; set; }
        public UserStatus UserStatus { get; set; }  // 使用 UserStatus 枚举
        public Role? Role { get; set; }

    }
}