/**
 * Sentry Integration Examples
 * 
 * Quick reference for using Sentry throughout your app
 */

// ============================================
// 1. CAPTURING ERRORS
// ============================================

import * as Sentry from '@sentry/react';

// Automatic - already wrapped in ErrorBoundary
class MyComponent extends React.Component {
  render() {
    // Component errors will be caught automatically
    return <div>Content</div>;
  }
}

// Manual - explicit error capture
export function fetchDataExample() {
  try {
    const data = risky_operation();
    return data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { section: 'data-fetch' },
      level: 'error',
    });
    return null;
  }
}

// ============================================
// 2. PERFORMANCE TRACKING
// ============================================

import { performanceMetrics } from '../monitoring/performanceMonitoring';

export async function loadDashboardData() {
  const startTime = performance.now();

  // ... load your data ...

  const duration = performance.now() - startTime;
  performanceMetrics.recordDashboardLoadTime(duration);
}

export async function fetchInvoices() {
  const startTime = performance.now();

  const response = await fetch('/api/invoices');
  const duration = performance.now() - startTime;

  performanceMetrics.recordApiTime('/api/invoices', duration);
  return response.json();
}

// ============================================
// 3. USER CONTEXT TRACKING
// ============================================

export function onUserLogin(user: any) {
  // Set user context for all future errors
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });

  Sentry.captureMessage('User logged in', 'info');
}

export function onUserLogout() {
  Sentry.setUser(null);
  Sentry.captureMessage('User logged out', 'info');
}

// ============================================
// 4. CUSTOM MESSAGES
// ============================================

export function logFeatureUsage(feature: string) {
  Sentry.captureMessage(`Feature used: ${feature}`, 'info');
}

export function logWarning(message: string) {
  Sentry.captureMessage(message, 'warning');
}

export function logCritical(message: string) {
  Sentry.captureMessage(message, 'error');
}

// ============================================
// 5. TAGGING & BREADCRUMBS
// ============================================

export function userAction(action: string) {
  // Add breadcrumb for better context
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: action,
    level: 'info',
  });

  // Set tags for filtering in dashboard
  Sentry.setTag('last-action', action);
}

export function apiCall(endpoint: string, method: string, status: number) {
  Sentry.addBreadcrumb({
    category: 'api',
    message: `${method} ${endpoint} → ${status}`,
    level: status >= 500 ? 'error' : 'info',
  });
}

// ============================================
// 6. REACT HOOKS INTEGRATION
// ============================================

import { useEffect } from 'react';

export function useErrorTracking(componentName: string) {
  useEffect(() => {
    Sentry.setTag('component', componentName);
    Sentry.addBreadcrumb({
      category: 'component',
      message: `${componentName} mounted`,
    });

    return () => {
      Sentry.addBreadcrumb({
        category: 'component',
        message: `${componentName} unmounted`,
      });
    };
  }, [componentName]);
}

export function usePerformanceTracking(metricName: string) {
  const startTime = useRef(performance.now());

  useEffect(() => {
    return () => {
      const duration = performance.now() - startTime.current;
      Sentry.captureMessage(`${metricName} completed in ${duration.toFixed(2)}ms`, 'info');
    };
  }, [metricName]);
}

// ============================================
// 7. TESTING WITH SENTRY
// ============================================

import { useRef } from 'react';

export function SentryTestComponent() {
  const handleTestError = () => {
    throw new Error('Test error');
  };

  const handleTestMessage = () => {
    Sentry.captureMessage('Test message', 'info');
  };

  return (
    <div>
      <button onClick={handleTestError}>Throw Error</button>
      <button onClick={handleTestMessage}>Send Message</button>
    </div>
  );
}

// ============================================
// 8. API ERROR INTERCEPTOR
// ============================================

import axios from 'axios';

// Wrap API calls with Sentry tracking
export const setupSentryAxios = () => {
  const apiClient = axios.create();

  apiClient.interceptors.response.use(
    response => response,
    error => {
      const { status, statusText, config } = error.response || {};

      Sentry.captureException(error, {
        tags: {
          'api-error': true,
          'endpoint': config?.url,
          'method': config?.method,
          'status': status,
        },
        level: status >= 500 ? 'error' : 'warning',
      });

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// ============================================
// QUICK START
// ============================================

/*
1. In src/main.tsx:
   ✅ Already set up - Sentry initialized before render

2. In your components:
   import * as Sentry from '@sentry/react';
   
3. Wrap async operations:
   try {
     await doSomething();
   } catch (error) {
     Sentry.captureException(error);
   }

4. Track user actions:
   Sentry.captureMessage('User action', 'info');

5. Check dashboard:
   https://sentry.io/organizations/serendipity-bros/projects/serendipity-anthropos-core/
*/
