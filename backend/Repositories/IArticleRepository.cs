using Models;

namespace Repositories
{
    public interface IArticleRepository
    {
        Task<IEnumerable<Article>> GetAllAsync();
        Task<Article> GetByIdAsync(int id);
        Task AddAsync(Article article);
        Task UpdateAsync(Article article);
        Task DeleteAsync(int id);
    }
}
