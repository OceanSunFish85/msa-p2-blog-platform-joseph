using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class Article
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = null!;

        [Required]
        public string AuthorEmail { get; set; } = null!;

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        public string? Summary { get; set; }
        public string? Cover { get; set; }
        public int? CategoryId { get; set; }

        [Required]
        public int ContentId { get; set; }

        [Required]
        public ArticleStatus Status { get; set; }

        [Required]
        public int Views { get; set; }

        [Required]
        public int CommentsCount { get; set; }

        [Required]
        public int Likes { get; set; }
    }
}