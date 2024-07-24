namespace Models
{
    public class ArticleContent
    {
        public int ContentId { get; set; } // 主键
        public string HtmlContent { get; set; } = null!;// 存储文章的HTML内容
        public DateTime CreatedAt { get; set; } // 文章内容创建时间
        public DateTime UpdatedAt { get; set; } // 文章内容更新时间

        // 文章与内容的一对一关系
        public Article Article { get; set; } = null!;// 导航属性
    }
}