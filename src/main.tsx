import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.tsx' // Explícitamente importar App.tsx
import { initializePerformanceMonitoring, trackWebVitals } from './monitoring/performanceMonitoring'
import './index.css'

// ✅ Initialize Sentry BEFORE rendering
initializePerformanceMonitoring();
trackWebVitals();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div>An error occurred. Please refresh the page.</div>} showDialog>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)