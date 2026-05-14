using FluentValidation;
using MecaProApi.DTOs.Appointment;

namespace MecaProApi.Validators;

public class CreateAppointmentValidator : AbstractValidator<CreateAppointmentDto>
{
    public CreateAppointmentValidator()
    {
        RuleFor(x => x.GarageId)
            .NotEmpty().WithMessage("Le garage est requis");

        RuleFor(x => x.AppointmentDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("La date doit être dans le futur");
    }
}