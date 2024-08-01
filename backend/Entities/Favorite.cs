namespace backend.Entities
{
    public class Favorite
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public string UserEmail { get; set; } = null!;
    }
}