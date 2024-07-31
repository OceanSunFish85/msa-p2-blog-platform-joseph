using System.Text;
using System.Text.Json;
using backend.Modals;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ILogger<AIService> _logger;

        public AIService(HttpClient httpClient, IConfiguration configuration, ILogger<AIService> logger)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _apiKey = configuration["HuggingFace:ApiKey"] ?? throw new ArgumentNullException(nameof(configuration), "API key is not configured.");
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<string> GetSummaryAsync(string articleContent)
        {
            if (string.IsNullOrWhiteSpace(articleContent))
            {
                throw new ArgumentException("Article content cannot be null or empty.", nameof(articleContent));
            }

            // Escape special characters in articleContent
            articleContent = JsonSerializer.Serialize(articleContent);

            var requestData = new
            {
                inputs = articleContent
            };

            var requestContent = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api-inference.huggingface.co/models/facebook/bart-large-cnn")
            {
                Content = requestContent
            };
            requestMessage.Headers.Add("Authorization", $"Bearer {_apiKey}");

            try
            {
                _logger.LogInformation("Sending request to Hugging Face API.");
                var response = await _httpClient.SendAsync(requestMessage);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Received response from Hugging Face API: {ResponseContent}", responseContent);

                var responseData = JsonSerializer.Deserialize<HuggingFaceResponse[]>(responseContent);

                return responseData?[0].Summary_text ?? string.Empty;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error occurred while calling the AI service.");
                throw new ApplicationException("Error occurred while calling the AI service.", ex);
            }
        }
    }
}