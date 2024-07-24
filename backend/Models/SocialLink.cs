namespace Models
{
    public class SocialLink
    {
        public int LinkId { get; set; }
        public int UserId { get; set; } // 关联的用户ID
        public string Platform { get; set; } = null!;// 社交媒体平台名称
        public string Url { get; set; } = null!;// 链接地址
        public DateTime CreatedAt { get; set; } // 创建时间
        public DateTime UpdatedAt { get; set; } // 更新时间

        // 导航属性
        public User User { get; set; } = null!;
    }
}