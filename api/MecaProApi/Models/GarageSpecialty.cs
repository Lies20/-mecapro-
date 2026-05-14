namespace MecaProApi.Models;

public class GarageSpecialty
{
    public Guid GarageId { get; set; }
    public Garage Garage { get; set; } = null!;

    public int SpecialtyId { get; set; }
    public Specialty Specialty { get; set; } = null!;
}