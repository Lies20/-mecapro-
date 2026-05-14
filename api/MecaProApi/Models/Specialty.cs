using System.ComponentModel.DataAnnotations;

namespace MecaProApi.Models;

public class Specialty
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;

    public ICollection<GarageSpecialty> GarageSpecialties { get; set; } = new List<GarageSpecialty>();
}