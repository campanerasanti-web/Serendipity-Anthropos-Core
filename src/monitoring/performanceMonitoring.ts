/**
 * Performance Monitoring Setup
 * Integrates Sentry, metrics, and error tracking
 */

import * as Sentry from '@sentry/react';

export const initializePerformanceMonitoring = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
    environment: import.meta.env.MODE,
    release: '1.0.0',
    sendDefaultPii: true,
  });

  console.log('✅ Sentry initialized for error tracking');
};

// Custom performance metrics
export const performanceMetrics = {
  // Dashboard load time
  recordDashboardLoadTime: (duration: number) => {
    Sentry.captureMessage(`Dashboard loaded in ${duration}ms`, 'info');
    if (duration > 3000) {
      Sentry.captureMessage(`⚠️ Dashboard slow load: ${duration}ms`, 'warning');
    }
  },

  // API response time
  recordApiTime: (endpoint: string, duration: number) => {
    Sentry.captureMessage(`API ${endpoint}: ${duration}ms`, 'info');
    if (duration > 2000) {
      Sentry.captureException(new Error(`Slow API: ${endpoint} (${duration}ms)`));
    }
  },

  // Realtime latency
  recordRealtimeLatency: (latency: number) => {
    if (latency > 1000) {
      Sentry.captureMessage(`⚠️ Slow realtime update: ${latency}ms`, 'warning');
    }
  },

  // Memory usage - removed due to non-standard API
  // Use performance.memory with proper type guards in monitoring libraries
  recordMemoryUsage: () => {
    // Memory API not available on all browsers, skipped
  },
};

// Web Vitals tracking
export const trackWebVitals = () => {
  // Simple Core Web Vitals tracking
  try {
    // Monitor document visibility
    if (document.hidden) {
      Sentry.captureMessage('App backgrounded', 'info');
    }

    // Capture page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        Sentry.captureMessage('App backgrounded', 'info');
      } else {
        Sentry.captureMessage('App resumed', 'info');
      }
    });
  } catch (e) {
    console.warn('Web Vitals tracking not available');
  }
};
