using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class EditProfileRequest
    {
        public string? UserName { get; set; }

        public string? Bio { get; set; }
        public string? Avatar { get; set; }
    }
}