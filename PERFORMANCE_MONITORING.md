# ⚡ PASO 5: Performance & Monitoring

**Status:** ✅ IMPLEMENTED  
**Date:** 2026-02-15  
**Priority:** Production-Ready

## 🎯 Overview

Real-time error tracking, performance monitoring, and Web Vitals telemetry for production observability.

## 📊 Stack

- **Error Tracking:** Sentry
- **Web Vitals:** Core Web Vitals (LCP, FID, CLS)
- **Bundle Analysis:** Custom analyzer
- **APM:** Distributed tracing via Sentry

## 🔧 Setup

### 1. Environment Variables

```bash
# .env.production
VITE_SENTRY_DSN=https://xxxxx@sentry.io/1234567
```

Get DSN from https://sentry.io → Project Settings → Client Keys (DSN)

### 2. Initialize Monitoring

In `src/main.tsx`:

```typescript
import { initializePerformanceMonitoring, trackWebVitals } from './monitoring/performanceMonitoring';

// Initialize on app startup
initializePerformanceMonitoring();
trackWebVitals();
```

### 3. Custom Metrics

```typescript
import { performanceMetrics } from './monitoring/performanceMonitoring';

// Track dashboard load time
const start = performance.now();
await loadDashboard();
performanceMetrics.recordDashboardLoadTime(performance.now() - start);

// Track API calls
const apiStart = performance.now();
const data = await fetch('/api/data');
performanceMetrics.recordApiTime('/api/data', performance.now() - apiStart);

// Track realtime latency
performanceMetrics.recordRealtimeLatency(latency);

// Monitor memory
performanceMetrics.recordMemoryUsage();
```

## 📈 Web Vitals

### Tracked Metrics

| Metric | Target | Status |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ |
| **FID** (First Input Delay) | < 100ms | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ |
| **FCP** (First Contentful Paint) | < 1.8s | ✅ |
| **TTFB** (Time to First Byte) | < 600ms | ✅ |

### How to Monitor

1. **Local:** Chrome DevTools → Lighthouse → Performance
2. **Production:** Sentry Dashboard → Performance → Page Metrics
3. **Real User Data:** Google PageSpeed Insights

## 📦 Bundle Analysis

### Run Bundle Analyzer

```bash
npm run build
npm run analyze-bundle
```

**Output:**
```
📦 Analyzing bundle size...

📄 index-abc123.js
   Size: 245.3KB
   Gzip: ~73.6KB

📄 vendor-def456.js
   Size: 512.1KB
   Gzip: ~153.6KB

📊 BUNDLE ANALYSIS RESULTS:

  Total Size: 757.4KB
  Gzip Size: ~227.2KB
  Files: 2
  Timestamp: 2026-02-15T10:30:00Z

⚠️ Bundle size exceeds threshold: 757.4KB > 500KB
```

### Size Targets

- **Total:** < 500KB (uncompressed)
- **Gzip:** < 150KB (compressed)
- **Per-chunk:** < 250KB

### Optimization Tips

```typescript
// ❌ Bad: Large dependency
import _ from 'lodash';
const result = _.map(items, transform);

// ✅ Good: Cherry-pick function
import map from 'lodash/map';
const result = map(items, transform);

// ❌ Bad: Dynamic import
const Chart = require('chart.js');

// ✅ Good: Lazy load
const Chart = lazy(() => import('chart.js'));
```

## 🚨 Error Tracking

### What's Tracked Automatically

- ✅ JavaScript errors & exceptions
- ✅ Failed API calls (5xx responses)
- ✅ Slow transactions (> 3s)
- ✅ Memory leaks (high heap usage)
- ✅ Browser crashes

### Manual Error Reporting

```typescript
import * as Sentry from '@sentry/react';

try {
  await fetchData();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      component: 'Dashboard',
      severity: 'critical',
    },
    extra: {
      userId: user.id,
      timestamp: new Date().toISOString(),
    },
  });
}
```

