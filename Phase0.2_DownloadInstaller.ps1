# ============================================
# CLIPTO RESURRECTION - PHASE 0: PRE-FLIGHT SAFETY
# Step 0.2: Download & Verify Installer
# ============================================

Write-Host ""
Write-Host "=== PHASE 0.2: INSTALLER DOWNLOAD & VERIFICATION ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$installerUrl = "https://github.com/clipto-pro/Desktop/releases/download/v7.2.17/clipto-7.2.17.exe"
$installerPath = "$PSScriptRoot\clipto-7.2.17.exe"

# Download installer
Write-Host "📥 Downloading Clipto v7.2.17 from GitHub..." -ForegroundColor Cyan
Write-Host "   URL: $installerUrl" -ForegroundColor Gray
Write-Host ""

try {
    # Use Invoke-WebRequest with progress
    $ProgressPreference = 'SilentlyContinue'  # Speeds up download
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -ErrorAction Stop
    $ProgressPreference = 'Continue'
    
    Write-Host "✅ Download complete!" -ForegroundColor Green
    Write-Host "   Saved to: $installerPath" -ForegroundColor Yellow
} catch {
    Write-Host "❌ DOWNLOAD FAILED: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Check your internet connection" -ForegroundColor Gray
    Write-Host "  2. Verify GitHub is accessible" -ForegroundColor Gray
    Write-Host "  3. Try downloading manually from:" -ForegroundColor Gray
    Write-Host "     https://github.com/clipto-pro/Desktop/releases/tag/v7.2.17" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Verify file size (should be around 50-150 MB for Electron app)
$fileSize = (Get-Item $installerPath).Length / 1MB
Write-Host "📊 File size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Yellow

if ($fileSize -lt 10) {
    Write-Host "⚠️  WARNING: File seems too small. Download may be corrupted." -ForegroundColor Yellow
}

Write-Host ""

# Calculate SHA-256 hash
Write-Host "🔐 Calculating SHA-256 hash..." -ForegroundColor Cyan
$actualHash = (Get-FileHash -Path $installerPath -Algorithm SHA256).Hash
Write-Host "   Hash: $actualHash" -ForegroundColor Yellow

Write-Host ""
Write-Host "=== VERIFICATION ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 IMPORTANT: Community Hash Verification" -ForegroundColor Yellow
Write-Host ""
Write-Host "This is an abandoned app. To ensure safety, we need to verify" -ForegroundColor Gray
Write-Host "this installer hash against the Discord community or d0x360." -ForegroundColor Gray
Write-Host ""
Write-Host "Your installer hash:" -ForegroundColor Cyan
Write-Host "  $actualHash" -ForegroundColor White
Write-Host ""
Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
Write-Host "  1. Share this hash in the Clipto Discord community" -ForegroundColor Gray
Write-Host "  2. Ask if others can confirm this matches their v7.2.17 installer" -ForegroundColor Gray
Write-Host "  3. OR: If you already have a trusted hash, compare it manually" -ForegroundColor Gray
Write-Host ""
Write-Host "Once verified, you can proceed to Phase 1 (Installation)" -ForegroundColor Green
Write-Host ""

# Save hash to file for easy sharing
$hashReportPath = "$PSScriptRoot\clipto-7.2.17_HASH_REPORT.txt"
@"
Clipto Desktop v7.2.17 Hash Report
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

Installer: clipto-7.2.17.exe
Source: https://github.com/clipto-pro/Desktop/releases/tag/v7.2.17

SHA-256 Hash:
$actualHash

File Size: $([math]::Round($fileSize, 2)) MB
Download Date: $(Get-Date -Format 'yyyy-MM-dd')

VERIFICATION STATUS: PENDING
Please verify this hash with the Clipto Discord community before installation.

Discord Community: [Your Discord link here]
Contact: d0x360 (co-founder)
"@ | Out-File -FilePath $hashReportPath -Encoding UTF8

Write-Host "📄 Hash report saved to:" -ForegroundColor Cyan
Write-Host "   $hashReportPath" -ForegroundColor Yellow
Write-Host "   (You can share this file in Discord)" -ForegroundColor Gray
Write-Host ""

Write-Host "=== PHASE 0.2 COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Installer downloaded and hash calculated" -ForegroundColor Green
Write-Host "⏸️  PAUSED: Awaiting community hash verification" -ForegroundColor Yellow
Write-Host ""
Write-Host "After verification, run: .\Phase1_Installation.ps1" -ForegroundColor Cyan
Write-Host ""
