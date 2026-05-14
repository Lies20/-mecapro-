using MecaProApi.DTOs.Auth;

namespace MecaProApi.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> Register(RegisterDto dto);
    Task<AuthResponseDto?> Login(LoginDto dto);
}