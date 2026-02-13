using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ElMediadorDeSofia.Services
{
    /// <summary>
    /// Servicio de reportes PDF para cierre de jornada
    /// </summary>
    public class OrderReportService
    {
        private readonly AppDbContext _db;

        public OrderReportService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<byte[]> GenerateDailyReportAsync(DateTime date)
        {
            var start = date.Date;
            var end = start.AddDays(1);

            var orders = await _db.Orders
                .Where(o => o.UpdatedAt >= start && o.UpdatedAt < end)
                .OrderBy(o => o.UpdatedAt)
                .ToListAsync();

            var summary = BuildSummary(orders);

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);
                    page.Size(PageSizes.A4);

                    page.Header()
                        .Text($"Cierre de Jornada - {start:yyyy-MM-dd}")
                        .FontSize(20)
                        .Bold();

                    page.Content()
                        .Column(column =>
                        {
                            column.Spacing(10);

                            column.Item().Text("Resumen").FontSize(14).Bold();
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn();
                                    columns.ConstantColumn(80);
                                });

                                foreach (var item in summary)
                                {
                                    table.Cell().Text(item.Label);
                                    table.Cell().AlignRight().Text(item.Value.ToString());
                                }
                            });

                            column.Item().Text("Ordenes del dia").FontSize(14).Bold();
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(120);
                                    columns.RelativeColumn();
                                    columns.ConstantColumn(80);
                                    columns.ConstantColumn(90);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Text("QR").Bold();
                                    header.Cell().Text("Cliente / Producto").Bold();
                                    header.Cell().Text("Estado").Bold();
                                    header.Cell().Text("Actualizado").Bold();
                                });

                                foreach (var order in orders)
                                {
                                    table.Cell().Text(order.QrCode);
                                    table.Cell().Text($"{order.Customer} - {order.Product}");
                                    table.Cell().Text(order.Status);
                                    table.Cell().Text(order.UpdatedAt.ToLocalTime().ToString("HH:mm"));
                                }
                            });

                            if (orders.Count == 0)
                            {
                                column.Item().Text(text =>
                                {
                                    text.Span("No se registraron actualizaciones hoy.")
                                        .FontColor(Colors.Grey.Medium);
                                });
                            }
                        });

                    page.Footer()
                        .AlignRight()
                        .Text(text =>
                        {
                            text.Span("Generado ")
                                .FontSize(9)
                                .FontColor(Colors.Grey.Medium);
                            text.Span(DateTime.UtcNow.ToLocalTime().ToString("yyyy-MM-dd HH:mm"))
                                .FontSize(9)
                                .FontColor(Colors.Grey.Medium);
                        });
                });
            });

            return document.GeneratePdf();
        }

        private static List<(string Label, int Value)> BuildSummary(List<OrderRecord> orders)
        {
            return new List<(string Label, int Value)>
            {
                ("Total", orders.Count),
                ("Pendientes", orders.Count(o => o.Status == "pending")),
                ("En Proceso", orders.Count(o => o.Status == "in-progress")),
                ("Completadas", orders.Count(o => o.Status == "completed")),
                ("Canceladas", orders.Count(o => o.Status == "cancelled"))
            };
        }
    }
}
