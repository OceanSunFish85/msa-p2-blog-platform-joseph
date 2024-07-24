namespace Models
{
    public class Tag
    {
        public int TagId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // 导航属性
        public ICollection<ArticleTag> ArticleTags { get; set; } = null!;
    }
}