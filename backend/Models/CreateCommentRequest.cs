namespace backend.Models
{
    public class CreateCommentRequest
    {
        public string Content { get; set; } = null!;
        public string? AuthorEmail { get; set; } = null!;
        public int ArticleId { get; set; }
    }
}