namespace MecaProApi.DTOs.Appointment;

public class CreateAppointmentDto
{
    public Guid GarageId { get; set; }
    public int? SpecialtyId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Description { get; set; }
}