import React from 'react';

export default function FinalPackageViewer({ packageData }) {
  if (!packageData) return null;

  const { invoice, packingList, metrics } = packageData;

  return (
    <div className="space-y-4">
      <section className="p-3 border rounded">
        <h4 className="font-semibold">Factura</h4>
        {invoice ? (
          <div>
            <div>ID: {invoice.id || invoice.idFactura || '—'}</div>
            <div>Total: {invoice.totalAmount ?? invoice.total_amount ?? invoice.amount ?? '—'}</div>
            <div>Cliente: {invoice.customerName ?? invoice.client ?? '—'}</div>
          </div>
        ) : (
          <div>No se generó factura.</div>
        )}
      </section>

      <section className="p-3 border rounded">
        <h4 className="font-semibold">Packing List</h4>
        {packingList ? (
          <div>
            <div>Total Sf: {packingList.totalSf ?? packingList.total_sf ?? '—'}</div>
            {packingList.items && packingList.items.length > 0 ? (
              <ul className="list-disc pl-5">
                {packingList.items.map((it, idx) => (
                  <li key={idx}>{it.description} — {it.sf}</li>
                ))}
              </ul>
            ) : (
              <div>No hay ítems en el packing list.</div>
            )}
          </div>
        ) : (
          <div>No se generó packing list.</div>
        )}
      </section>

      <section className="p-3 border rounded">
        <h4 className="font-semibold">Métricas</h4>
        {metrics ? (
          <div>
            <div>Productividad: {metrics.productivity ?? '—'}</div>
            <div>Sf Facturables: {metrics.sfFacturables ?? metrics.sf_facturables ?? '—'}</div>
            <div>Observaciones: {metrics.notes ?? '—'}</div>
          </div>
        ) : (
          <div>No hay métricas.</div>
        )}
      </section>
    </div>
  );
}
