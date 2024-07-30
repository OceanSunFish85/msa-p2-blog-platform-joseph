using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class EditArticleRequest
    {
        [Required]
        public int ArticleId { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Title { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string AuthorEmail { get; set; } = null!;

        [StringLength(500)]
        public string Summary { get; set; } = null!;

        [Url]
        public string Cover { get; set; } = null!;

        public int? CategoryId { get; set; }

        [Required]
        public string HtmlContent { get; set; } = null!;

        [Required]
        public ArticleStatus Status { get; set; }

        public List<ArticleMediaDto> Media { get; set; } = new List<ArticleMediaDto>();

        public List<int> DeletedMediaIds { get; set; } = new List<int>();
    }
}