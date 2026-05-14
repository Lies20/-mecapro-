using MecaProApi.Data;
using MecaProApi.DTOs.Review;
using MecaProApi.Models;
using MecaProApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MecaProApi.Services;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _db;

    public ReviewService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<ReviewDto>> GetByGarage(Guid garageId)
    {
        var reviews = await _db.Reviews
            .Include(r => r.User)
            .Where(r => r.GarageId == garageId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reviews.Select(ToDto).ToList();
    }

    public async Task<ReviewDto> Create(Guid userId, CreateReviewDto dto)
    {
        var review = new Review
        {
            UserId = userId,
            GarageId = dto.GarageId,
            AppointmentId = dto.AppointmentId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        return ToDto(await _db.Reviews
            .Include(r => r.User)
            .FirstAsync(r => r.Id == review.Id));
    }

    public async Task<bool> Delete(Guid id, Guid userId)
    {
        var review = await _db.Reviews
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (review == null) return false;

        _db.Reviews.Remove(review);
        await _db.SaveChangesAsync();
        return true;
    }

    private static ReviewDto ToDto(Review r) => new()
    {
        Id = r.Id,
        UserId = r.UserId,
        UserFirstName = r.User?.FirstName ?? string.Empty,
        GarageId = r.GarageId,
        AppointmentId = r.AppointmentId,
        Rating = r.Rating,
        Comment = r.Comment,
        CreatedAt = r.CreatedAt
    };
}