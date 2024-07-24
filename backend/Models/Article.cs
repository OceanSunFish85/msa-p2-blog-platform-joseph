namespace Models
{
    public class Article
    {
        public int ArticleId { get; set; }
        public string Title { get; set; } = null!;
        public int AuthorId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Summary { get; set; }
        public int ContentId { get; set; } // Foreign key for ArticleContent
        public int Views { get; set; }
        public int CommentsCount { get; set; }
        public int Likes { get; set; }

        // CategoryId without foreign key constraint
        public int? CategoryId { get; set; }

        // Navigation properties
        public ArticleContent ArticleContent { get; set; } = null!;
        public ICollection<ArticleMedia>? ArticleMedias { get; set; }
        public ICollection<ArticleTag>? ArticleTags { get; set; }
        public Category? Category { get; set; }
        public ICollection<Comment>? Comments { get; set; } // 添加 Comments 导航属性
    }
}