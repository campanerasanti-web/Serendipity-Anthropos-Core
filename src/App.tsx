import React, { useState } from 'react';
import { AuthProvider, useAuth, LoginForm, UserProfile } from './components/AuthManager';
import Dashboard from './components/Dashboard';
import { useNotification } from './hooks/useNotification';
import { NotificationUniversal } from './components/NotificationUniversal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { I18nProvider } from './i18n/I18nContext';
import styles from './styles/App.module.css';
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

// 🧪 Componente de prueba para Sentry (solo en development)
function ErrorButton() {
  // Solo renderiza en modo development
  if (!import.meta.env.DEV) return null;
  
  return (
    <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: '2px solid rgba(239, 68, 68, 0.5)',
        background: 'rgba(239, 68, 68, 0.1)',
        color: 'rgb(239, 68, 68)',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.75rem',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
      }}
    >
      🧪 Test Sentry
    </button>
  );
}

type Page = 'serendipity' | 'dashboard' | 'admin' | 'visualizations' | 'hermetic' | 'sofia';

const queryClient = new QueryClient();

// 🫀 Inicializa el Sistema Nervioso Autónomo GLOBALMENTE
import { initializeAutonomicSystem } from './services/autonomic-system';
const autonomicGlobal = initializeAutonomicSystem();

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState<Page>('serendipity');
  const { notifications, addNotification, markAsRead } = useNotification();
  const { user, loading } = useAuth();

  // Ejemplo: agregar notificación universal
  const handleAddNotification = () => {
    addNotification({
      id: Date.now().toString(),
      type: 'info',
      message: '🌱 ¡Semilla de notificación germinada!',
      createdAt: new Date(),
      read: false
    });
  };

  if (loading) return <div className={styles.appContainer}><div style={{color: 'white', textAlign: 'center', marginTop: '4rem'}}>Cargando autenticación...</div></div>;
  if (!user) return <LoginForm />;

  return (
    <div className={styles.appContainer}>
      <div style={{ position: 'absolute', top: 16, right: 16 }}><UserProfile /></div>
      <nav className={styles.navContainer}>
        <div className={styles.navTitle}>
          <h1> Serendipity Dashboard</h1>
        </div>

        <div className={styles.navButtons}>
          <button className={styles.navButton} onClick={handleAddNotification}>
            🌱 Notificar
          </button>
                {/* Notificaciones universales germinadas */}
                <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 1000, minWidth: 320 }}>
                  {notifications.map(n => (
                    <NotificationUniversal key={n.id} notification={n} onRead={markAsRead} />
                  ))}
                </div>
          <button onClick={() => setCurrentPage('serendipity')} className={navButtonClass(currentPage === 'serendipity')}>
            <LayoutDashboard width={16} height={16} />
            Serendipity
          </button>
          <button onClick={() => setCurrentPage('dashboard')} className={navButtonClass(currentPage === 'dashboard')}>
            <LayoutDashboard width={16} height={16} />
            Zen
          </button>
          <button onClick={() => setCurrentPage('hermetic')} className={navButtonClass(currentPage === 'hermetic')}>
            <Flame width={16} height={16} />
            Hermética
          </button>
          <button onClick={() => setCurrentPage('sofia')} className={navButtonClass(currentPage === 'sofia')}>
            <Activity width={16} height={16} />
            Sofia
          </button>
          <button onClick={() => setCurrentPage('visualizations')} className={navButtonClass(currentPage === 'visualizations')}>
            <BarChart3 width={16} height={16} />
            Visualizaciones
          </button>
          <button onClick={() => setCurrentPage('admin')} className={navButtonClass(currentPage === 'admin')}>
            <Settings width={16} height={16} />
            Admin
          </button>

          {/* 🧪 Botón de prueba de Sentry */}
          <ErrorButton />

          {/* 🫀 Indicador del Sistema Nervioso Autónomo */}
          <div className={styles.infoBox} style={{
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
            <span className={styles.infoText}>
              {autonomic.healthStatus === 'healthy' ? '✓ Sistema Vivo' :
               autonomic.healthStatus === 'degraded' ? '⚠ Conexión Lenta' :
               '✗ Desconectado'}
            </span>
            <button 
              onClick={() => autonomic.syncNow()}
              className={styles.navButton}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                marginLeft: '0.5rem',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
              }}
            >
              Sincronizar
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.gradientBg}>
        {currentPage === 'serendipity' && <SerendipityDashboard />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'hermetic' && <HermeticBodyDashboard />}
        {currentPage === 'sofia' && <SofiaAgentsDashboard />}
        {currentPage === 'visualizations' && <VisualizationDashboard />}
        {currentPage === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
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

          {/* � Botón de prueba de Sentry */}
          <ErrorButton />

          {/* �🫀 Indicador del Sistema Nervioso Autónomo */}
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
      <I18nProvider defaultLanguage="es" defaultRole="admin">
        <AuthProvider>
          <NotificationProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </NotificationProvider>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
