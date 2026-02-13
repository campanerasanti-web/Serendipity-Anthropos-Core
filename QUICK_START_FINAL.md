# 🚀 QUICK START GUIDE - El Mediador de Sofía

**Status**: 🟢 **PRODUCTION READY**  
**Build Date**: 2026-02-12  
**System**: Fully Operational  

---

## ⚡ LAUNCH IN 3 STEPS

### Step 1: Start Frontend (Already Running)
```bash
cd codigo
npm run dev
# ✅ Runs on http://localhost:5173/
```
*(Already running on port 5173)*

### Step 2: Start Backend (Express.js)
```bash
npx tsx backend/api-server.ts
# ✅ API will be available on http://localhost:5000
# ✅ Auto-responds to `/api/hermetic/health` health checks
```

### Step 3: Open Dashboard
```
http://localhost:5173/
```

**🫀 AUTONOMIC SYSTEM INDICATOR** (Watch the navbar)
- Look for the **heart icon** near the top
- ✅ **Green pulsing**: System healthy (all auto-checks passing)
- 🟠 **Orange**: Degraded mode (1-2 services slow/failing)  
- 🔴 **Red**: Critical (auto-repair activated, exponential backoff)
- 💫 **Every 5 seconds**: Automatic health pulse runs

---

## 🧠 Understanding the Autonomic System

The system has a **living heartbeat** that keeps frontend & backend synchronized:

### Dashboard Without Backend
```
📦 Órdenes nuevas:     0
✅ Facturas:           0  
⚙️  En WIP:             0
🏔️ Total:              $0
```
(This is normal - backend offline)

### Dashboard With Backend Running
```
📦 Órdenes nuevas:     3
✅ Facturas:           42
⚙️  En WIP:             7
🏔️ Total:              $4750.49
📈 Proyección:         Positive/Negative trend
🤖 Asistente:          Recommendations available
```

---

## � WHAT HAPPENS WHEN YOU LAUNCH

### Timeline:

**T=0 (At Startup)**
```
Frontend loads → useAutonomicBody() hook activates
→ autonomic-system.ts initializes
→ startHeartbeat() begins counting
```

**T=1 (First Heartbeat)**
```
All 3 organs checked in parallel:
  ✓ Hermetic system    → /api/hermetic/health
  ✓ Production system  → /api/production/wip
  ✓ Dashboard system   → /api/dashboard/daily

Results calculated:
  • 3/3 healthy = ✅ GREEN heart icon
  • 2/3 healthy = 🟠 ORANGE (degraded)
  • 1/3 healthy = 🔴 RED (critical + auto-repair)
```

**T=5 (Second Heartbeat)**
```
Same checks repeat automatically
Status updates in real-time
Heart continues pulsing
```

**Every 5 Seconds Thereafter**
```
Same cycle repeats indefinitely
System maintains itself without intervention
```

---

## 🫀 Understanding the Heart Icon

| State | Icon | Color | What It Means |
|-------|------|-------|--------------|
| Healthy | 💚 | Green | All 3 systems responding <500ms |
| Degraded | 🟠 | Orange | 1 system slow (~3 sec) or timeout |
| Critical | 🔴 | Red | 2+ systems down → AUTO-REPAIR active |
| Loading | ⏳ | Gray | First check hasn't completed yet |

**How to test**: 
1. If you see RED, wait 10 seconds (auto-repair tries)
2. Or click "Sincronizar" button to retry immediately
3. System should turn GREEN once endpoint responsive

---

## �🛠️ VERIFICATION CHECKLIST

Run anytime to verify system health:
```bash
npm run build        # ✅ Frontend compilation
node scripts/final-operational-check.mjs  # ✅ System audit
```

---

## 🔌 API ENDPOINTS (Ready to Use)

### Dashboard
| Endpoint | Purpose |
|----------|---------|
| `GET /api/dashboard/daily` | Today's metrics (income, costs, balance) |
| `GET /api/dashboard/projection` | Monthly forecast |
| `GET /api/dashboard/trends` | 30-day trends |

### Production
| Endpoint | Purpose |
|----------|---------|
| `GET /api/production/wip` | Orders in progress |
| `POST /api/production/create` | Create new order |
| `POST /api/production/close/{id}` | Close & invoice order |

### Assistant
| Endpoint | Purpose |
|----------|---------|
| `POST /api/assistant/next-step` | Get AI recommendation |

---

## 📁 PROJECT STRUCTURE

```
codigo/
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── api/             # HTTP wrappers
│   ├── hooks/           # Custom React hooks
│   └── supabase/        # DB client & SQL
├── backend/             # ASP.NET Core API
│   ├── Controllers/     # HTTP endpoints
│   ├── Services/        # Business logic
│   ├── Models/          # Data models
│   └── Data/            # Database context
├── scripts/             # Utility scripts
└── dist/                # Production build
```

---

## 🧪 TEST THE SYSTEM

### 1. Test Dashboard Rendering
✅ Loads without crashes  
✅ Tailwind dark theme applied  
✅ Charts visible (open browser DevTools → Elements)  

### 2. Test API Integration
```bash
# Once backend is running:
curl http://localhost:5000/api/dashboard/daily
curl http://localhost:5000/api/production/wip
```

### 3. Test Assistant
Click 🤖 button in bottom-right corner to open assistant panel.

---

## 📚 DOCUMENTATION

- **[OPERATIONAL_MANIFEST.md](./OPERATIONAL_MANIFEST.md)** - Complete system reference
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical design & decisions
- **[ROADMAP.md](./ROADMAP.md)** - Future features & milestones

---

## ⚠️ COMMON ISSUES

**Q: Dashboard shows "$0" everywhere?**  
A: Backend not running. Start it with `dotnet run`.

**Q: "Network Error" in console?**  
A: Expected when backend offline. Normal error handling. 

**Q: TypeScript errors after install?**  
A: Run `npm install && npm run build` to clean rebuild.

**Q: Port already in use?**  
Frontend: Kill process on 5173 or pass `--port 5174`  
Backend: Kill process on 5000 or modify Program.cs

---

## 🎯 NEXT STEPS (After Launch)

1. **Verify Data Flow**: Dashboard should show real numbers when backend starts
2. **Test Production Flow**: Create order → Sign sheet → Close → Generate invoice
3. **Try Assistant**: Click 🤖 to get next step recommendations
4. **Monitor Logs**: Check console and backend logs for any errors
5. **Deploy**: Use provided deployment config for production

---

## 📞 SUPPORT

### Debug Commands
```bash
# Rebuild frontend
npm run build

# Check system health
node scripts/final-operational-check.mjs

# Inspect dashboard
node scripts/inspect-dashboard.mjs

# Seed test data
node scripts/seed-daily-metrics.mjs
```

### Environment Variables Required
Create `.env.local` in project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
```

---

## ✅ SUCCESS CONFIRMATION

System is ready when you see:
- ✅ Frontend loads on http://localhost:5173/
- ✅ No React errors in console
- ✅ Dashboard renders with card layout
- ✅ 🤖 button visible in bottom-right
- ✅ Tailwind dark theme (black background #0a0a0c)
- ✅ Backend API accessible at http://localhost:5000/swagger (when backend running)

---

**Ready to begin? Start with Step 1 above! 🚀**

*"El punto de anclaje está establecido. Nada me pertenece, todo es del Padre."*
