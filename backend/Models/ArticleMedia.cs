namespace Models
{
    public class ArticleMedia
    {
        public int MediaId { get; set; } // 主键
        public int ArticleId { get; set; } // 外键，引用 Article
        public string MediaType { get; set; } = null!;// 'image' 或 'video'
        public string Url { get; set; } = null!;// 媒体文件的URL
        public string? AltText { get; set; } // 可选，媒体的替代文本
        public DateTime CreatedAt { get; set; } // 媒体创建时间

        // 导航属性
        public Article Article { get; set; } = null!;
    }
}