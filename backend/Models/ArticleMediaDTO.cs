public class ArticleMediaDto
{
    public MediaType Type { get; set; } = MediaType.Image;
    public string Url { get; set; } = null!;
    public string? AltText { get; set; }
}