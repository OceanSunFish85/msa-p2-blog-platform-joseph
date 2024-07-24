namespace Models
{
    public class ArticleTag
    {
        public int ArticleTagId { get; set; }
        public int ArticleId { get; set; } // Foreign key referencing Article
        public int TagId { get; set; } // Foreign key referencing Tag

        // Navigation properties
        public Article Article { get; set; } = null!;
        public Tag Tag { get; set; } = null!;
    }
}