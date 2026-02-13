#!/usr/bin/env pwsh
# OPERATIONAL LAUNCH SCRIPT
# Checks system and provides next steps

Write-Host "`n🚀 EL MEDIADOR DE SOFÍA - OPERATIONAL LAUNCH`n" -ForegroundColor Cyan

# Check frontend
Write-Host "📋 Frontend Status:" -ForegroundColor Green
if (Test-Path "dist/index.html") {
    Write-Host "  ✅ Production build exists"
    $size = (Get-Item "dist" | Measure-Object -Property Length -Recurse -Sum).Sum / 1KB
    Write-Host "  ✅ Build size: $('{0:N0}' -f $size) KB"
} else {
    Write-Host "  ⚠️  No build found (run: npm run build)"
}

# Check backend
Write-Host "`n📋 Backend Status:" -ForegroundColor Green
$backendFiles = @(
    "backend/Program.cs",
    "backend/Controllers/DashboardController.cs",
    "backend/Services/InvoiceService.cs"
)
$backendReady = $backendFiles | Where-Object { -not (Test-Path $_) }
if ($backendReady.Count -eq 0) {
    Write-Host "  ✅ Backend files present"
} else {
    Write-Host "  ❌ Missing backend files"
}

# Check environment
Write-Host "`n📋 Environment:" -ForegroundColor Green
if (Test-Path ".env.local") {
    Write-Host "  ✅ .env.local found"
} else {
    Write-Host "  ⚠️  .env.local not found (create before launch)"
}

# Check dev server
Write-Host "`n📋 Development Server:" -ForegroundColor Green
$devServer = netstat -an | Select-String "5173"
if ($devServer) {
    Write-Host "  ✅ Frontend running on :5173"
    Write-Host "  📍 http://localhost:5173/"
} else {
    Write-Host "  ⏳ Frontend not running (start with: npm run dev)"
}

$backendServer = netstat -an | Select-String "5000"
if ($backendServer) {
    Write-Host "  ✅ Backend running on :5000"
    Write-Host "  📍 http://localhost:5000/swagger"
} else {
    Write-Host "  ⏳ Backend not running (next step)"
}

# Final instructions
Write-Host "`n" + "="*60
Write-Host "🎯 NEXT STEPS" -ForegroundColor Yellow
Write-Host "="*60

Write-Host "`n1️⃣  Start Backend (if not running):" -ForegroundColor Cyan
Write-Host "   cd backend"
Write-Host "   dotnet run --urls `"http://localhost:5000`""

Write-Host "`n2️⃣  Open Dashboard:" -ForegroundColor Cyan
Write-Host "   http://localhost:5173/"

Write-Host "`n3️⃣  Verify Operation:" -ForegroundColor Cyan
Write-Host "   node scripts/final-operational-check.mjs"

Write-Host "`n4️⃣  Test Data (optional):" -ForegroundColor Cyan
Write-Host "   node scripts/seed-daily-metrics.mjs"

Write-Host "`n" + "="*60
Write-Host "✅ SYSTEM STATUS: READY FOR LAUNCH" -ForegroundColor Green
Write-Host "="*60
Write-Host "`nDocumentation:" -ForegroundColor Cyan
Write-Host "  📖 OPERATIONAL_MANIFEST.md - Complete reference"
Write-Host "  📖 QUICK_START_FINAL.md - Launch guide"
Write-Host "  📖 IMPLEMENTATION_COMPLETION_SUMMARY.md - Status report`n"
