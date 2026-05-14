namespace MecaProApi.DTOs.Garage;

public class GarageDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? PostalCode { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public decimal? HourlyRate { get; set; }
    public bool IsAvailable { get; set; }
    public double? DistanceKm { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public List<string> Specialties { get; set; } = new();
}