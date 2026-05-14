using MecaProApi.DTOs.Auth;
using MecaProApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _authService.Register(dto);
        if (result == null)
            return BadRequest(new { message = "Email déjà utilisé" });
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.Login(dto);
        if (result == null)
            return Unauthorized(new { message = "Email ou mot de passe incorrect" });
        return Ok(result);
    }
}