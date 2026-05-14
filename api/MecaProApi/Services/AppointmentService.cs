using MecaProApi.Data;
using MecaProApi.DTOs.Appointment;
using MecaProApi.Models;
using MecaProApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MecaProApi.Services;

public class AppointmentService : IAppointmentService
{
    private readonly AppDbContext _db;

    public AppointmentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<AppointmentDto>> GetUserAppointments(Guid userId)
    {
        var appointments = await _db.Appointments
            .Include(a => a.Garage)
            .Include(a => a.Specialty)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();

        return appointments.Select(ToDto).ToList();
    }

    public async Task<List<AppointmentDto>> GetGarageAppointments(Guid garageId)
    {
        var appointments = await _db.Appointments
            .Include(a => a.Garage)
            .Include(a => a.Specialty)
            .Where(a => a.GarageId == garageId)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();

        return appointments.Select(ToDto).ToList();
    }

   public async Task<AppointmentDto?> GetById(Guid id, Guid userId, string role)
{
    var appointment = await _db.Appointments
        .Include(a => a.Garage)
        .Include(a => a.Specialty)
        .FirstOrDefaultAsync(a => a.Id == id);

    if (appointment == null) return null;
    if (role != "admin" && appointment.UserId != userId) return null;

    return ToDto(appointment);
}

    public async Task<AppointmentDto> Create(Guid userId, CreateAppointmentDto dto)
    {
        var appointment = new Appointment
        {
            UserId = userId,
            GarageId = dto.GarageId,
            SpecialtyId = dto.SpecialtyId,
            AppointmentDate = dto.AppointmentDate,
            Description = dto.Description,
            Status = "pending"
        };

        _db.Appointments.Add(appointment);
        await _db.SaveChangesAsync();

        return ToDto(await _db.Appointments
            .Include(a => a.Garage)
            .Include(a => a.Specialty)
            .FirstAsync(a => a.Id == appointment.Id));
    }

    public async Task<bool> UpdateStatus(Guid id, string status)
    {
        var appointment = await _db.Appointments.FindAsync(id);
        if (appointment == null) return false;

        appointment.Status = status;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Cancel(Guid id, Guid userId)
    {
        var appointment = await _db.Appointments
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (appointment == null) return false;

        appointment.Status = "cancelled";
        await _db.SaveChangesAsync();
        return true;
    }

    private static AppointmentDto ToDto(Appointment a) => new()
    {
        Id = a.Id,
        UserId = a.UserId,
        GarageId = a.GarageId,
        GarageName = a.Garage?.Name ?? string.Empty,
        GarageAddress = a.Garage?.Address ?? string.Empty,
        SpecialtyId = a.SpecialtyId,
        SpecialtyName = a.Specialty?.Name,
        AppointmentDate = a.AppointmentDate,
        Description = a.Description,
        Status = a.Status,
        CreatedAt = a.CreatedAt
    };
}