namespace backend.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string UserName { get; set; } = string.Empty;
    }
}