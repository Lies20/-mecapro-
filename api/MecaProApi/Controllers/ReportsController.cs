using System.Security.Claims;
using MecaProApi.DTOs.Report;
using MecaProApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MecaProApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create(CreateReportDto dto)
    {
        if (dto.PostId == null && dto.GarageId == null)
            return BadRequest(new { message = "PostId ou GarageId requis" });

        var report = await _reportService.Create(GetUserId(), dto);
        return Ok(report);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reports = await _reportService.GetAll();
        return Ok(reports);
    }
}