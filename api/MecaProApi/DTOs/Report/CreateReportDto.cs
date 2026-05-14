namespace MecaProApi.DTOs.Report;

public class CreateReportDto
{
    public Guid? PostId { get; set; }
    public Guid? GarageId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class ReportDto
{
    public Guid Id { get; set; }
    public Guid ReporterId { get; set; }
    public string ReporterFirstName { get; set; } = string.Empty;
    public Guid? PostId { get; set; }
    public Guid? GarageId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}