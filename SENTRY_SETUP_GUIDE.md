## 🎯 Sentry Error Tracking & Performance Monitoring Setup

**Status:** ✅ Complete and Ready  
**DSN:** `https://171dbc414c78426de1b61d016550d11f@o4510886164103169.ingest.de.sentry.io/4510886196412496`  
**Organization:** serendipity-bros  
**Project:** serendipity-anthropos-core  

---

## ✅ Installation & Configuration Complete

### Packages Installed
```bash
npm install --save @sentry/react @sentry/vite-plugin
```

### Configuration Files Updated

1. **`.env` - Added Sentry DSN**
   ```env
   VITE_SENTRY_DSN=https://171dbc414c78426de1b61d016550d11f@o4510886164103169.ingest.de.sentry.io/4510886196412496
   ```

2. **`src/main.tsx` - Initialize Sentry**
   - ✅ Imports Sentry and monitoring functions
   - ✅ Calls `initializePerformanceMonitoring()` before render
   - ✅ Calls `trackWebVitals()` for performance metrics
   - ✅ Wraps App with `Sentry.ErrorBoundary`

3. **`src/monitoring/performanceMonitoring.ts` - Enhanced Config**
   - ✅ Fixed typo: `profilesSampleRate`
   - ✅ Added `sendDefaultPii: true` for user tracking
   - ✅ Configured BrowserTracing for performance monitoring
   - ✅ Set sample rates: 100% in DEV, 10% in PROD

---

## 🚀 How to Use Sentry

### 1. **Automatic Error Tracking** (Already Active)
```typescript
// All unhandled errors are automatically captured
// Error boundary in main.tsx catches React component errors
```

### 2. **Manual Error Capture**
```typescript
import * as Sentry from '@sentry/react';

// Capture an exception
try {
  riskyFunction();
} catch (error) {
  Sentry.captureException(error);
}
```

### 3. **Send Messages**
```typescript
// Info level
Sentry.captureMessage('User clicked button', 'info');

// Warning level
Sentry.captureMessage('High memory usage detected', 'warning');

// Error level
Sentry.captureMessage('Critical issue occurred', 'error');
```

### 4. **Set User Context** (For Tracking)
```typescript
Sentry.setUser({
  id: '123',
  email: 'user@example.com',
  username: 'santiago',
});
```

### 5. **Add Custom Tags**
```typescript
Sentry.setTag('dashboard', 'serendipity');
Sentry.setTag('version', '1.0.0');
```

### 6. **Performance Monitoring**
```typescript
import { performanceMetrics } from './monitoring/performanceMonitoring';

// Track dashboard load time
const startTime = performance.now();
// ... load dashboard ...
performanceMetrics.recordDashboardLoadTime(performance.now() - startTime);

// Track API response time
performanceMetrics.recordApiTime('/api/invoices', 1200);

// Track realtime latency
performanceMetrics.recordRealtimeLatency(450);

// Track memory usage
performanceMetrics.recordMemoryUsage();
```

---

## 🧪 Test Sentry Setup

### Option A: Use the Test Component
```typescript
import SentryErrorTester from './components/SentryErrorTester';

// Add to your app:
<SentryErrorTester />
```

**Component Features:**
- 🔥 **Break the World** - Throw an intentional error
- 📨 **Send Test Message** - Log a message to Sentry
- ⚠️ **Capture Exception** - Safely capture an error
- 👤 **Set User Context** - Add user tracking info

### Option B: Manual Test
```typescript
// In browser console:
import * as Sentry from '@sentry/react';
Sentry.captureMessage('Test message', 'info');
```

---

## 📊 Monitor Events in Sentry Dashboard

### Access Dashboard
**URL:** https://sentry.io/organizations/serendipity-bros/projects/serendipity-anthropos-core/

### What You'll See
1. **Error Events** - Unhandled exceptions and captured errors
2. **Performance** - Dashboard load time, API latency, Core Web Vitals (LCP, FID, CLS)
3. **User Sessions** - Which users are affected by errors
4. **Releases** - Track errors per version
5. **Alerts** - Set up notifications for critical issues

---

## ⚡ Performance Metrics Tracked

### Web Vitals (Core Web Vitals)
| Metric | Description | Target |
|--------|-----------|--------|
| **LCP** | Largest Contentful Paint | < 2.5s |
| **FID** | First Input Delay | < 100ms |
| **CLS** | Cumulative Layout Shift | < 0.1 |

### Custom Metrics
| Metric | Description | Tracking |
|--------|-----------|----------|
| **Dashboard Load** | Time to fully load dashboard | Alerts if > 3s |
| **API Response** | HTTP request duration | Alerts if > 2s |
| **Realtime Latency** | WebSocket update delay | Alerts if > 1s |
| **Memory Usage** | JS heap memory usage | Alerts if > 85% |

---

## 🔒 Privacy & PII Handling

### Current Settings
- ✅ `sendDefaultPii: true` - Automatically captures IP address and user agent
- ✅ User context tracking enabled
- ✅ Full stack traces captured

### To Disable PII Collection (GDPR)
```typescript
// In src/monitoring/performanceMonitoring.ts
Sentry.init({
  // ... other options
  sendDefaultPii: false,  // Disable
});
```

---

## 🔗 Integration with CI/CD

### Sentry Build Plugin (Already Added)
```json
// package.json
{
  "dependencies": {
    "@sentry/vite-plugin": "^4.9.1"
  }
}
```

### GitHub Actions Integration
- Sourcemaps auto-upload on build
- Release tracking
- Deploy notifications

**Configured in:** `.github/workflows/CI_CD.yml`

---

## 🐛 Debugging Tips

### Check if Sentry is Initialized
```typescript
import * as Sentry from '@sentry/react';
console.log(Sentry.getCurrentHub().getClient());
// Should output: SentryClient object
```

### View Sent Events Locally
```typescript
// In dev console:
import * as Sentry from '@sentry/react';
Sentry.captureMessage('Test', 'info');
// Check Network tab → Sentry requests
```

### Enable Debug Mode
```typescript
// In .env
DEBUG=@sentry:*
```

---

## 📚 Additional Resources

### Documentation
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/performance/)
- [Web Vitals](https://docs.sentry.io/platforms/javascript/guides/react/performance/web-vitals/)

### Project URLs
- **Dashboard:** https://sentry.io/organizations/serendipity-bros/
- **Project:** https://sentry.io/organizations/serendipity-bros/projects/serendipity-anthropos-core/
- **Issues:** https://sentry.io/organizations/serendipity-bros/projects/serendipity-anthropos-core/issues/
- **Performance:** https://sentry.io/organizations/serendipity-bros/projects/serendipity-anthropos-core/performance/

---

## ✅ Verification Checklist

- [x] @sentry/react package installed
- [x] DSN configured in `.env`
- [x] Sentry initialized in main.tsx before render
- [x] Error boundary wrapping App
- [x] Web Vitals tracking enabled
- [x] Custom performance metrics available
- [x] SentryErrorTester component created
- [x] Sourcemaps plugin configured for builds
- [x] PII settings configured

---

**Ready to Monitor!** 🚀

Start your app with `npm run dev` and check Sentry dashboard at the URL above for real-time events.
