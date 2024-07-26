using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class ArticleMedia
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public MediaType Type { get; set; }

        [Required]
        public string Url { get; set; } = null!;

        public string? AltText { get; set; }

        [Required]
        public int ArticleId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}