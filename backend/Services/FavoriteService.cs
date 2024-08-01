using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace backend.Services
{
    public class FavoriteService
    {
        private readonly BlogWebDbContext _context;

        public FavoriteService(BlogWebDbContext context)
        {
            _context = context;
        }

        public async Task<Favorite> AddFavorite(int articleId, string userEmail)
        {
            var favorite = new Favorite
            {
                ArticleId = articleId,
                UserEmail = userEmail
            };

            _context.Favorites.Add(favorite);

            var article = await _context.Articles.FindAsync(articleId);
            if (article != null)
            {
                article.Likes++;
            }

            await _context.SaveChangesAsync();

            return favorite;
        }

        public async Task<Favorite?> RemoveFavorite(int articleId, string userEmail)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.ArticleId == articleId && f.UserEmail == userEmail);

            if (favorite == null)
            {
                return null;
            }

            _context.Favorites.Remove(favorite);

            var article = await _context.Articles.FindAsync(articleId);
            if (article != null)
            {
                article.Likes--;
            }

            await _context.SaveChangesAsync();

            return favorite;
        }


        public async Task<Favorite?> CheckFavorite(int articleId, string userEmail)
        {
            return await _context.Favorites
                .FirstOrDefaultAsync(f => f.ArticleId == articleId && f.UserEmail == userEmail);
        }

        public async Task<List<Favorite>> GetFavorites(string userEmail)
        {
            return await _context.Favorites
                .Where(f => f.UserEmail == userEmail)
                .ToListAsync();
        }

    }
}