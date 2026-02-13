using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElMediadorDeSofia.Models
{
    public class PackingListItem
    {
        public string Description { get; set; } = string.Empty;
        public decimal Sf { get; set; }
    }

    public class PackingList
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid LotId { get; set; }

        [NotMapped]
        public List<PackingListItem> Items { get; set; } = new List<PackingListItem>();

        public decimal TotalSf { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
