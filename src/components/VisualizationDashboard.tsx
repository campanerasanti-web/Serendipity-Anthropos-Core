import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface VisualizationProps {
  metrics: any[];
  invoices: any[];
  fixedCosts: any[];
}

const VisualizationDashboard: React.FC<VisualizationProps> = ({ metrics, invoices, fixedCosts }) => {
  // ===== DATA PREPARATION =====
  
  // Revenue trend (last 30 days)
  const revenueTrendData = metrics
    .slice(-30)
    .map((m: any) => ({
      date: new Date(m.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      revenue: m.daily_revenue,
      expenses: m.daily_expenses,
      profit: m.daily_profit
    }));

  // Monthly costs breakdown (last 3 months)
  const monthlyCostsData = fixedCosts
    .slice(-3)
    .map((c: any) => ({
      month: `${c.month}/${c.year}`,
      payroll: c.payroll,
      rent: c.rent,
      utilities: c.evn,
      other: c.other_costs
    }));

  // Invoice distribution (top 10)
  const topInvoicesData = invoices
    .sort((a: any, b: any) => b.total_amount - a.total_amount)
    .slice(0, 10)
    .map((inv: any) => ({
      name: inv.invoice_number,
      amount: inv.total_amount
    }));

  // Profitability over time
  const profitabilityData = metrics
    .slice(-14)
    .map((m: any) => ({
      date: new Date(m.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      profit: m.daily_profit,
      revenue: m.daily_revenue
    }));

  const chartContainerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'white',
    marginBottom: '1.5rem'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem' }}>📈 Visualizaciones Avanzadas</h1>

      <div style={gridStyle}>
        {/* ===== CHART 1: REVENUE TREND ===== */}
        <div style={chartContainerStyle}>
          <h2 style={titleStyle}>💹 Tendencia de Ingresos y Gastos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueTrendData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(239, 68, 68)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgb(239, 68, 68)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="date" stroke="rgb(148, 163, 184)" />
              <YAxis stroke="rgb(148, 163, 184)" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="rgb(34, 197, 94)" fillOpacity={1} fill="url(#colorRevenue)" name="Ingresos" />
              <Area type="monotone" dataKey="expenses" stroke="rgb(239, 68, 68)" fillOpacity={1} fill="url(#colorExpenses)" name="Gastos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ===== CHART 2: PROFITABILITY ===== */}
        <div style={chartContainerStyle}>
          <h2 style={titleStyle}>📊 Rentabilidad Diaria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="date" stroke="rgb(148, 163, 184)" />
              <YAxis stroke="rgb(148, 163, 184)" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="rgb(59, 130, 246)"
                dot={{ fill: 'rgb(59, 130, 246)', r: 4 }}
                activeDot={{ r: 6 }}
                name="Ganancia"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ===== CHART 3: COST BREAKDOWN ===== */}
        {monthlyCostsData.length > 0 && (
          <div style={chartContainerStyle}>
            <h2 style={titleStyle}>💰 Desglose de Costos Fijos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyCostsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="month" stroke="rgb(148, 163, 184)" />
                <YAxis stroke="rgb(148, 163, 184)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
                <Legend />
                <Bar dataKey="payroll" stackId="a" fill="rgb(168, 85, 247)" name="Nómina" />
                <Bar dataKey="rent" stackId="a" fill="rgb(59, 130, 246)" name="Alquiler" />
                <Bar dataKey="utilities" stackId="a" fill="rgb(251, 146, 60)" name="Utilidades" />
                <Bar dataKey="other" stackId="a" fill="rgb(99, 102, 241)" name="Otros" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ===== CHART 4: TOP INVOICES ===== */}
        {topInvoicesData.length > 0 && (
          <div style={chartContainerStyle}>
            <h2 style={titleStyle}>🏆 Top 10 Facturas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topInvoicesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis type="number" stroke="rgb(148, 163, 184)" />
                <YAxis dataKey="name" type="category" stroke="rgb(148, 163, 184)" width={80} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
                <Bar dataKey="amount" fill="rgb(34, 197, 94)" name="Monto" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ===== METRICS CARDS ===== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Average Daily Revenue */}
        <div style={{
          ...chartContainerStyle,
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
          border: '2px solid rgba(34, 197, 94, 0.2)'
        }}>
          <p style={{ color: 'rgb(134, 239, 172)', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Ingresos Diarios Promedio
          </p>
          <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
            ${(
              metrics.reduce((sum: number, m: any) => sum + (m.daily_revenue || 0), 0) / Math.max(metrics.length, 1)
            ).toFixed(2)}
          </p>
        </div>

        {/* Average Daily Expenses */}
        <div style={{
          ...chartContainerStyle,
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.2)'
        }}>
          <p style={{ color: 'rgb(252, 165, 165)', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Gastos Diarios Promedio
          </p>
          <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
            ${(
              metrics.reduce((sum: number, m: any) => sum + (m.daily_expenses || 0), 0) / Math.max(metrics.length, 1)
            ).toFixed(2)}
          </p>
        </div>

        {/* Average Daily Profit */}
        <div style={{
          ...chartContainerStyle,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '2px solid rgba(59, 130, 246, 0.2)'
        }}>
          <p style={{ color: 'rgb(147, 197, 253)', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Ganancia Diaria Promedio
          </p>
          <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
            ${(
              metrics.reduce((sum: number, m: any) => sum + (m.daily_profit || 0), 0) / Math.max(metrics.length, 1)
            ).toFixed(2)}
          </p>
        </div>

        {/* Total Invoice Count */}
        <div style={{
          ...chartContainerStyle,
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
          border: '2px solid rgba(168, 85, 247, 0.2)'
        }}>
          <p style={{ color: 'rgb(221, 214, 254)', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Total de Facturas
          </p>
          <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
            {invoices.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualizationDashboard;
