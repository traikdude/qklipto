# ============================================
# CLIPTO RESURRECTION - PHASE 2: SOURCE EXTRACTION
# Step 2.1: Extract Desktop Source Code
# ============================================

Write-Host ""
Write-Host "=== PHASE 2.1: DESKTOP SOURCE CODE EXTRACTION ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Goal: Extract source code from Clipto Electron app" -ForegroundColor Yellow
Write-Host "   Electron apps bundle source in ASAR archives" -ForegroundColor Gray
Write-Host "   We can unpack them to access the full codebase!" -ForegroundColor Gray
Write-Host ""

# Configuration
$cliptoAppPath = "$env:LOCALAPPDATA\Programs\Clipto"
$resourcesPath = "$cliptoAppPath\resources"
$asarFile = "$resourcesPath\app.asar"
$outputPath = "$PSScriptRoot\CliptoDesktopSource"

# Step 1: Verify Clipto installation
Write-Host "🔍 Step 1: Verifying Clipto installation..." -ForegroundColor Cyan

if (-not (Test-Path $cliptoAppPath)) {
    Write-Host "❌ ERROR: Clipto not found at: $cliptoAppPath" -ForegroundColor Red
    Write-Host "   Please complete Phase 1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Clipto found at: $cliptoAppPath" -ForegroundColor Green
Write-Host ""

# Step 2: Check for app.asar
Write-Host "🔍 Step 2: Locating app.asar bundle..." -ForegroundColor Cyan

if (Test-Path $asarFile) {
    Write-Host "✅ Found: $asarFile" -ForegroundColor Green
    $fileSize = (Get-Item $asarFile).Length / 1MB
    Write-Host "   Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Yellow
} else {
    Write-Host "❌ ERROR: app.asar not found!" -ForegroundColor Red
    Write-Host "   Expected at: $asarFile" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Searching for ASAR files..." -ForegroundColor Cyan
    $foundAsar = Get-ChildItem -Path $cliptoAppPath -Recurse -Filter "*.asar" -ErrorAction SilentlyContinue
    
    if ($foundAsar) {
        Write-Host "Found ASAR files:" -ForegroundColor Yellow
        $foundAsar | ForEach-Object {
            Write-Host "  • $($_.FullName)" -ForegroundColor Gray
        }
        Write-Host ""
        Write-Host "Please update `$asarFile variable and re-run" -ForegroundColor Yellow
    } else {
        Write-Host "❌ No ASAR files found in Clipto directory" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""

# Step 3: Check if Node.js is installed
Write-Host "🔍 Step 3: Checking for Node.js..." -ForegroundColor Cyan

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Installing Node.js..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPTION 1: Install via Winget (Recommended)" -ForegroundColor Cyan
    Write-Host "  Run: winget install OpenJS.NodeJS" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTION 2: Download installer" -ForegroundColor Cyan
    Write-Host "  URL: https://nodejs.org/en/download/" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing Node.js, re-run this script" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 4: Check if asar is installed
Write-Host "🔍 Step 4: Checking for asar tool..." -ForegroundColor Cyan

try {
    $asarVersion = npx asar --version 2>$null
    if ($asarVersion) {
        Write-Host "✅ asar tool available: v$asarVersion" -ForegroundColor Green
    } else {
        throw "asar not found"
    }
} catch {
    Write-Host "⚠️  asar not installed globally" -ForegroundColor Yellow
    Write-Host "   Installing asar via npx (no global install needed)..." -ForegroundColor Cyan
    Write-Host ""
}

Write-Host ""

# Step 5: Create output directory
Write-Host "🔍 Step 5: Creating output directory..." -ForegroundColor Cyan

if (Test-Path $outputPath) {
    Write-Host "⚠️  Output directory already exists" -ForegroundColor Yellow
    Write-Host "   Location: $outputPath" -ForegroundColor Gray
    Write-Host ""
    
    $response = Read-Host "Delete and re-extract? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Remove-Item -Path $outputPath -Recurse -Force
        Write-Host "✅ Old directory removed" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Using existing extraction." -ForegroundColor Gray
        Write-Host "Skipping to analysis..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "=== PHASE 2.1 COMPLETE ===" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📂 Source code location:" -ForegroundColor Yellow
        Write-Host "   $outputPath" -ForegroundColor White
        Write-Host ""
        Write-Host "Next step: Run '.\Phase2.2_AnalyzeSource.ps1'" -ForegroundColor Cyan
        exit 0
    }
}

New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
Write-Host "✅ Created: $outputPath" -ForegroundColor Green
Write-Host ""

# Step 6: Extract the ASAR archive
Write-Host "🔍 Step 6: Extracting app.asar..." -ForegroundColor Cyan
Write-Host "   This may take 30-60 seconds..." -ForegroundColor Gray
Write-Host ""

try {
    # Use npx to run asar without global install
    $extractCmd = "npx -y @electron/asar extract `"$asarFile`" `"$outputPath`""
    Write-Host "Running: $extractCmd" -ForegroundColor Gray
    Write-Host ""
    
    Invoke-Expression $extractCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Extraction complete!" -ForegroundColor Green
    } else {
        throw "asar extraction failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ Extraction failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 7: Verify extraction
Write-Host "🔍 Step 7: Verifying extracted files..." -ForegroundColor Cyan

$fileCount = (Get-ChildItem -Path $outputPath -Recurse -File).Count
$dirCount = (Get-ChildItem -Path $outputPath -Recurse -Directory).Count

Write-Host "✅ Extraction verified!" -ForegroundColor Green
Write-Host "   Files: $fileCount" -ForegroundColor Yellow
Write-Host "   Directories: $dirCount" -ForegroundColor Yellow
Write-Host ""

# Show key files
Write-Host "📋 Key files found:" -ForegroundColor Cyan

$keyFiles = @(
    "package.json",
    "main.js",
    "index.js",
    "app.js"
)

foreach ($file in $keyFiles) {
    $found = Get-ChildItem -Path $outputPath -Recurse -Filter $file -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (not found)" -ForegroundColor Gray
    }
}

Write-Host ""

# Step 8: Search for database-related files
Write-Host "🔍 Step 8: Searching for database files..." -ForegroundColor Cyan

$dbPatterns = @("*.db", "*.sqlite", "*.sqlite3", "*database*", "*storage*", "*db.js", "*database.js")
$dbFiles = @()

foreach ($pattern in $dbPatterns) {
    $found = Get-ChildItem -Path $outputPath -Recurse -Filter $pattern -ErrorAction SilentlyContinue
    $dbFiles += $found
}

if ($dbFiles.Count -gt 0) {
    Write-Host "✅ Found $($dbFiles.Count) database-related files:" -ForegroundColor Green
    $dbFiles | Select-Object -First 10 | ForEach-Object {
        Write-Host "   • $($_.Name)" -ForegroundColor Yellow
    }
    if ($dbFiles.Count -gt 10) {
        Write-Host "   ... and $($dbFiles.Count - 10) more" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  No obvious database files found" -ForegroundColor Yellow
    Write-Host "   Will analyze code structure next" -ForegroundColor Gray
}

Write-Host ""

# Summary
Write-Host "=== PHASE 2.1 COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Desktop source code extracted!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Source code location:" -ForegroundColor Yellow
Write-Host "   $outputPath" -ForegroundColor White
Write-Host ""
Write-Host "📊 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Analyze package.json for dependencies" -ForegroundColor Gray
Write-Host "   2. Find database implementation" -ForegroundColor Gray
Write-Host "   3. Locate Firebase sync code" -ForegroundColor Gray
Write-Host "   4. Compare with Android source" -ForegroundColor Gray
Write-Host ""
Write-Host "Next step: Run '.\Phase2.2_AnalyzeSource.ps1'" -ForegroundColor Cyan
Write-Host ""
