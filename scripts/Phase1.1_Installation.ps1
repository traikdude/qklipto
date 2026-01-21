# ============================================
# CLIPTO RESURRECTION - PHASE 1: INSTALLATION
# Step 1.1: Install Clipto v7.2.17
# ============================================

Write-Host ""
Write-Host "=== PHASE 1.1: CLIPTO INSTALLATION ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$installerPath = "$PSScriptRoot\clipto-7.2.17.exe"
$expectedHash = "5258899BFA826096A1484408E6E97CF94C728C44CCEF360980CA7F39793CAC71"

# Verify installer exists
if (-not (Test-Path $installerPath)) {
    Write-Host "❌ ERROR: Installer not found!" -ForegroundColor Red
    Write-Host "   Expected location: $installerPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run Phase 0.2 first to download the installer." -ForegroundColor Yellow
    exit 1
}

# Re-verify hash before installation
Write-Host "🔐 Verifying installer hash..." -ForegroundColor Cyan
$actualHash = (Get-FileHash -Path $installerPath -Algorithm SHA256).Hash

if ($actualHash -ne $expectedHash) {
    Write-Host "❌ HASH MISMATCH! Installation aborted." -ForegroundColor Red
    Write-Host ""
    Write-Host "Expected: $expectedHash" -ForegroundColor Yellow
    Write-Host "Actual:   $actualHash" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  DO NOT PROCEED - The installer may be compromised!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Hash verified!" -ForegroundColor Green
Write-Host ""

# Check for existing installation
$cliptoAppPath = "$env:LOCALAPPDATA\Programs\Clipto"
if (Test-Path "$cliptoAppPath\Clipto.exe") {
    Write-Host "⚠️  Existing Clipto installation detected" -ForegroundColor Yellow
    Write-Host "   Location: $cliptoAppPath" -ForegroundColor Gray
    Write-Host ""
    
    $response = Read-Host "Reinstall anyway? (Y/N)"
    if ($response -ne 'Y' -and $response -ne 'y') {
        Write-Host ""
        Write-Host "Installation cancelled. Using existing installation." -ForegroundColor Yellow
        Write-Host "Proceeding to Phase 1.2 (Air-Gap Configuration)" -ForegroundColor Cyan
        exit 0
    }
}

# Run installer
Write-Host "🚀 Launching installer..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Installation Notes:" -ForegroundColor Yellow
Write-Host "  • The installer will open a GUI window" -ForegroundColor Gray
Write-Host "  • Use default installation location" -ForegroundColor Gray
Write-Host "  • DO NOT launch Clipto after installation completes" -ForegroundColor Gray
Write-Host "  • We need to configure firewall air-gap first!" -ForegroundColor Gray
Write-Host ""

try {
    # Start installer and wait for completion
    $process = Start-Process -FilePath $installerPath -PassThru -Wait
    
    if ($process.ExitCode -eq 0) {
        Write-Host "✅ Installation completed successfully!" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Installer exited with code: $($process.ExitCode)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Installation failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verify installation
Write-Host "🔍 Verifying installation..." -ForegroundColor Cyan
$exePath = "$cliptoAppPath\Clipto.exe"

if (Test-Path $exePath) {
    Write-Host "✅ Clipto.exe found at: $cliptoAppPath" -ForegroundColor Green
    
    try {
        $version = (Get-Item $exePath).VersionInfo
        Write-Host "   Version: $($version.FileVersion)" -ForegroundColor Yellow
    }
    catch {
        Write-Host "   (Version info unavailable)" -ForegroundColor Gray
    }
}
else {
    Write-Host "⚠️  WARNING: Clipto.exe not found at expected location" -ForegroundColor Yellow
    Write-Host "   Installer may have used a different path" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Searching for Clipto.exe..." -ForegroundColor Cyan
    
    $found = Get-ChildItem -Path "$env:LOCALAPPDATA" -Recurse -Filter "Clipto.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($found) {
        Write-Host "✅ Found at: $($found.FullName)" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Could not locate Clipto.exe" -ForegroundColor Red
        Write-Host "   Installation may have failed" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "=== PHASE 1.1 COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: DO NOT launch Clipto yet!" -ForegroundColor Yellow
Write-Host "   We need to configure the firewall air-gap first" -ForegroundColor Yellow
Write-Host "   to prevent timeout issues." -ForegroundColor Yellow
Write-Host ""
Write-Host "Next step: Run '.\Phase1.2_AirGapFirewall.ps1'" -ForegroundColor Cyan
Write-Host ""
