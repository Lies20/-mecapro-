using System.ComponentModel.DataAnnotations;

namespace MecaProApi.Models;

public class Post
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid GarageId { get; set; }
    public Garage Garage { get; set; } = null!;
    
    public Guid? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }
    
    public string? Caption { get; set; }
    
    [Required]
    public string MediaUrl { get; set; } = string.Empty;
    
    public string MediaType { get; set; } = "video";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
    public ICollection<PostComment> Comments { get; set; } = new List<PostComment>();
}