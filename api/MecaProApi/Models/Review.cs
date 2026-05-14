using System.ComponentModel.DataAnnotations;

namespace MecaProApi.Models;

public class Review
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid GarageId { get; set; }
    public Garage Garage { get; set; } = null!;
    
    public Guid? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }
    
    [Range(1, 5)]
    public int Rating { get; set; }
    
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}