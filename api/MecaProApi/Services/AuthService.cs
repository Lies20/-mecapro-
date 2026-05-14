using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using MecaProApi.Data;
using MecaProApi.DTOs.Auth;
using MecaProApi.Models;
using MecaProApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MecaProApi.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponseDto?> Register(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return null;

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone = dto.Phone,
            VehicleType = dto.VehicleType,
            VehicleModel = dto.VehicleModel,
            Role = "user"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var refreshToken = await GenerateRefreshToken(user.Id);

        return new AuthResponseDto
        {
            Token = GenerateJwt(user),
            RefreshToken = refreshToken,
            FirstName = user.FirstName,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponseDto?> Login(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        var refreshToken = await GenerateRefreshToken(user.Id);

        return new AuthResponseDto
        {
            Token = GenerateJwt(user),
            RefreshToken = refreshToken,
            FirstName = user.FirstName,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponseDto?> RefreshToken(string refreshToken)
    {
        var token = await _db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (token == null || token.IsExpired) return null;

        _db.RefreshTokens.Remove(token);
        var newRefreshToken = await GenerateRefreshToken(token.UserId);

        return new AuthResponseDto
        {
            Token = GenerateJwt(token.User),
            RefreshToken = newRefreshToken,
            FirstName = token.User.FirstName,
            Email = token.User.Email,
            Role = token.User.Role
        };
    }

    public async Task<bool> RevokeToken(string refreshToken)
    {
        var token = await _db.RefreshTokens
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (token == null) return false;

        _db.RefreshTokens.Remove(token);
        await _db.SaveChangesAsync();
        return true;
    }

    private async Task<string> GenerateRefreshToken(Guid userId)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        });

        await _db.SaveChangesAsync();
        return token;
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.GivenName, user.FirstName),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}