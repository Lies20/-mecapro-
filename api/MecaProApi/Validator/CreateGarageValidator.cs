using FluentValidation;
using MecaProApi.DTOs.Garage;

namespace MecaProApi.Validators;

public class CreateGarageValidator : AbstractValidator<CreateGarageDto>
{
    public CreateGarageValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Le nom est requis")
            .MaximumLength(255);

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("L'adresse est requise");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("La ville est requise");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Latitude invalide");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("Longitude invalide");

        RuleFor(x => x.HourlyRate)
            .GreaterThan(0).When(x => x.HourlyRate.HasValue)
            .WithMessage("Le tarif doit être positif");
    }
}