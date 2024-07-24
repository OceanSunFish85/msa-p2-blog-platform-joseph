using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly BlogPlatformContext _context;

        public TestController(BlogPlatformContext context)
        {
            _context = context;
        }

        [HttpGet("articles")]
        public async Task<IActionResult> GetArticles()
        {
            var articles = await _context.Articles.ToListAsync();
            return Ok(articles);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
    }
}
