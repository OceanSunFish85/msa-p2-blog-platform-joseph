namespace backend.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public int ArticleId { get; set; }
        public string AuthorEmail { get; set; } = null!;

    }
}