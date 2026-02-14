using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    public partial class EventService
    {
        private readonly AppDbContext _db;

        public EventService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<EventRecord> AppendEventAsync(string aggregateType, Guid aggregateId, string eventType, object payload, string? createdBy = null)
        {
            var record = new EventRecord
            {
                AggregateType = aggregateType,
                AggregateId = aggregateId,
                EventType = eventType,
                Payload = JsonSerializer.Serialize(payload),
                CreatedBy = createdBy,
                CreatedAt = DateTime.UtcNow,
                Processed = false
            };

            _db.EventRecords.Add(record);
            await _db.SaveChangesAsync();
            return record;
        }

        public async Task<List<EventRecord>> GetEventsForAggregate(string aggregateType, Guid aggregateId)
        {
            return await _db.EventRecords
                .Where(e => e.AggregateType == aggregateType && e.AggregateId == aggregateId)
                .OrderBy(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<EventRecord>> GetUnprocessedEventsAsync(int batch = 50)
        {
            return await _db.EventRecords
                .Where(e => !e.Processed)
                .OrderBy(e => e.CreatedAt)
                .Take(batch)
                .ToListAsync();
        }

        public async Task MarkProcessedAsync(EventRecord record)
        {
            record.Processed = true;
            record.ProcessedAt = DateTime.UtcNow;
            _db.EventRecords.Update(record);
            await _db.SaveChangesAsync();
        }

        public async Task LogEventAsync(EventRecord record)
        {
            _db.EventRecords.Add(record);
            await _db.SaveChangesAsync();
        }

        public async Task<List<EventRecord>> GetRecentEventsAsync(int limit = 50)
        {
            return await _db.EventRecords
                .OrderByDescending(e => e.CreatedAt)
                .Take(limit)
                .ToListAsync();
        }
    }
}
