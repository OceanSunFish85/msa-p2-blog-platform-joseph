namespace Models
{
    public class Category
    {
        public int CategoryId { get; set; } // 主键
        public string Name { get; set; } = null!;// 类别名称
        public string? Description { get; set; } // 类别描述
        public DateTime CreatedAt { get; set; } // 类别创建时间
        public DateTime UpdatedAt { get; set; } // 类别更新时间

        // 导航属性
        public ICollection<Article> Articles { get; set; } = null!;
    }
}