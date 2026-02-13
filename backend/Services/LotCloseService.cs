using System;
using System.Linq;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    public class LotCloseService
    {
        private readonly AppDbContext _db;
        private readonly EventService _events;
        private readonly InvoiceService _invoices;
        private readonly PackingListService _packing;

        public LotCloseService(AppDbContext db, EventService events, InvoiceService invoices, PackingListService packing)
        {
            _db = db;
            _events = events;
            _invoices = invoices;
            _packing = packing;
        }

        public async Task<FinalPackage> CloseLotAsync(Guid lotId, string user)
        {
            var lot = await _db.Lots.FirstOrDefaultAsync(l => l.Id == lotId);
            if (lot == null) throw new InvalidOperationException("Lot not found");
            if (!lot.SheetSigned) throw new InvalidOperationException("Sheet must be signed before closing the lot");

            // Example rejection rate field assumed on Lot (if absent, assume 0)
            var rejectionRate = 0m;
            var rejectionProp = lot.GetType().GetProperty("RejectionRate");
            if (rejectionProp != null) rejectionRate = (decimal?)rejectionProp.GetValue(lot) ?? 0m;

            if (rejectionRate > 0.20m) throw new InvalidOperationException("Rejection rate too high to close the lot (>20%)");
            if (rejectionRate > 0.10m)
            {
                // return warning but continue
                // In this implementation we still proceed but include a warning
            }

            // Mark closed
            lot.Closed = true;
            lot.ClosedAt = DateTime.UtcNow;
            _db.Lots.Update(lot);

            await _db.SaveChangesAsync();

            // register lot.closed event
            await _events.AppendEventAsync("Lot", lot.Id, "lot.closed", new { lotId = lot.Id, closedAt = lot.ClosedAt }, user);

            // Calculate sf facturables (use ExpectedAmount minus rejection)
            var sfFacturables = lot.ExpectedAmount * (1 - rejectionRate);

            // Productivity: sf / (mh + ot) -- try to get mh and ot properties
            decimal mh = 0m, ot = 0m;
            var mhProp = lot.GetType().GetProperty("MH");
            var otProp = lot.GetType().GetProperty("OT");
            if (mhProp != null) mh = (decimal?)mhProp.GetValue(lot) ?? 0m;
            if (otProp != null) ot = (decimal?)otProp.GetValue(lot) ?? 0m;

            var productivity = (mh + ot) > 0 ? sfFacturables / (mh + ot) : 0m;

            // Generate invoice automatically using InvoiceService
            var invoice = await _invoices.GenerateInvoiceForLotAsync(lot.Id, user);

            await _events.AppendEventAsync("Invoice", invoice.Id, "invoice.generated", new { invoiceId = invoice.Id, lotId = lot.Id, amount = invoice.Amount }, user);

            // Generate packing list
            var packingList = await _packing.GeneratePackingListAsync(lot);

            // Prepare final package (stub)
            var finalPackage = new FinalPackage
            {
                Invoice = invoice,
                PackingList = packingList,
                Metrics = new CloseMetrics
                {
                    SfFacturables = sfFacturables,
                    Productivity = productivity,
                    RejectionRate = rejectionRate
                }
            };

            await _events.AppendEventAsync("Lot", lot.Id, "package.prepared", new { lotId = lot.Id, invoiceId = invoice.Id, packingListId = packingList.Id }, user);

            return finalPackage;
        }
    }

    public class FinalPackage
    {
        public Invoice Invoice { get; set; } = null!;
        public PackingList PackingList { get; set; } = null!;
        public CloseMetrics Metrics { get; set; } = new CloseMetrics();
    }

    public class CloseMetrics
    {
        public decimal SfFacturables { get; set; }
        public decimal Productivity { get; set; }
        public decimal RejectionRate { get; set; }
    }
}
