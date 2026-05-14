using MecaProApi.DTOs.Appointment;

namespace MecaProApi.Services.Interfaces;

public interface IAppointmentService
{
    Task<List<AppointmentDto>> GetUserAppointments(Guid userId);
    Task<List<AppointmentDto>> GetGarageAppointments(Guid garageId);
    Task<AppointmentDto?> GetById(Guid id);
    Task<AppointmentDto> Create(Guid userId, CreateAppointmentDto dto);
    Task<bool> UpdateStatus(Guid id, string status);
    Task<bool> Cancel(Guid id, Guid userId);
}