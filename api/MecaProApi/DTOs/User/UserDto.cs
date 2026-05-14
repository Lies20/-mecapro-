namespace MecaProApi.DTOs.User;

public class UserDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? VehicleType { get; set; }
    public string? VehicleModel { get; set; }
    public DateTime CreatedAt { get; set; }
    
}

public class UpdateUserDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Phone { get; set; }
    public string? VehicleType { get; set; }
    public string? VehicleModel { get; set; }
}