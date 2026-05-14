using FluentValidation;
using MecaProApi.DTOs.Review;

namespace MecaProApi.Validators;

public class CreateReviewValidator : AbstractValidator<CreateReviewDto>
{
    public CreateReviewValidator()
    {
        RuleFor(x => x.GarageId)
            .NotEmpty().WithMessage("Le garage est requis");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5).WithMessage("La note doit être entre 1 et 5");

        RuleFor(x => x.Comment)
            .MaximumLength(1000).When(x => x.Comment != null);
    }
}