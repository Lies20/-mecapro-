using MecaProApi.Data;
using MecaProApi.DTOs.Garage;
using MecaProApi.Models;
using MecaProApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MecaProApi.Services;

public class GarageService : IGarageService
{
    private readonly AppDbContext _db;

    public GarageService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<GarageDto>> GetAll()
    {
        var garages = await _db.Garages
            .Include(g => g.GarageSpecialties).ThenInclude(gs => gs.Specialty)
            .Include(g => g.Reviews)
            .ToListAsync();

        return garages.Select(g => ToDto(g, null)).ToList();
    }

    public async Task<List<GarageDto>> GetNearby(double lat, double lng, double radiusKm)
    {
        var garages = await _db.Garages
            .Include(g => g.GarageSpecialties).ThenInclude(gs => gs.Specialty)
            .Include(g => g.Reviews)
            .ToListAsync();

        return garages
            .Select(g => {
                var dist = CalculateDistance(lat, lng,
                    (double)g.Latitude, (double)g.Longitude);
                return (garage: g, dist);
            })
            .Where(x => x.dist <= radiusKm)
            .OrderBy(x => x.dist)
            .Select(x => ToDto(x.garage, x.dist))
            .ToList();
    }

    public async Task<GarageDto?> GetById(Guid id)
    {
        var garage = await _db.Garages
            .Include(g => g.GarageSpecialties).ThenInclude(gs => gs.Specialty)
            .Include(g => g.Reviews)
            .FirstOrDefaultAsync(g => g.Id == id);

        return garage == null ? null : ToDto(garage, null);
    }

    public async Task<GarageDto> Create(CreateGarageDto dto)
{
    var garage = new Garage
    {
        Name = dto.Name,
        Description = dto.Description,
        Address = dto.Address,
        City = dto.City,
        PostalCode = dto.PostalCode,
        Latitude = dto.Latitude,
        Longitude = dto.Longitude,
        Phone = dto.Phone,
        Email = dto.Email,
        HourlyRate = dto.HourlyRate
    };

    _db.Garages.Add(garage);

    foreach (var specId in dto.SpecialtyIds)
    {
        _db.GarageSpecialties.Add(new GarageSpecialty
        {
            GarageId = garage.Id,
            SpecialtyId = specId
        });
    }

    await _db.SaveChangesAsync();

    // Recharge le garage avec les spécialités
    var created = await _db.Garages
        .Include(g => g.GarageSpecialties).ThenInclude(gs => gs.Specialty)
        .Include(g => g.Reviews)
        .FirstAsync(g => g.Id == garage.Id);

    return ToDto(created, null);
}

    public async Task<bool> ToggleAvailability(Guid id, bool isAvailable)
    {
        var garage = await _db.Garages.FindAsync(id);
        if (garage == null) return false;

        garage.IsAvailable = isAvailable;
        await _db.SaveChangesAsync();
        return true;
    }

    private static GarageDto ToDto(Garage g, double? distance) => new()
    {
        Id = g.Id,
        Name = g.Name,
        Description = g.Description,
        Address = g.Address,
        City = g.City,
        PostalCode = g.PostalCode,
        Latitude = g.Latitude,
        Longitude = g.Longitude,
        Phone = g.Phone,
        Email = g.Email,
        HourlyRate = g.HourlyRate,
        IsAvailable = g.IsAvailable,
        DistanceKm = distance.HasValue ? Math.Round(distance.Value, 2) : null,
        AverageRating = g.Reviews.Any() ? Math.Round(g.Reviews.Average(r => r.Rating), 1) : 0,
        ReviewCount = g.Reviews.Count,
        Specialties = g.GarageSpecialties.Select(gs => gs.Specialty.Name).ToList()
    };

    private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }
}