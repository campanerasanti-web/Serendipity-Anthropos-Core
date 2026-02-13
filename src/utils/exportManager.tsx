import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface ExportData {
  stats: any;
  metrics: any[];
  invoices: any[];
  fixedCosts: any[];
  fileName?: string;
}

export const exportToPDF = (data: ExportData) => {
  const { stats, metrics, invoices, fixedCosts, fileName = 'Report' } = data;
  
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 15;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246);
  doc.text('🤖 Sofia Dashboard Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // ===== SECTION: FINANCIAL SUMMARY =====
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94);
  doc.text('📊 Financial Summary', 15, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  const totalIncomes = stats?.total_incomes || 0;
  const totalFixedCostsAmount = stats?.total_fixed_costs || 0;
  const balance = totalIncomes - totalFixedCostsAmount;

  doc.text(`Total Income: $${Number(totalIncomes).toFixed(2)}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Total Fixed Costs: $${Number(totalFixedCostsAmount).toFixed(2)}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Balance: $${Number(balance).toFixed(2)}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Runway: ${totalFixedCostsAmount > 0 ? (totalIncomes / totalFixedCostsAmount).toFixed(1) : 'N/A'} months`, 20, yPosition);
  yPosition += 15;

  // ===== SECTION: INVOICES =====
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94);
  doc.text('💰 Invoices', 15, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  invoices.slice(0, 10).forEach((invoice: any) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 15;
    }
    doc.text(`${invoice.invoice_number}: $${Number(invoice.total_amount).toFixed(2)} - ${invoice.description}`, 20, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // ===== SECTION: FIXED COSTS =====
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  doc.setFontSize(14);
  doc.setTextColor(239, 68, 68);
  doc.text('📋 Fixed Costs', 15, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  fixedCosts.slice(0, 5).forEach((cost: any) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 15;
    }
    const total = cost.payroll + cost.rent + cost.evn + cost.other_costs;
    doc.text(`${cost.month}/${cost.year}: $${Number(total).toFixed(2)} (Payroll: $${cost.payroll}, Rent: $${cost.rent})`, 20, yPosition);
    yPosition += 8;
  });

  // Save
  doc.save(`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (data: ExportData) => {
  const { stats, metrics, invoices, fixedCosts, fileName = 'Report' } = data;

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // ===== SHEET 1: SUMMARY =====
  const summary = [
    ['Dashboard Sofia - Financial Report'],
    ['Generated:', new Date().toLocaleString()],
    [],
    ['FINANCIAL SUMMARY'],
    ['Total Income', stats?.total_incomes || 0],
    ['Total Fixed Costs', stats?.total_fixed_costs || 0],
    ['Balance', (stats?.total_incomes || 0) - (stats?.total_fixed_costs || 0)],
    ['Runway (months)', stats?.total_fixed_costs > 0 ? (stats?.total_incomes || 0) / (stats?.total_fixed_costs || 0) : 'N/A'],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // ===== SHEET 2: INVOICES =====
  const invoiceData = [
    ['Invoice Number', 'Amount', 'Description', 'Date'],
    ...invoices.map((inv: any) => [
      inv.invoice_number,
      inv.total_amount,
      inv.description,
      new Date(inv.created_at).toLocaleDateString()
    ])
  ];

  const invoiceSheet = XLSX.utils.aoa_to_sheet(invoiceData);
  invoiceSheet['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 30 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, invoiceSheet, 'Invoices');

  // ===== SHEET 3: FIXED COSTS =====
  const costsData = [
    ['Month', 'Year', 'Payroll', 'Rent', 'Utilities', 'Other', 'Total'],
    ...fixedCosts.map((cost: any) => [
      cost.month,
      cost.year,
      cost.payroll,
      cost.rent,
      cost.evn,
      cost.other_costs,
      cost.payroll + cost.rent + cost.evn + cost.other_costs
    ])
  ];

  const costsSheet = XLSX.utils.aoa_to_sheet(costsData);
  costsSheet['!cols'] = [
    { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 12 },
    { wch: 12 }, { wch: 12 }, { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(workbook, costsSheet, 'Fixed Costs');

  // ===== SHEET 4: DAILY METRICS =====
  const metricsData = [
    ['Date', 'Daily Revenue', 'Daily Expenses', 'Daily Profit', 'Narrative', 'Confidence'],
    ...metrics.slice(0, 30).map((metric: any) => [
      metric.date,
      metric.daily_revenue,
      metric.daily_expenses,
      metric.daily_profit,
      metric.narrative,
      metric.confidence_score
    ])
  ];

  const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
  metricsSheet['!cols'] = [
    { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
    { wch: 40 }, { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Daily Metrics');

  // Save
  XLSX.writeFile(workbook, `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToCSV = (data: ExportData) => {
  const { invoices, fixedCosts, metrics, fileName = 'Report' } = data;

  // Build CSV for invoices
  const invoiceHeaders = 'Invoice Number,Amount,Description,Date\n';
  const invoiceRows = invoices
    .map((inv: any) => `"${inv.invoice_number}","${inv.total_amount}","${inv.description}","${new Date(inv.created_at).toLocaleDateString()}"`)
    .join('\n');
  
  const invoiceCSV = invoiceHeaders + invoiceRows;

  // Download invoices CSV
  downloadCSV(invoiceCSV, `${fileName}-invoices-${new Date().toISOString().split('T')[0]}.csv`);

  // Build CSV for fixed costs
  const costsHeaders = 'Month,Year,Payroll,Rent,Utilities,Other,Total\n';
  const costsRows = fixedCosts
    .map((cost: any) => `"${cost.month}","${cost.year}","${cost.payroll}","${cost.rent}","${cost.evn}","${cost.other_costs}","${cost.payroll + cost.rent + cost.evn + cost.other_costs}"`)
    .join('\n');
  
  const costsCSV = costsHeaders + costsRows;

  // Download costs CSV
  downloadCSV(costsCSV, `${fileName}-costs-${new Date().toISOString().split('T')[0]}.csv`);
};

const downloadCSV = (csv: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  link.download = fileName;
  link.click();
};

export const ExportButtons = ({ data }: { data: ExportData }) => {
  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    color: 'white',
    transition: 'all 0.3s ease',
    marginRight: '0.5rem'
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <button
        onClick={() => exportToPDF(data)}
        style={{ ...buttonStyle, background: 'rgb(239, 68, 68)' }}
      >
        📄 PDF
      </button>
      <button
        onClick={() => exportToExcel(data)}
        style={{ ...buttonStyle, background: 'rgb(34, 197, 94)' }}
      >
        📊 Excel
      </button>
      <button
        onClick={() => exportToCSV(data)}
        style={{ ...buttonStyle, background: 'rgb(59, 130, 246)' }}
      >
        📋 CSV
      </button>
    </div>
  );
};
