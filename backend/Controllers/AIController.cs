using System.Text.Json;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AISummaryController : ControllerBase
    {
        private readonly AIService _aiService;

        public AISummaryController(AIService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("summarize")]
        //get the article content from the request body and return the summary
        public async Task<IActionResult> Summarize([FromBody] SummarizeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Inputs))
            {
                return BadRequest("Article content cannot be null or empty.");
            }

            try
            {
                // Escape special characters in articleContent
                var articleContent = JsonSerializer.Serialize(request.Inputs);

                // Validate JSON format
                try
                {
                    JsonDocument.Parse(articleContent);
                }
                catch (JsonException)
                {
                    return BadRequest("Article content is not in a valid JSON format.");
                }

                var summary = await _aiService.GetSummaryAsync(articleContent);
                return Ok(summary);
            }
            catch (ApplicationException ex)
            {
                // Log the exception (logging not shown here)
                return StatusCode(500, ex.Message);
            }
        }
    }
}