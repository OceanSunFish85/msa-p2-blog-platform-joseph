namespace Models
{
    public class Like
    {
        public int LikeId { get; set; }
        public int UserId { get; set; }
        public int ArticleId { get; set; }
        public DateTime CreatedAt { get; set; }

        // 导航属性
        public User User { get; set; } = null!;
        public Article Article { get; set; } = null!;
    }
}