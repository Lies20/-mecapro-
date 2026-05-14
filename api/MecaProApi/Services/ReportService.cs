using MecaProApi.Data;
using MecaProApi.DTOs.Report;
using MecaProApi.Models;
using MecaProApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MecaProApi.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _db;

    public ReportService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ReportDto> Create(Guid reporterId, CreateReportDto dto)
    {
        var report = new Report
        {
            ReporterId = reporterId,
            PostId = dto.PostId,
            GarageId = dto.GarageId,
            Reason = dto.Reason
        };

        _db.Reports.Add(report);
        await _db.SaveChangesAsync();

        var user = await _db.Users.FindAsync(reporterId);

        return new ReportDto
        {
            Id = report.Id,
            ReporterId = report.ReporterId,
            ReporterFirstName = user?.FirstName ?? string.Empty,
            PostId = report.PostId,
            GarageId = report.GarageId,
            Reason = report.Reason,
            CreatedAt = report.CreatedAt
        };
    }

    public async Task<List<ReportDto>> GetAll()
    {
        var reports = await _db.Reports
            .Include(r => r.Reporter)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reports.Select(r => new ReportDto
        {
            Id = r.Id,
            ReporterId = r.ReporterId,
            ReporterFirstName = r.Reporter?.FirstName ?? string.Empty,
            PostId = r.PostId,
            GarageId = r.GarageId,
            Reason = r.Reason,
            CreatedAt = r.CreatedAt
        }).ToList();
    }
}