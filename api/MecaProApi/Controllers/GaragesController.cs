using MecaProApi.DTOs.Garage;
using MecaProApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MecaProApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GaragesController : ControllerBase
{
    private readonly IGarageService _garageService;

    public GaragesController(IGarageService garageService)
    {
        _garageService = garageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var garages = await _garageService.GetAll();
        return Ok(garages);
    }

    [HttpGet("nearby")]
    public async Task<IActionResult> GetNearby(
        [FromQuery] double lat,
        [FromQuery] double lng,
        [FromQuery] double radius = 10)
    {
        var garages = await _garageService.GetNearby(lat, lng, radius);
        return Ok(garages);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var garage = await _garageService.GetById(id);
        if (garage == null) return NotFound();
        return Ok(garage);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateGarageDto dto)
    {
        var garage = await _garageService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = garage.Id }, garage);
    }

    [HttpPatch("{id}/availability")]
    [Authorize]
    public async Task<IActionResult> ToggleAvailability(Guid id, [FromBody] bool isAvailable)
    {
        var result = await _garageService.ToggleAvailability(id, isAvailable);
        if (!result) return NotFound();
        return Ok();
    }
}