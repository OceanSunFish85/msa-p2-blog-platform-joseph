namespace Models
{
    public class UserBehavior
    {
        public int BehaviorId { get; set; }
        public int UserId { get; set; }
        public int ArticleId { get; set; }
        public string BehaviorType { get; set; } = null!;// 行为类型：view, click, like, comment
        public DateTime Timestamp { get; set; } // 行为发生的时间

        // 导航属性
        public User User { get; set; } = null!;
        public Article Article { get; set; } = null!;
    }
}