using backend.Enums;
using Microsoft.AspNetCore.Identity;

namespace backend.Entities
{


    //extend IdentityUser, add Role property
    public class ApplicationUser : IdentityUser
    {
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Avatar { get; set; }
        public string? Bio { get; set; }
        public UserStatus UserStatus { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}