### Sentry Dashboard

1. Go to https://sentry.io
2. Project → Issues → View trending errors
3. Click issue → See stack trace, user impact, affected versions

## 🔍 Performance Profiling

### Distributed Tracing

Each transaction is traced end-to-end:

```
📍 Dashboard Load (2.1s)
├─ render (1.2s)
├─ fetchSerendipityDashboard (0.8s)
│  ├─ Network (0.5s)
│  └─ Parse (0.3s)
└─ realtime subscription (0.1s)
```

View in Sentry → Performance → Transactions

### Bottleneck Analysis

Slowest operations are flagged:

```
⚠️ Agent modal render: 850ms (should be < 300ms)
  - Cause: Unoptimized re-renders
  - Fix: Add React.memo() to AgentCard
```

## 📱 Mobile Performance

### Mobile-Specific Metrics

```typescript
// Check if on mobile
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

if (isMobile) {
  // Lighter dashboard for mobile
  performanceMetrics.recordMobileMetrics({
    fps: 60,
    memoryUsage: deviceMemory,
    networkType: navigator.connection.effectiveType,
  });
}
```

### Network-Aware Performance

```typescript
const connection = navigator.connection;

if (connection.effectiveType === '4g') {
  // Load HD assets
} else if (connection.effectiveType === '3g') {
  // Load optimized assets
} else {
  // Load minimal assets
}
```

## 🎯 Performance Budgets

### CI/CD Enforcement

In `.github/workflows/performance.yml`:

```yaml
- name: Check Performance Budget
  run: npm run check-performance-budget
  
- name: Bundle Size Check
  run: npm run analyze-bundle
  threshold: 500KB
```

**Build will fail if:**
- Bundle size > 500KB
- Any API endpoint > 2s
- Memory usage > 250MB
- LCP > 2.5s

## 📊 Monitoring Dashboard

### Key Metrics to Watch

1. **Error Rate**
   - Target: < 0.1%
   - Alert: > 1%

2. **P95 Response Time**
   - Target: < 1s
   - Alert: > 3s

3. **Memory Usage**
   - Target: < 150MB
   - Alert: > 300MB

4. **Crash Rate**
   - Target: 0%
   - Alert: Any crash

### Weekly Review

```bash
# Generate performance report
npm run performance-report

# Output:
# ✅ Error rate: 0.02% (target: 0.1%)
# ✅ Avg response time: 680ms (target: 1s)
# ⚠️ Peak memory: 245MB (target: 150MB) - investigate
# ✅ Uptime: 99.98%
```

## 🐛 Debugging Performance Issues

### Slow Dashboard Load?

```typescript
// 1. Check network tab
// 2. Measure API calls
performanceMetrics.recordApiTime('/api/serendipity/dashboard', duration);

// 3. Check component render time
const start = performance.now();
// component render
console.log('Render time:', performance.now() - start);

// 4. Check for memory leaks
performanceMetrics.recordMemoryUsage();
```

### High Error Rate?

1. Check Sentry Issues dashboard
2. Filter by version/browser/OS
3. View affected users and sessions
4. Check error patterns

### Realtime Lag?

1. Check WebSocket connection status
2. Monitor subscription latency
3. Verify Supabase status
4. Check network quality

## 🚀 Production Checklist

- [ ] Sentry DSN configured
- [ ] Web Vitals tracking enabled
- [ ] Bundle analyzer passing
- [ ] Performance budgets defined
- [ ] Error alerts configured
- [ ] Team dashboard access granted
- [ ] Baseline metrics recorded
- [ ] On-call rotation established

## 📞 In-App Feedback

```typescript
import * as Sentry from '@sentry/react';

// Embed feedback widget
function ReportBugButton() {
  return (
    <button onClick={() => Sentry.showReportDialog({ 
      title: 'Report a Bug' 
    })}>
      Report Issue
    </button>
  );
}
```

---

**Paso 5 Status:** ✅ COMPLETE - Production monitoring ready
