using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Services;
using backend.Entities;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly FavoriteService _favoriteService;

        public FavoritesController(FavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        // 添加收藏
        [HttpPost("add")]
        public async Task<IActionResult> AddFavorite(int articleId, string userEmail)
        {
            var favorite = await _favoriteService.AddFavorite(articleId, userEmail);
            if (favorite == null)
            {
                return BadRequest("Failed to add favorite.");
            }

            return Ok(favorite);
        }

        // 删除收藏
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFavorite(int articleId, string userEmail)
        {
            var favorite = await _favoriteService.RemoveFavorite(articleId, userEmail);
            if (favorite == null)
            {
                return NotFound("Favorite not found.");
            }

            return Ok(favorite);
        }

        // 检查收藏状态
        [HttpGet("check")]
        public async Task<IActionResult> CheckFavorite(int articleId, string userEmail)
        {
            var favorite = await _favoriteService.CheckFavorite(articleId, userEmail);
            return Ok(new { isFavorite = favorite != null });
        }
    }
}
