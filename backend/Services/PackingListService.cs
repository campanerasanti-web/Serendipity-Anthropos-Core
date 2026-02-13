using System;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;

namespace ElMediadorDeSofia.Services
{
    public class PackingListService
    {
        private readonly AppDbContext _db;
        private readonly EventService _events;

        public PackingListService(AppDbContext db, EventService events)
        {
            _db = db;
            _events = events;
        }

        public async Task<PackingList> GeneratePackingListAsync(Lot lot)
        {
            // Create a basic packing list object; no file generation
            var pl = new PackingList
            {
                LotId = lot.Id,
                TotalSf = lot.ExpectedAmount,
                CreatedAt = DateTime.UtcNow
            };

            _db.Add(pl);
            await _db.SaveChangesAsync();

            // Register event
            await _events.AppendEventAsync("Lot", lot.Id, "packinglist.generated", new { PackingListId = pl.Id, lotId = lot.Id }, "system");

            return pl;
        }
    }
}
