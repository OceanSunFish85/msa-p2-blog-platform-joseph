using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Entities;

namespace backend.Data
{
    public class BlogWebDbContext : IdentityDbContext<ApplicationUser>
    {
        public BlogWebDbContext(DbContextOptions<BlogWebDbContext> options)
            : base(options)
        {
        }

        //Add more DbSet for other entities
        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleContent> ArticleContents { get; set; }
        public DbSet<ArticleMedia> ArticleMedias { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Comment> Comments { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 其他实体的配置
            // modelBuilder.Entity<Page>().ToTable("Pages");
            // modelBuilder.Entity<ApplicationUser>().ToTable("Users");
        }
    }
}