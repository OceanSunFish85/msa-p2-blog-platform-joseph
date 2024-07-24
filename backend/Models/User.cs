namespace Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Role { get; set; } = null!;
        public string? Avatar { get; set; }
        public string? Bio { get; set; }
        // 导航属性
        public ICollection<SocialLink>? SocialLinks { get; set; }
        public ICollection<UserNotification>? UserNotifications { get; set; }
    }
}