using material_vender_api.Models.Database;

namespace material_vender_api.Repository.Contracts;

public interface IAuthService
{
    Task<User?> AuthenticateUserAsync(string username, string password);
    Task<User> RegisterUserAsync(string username, string password, string email);
    string GenerateJwtToken(User user);
} 