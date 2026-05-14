namespace MecaProApi.DTOs.Post;

public class CreatePostDto
{
    public Guid GarageId { get; set; }
    public Guid? AppointmentId { get; set; }
    public string? Caption { get; set; }
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaType { get; set; } = "video";
}