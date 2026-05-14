using System.ComponentModel.DataAnnotations;

namespace MecaProApi.DTOs.Review;

public class CreateReviewDto
{
    public Guid GarageId { get; set; }
    public Guid? AppointmentId { get; set; }
    
    [Range(1, 5)]
    public int Rating { get; set; }
    public string? Comment { get; set; }
}