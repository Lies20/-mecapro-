namespace MecaProApi.DTOs.Garage;

public class CreateGarageDto
{
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
    public List<int> SpecialtyIds { get; set; } = new();
}