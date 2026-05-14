namespace MecaProApi.DTOs.Post;

public class PostDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserFirstName { get; set; } = string.Empty;
    public Guid GarageId { get; set; }
    public string GarageName { get; set; } = string.Empty;
    public Guid? AppointmentId { get; set; }
    public string? Caption { get; set; }
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty;
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public bool IsLikedByMe { get; set; }
    public DateTime CreatedAt { get; set; }
}