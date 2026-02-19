console.log('%c ⚡ SOFÍA ESTÁ DESPIERTA ⚡ ', 'background: #222; color: #bada55; font-size: 20px');
import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './i18n/I18nContext' // Initialize i18n context
import App from './App' // Import App sin extensión
import { initializePerformanceMonitoring, trackWebVitals } from './monitoring/performanceMonitoring'
import { testSentryConnection } from './utils/sentryDiagnostics'
import './index.css'

// ✅ Initialize Sentry BEFORE rendering
initializePerformanceMonitoring();
trackWebVitals();



// Tipado global para import.meta.env
declare global {
  interface ImportMeta {
    env: {
      DEV: boolean;
      MODE: string;
      VITE_API_URL?: string;
      VITE_SENTRY_DSN?: string;
    };
  }
}

// 🔍 Diagnose Sentry connection in dev
if (import.meta.env.DEV) {
  testSentryConnection().catch((err: unknown) => console.error('Diagnostic error:', err));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div>An error occurred. Please refresh the page.</div>} showDialog>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)
