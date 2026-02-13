using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Lot> Lots { get; set; } = null!;
        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<EventRecord> EventRecords { get; set; } = null!;
        public DbSet<PaymentOrder> PaymentOrders { get; set; } = null!;
        
        // Sistema de Órdenes con QR
        public DbSet<OrderRecord> Orders { get; set; } = null!;
        public DbSet<OrderStatusHistoryRecord> OrderStatusHistory { get; set; } = null!;
        public DbSet<QrScanRecord> QrScans { get; set; } = null!;

        // Protocolo TET Nguyên Đán - Disponibilidad y Preparación
        public DbSet<TETReadinessRecord> TETReadiness { get; set; } = null!;

        // Bienestar Personal - Paz Interior, Presencia, Automatización
        public DbSet<PersonalWellbeingRecord> PersonalWellbeing { get; set; } = null!;

        // Medicina China Tradicional - Qi Score, 5 Elementos, Meridians
        public DbSet<ChineseMedicineSnapshot> ChineseMedicineSnapshots { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Lot>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            });

            modelBuilder.Entity<Invoice>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Amount).HasColumnType("numeric(18,2)");
                b.HasOne(x => x.Lot).WithMany().HasForeignKey(x => x.LotId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<EventRecord>(b =>
            {
                b.HasKey(x => x.Id);
                // Store payload as jsonb when using Npgsql
                b.Property(x => x.Payload).HasColumnType("jsonb");
                b.Property(x => x.AggregateType).IsRequired().HasMaxLength(100);
                b.Property(x => x.EventType).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<PaymentOrder>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Amount).HasColumnType("numeric(18,2)");
                b.HasOne(x => x.Invoice).WithMany().HasForeignKey(x => x.InvoiceId).OnDelete(DeleteBehavior.Cascade);
            });

            // Sistema de Órdenes con QR
            modelBuilder.Entity<OrderRecord>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.QrCode).IsRequired().HasMaxLength(100);
                b.Property(x => x.Customer).IsRequired().HasMaxLength(200);
                b.Property(x => x.Product).IsRequired().HasMaxLength(200);
                b.Property(x => x.Priority).IsRequired().HasMaxLength(20);
                b.Property(x => x.Status).IsRequired().HasMaxLength(20);
                b.HasIndex(x => x.QrCode).IsUnique();
                b.HasIndex(x => x.Status);
                b.HasIndex(x => x.DueDate);
                b.HasQueryFilter(x => !x.IsDeleted); // Global query filter for soft delete
            });

            modelBuilder.Entity<OrderStatusHistoryRecord>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.NewStatus).IsRequired().HasMaxLength(20);
                b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => x.OrderId);
                b.HasIndex(x => x.ChangedAt);
            });

            modelBuilder.Entity<QrScanRecord>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.QrCode).IsRequired().HasMaxLength(100);
                b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => x.OrderId);
                b.HasIndex(x => x.QrCode);
                b.HasIndex(x => x.ScannedAt);
            });

            // TET Readiness Configuration
            modelBuilder.Entity<TETReadinessRecord>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Email).IsRequired().HasMaxLength(200);
                b.Property(x => x.Name).IsRequired().HasMaxLength(200);
                b.Property(x => x.ProtocolStatus).IsRequired().HasMaxLength(50);
                b.HasIndex(x => x.Email).IsUnique();
                b.HasIndex(x => x.ProtocolStatus);
                b.HasIndex(x => x.UpdatedAt);
                b.HasQueryFilter(x => !x.IsDeleted);
            });

            // Personal Wellbeing Configuration
            modelBuilder.Entity<PersonalWellbeingRecord>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Email).IsRequired().HasMaxLength(200);
                b.Property(x => x.PersonName).IsRequired().HasMaxLength(200);
                b.Property(x => x.Status).IsRequired().HasMaxLength(50);
                b.Property(x => x.PazInteriorScore).HasDefaultValue(50);
                b.HasIndex(x => x.Email);
                b.HasIndex(x => x.PeriodStartDate);
                b.HasIndex(x => x.IsActive);
            });

            // Chinese Medicine Snapshot Configuration
            modelBuilder.Entity<ChineseMedicineSnapshot>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Email).IsRequired().HasMaxLength(200);
                b.Property(x => x.PersonName).IsRequired().HasMaxLength(200);
                b.Property(x => x.Status).IsRequired().HasMaxLength(50);
                b.Property(x => x.ConstitutionalType).IsRequired().HasMaxLength(50);
                b.HasIndex(x => x.Email);
                b.HasIndex(x => x.SnapshotDate);
                b.HasIndex(x => x.QiScore);
            });
        }
    }
}
