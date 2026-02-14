/**
 * Performance Monitoring Setup
 * Integrates Sentry, metrics, and error tracking
 */

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initializePerformanceMonitoring = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: undefined, // Add React Router integration if needed
        tracingOrigins: ['localhost', import.meta.env.VITE_API_URL, /^\//],
      }),
    ],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
    profiles SampleRate: import.meta.env.DEV ? 1.0 : 0.1,
    environment: import.meta.env.MODE,
    release: '1.0.0',
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
    const span = Sentry.startSpan({ op: 'http.client', description: endpoint });
    span?.setDuration(duration);
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

  // Memory usage
  recordMemoryUsage: () => {
    if (performance.memory) {
      const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const percentUsed = (usedJSHeapSize / jsHeapSizeLimit) * 100;

      Sentry.captureMessage(
        `Memory usage: ${percentUsed.toFixed(1)}% (${(usedJSHeapSize / 1024 / 1024).toFixed(1)}MB)`,
        'info'
      );

      if (percentUsed > 85) {
        Sentry.captureMessage(`⚠️ High memory usage: ${percentUsed.toFixed(1)}%`, 'warning');
      }
    }
  },
};

// Web Vitals tracking
export const trackWebVitals = () => {
  // LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    Sentry.captureMessage(`LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`, 'info');
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // FID (First Input Delay)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      Sentry.captureMessage(`FID: ${entry.processingDuration}ms`, 'info');
    });
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // CLS (Cumulative Layout Shift)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if ((entry as any).hadRecentInput) return;
      clsValue += (entry as any).value;
      Sentry.captureMessage(`CLS: ${clsValue}`, 'info');
    });
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });
};
