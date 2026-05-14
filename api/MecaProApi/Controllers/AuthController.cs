using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MecaProApi.DTOs.Auth;
using MecaProApi.Services.Interfaces;
using MecaProApi.Validators;

namespace MecaProApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var validator = new RegisterValidator();
        var result = validator.Validate(dto);
        if (!result.IsValid)
            return BadRequest(result.Errors.Select(e => e.ErrorMessage));

        var response = await _authService.Register(dto);
        if (response == null)
            return BadRequest(new { message = "Email déjà utilisé" });
        return Ok(response);
    }

    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var response = await _authService.Login(dto);
        if (response == null)
            return Unauthorized(new { message = "Email ou mot de passe incorrect" });
        return Ok(response);
    }
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var result = await _authService.RefreshToken(refreshToken);
        if (result == null)
            return Unauthorized(new { message = "Token invalide ou expiré" });
        return Ok(result);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] string refreshToken)
    {
        await _authService.RevokeToken(refreshToken);
        return Ok();
    }
}