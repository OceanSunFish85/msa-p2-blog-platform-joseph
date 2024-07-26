using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class BlogWebDbContext : IdentityDbContext<ApplicationUser>
    {
        public BlogWebDbContext(DbContextOptions<BlogWebDbContext> options)
            : base(options)
        {
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 其他实体的配置
            // modelBuilder.Entity<Page>().ToTable("Pages");
            // modelBuilder.Entity<ApplicationUser>().ToTable("Users");
        }
    }
}