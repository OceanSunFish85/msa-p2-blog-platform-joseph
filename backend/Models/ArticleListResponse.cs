namespace backend.Models
{
    public class ArticleListResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string AuthorEmail { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Cover { get; set; } = null!;
        public int? CategoryId { get; set; }
        public ArticleStatus Status { get; set; }
        public int Views { get; set; }
        public int CommentsCount { get; set; }
        public int Likes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}