using System.Security.Claims;
using MecaProApi.DTOs.Review;
using MecaProApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MecaProApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("garage/{garageId}")]
    public async Task<IActionResult> GetByGarage(Guid garageId)
    {
        var reviews = await _reviewService.GetByGarage(garageId);
        return Ok(reviews);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateReviewDto dto)
    {
        var review = await _reviewService.Create(GetUserId(), dto);
        return Ok(review);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _reviewService.Delete(id, GetUserId());
        if (!result) return NotFound();
        return Ok();
    }
}