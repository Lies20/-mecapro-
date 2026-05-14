namespace MecaProApi.DTOs.Appointment;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid GarageId { get; set; }
    public string GarageName { get; set; } = string.Empty;
    public string GarageAddress { get; set; } = string.Empty;
    public int? SpecialtyId { get; set; }
    public string? SpecialtyName { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}