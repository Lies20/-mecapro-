using System.Security.Claims;
using MecaProApi.DTOs.Appointment;
using MecaProApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MecaProApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyAppointments()
    {
        var appointments = await _appointmentService.GetUserAppointments(GetUserId());
        return Ok(appointments);
    }

    [HttpGet("garage/{garageId}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetGarageAppointments(Guid garageId)
    {
        var appointments = await _appointmentService.GetGarageAppointments(garageId);
        return Ok(appointments);
    }

    private string GetUserRole() =>
    User.FindFirstValue(ClaimTypes.Role) ?? "user";

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var appointment = await _appointmentService.GetById(id, GetUserId(), GetUserRole());
        if (appointment == null) return NotFound();
        return Ok(appointment);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateAppointmentDto dto)
    {
        var appointment = await _appointmentService.Create(GetUserId(), dto);
        return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, appointment);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string status)
    {
        var result = await _appointmentService.UpdateStatus(id, status);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpPatch("{id}/cancel")]
    [Authorize]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await _appointmentService.Cancel(id, GetUserId());
        if (!result) return NotFound();
        return Ok();
    }
}