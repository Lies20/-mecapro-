using MecaProApi.DTOs.Review;

namespace MecaProApi.Services.Interfaces;

public interface IReviewService
{
    Task<List<ReviewDto>> GetByGarage(Guid garageId);
    Task<ReviewDto> Create(Guid userId, CreateReviewDto dto);
    Task<bool> Delete(Guid id, Guid userId);
}