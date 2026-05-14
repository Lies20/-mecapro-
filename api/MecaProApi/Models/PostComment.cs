using System.ComponentModel.DataAnnotations;

namespace MecaProApi.Models;

public class PostComment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}