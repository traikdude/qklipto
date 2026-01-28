# ============================================
# QKLIPTO - CREATE CLEAN PROJECT STRUCTURE
# Organize files into dedicated qklipto directory
# ============================================

Write-Host ""
Write-Host "=== QKLIPTO PROJECT SETUP ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$currentDir = $PSScriptRoot
$qkliptoDir = "C:\Users\Erik\.gemini\antigravity\scratch\qklipto"

Write-Host "📦 Creating dedicated qklipto directory structure..." -ForegroundColor Cyan
Write-Host ""

# Create directory structure
$directories = @(
    $qkliptoDir,
    "$qkliptoDir\scripts",
    "$qkliptoDir\docs"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "✅ Exists: $dir" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📋 Copying project files..." -ForegroundColor Cyan
Write-Host ""

# Copy all Phase scripts
$scriptFiles = @(
    "Phase0.1_DataDiscovery.ps1",
    "Phase0.2_DownloadInstaller.ps1",
    "Phase1.1_Installation.ps1",
    "Phase1.2_AirGapFirewall.ps1",
    "Phase1.3_BackupAutomation.ps1",
    "Phase2.1_ExtractSource.ps1",
    "Phase2.2_AnalyzeSource.ps1"
)

foreach ($script in $scriptFiles) {
    $source = Join-Path $currentDir $script
    $dest = Join-Path "$qkliptoDir\scripts" $script
    
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dest -Force
        Write-Host "✅ Copied: $script" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $script" -ForegroundColor Yellow
    }
}

# Copy documentation
$docFiles = @(
    @{Source = "README.md"; Dest = "$qkliptoDir\README.md"},
    @{Source = ".gitignore"; Dest = "$qkliptoDir\.gitignore"},
    @{Source = "EXECUTION_GUIDE.md"; Dest = "$qkliptoDir\EXECUTION_GUIDE.md"},
    @{Source = "docs\PROGRESS.md"; Dest = "$qkliptoDir\docs\PROGRESS.md"}
)

foreach ($file in $docFiles) {
    $source = Join-Path $currentDir $file.Source
    
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $file.Dest -Force
        Write-Host "✅ Copied: $($file.Source)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $($file.Source)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📄 Creating project manifest..." -ForegroundColor Cyan

# Create package.json equivalent for the project
$manifest = @{
    name = "qklipto"
    version = "1.0.0"
    description = "Clipto Resurrection Toolkit - Custom sync solution for abandoned Clipto Pro"
    author = "Clipto Community"
    license = "MIT"
    repository = @{
        type = "git"
        url = "https://github.com/YOUR_USERNAME/qklipto.git"
    }
    scripts = @{
        "phase0.1" = "pwsh scripts/Phase0.1_DataDiscovery.ps1"
        "phase0.2" = "pwsh scripts/Phase0.2_DownloadInstaller.ps1"
        "phase1.1" = "pwsh scripts/Phase1.1_Installation.ps1"
        "phase1.2" = "pwsh scripts/Phase1.2_AirGapFirewall.ps1"
        "phase1.3" = "pwsh scripts/Phase1.3_BackupAutomation.ps1"
        "phase2.1" = "pwsh scripts/Phase2.1_ExtractSource.ps1"
        "phase2.2" = "pwsh scripts/Phase2.2_AnalyzeSource.ps1"
    }
    keywords = @("clipto", "resurrection", "electron", "sync", "firebase", "abandoned-software")
}

$manifest | ConvertTo-Json -Depth 3 | Out-File "$qkliptoDir\project.json" -Encoding UTF8
Write-Host "✅ Created: project.json" -ForegroundColor Green

Write-Host ""
Write-Host "=== PROJECT STRUCTURE CREATED ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📂 Directory: $qkliptoDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "   1. cd $qkliptoDir" -ForegroundColor White
Write-Host "   2. git init" -ForegroundColor White
Write-Host "   3. git add ." -ForegroundColor White
Write-Host "   4. git commit -m 'Initial commit: QKlipto v1.0'" -ForegroundColor White
Write-Host "   5. Create GitHub repo and push" -ForegroundColor White
Write-Host ""
