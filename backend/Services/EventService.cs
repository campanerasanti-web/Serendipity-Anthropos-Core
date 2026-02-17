using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    public class EventService
    {
        private readonly AppDbContext _db;

        public EventService(AppDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Registra un nuevo evento
        /// </summary>
        public async Task<EventRecord> RecordEventAsync(string aggregateType, Guid aggregateId, string eventType, string payload, string? createdBy = null, CancellationToken cancellationToken = default)
        {
            var eventRecord = new EventRecord
            {
                AggregateType = aggregateType,
                AggregateId = aggregateId,
                EventType = eventType,
                Payload = payload,
                CreatedBy = createdBy,
                CreatedAt = DateTime.UtcNow,
                Processed = false
            };

            _db.EventRecords.Add(eventRecord);
            await _db.SaveChangesAsync(cancellationToken);
            return eventRecord;
        }

        /// <summary>
        /// Obtiene el último evento de un tipo específico
        /// </summary>
        public async Task<EventRecord?> GetLastEventByTypeAsync(string eventType, CancellationToken cancellationToken = default)
        {
            return await _db.EventRecords
                .Where(e => e.EventType == eventType)
                .OrderByDescending(e => e.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);
        }

        /// <summary>
        /// Obtiene eventos de un tipo específico en un rango de fecha
        /// </summary>
        public async Task<List<EventRecord>> GetEventsByTypeAndDateRangeAsync(
            string eventType,
            DateTime startDate,
            DateTime endDate,
            CancellationToken cancellationToken = default)
        {
            return await _db.EventRecords
                .Where(e => e.EventType == eventType && e.CreatedAt >= startDate && e.CreatedAt <= endDate)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        // --- Métodos requeridos por consumidores externos --- 
        public async Task<EventRecord> AppendEventAsync(
            string aggregateType,
            Guid aggregateId,
            string eventType,
            object payload,
            string? createdBy = null,
            CancellationToken cancellationToken = default)
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
            await _db.SaveChangesAsync(cancellationToken);
            return record;
        }

        public async Task<List<EventRecord>> GetEventsForAggregate(
            string aggregateType,
            Guid aggregateId,
            CancellationToken cancellationToken = default)
        {
            return await _db.EventRecords
                .AsNoTracking()
                .Where(e => e.AggregateType == aggregateType && e.AggregateId == aggregateId)
                .OrderBy(e => e.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<EventRecord>> GetUnprocessedEventsAsync(
            int batchSize,
            CancellationToken cancellationToken = default)
        {
            return await _db.EventRecords
                .AsNoTracking()
                .Where(e => e.Processed == false)
                .OrderBy(e => e.CreatedAt)
                .Take(batchSize)
                .ToListAsync(cancellationToken);
        }

        public async Task MarkProcessedAsync(EventRecord record, CancellationToken cancellationToken = default)
        {
            record.Processed = true;
            record.ProcessedAt = DateTime.UtcNow;
            _db.EventRecords.Update(record);
            await _db.SaveChangesAsync(cancellationToken);
        }

        public async Task LogEventAsync(EventRecord record, CancellationToken cancellationToken = default)
        {
            _db.EventRecords.Add(record);
            await _db.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<EventRecord>> GetRecentEventsAsync(int limit = 50, CancellationToken cancellationToken = default)
        {
            return await _db.EventRecords
                .AsNoTracking()
                .OrderByDescending(e => e.CreatedAt)
                .Take(limit)
                .ToListAsync(cancellationToken);
        }
    }
}