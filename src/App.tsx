import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { NotificationProvider } from './components/NotificationCenter';
import ErrorBoundary from './components/ErrorBoundary';
import ZenDashboard from './components/ZenDashboard';
import { SerendipityDashboard } from './components/SerendipityDashboard';
import AdminDashboard from './components/AdminDashboard';
import VisualizationDashboard from './components/VisualizationDashboard';
import HermeticBodyDashboard from './components/HermeticBodyDashboard';
import SofiaAgentsDashboard from './components/SofiaAgentsDashboard';
import { useQuery } from '@tanstack/react-query';
import { fetchUnifiedDashboard, fetchLast30DaysMetrics, localDataService } from './services/queries';
import { useAutonomicBody } from './hooks/useAutonomicBody';
import { useSupabaseRealtime } from './hooks/useSupabaseRealtime';
import { BarChart3, Settings, LayoutDashboard, Flame, Heart, Activity } from 'lucide-react';
import * as Sentry from '@sentry/react';

type Page = 'serendipity' | 'dashboard' | 'admin' | 'visualizations' | 'hermetic' | 'sofia';

const queryClient = new QueryClient();

// 🫀 Inicializa el Sistema Nervioso Autónomo GLOBALMENTE
import { initializeAutonomicSystem } from './services/autonomic-system';
const autonomicGlobal = initializeAutonomicSystem();

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState<Page>('serendipity');
  
  // 🫀 Sistema Nervioso Autónomo (hook para UI)
  const autonomic = useAutonomicBody();

  // 📊 Supabase Realtime - Invoices
  const { data: supabaseInvoices = [], loading: loadingInvoices, error: invoiceError } = useSupabaseRealtime(
    {
      table: 'invoices',
      event: '*',
      onError: (error) => {
        Sentry.captureException(error, {
          tags: { source: 'supabase-invoices' },
        });
      },
    }
  );

  // 📊 Supabase Realtime - Fixed Costs
  const { data: supabaseFixedCosts = [], loading: loadingFixedCosts, error: costsError } = useSupabaseRealtime(
    {
      table: 'fixed_costs',
      event: '*',
      onError: (error) => {
        Sentry.captureException(error, {
          tags: { source: 'supabase-fixed-costs' },
        });
      },
    }
  );

  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchUnifiedDashboard,
    retry: 1
  });

  const { data: metrics = [] } = useQuery({
    queryKey: ['last30Metrics'],
    queryFn: fetchLast30DaysMetrics,
    retry: 1
  });

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices_list'],
    queryFn: async () => {
      const result = await localDataService.fetchInvoices();
      return result.facturas || [];
    },
    retry: 1
  });

  const { data: fixedCostsData } = useQuery({
    queryKey: ['fixedCosts_list'],
    queryFn: async () => {
      const result = await localDataService.fetchFixedCosts();
      return result.costosFijos || [];
    },
    retry: 1
  });

  const invoices = invoicesData || [];
  const fixedCosts = fixedCostsData || [];

  const navContainerStyle: React.CSSProperties = {
    background: 'linear-gradient(to right, rgba(30, 41, 59, 0.9) 0%, rgba(20, 27, 45, 0.9) 100%)',
    borderBottom: '2px solid rgba(59, 130, 246, 0.2)',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem'
  };

  const navButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    background: isActive ? 'rgb(59, 130, 246)' : 'rgba(59, 130, 246, 0.2)',
    color: 'white'
  });

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={navContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}> Serendipity Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setCurrentPage('serendipity')} style={navButtonStyle(currentPage === 'serendipity')}>
            <LayoutDashboard width={16} height={16} />
            Serendipity
          </button>
          <button onClick={() => setCurrentPage('dashboard')} style={navButtonStyle(currentPage === 'dashboard')}>
            <LayoutDashboard width={16} height={16} />
            Zen
          </button>
          <button onClick={() => setCurrentPage('hermetic')} style={navButtonStyle(currentPage === 'hermetic')}>
            <Flame width={16} height={16} />
            Hermética
          </button>
          <button onClick={() => setCurrentPage('sofia')} style={navButtonStyle(currentPage === 'sofia')}>
            <Activity width={16} height={16} />
            Sofia
          </button>
          <button onClick={() => setCurrentPage('visualizations')} style={navButtonStyle(currentPage === 'visualizations')}>
            <BarChart3 width={16} height={16} />
            Visualizaciones
          </button>
          <button onClick={() => setCurrentPage('admin')} style={navButtonStyle(currentPage === 'admin')}>
            <Settings width={16} height={16} />
            Admin
          </button>

          {/* 🫀 Indicador del Sistema Nervioso Autónomo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            background: autonomic.healthStatus === 'healthy' ? 'rgba(34, 197, 94, 0.2)' :
                       autonomic.healthStatus === 'degraded' ? 'rgba(251, 146, 60, 0.2)' :
                       'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${autonomic.healthStatus === 'healthy' ? 'rgb(34, 197, 94)' :
                                autonomic.healthStatus === 'degraded' ? 'rgb(251, 146, 60)' :
                                'rgb(239, 68, 68)'}`
          }}>
            <Heart width={16} height={16} style={{
              animation: 'pulse 1.5s ease-in-out infinite',
              color: autonomic.healthStatus === 'healthy' ? 'rgb(34, 197, 94)' :
                     autonomic.healthStatus === 'degraded' ? 'rgb(251, 146, 60)' :
                     'rgb(239, 68, 68)'
            }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              {autonomic.healthStatus === 'healthy' ? '✓ Sistema Vivo' :
               autonomic.healthStatus === 'degraded' ? '⚠ Conexión Lenta' :
               '✗ Desconectado'}
            </span>
            <button 
              onClick={() => autonomic.syncNow()}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                marginLeft: '0.5rem'
              }}
            >
              Sincronizar
            </button>
          </div>
        </div>
      </nav>

      <div style={{ background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(15, 23, 42), rgb(49, 46, 129))' }}>
        {currentPage === 'serendipity' && <SerendipityDashboard />}
        {currentPage === 'dashboard' && <ZenDashboard />}
        {currentPage === 'hermetic' && <HermeticBodyDashboard />}
        {currentPage === 'sofia' && <SofiaAgentsDashboard />}
        {currentPage === 'admin' && <AdminDashboard />}
        {currentPage === 'visualizations' && <VisualizationDashboard metrics={metrics} invoices={invoices} fixedCosts={fixedCosts} />}
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </NotificationProvider>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
