using Microsoft.EntityFrameworkCore;
using MecaProApi.Models;

namespace MecaProApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<User> Users => Set<User>();
    public DbSet<Garage> Garages => Set<Garage>();
    public DbSet<Specialty> Specialties => Set<Specialty>();
    public DbSet<GarageSpecialty> GarageSpecialties => Set<GarageSpecialty>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<PostLike> PostLikes => Set<PostLike>();
    public DbSet<PostComment> PostComments => Set<PostComment>();
    public DbSet<Report> Reports => Set<Report>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable("users");
        modelBuilder.Entity<Garage>().ToTable("garages");
        modelBuilder.Entity<Specialty>().ToTable("specialties");
        modelBuilder.Entity<GarageSpecialty>().ToTable("garage_specialties");
        modelBuilder.Entity<Appointment>().ToTable("appointments");
        modelBuilder.Entity<Review>().ToTable("reviews");
        modelBuilder.Entity<Post>().ToTable("posts");
        modelBuilder.Entity<PostLike>().ToTable("post_likes");
        modelBuilder.Entity<PostComment>().ToTable("post_comments");
        // Colonnes en minuscules pour User
        modelBuilder.Entity<Report>().ToTable("reports");
        modelBuilder.Entity<Report>(e => {
        e.Property(r => r.Id).HasColumnName("id");
        e.Property(r => r.ReporterId).HasColumnName("reporter_id");
        e.Property(r => r.PostId).HasColumnName("post_id");
        e.Property(r => r.GarageId).HasColumnName("garage_id");
        e.Property(r => r.Reason).HasColumnName("reason");
        e.Property(r => r.CreatedAt).HasColumnName("created_at");
});





        
modelBuilder.Entity<User>(e => {
    e.Property(u => u.Id).HasColumnName("id");
    e.Property(u => u.FirstName).HasColumnName("first_name");
    e.Property(u => u.LastName).HasColumnName("last_name");
    e.Property(u => u.Email).HasColumnName("email");
    e.Property(u => u.PasswordHash).HasColumnName("password_hash");
    e.Property(u => u.Phone).HasColumnName("phone");
    e.Property(u => u.VehicleType).HasColumnName("vehicle_type");
    e.Property(u => u.VehicleModel).HasColumnName("vehicle_model");
    e.Property(u => u.CreatedAt).HasColumnName("created_at");
});

modelBuilder.Entity<Garage>(e => {
    e.Property(g => g.Id).HasColumnName("id");
    e.Property(g => g.Name).HasColumnName("name");
    e.Property(g => g.Description).HasColumnName("description");
    e.Property(g => g.Address).HasColumnName("address");
    e.Property(g => g.City).HasColumnName("city");
    e.Property(g => g.PostalCode).HasColumnName("postal_code");
    e.Property(g => g.Latitude).HasColumnName("latitude");
    e.Property(g => g.Longitude).HasColumnName("longitude");
    e.Property(g => g.Phone).HasColumnName("phone");
    e.Property(g => g.Email).HasColumnName("email");
    e.Property(g => g.HourlyRate).HasColumnName("hourly_rate");
    e.Property(g => g.IsAvailable).HasColumnName("is_available");
    e.Property(g => g.CreatedAt).HasColumnName("created_at");
});

modelBuilder.Entity<Specialty>(e => {
    e.Property(s => s.Id).HasColumnName("id");
    e.Property(s => s.Name).HasColumnName("name");
});

modelBuilder.Entity<GarageSpecialty>(e => {
    e.Property(gs => gs.GarageId).HasColumnName("garage_id");
    e.Property(gs => gs.SpecialtyId).HasColumnName("specialty_id");
});

modelBuilder.Entity<Appointment>(e => {
    e.Property(a => a.Id).HasColumnName("id");
    e.Property(a => a.UserId).HasColumnName("user_id");
    e.Property(a => a.GarageId).HasColumnName("garage_id");
    e.Property(a => a.SpecialtyId).HasColumnName("specialty_id");
    e.Property(a => a.AppointmentDate).HasColumnName("appointment_date");
    e.Property(a => a.Description).HasColumnName("description");
    e.Property(a => a.Status).HasColumnName("status");
    e.Property(a => a.CreatedAt).HasColumnName("created_at");
});

modelBuilder.Entity<Review>(e => {
    e.Property(r => r.Id).HasColumnName("id");
    e.Property(r => r.UserId).HasColumnName("user_id");
    e.Property(r => r.GarageId).HasColumnName("garage_id");
    e.Property(r => r.AppointmentId).HasColumnName("appointment_id");
    e.Property(r => r.Rating).HasColumnName("rating");
    e.Property(r => r.Comment).HasColumnName("comment");
    e.Property(r => r.CreatedAt).HasColumnName("created_at");
});

modelBuilder.Entity<Post>(e => {
    e.Property(p => p.Id).HasColumnName("id");
    e.Property(p => p.UserId).HasColumnName("user_id");
    e.Property(p => p.GarageId).HasColumnName("garage_id");
    e.Property(p => p.AppointmentId).HasColumnName("appointment_id");
    e.Property(p => p.Caption).HasColumnName("caption");
    e.Property(p => p.MediaUrl).HasColumnName("media_url");
    e.Property(p => p.MediaType).HasColumnName("media_type");
    e.Property(p => p.CreatedAt).HasColumnName("created_at");
});

modelBuilder.Entity<PostLike>(e => {
    e.Property(pl => pl.UserId).HasColumnName("user_id");
    e.Property(pl => pl.PostId).HasColumnName("post_id");
    e.Property(pl => pl.CreatedAt).HasColumnName("created_at");
});

modelBuilder.Entity<PostComment>(e => {
    e.Property(pc => pc.Id).HasColumnName("id");
    e.Property(pc => pc.UserId).HasColumnName("user_id");
    e.Property(pc => pc.PostId).HasColumnName("post_id");
    e.Property(pc => pc.Content).HasColumnName("content");
    e.Property(pc => pc.CreatedAt).HasColumnName("created_at");
});

        modelBuilder.Entity<GarageSpecialty>()
            .HasKey(gs => new { gs.GarageId, gs.SpecialtyId });

        modelBuilder.Entity<PostLike>()
            .HasKey(pl => new { pl.UserId, pl.PostId });

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Garage)
            .WithMany(g => g.Appointments)
            .HasForeignKey(a => a.GarageId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.User)
            .WithMany(u => u.Appointments)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Garage)
            .WithMany(g => g.Reviews)
            .HasForeignKey(r => r.GarageId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PostLike>()
            .HasOne(pl => pl.Post)
            .WithMany(p => p.Likes)
            .HasForeignKey(pl => pl.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PostComment>()
            .HasOne(pc => pc.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(pc => pc.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}