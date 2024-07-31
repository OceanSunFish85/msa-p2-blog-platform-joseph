namespace backend.Models
{
    public class NewArticleRequest
    {
        public string Title { get; set; } = null!;
        public string? AuthorEmail { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Cover { get; set; } = null!;
        public int? CategoryId { get; set; }
        public string HtmlContent { get; set; } = null!;
        public ArticleStatus Status { get; set; }
        public List<ArticleMediaDto>? Media { get; set; }
    }
}