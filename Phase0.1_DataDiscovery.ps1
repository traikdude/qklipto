# ============================================
# CLIPTO RESURRECTION - PHASE 0: PRE-FLIGHT SAFETY
# Step 0.1: Existing Data Discovery & Backup
# ============================================

Write-Host ""
Write-Host "=== PHASE 0.1: EXISTING DATA DISCOVERY ===" -ForegroundColor Cyan
Write-Host ""

# Define paths
$cliptoAppData = "$env:APPDATA\Clipto"
$cliptoLocal = "$env:LOCALAPPDATA\Programs\Clipto"
$oneDriveBackup = "$env:USERPROFILE\OneDrive\CliptoArchive"
$localBackup = "$env:USERPROFILE\Documents\CliptoArchive"

# Check for existing data
$existingDataFound = $false

if (Test-Path $cliptoAppData) {
    $existingDataFound = $true
    Write-Host "✅ FOUND: Existing Clipto AppData" -ForegroundColor Green
    Write-Host "   Path: $cliptoAppData" -ForegroundColor Yellow
    
    # Show size and file count
    try {
        $files = Get-ChildItem -Path $cliptoAppData -Recurse -File -ErrorAction SilentlyContinue
        $totalSize = ($files | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "   Files: $($files.Count) | Size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Yellow
    } catch {
        Write-Host "   (Unable to calculate size)" -ForegroundColor Gray
    }
    
    # Create timestamped backup
    $timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
    
    # Try OneDrive first, fallback to Documents
    $backupPath = if (Test-Path "$env:USERPROFILE\OneDrive") {
        "$oneDriveBackup`_$timestamp"
    } else {
        "$localBackup`_$timestamp"
    }
    
    Write-Host ""
    Write-Host "📦 Creating backup..." -ForegroundColor Cyan
    Write-Host "   Destination: $backupPath" -ForegroundColor Gray
    
    try {
        Copy-Item -Path $cliptoAppData -Destination $backupPath -Recurse -Force -ErrorAction Stop
        Write-Host "✅ BACKUP COMPLETE!" -ForegroundColor Green
        Write-Host "   Your existing Clipto data is SAFE at:" -ForegroundColor Green
        Write-Host "   $backupPath" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ BACKUP FAILED: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "⚠️  CRITICAL: Backup failed. Do NOT proceed with installation!" -ForegroundColor Red
        Write-Host "   Please manually copy $cliptoAppData to a safe location." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "📭 No existing Clipto data found in AppData" -ForegroundColor Gray
    Write-Host "   (This is normal for first-time installation)" -ForegroundColor Gray
}

Write-Host ""

# Check for existing installation
if (Test-Path $cliptoLocal) {
    Write-Host "✅ FOUND: Existing Clipto installation" -ForegroundColor Green
    Write-Host "   Path: $cliptoLocal" -ForegroundColor Yellow
    
    $exePath = "$cliptoLocal\Clipto.exe"
    if (Test-Path $exePath) {
        try {
            $version = (Get-Item $exePath).VersionInfo.FileVersion
            Write-Host "   Version: $version" -ForegroundColor Yellow
        } catch {
            Write-Host "   (Version info unavailable)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "📭 No existing Clipto installation found" -ForegroundColor Gray
    Write-Host "   (Ready for fresh installation)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== PHASE 0.1 COMPLETE ===" -ForegroundColor Cyan
Write-Host ""

if ($existingDataFound) {
    Write-Host "✅ SUCCESS: Your existing data has been preserved!" -ForegroundColor Green
    Write-Host "   You can safely proceed to Phase 0.2 (installer download)" -ForegroundColor Green
} else {
    Write-Host "✅ CLEAR: No existing data to backup." -ForegroundColor Green
    Write-Host "   Safe to proceed to Phase 0.2 (installer download)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next step: Run '.\Phase0.2_DownloadInstaller.ps1'" -ForegroundColor Cyan
Write-Host ""
