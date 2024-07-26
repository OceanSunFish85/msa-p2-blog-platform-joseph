using backend.Enums;
using Microsoft.AspNetCore.Identity;

namespace backend.Models;


//extend IdentityUser, add Role property
public class ApplicationUser : IdentityUser
{
    public Role Role { get; set; }
}