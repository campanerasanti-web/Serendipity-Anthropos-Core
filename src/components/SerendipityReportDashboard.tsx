
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import jsPDF from 'jspdf';

interface ReportData {
  date: string;
  revenue: number;
  expenses: number;
  grossMargin: number;
  payroll: number;
  praraPct: number;
  teamSize: number;
  salesPerEmployee: number;
  errorRate: number;
  onTimeDelivery: number;
  activeOrders: number;
  alerts: Array<{ level: string; message: string; recommendation: string }>;
}

// Función para parsear el markdown del reporte
function parseReportMarkdown(md: string): ReportData | null {
  try {
    const get = (regex: RegExp, def = 0) => {
      const m = md.match(regex);
      if (!m) return def;
      const val = m[1].replace(/\./g, '').replace(/,/g, '');
      return Number(val);
    };
    const getPct = (regex: RegExp, def = 0) => {
      const m = md.match(regex);
      if (!m) return def;
      return Number(m[1].replace(/,/, '.'));
    };
    const getText = (regex: RegExp, def = '') => {
      const m = md.match(regex);
      return m ? m[1].trim() : def;
    };
    const date = getText(/# .+ - (\d{2}\/\d{2}\/\d{4})/);
    const revenue = get(/Revenue Mensual\*\*: ([\d\.]+) VND/);
    const expenses = get(/Gastos Mensuales\*\*: ([\d\.]+) VND/);
    const grossMargin = getPct(/Margen Bruto\*\*: ([\d\.]+)%/);
    const payroll = get(/Nómina\*\*: ([\d\.]+) VND/);
    const praraPct = getPct(/PRARA %\*\*: ([\d\.]+)%/);
    const teamSize = get(/Total personas\*\*: (\d+)/);
    const salesPerEmployee = get(/Ventas por empleado\*\*: ([\d\.]+) VND/);
    const errorRate = getPct(/Error Rate\*\*: ([\d\.]+)%/);
    const onTimeDelivery = getPct(/On-Time Delivery\*\*: ([\d\.]+)%/);
    const activeOrders = get(/Órdenes activas\*\*: (\d+)/);
    // Alertas
    const alertRegex = /### \d+\. \[(.+?)\] ([^\n]+)\n\n\*\*Mensaje\*\*: ([^\n]+)\n\n\*\*Recomendación\*\*: ([^\n]+)/g;
    const alerts: Array<{ level: string; message: string; recommendation: string }> = [];
    let match;
    while ((match = alertRegex.exec(md))) {
      alerts.push({
        level: match[1],
        message: match[3],
        recommendation: match[4],
      });
    }
    return {
      date,
      revenue,
      expenses,
      grossMargin,
      payroll,
      praraPct,
      teamSize,
      salesPerEmployee,
      errorRate,
      onTimeDelivery,
      activeOrders,
      alerts,
    };
  } catch {
    return null;
  }
}

export default function SerendipityReportDashboard() {
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    // Cargar el archivo markdown real (simulado aquí con import dinámico)
    fetch('/Serendipity bros 26/reportes-generados/reporte-2026-02-13.md')
      .then((res) => res.text())
      .then((md) => setReport(parseReportMarkdown(md)));
  }, []);

  const exportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.text(`Reporte Diario - ${report.date}`, 10, 10);
    doc.text(`Estado Financiero`, 10, 20);
    doc.text(`Revenue Mensual: ${report.revenue} VND`, 10, 30);
    doc.text(`Gastos Mensuales: ${report.expenses} VND`, 10, 40);
    doc.text(`Margen Bruto: ${report.grossMargin}%`, 10, 50);
    doc.text(`Nómina: ${report.payroll} VND`, 10, 60);
    doc.text(`PRARA %: ${report.praraPct}%`, 10, 70);
    doc.text(`Equipo`, 10, 80);
    doc.text(`Total personas: ${report.teamSize}`, 10, 90);
    doc.text(`Ventas por empleado: ${report.salesPerEmployee} VND`, 10, 100);
    doc.text(`Métricas Operativas`, 10, 110);
    doc.text(`Error Rate: ${report.errorRate}%`, 10, 120);
    doc.text(`On-Time Delivery: ${report.onTimeDelivery}%`, 10, 130);
    doc.text(`Órdenes activas: ${report.activeOrders}`, 10, 140);
    doc.text(`Alertas:`, 10, 150);
    report.alerts.forEach((a, i) => {
      doc.text(`${i + 1}. [${a.level}] ${a.message}`, 10, 160 + i * 20);
      doc.text(`Recomendación: ${a.recommendation}`, 10, 170 + i * 20);
    });
    doc.save(`Reporte_Serendipity_${report.date}.pdf`);
  };

  if (!report) return <div>Cargando reporte...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Reporte Diario - {report.date}</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <strong>Estado Financiero</strong>
            <ul>
              <li>Revenue Mensual: {report.revenue} VND</li>
              <li>Gastos Mensuales: {report.expenses} VND</li>
              <li>Margen Bruto: {report.grossMargin}%</li>
              <li>Nómina: {report.payroll} VND</li>
              <li>PRARA %: {report.praraPct}%</li>
            </ul>
          </div>
          <div className="mb-4">
            <strong>Equipo</strong>
            <ul>
              <li>Total personas: {report.teamSize}</li>
              <li>Ventas por empleado: {report.salesPerEmployee} VND</li>
            </ul>
          </div>
          <div className="mb-4">
            <strong>Métricas Operativas</strong>
            <ul>
              <li>Error Rate: {report.errorRate}%</li>
              <li>On-Time Delivery: {report.onTimeDelivery}%</li>
              <li>Órdenes activas: {report.activeOrders}</li>
            </ul>
          </div>
          <div className="mb-4">
            <strong>Alertas</strong>
            <ul>
              {report.alerts.map((a, i) => (
                <li key={i} className="mb-2">
                  <span className={`font-bold ${a.level === 'CRITICAL' ? 'text-red-600' : a.level === 'MEDIUM' ? 'text-yellow-600' : ''}`}>[{a.level}]</span> {a.message}
                  <br />
                  <span className="italic">Recomendación: {a.recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={exportPDF}>Exportar a PDF</Button>
        </CardContent>
      </Card>
    </div>
  );
}
