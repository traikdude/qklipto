# ============================================
# CLIPTO RESURRECTION - PHASE 1: INSTALLATION
# Step 1.2: Configure Air-Gap Firewall
# ============================================

Write-Host ""
Write-Host "=== PHASE 1.2: AIR-GAP FIREWALL CONFIGURATION ===" -ForegroundColor Cyan
Write-Host ""

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ ERROR: This script requires Administrator privileges" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run PowerShell as Administrator:" -ForegroundColor Yellow
    Write-Host "  1. Right-click on PowerShell" -ForegroundColor Gray
    Write-Host "  2. Select 'Run as Administrator'" -ForegroundColor Gray
    Write-Host "  3. Navigate to: $PSScriptRoot" -ForegroundColor Gray
    Write-Host "  4. Run: .\Phase1.2_AirGapFirewall.ps1" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Locate Clipto.exe
Write-Host "🔍 Locating Clipto installation..." -ForegroundColor Cyan

$cliptoExePath = "$env:LOCALAPPDATA\Programs\Clipto\Clipto.exe"

if (-not (Test-Path $cliptoExePath)) {
    # Search for it
    Write-Host "   Searching for Clipto.exe..." -ForegroundColor Gray
    $found = Get-ChildItem -Path "$env:LOCALAPPDATA" -Recurse -Filter "Clipto.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($found) {
        $cliptoExePath = $found.FullName
        Write-Host "✅ Found at: $cliptoExePath" -ForegroundColor Green
    }
    else {
        Write-Host "❌ ERROR: Could not locate Clipto.exe" -ForegroundColor Red
        Write-Host "   Please install Clipto first (Phase 1.1)" -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "✅ Found at: $cliptoExePath" -ForegroundColor Green
}

Write-Host ""

# Check if firewall rule already exists
$existingRule = Get-NetFirewallRule -DisplayName "Block Clipto Outbound" -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "⚠️  Firewall rule already exists" -ForegroundColor Yellow
    Write-Host ""
    
    $response = Read-Host "Remove and recreate? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Remove-NetFirewallRule -DisplayName "Block Clipto Outbound"
        Write-Host "✅ Old rule removed" -ForegroundColor Green
        Write-Host ""
    }
    else {
        Write-Host "Keeping existing rule." -ForegroundColor Gray
        Write-Host ""
        Write-Host "=== PHASE 1.2 COMPLETE ===" -ForegroundColor Cyan
        exit 0
    }
}

# Create firewall rule to block outbound connections
Write-Host "🛡️  Creating firewall rule..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Rule Configuration:" -ForegroundColor Yellow
Write-Host "  • Name: Block Clipto Outbound" -ForegroundColor Gray
Write-Host "  • Direction: Outbound (prevent internet access)" -ForegroundColor Gray
Write-Host "  • Action: Block" -ForegroundColor Gray
Write-Host "  • Program: $cliptoExePath" -ForegroundColor Gray
Write-Host ""

try {
    New-NetFirewallRule `
        -DisplayName "Block Clipto Outbound" `
        -Description "Prevents Clipto from accessing dead Firebase servers (prevents timeout hangs)" `
        -Direction Outbound `
        -Program $cliptoExePath `
        -Action Block `
        -Profile Any `
        -Enabled True `
        -ErrorAction Stop | Out-Null
    
    Write-Host "✅ Firewall rule created successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to create firewall rule: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verify rule was created
$verifyRule = Get-NetFirewallRule -DisplayName "Block Clipto Outbound" -ErrorAction SilentlyContinue

if ($verifyRule) {
    Write-Host "🔍 Verification:" -ForegroundColor Cyan
    Write-Host "   Status: $($verifyRule.Enabled)" -ForegroundColor Yellow
    Write-Host "   Direction: $($verifyRule.Direction)" -ForegroundColor Yellow
    Write-Host "   Action: $($verifyRule.Action)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ Air-gap firewall is ACTIVE" -ForegroundColor Green
}
else {
    Write-Host "❌ WARNING: Could not verify firewall rule" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== PHASE 1.2 COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Clipto is now air-gapped!" -ForegroundColor Green
Write-Host ""
Write-Host "What this means:" -ForegroundColor Yellow
Write-Host "  ✅ Clipto cannot access the internet" -ForegroundColor Green
Write-Host "  ✅ No timeout hangs when trying to reach Firebase" -ForegroundColor Green
Write-Host "  ✅ App will function in offline mode" -ForegroundColor Green
Write-Host "  ❌ Cloud sync will NOT work (expected)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next step: Run '.\Phase1.3_BackupAutomation.ps1'" -ForegroundColor Cyan
Write-Host ""
