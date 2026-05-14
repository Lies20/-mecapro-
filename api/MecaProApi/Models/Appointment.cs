using System.ComponentModel.DataAnnotations;

namespace MecaProApi.Models;

public class Appointment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid GarageId { get; set; }
    public Garage Garage { get; set; } = null!;
    
    public int? SpecialtyId { get; set; }
    public Specialty? Specialty { get; set; }
    
    [Required]
    public DateTime AppointmentDate { get; set; }
    
    public string? Description { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}