namespace backend.Models
{
    public class CommentListResponse
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public string AuthorEmail { get; set; } = null!;
        public string AuthorName { get; set; } = null!;
        public string AuthorAvatar { get; set; } = null!;
    }
}