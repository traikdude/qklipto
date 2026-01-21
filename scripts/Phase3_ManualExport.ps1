# ============================================
# CLIPTO MANUAL EXPORT LAUNCHER
# Purpose: Launch Clipto with Remote Debugging enabled
# ============================================

Write-Host "🚀 Launching Clipto in Debug Mode..." -ForegroundColor Cyan

# 1. Kill running instances
Stop-Process -Name "Clipto" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# 2. Define Path
$cliptoPath = "C:\Users\Erik\AppData\Local\Programs\Clipto\Clipto.exe"

# 3. Launch with Debug Flag
# Note: We use "--" to tell the wrapper "pass these flags to Electron"
$args = @("--", "--remote-debugging-port=8315")

try {
    Start-Process -FilePath $cliptoPath -ArgumentList $args -PassThru
    
    Write-Host "✅ Launch command sent!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Open Chrome/Edge"
    Write-Host "2. Go to: http://localhost:8315"
    Write-Host "3. Click 'Clipto'"
    Write-Host "4. Paste the export script (I will provide it)"
    Write-Host ""
} catch {
    Write-Host "❌ Failed to launch: $_" -ForegroundColor Red
}
