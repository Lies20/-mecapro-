using System.ComponentModel.DataAnnotations;

namespace MecaProApi.Models;

public class Report
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid ReporterId { get; set; }
    public User? Reporter { get; set; }
    
    public Guid? PostId { get; set; }
    public Post? Post { get; set; }
    
    public Guid? GarageId { get; set; }
    public Garage? Garage { get; set; }
    
    [Required]
    public string Reason { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}