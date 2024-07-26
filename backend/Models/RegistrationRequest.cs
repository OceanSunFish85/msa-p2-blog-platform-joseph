using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.Models
{

    public class RegistrationRequest
    {
        [Required]
        public string? Email { get; set; }

        [Required]
        public string? Username { get; set; }

        [Required]
        public string? Password { get; set; }

        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        [EnumDataType(typeof(UserStatus))]
        public UserStatus UserStatus { get; set; } = UserStatus.Active;

    }
}