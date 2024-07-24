namespace Models
{
    public class Reply
    {
        public int ReplyId { get; set; }
        public int CommentId { get; set; } // 关联的评论ID
        public int UserId { get; set; } // 回复用户ID
        public string Content { get; set; } = null!;// 回复内容
        public DateTime CreatedAt { get; set; } // 回复创建时间
        public DateTime UpdatedAt { get; set; } // 回复更新时间

        // 导航属性
        public Comment Comment { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}