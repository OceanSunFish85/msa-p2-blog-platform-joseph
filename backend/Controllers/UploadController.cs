using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly FileStorageService _fileStorageService;

        public UploadController(FileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var url = await _fileStorageService.UploadAvatarAsync(file);
            return Ok(new { url });
        }

        [HttpPost("cover")]
        public async Task<IActionResult> UploadCover(IFormFile file)
        {
            var url = await _fileStorageService.UploadCoverAsync(file);
            return Ok(new { url });
        }

        [HttpPost("articlemedia")]
        public async Task<IActionResult> UploadArticleMedia(List<IFormFile> files)
        {
            var urls = await _fileStorageService.UploadArticleMediaAsync(files);
            return Ok(new { urls });
        }
    }
}