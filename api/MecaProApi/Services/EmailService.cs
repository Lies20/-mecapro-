using MecaProApi.Services.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace MecaProApi.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendVerificationEmail(string toEmail, string firstName, string token)
    {
        var verifyUrl = $"https://mecapro.app/verify?token={token}";

        var html = $@"
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto'>
            <div style='background:#E8A020;padding:20px;text-align:center'>
                <h1 style='color:white;margin:0'>🔧 MécaPro</h1>
            </div>
            <div style='padding:30px;background:#f9f9f9'>
                <h2>Bonjour {firstName} !</h2>
                <p>Merci de t'être inscrit sur MécaPro. Clique sur le bouton ci-dessous pour vérifier ton adresse email.</p>
                <div style='text-align:center;margin:30px 0'>
                    <a href='{verifyUrl}' 
                       style='background:#E8A020;color:white;padding:14px 28px;
                              border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px'>
                        Vérifier mon email
                    </a>
                </div>
                <p style='color:#888;font-size:12px'>Ce lien expire dans 24h. Si tu n'as pas créé de compte, ignore cet email.</p>
            </div>
        </div>";

        await Send(toEmail, firstName, "Vérifie ton adresse email — MécaPro", html);
    }

    public async Task SendPasswordResetEmail(string toEmail, string firstName, string token)
    {
        var resetUrl = $"https://mecapro.app/reset-password?token={token}";

        var html = $@"
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto'>
            <div style='background:#E8A020;padding:20px;text-align:center'>
                <h1 style='color:white;margin:0'>🔧 MécaPro</h1>
            </div>
            <div style='padding:30px;background:#f9f9f9'>
                <h2>Réinitialisation du mot de passe</h2>
                <p>Bonjour {firstName}, tu as demandé à réinitialiser ton mot de passe.</p>
                <div style='text-align:center;margin:30px 0'>
                    <a href='{resetUrl}' 
                       style='background:#E8A020;color:white;padding:14px 28px;
                              border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px'>
                        Réinitialiser mon mot de passe
                    </a>
                </div>
                <p style='color:#888;font-size:12px'>Ce lien expire dans 1h. Si tu n'as pas fait cette demande, ignore cet email.</p>
            </div>
        </div>";

        await Send(toEmail, firstName, "Réinitialisation de ton mot de passe — MécaPro", html);
    }

    private async Task Send(string toEmail, string toName, string subject, string html)
    {
        var apiKey = _config["SendGrid:ApiKey"];
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress(_config["SendGrid:FromEmail"], _config["SendGrid:FromName"]);
        var to = new EmailAddress(toEmail, toName);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, string.Empty, html);
        await client.SendEmailAsync(msg);
    }
}