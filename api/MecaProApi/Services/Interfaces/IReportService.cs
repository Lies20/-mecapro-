using MecaProApi.DTOs.Report;

namespace MecaProApi.Services.Interfaces;

public interface IReportService
{
    Task<ReportDto> Create(Guid reporterId, CreateReportDto dto);
    Task<List<ReportDto>> GetAll();
}