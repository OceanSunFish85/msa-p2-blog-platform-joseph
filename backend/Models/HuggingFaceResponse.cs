using System.Text.Json.Serialization;

namespace backend.Modals
{
    public class HuggingFaceResponse
    {
        [JsonPropertyName("summary_text")]
        public string? Summary_text { get; set; }
    }
}