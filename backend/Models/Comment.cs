namespace Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public int ArticleId { get; set; } // 关联文章ID
        public int UserId { get; set; } // 评论用户ID
        public string Content { get; set; } = null!;// 评论内容
        public DateTime CreatedAt { get; set; } // 评论创建时间
        public DateTime UpdatedAt { get; set; } // 评论更新时间

        // 导航属性
        public Article Article { get; set; } = null!;
        public User User { get; set; } = null!;
        public ICollection<Reply> Replies { get; set; } = null!;// 回复集合
    }
}