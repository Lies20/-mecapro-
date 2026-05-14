using MecaProApi.DTOs.Garage;

namespace MecaProApi.Services.Interfaces;

public interface IGarageService
{
    Task<List<GarageDto>> GetAll();
    Task<List<GarageDto>> GetNearby(double lat, double lng, double radiusKm);
    Task<GarageDto?> GetById(Guid id);
    Task<GarageDto> Create(CreateGarageDto dto);
    Task<bool> ToggleAvailability(Guid id, bool isAvailable);
}