using Microsoft.EntityFrameworkCore;
using Models;

namespace Data
{
    public class BlogPlatformContext : DbContext
    {
        public BlogPlatformContext(DbContextOptions<BlogPlatformContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Article> Articles { get; set; } = null!;
        public DbSet<ArticleContent> ArticleContents { get; set; } = null!;
        public DbSet<ArticleMedia> ArticleMedias { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<Reply> Replies { get; set; } = null!;
        public DbSet<SocialLink> SocialLinks { get; set; } = null!;
        public DbSet<UserBehavior> UserBehaviors { get; set; } = null!;
        public DbSet<UserNotification> UserNotifications { get; set; } = null!;
        public DbSet<Like> Likes { get; set; } = null!;
        public DbSet<Tag> Tags { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<ArticleTag> ArticleTags { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Role).IsRequired().HasMaxLength(50);

                entity.HasMany(u => u.SocialLinks)
                      .WithOne(sl => sl.User)
                      .HasForeignKey(sl => sl.UserId);

                entity.HasMany(u => u.UserNotifications)
                      .WithOne(un => un.User)
                      .HasForeignKey(un => un.UserId);
            });

            modelBuilder.Entity<Article>(entity =>
            {
                entity.HasKey(e => e.ArticleId);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Summary).IsRequired().HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

                entity.HasOne(a => a.ArticleContent)
                      .WithOne(ac => ac.Article)
                      .HasForeignKey<ArticleContent>(ac => ac.ContentId);

                entity.HasOne(a => a.Category)
                      .WithMany(c => c.Articles)
                      .HasForeignKey(a => a.CategoryId);

                entity.HasMany(a => a.ArticleMedias)
                      .WithOne(am => am.Article)
                      .HasForeignKey(am => am.ArticleId);

                entity.HasMany(a => a.ArticleTags)
                      .WithOne(at => at.Article)
                      .HasForeignKey(at => at.ArticleId);

                entity.HasMany(a => a.Comments)
                      .WithOne(c => c.Article)
                      .HasForeignKey(c => c.ArticleId);
            });

            modelBuilder.Entity<ArticleContent>(entity =>
            {
                entity.HasKey(e => e.ContentId);
                entity.Property(e => e.HtmlContent).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<ArticleMedia>(entity =>
            {
                entity.HasKey(e => e.MediaId);
                entity.Property(e => e.MediaType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Url).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.CommentId);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

                entity.HasMany(c => c.Replies)
                      .WithOne(r => r.Comment)
                      .HasForeignKey(r => r.CommentId);
            });

            modelBuilder.Entity<Reply>(entity =>
            {
                entity.HasKey(e => e.ReplyId);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

                entity.HasOne(r => r.Comment)
                      .WithMany(c => c.Replies)
                      .HasForeignKey(r => r.CommentId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.User)
                      .WithMany()
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<SocialLink>(entity =>
            {
                entity.HasKey(e => e.LinkId);
                entity.Property(e => e.Platform).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Url).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<UserBehavior>(entity =>
            {
                entity.HasKey(e => e.BehaviorId);
                entity.Property(e => e.BehaviorType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Timestamp).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<UserNotification>(entity =>
            {
                entity.HasKey(e => e.NotificationId);
                entity.Property(e => e.Message).IsRequired();
                entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<Like>(entity =>
            {
                entity.HasKey(e => e.LikeId);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => e.TagId);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.CategoryId);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<ArticleTag>(entity =>
            {
                entity.HasKey(at => new { at.ArticleId, at.TagId });
                entity.HasOne(at => at.Article)
                      .WithMany(a => a.ArticleTags)
                      .HasForeignKey(at => at.ArticleId);

                entity.HasOne(at => at.Tag)
                      .WithMany(t => t.ArticleTags)
                      .HasForeignKey(at => at.TagId);
            });
        }
    }
}
