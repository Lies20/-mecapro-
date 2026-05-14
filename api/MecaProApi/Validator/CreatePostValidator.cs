using FluentValidation;
using MecaProApi.DTOs.Post;

namespace MecaProApi.Validators;

public class CreatePostValidator : AbstractValidator<CreatePostDto>
{
    public CreatePostValidator()
    {
        RuleFor(x => x.GarageId)
            .NotEmpty().WithMessage("Le garage est requis");

        RuleFor(x => x.MediaUrl)
            .NotEmpty().WithMessage("Le média est requis")
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("URL du média invalide");

        RuleFor(x => x.MediaType)
            .Must(t => t == "video" || t == "image")
            .WithMessage("Type de média invalide — video ou image");

        RuleFor(x => x.Caption)
            .MaximumLength(500).When(x => x.Caption != null);
    }
}