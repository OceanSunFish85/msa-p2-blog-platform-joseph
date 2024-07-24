namespace Models
{
    public class UserNotification
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; } // 关联的用户ID
        public string Message { get; set; } = null!;// 通知消息
        public string Type { get; set; } = null!;// 通知类型：comment, like, follow, system
        public DateTime CreatedAt { get; set; } // 创建时间
        public bool Read { get; set; } // 是否已读

        // 导航属性
        public User User { get; set; } = null!;
    }
}