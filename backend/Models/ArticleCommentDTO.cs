namespace backend.Models
{
    public class ArticleCommentDTO
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public string AuthorEmail { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

    }
}