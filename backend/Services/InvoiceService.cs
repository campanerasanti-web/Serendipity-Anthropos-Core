using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;

namespace ElMediadorDeSofia.Services
{
    public class InvoiceService
    {
        private readonly AppDbContext _db;
        private readonly EventService _events;

        public InvoiceService(AppDbContext db, EventService events)
        {
            _db = db;
            _events = events;
        }

        public async Task<Invoice> GenerateInvoiceForLotAsync(Guid lotId, string createdBy)
        {
            var lot = await _db.Lots.FindAsync(lotId);
            if (lot == null) throw new InvalidOperationException("Lot not found");
            if (lot.Closed == false) throw new InvalidOperationException("Lot must be closed before generating an invoice");

            var invoice = new Invoice
            {
                LotId = lotId,
                Amount = lot.ExpectedAmount,
                CreatedAt = DateTime.UtcNow
            };

            _db.Invoices.Add(invoice);
            await _db.SaveChangesAsync();

            // Stub: generate PDF and save path
            invoice.PdfPath = await GeneratePdfStubAsync(invoice);
            await _db.SaveChangesAsync();

            await _events.AppendEventAsync("Lot", lotId, "InvoiceGenerated", new { InvoiceId = invoice.Id, Amount = invoice.Amount }, createdBy);

            return invoice;
        }

        public async Task ApplyInvoiceToPraraAsync(Guid invoiceId, string appliedBy)
        {
            var invoice = await _db.Invoices.FindAsync(invoiceId);
            if (invoice == null) throw new InvalidOperationException("Invoice not found");
            if (invoice.Applied) return;

            // Mark applied and create payment order
            invoice.Applied = true;
            invoice.AppliedAt = DateTime.UtcNow;

            var payment = new PaymentOrder
            {
                InvoiceId = invoice.Id,
                Amount = invoice.Amount,
                Status = PaymentStatus.Pending
            };

            _db.PaymentOrders.Add(payment);
            _db.Invoices.Update(invoice);
            await _db.SaveChangesAsync();

            await _events.AppendEventAsync("Invoice", invoice.Id, "InvoiceApplied", new { InvoiceId = invoice.Id, PaymentOrderId = payment.Id }, appliedBy);

            // Stub: prepare email
            await PrepareEmailStubAsync(invoice);
        }

        private Task<string> GeneratePdfStubAsync(Invoice invoice)
        {
            // Create a tiny PDF-like stub file (really just text) to simulate PDF generation
            var dir = Path.Combine(Directory.GetCurrentDirectory(), "invoices");
            Directory.CreateDirectory(dir);
            var path = Path.Combine(dir, $"invoice-{invoice.Id}.txt");
            File.WriteAllText(path, $"Invoice: {invoice.Id}\nLot: {invoice.LotId}\nAmount: {invoice.Amount}");
            return Task.FromResult(path);
        }

        private Task PrepareEmailStubAsync(Invoice invoice)
        {
            // Prepare an email payload and pretend to enqueue it
            var email = new
            {
                To = "accounting@example.com",
                Subject = $"Invoice ready: {invoice.Id}",
                Body = $"Invoice {invoice.Id} for {invoice.Amount} is ready. PDF: {invoice.PdfPath}"
            };

            var serialized = JsonSerializer.Serialize(email);
            // In real app, push to queue; here we just write to disk for demo
            var dir = Path.Combine(Directory.GetCurrentDirectory(), "mail-queue");
            Directory.CreateDirectory(dir);
            var path = Path.Combine(dir, $"email-{invoice.Id}.json");
            File.WriteAllText(path, serialized, Encoding.UTF8);
            return Task.CompletedTask;
        }
    }
}
