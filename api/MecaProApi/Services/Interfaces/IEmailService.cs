namespace MecaProApi.Services.Interfaces;

public interface IEmailService
{
    Task SendVerificationEmail(string toEmail, string firstName, string token);
    Task SendPasswordResetEmail(string toEmail, string firstName, string token);
}