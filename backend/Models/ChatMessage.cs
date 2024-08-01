namespace backend.Models
{
    public class ChatMessage
    {
        public string? Type { get; set; }
        public string? Content { get; set; }
        public string? UserName { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}