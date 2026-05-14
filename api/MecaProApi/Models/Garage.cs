using System.ComponentModel.DataAnnotations;

namespace MecaProApi.Models;

public class Garage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    public string Address { get; set; } = string.Empty;
    
    [Required]
    public string City { get; set; } = string.Empty;
    
    public string? PostalCode { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public decimal? HourlyRate { get; set; }
    public bool IsAvailable { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<GarageSpecialty> GarageSpecialties { get; set; } = new List<GarageSpecialty>();
}