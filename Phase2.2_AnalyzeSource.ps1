# ============================================
# CLIPTO RESURRECTION - PHASE 2: SOURCE ANALYSIS
# Step 2.2: Analyze Extracted Source Code
# ============================================

Write-Host ""
Write-Host "=== PHASE 2.2: SOURCE CODE ANALYSIS ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$sourcePath = "$PSScriptRoot\CliptoDesktopSource"
$reportPath = "$PSScriptRoot\SourceAnalysisReport.md"

# Verify source exists
if (-not (Test-Path $sourcePath)) {
    Write-Host "❌ ERROR: Source not found at $sourcePath" -ForegroundColor Red
    Write-Host "   Please run Phase2.1_ExtractSource.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Source found at: $sourcePath" -ForegroundColor Green
Write-Host ""

# Initialize report
$report = @"
# Clipto Desktop Source Code Analysis
**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Source:** Extracted from Clipto v7.2.17 app.asar

---

## 📦 Project Structure

"@

# Analyze package.json
Write-Host "🔍 Analyzing package.json..." -ForegroundColor Cyan

$packageJsonPath = Get-ChildItem -Path $sourcePath -Recurse -Filter "package.json" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($packageJsonPath) {
    Write-Host "✅ Found: $($packageJsonPath.FullName)" -ForegroundColor Green
    
    try {
        $packageJson = Get-Content $packageJsonPath.FullName -Raw | ConvertFrom-Json
        
        $report += @"

### package.json
- **Name:** $($packageJson.name)
- **Version:** $($packageJson.version)
- **Description:** $($packageJson.description)
- **Main Entry:** $($packageJson.main)

#### Key Dependencies
"@
        
        if ($packageJson.dependencies) {
            $packageJson.dependencies.PSObject.Properties | ForEach-Object {
                $report += "`n- **$($_.Name):** $($_.Value)"
                
                # Highlight database-related deps
                if ($_.Name -match "sqlite|level|db|database|storage") {
                    Write-Host "   📊 Database: $($_.Name) ($($_.Value))" -ForegroundColor Yellow
                }
                
                # Highlight Firebase
                if ($_.Name -match "firebase") {
                    Write-Host "   🔥 Firebase: $($_.Name) ($($_.Value))" -ForegroundColor Red
                }
            }
        }
        
    } catch {
        Write-Host "⚠️  Could not parse package.json: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  package.json not found" -ForegroundColor Yellow
}

Write-Host ""

# Search for database files
Write-Host "🔍 Searching for database implementation..." -ForegroundColor Cyan

$dbSearchTerms = @("sqlite", "level", "nedb", "lowdb", "indexeddb", "database", "storage", "db.js")
$dbFiles = @()

foreach ($term in $dbSearchTerms) {
    $found = Get-ChildItem -Path $sourcePath -Recurse -Filter "*$term*" -File -ErrorAction SilentlyContinue
    $dbFiles += $found
}

$report += @"


## 🗄️ Database Implementation

"@

if ($dbFiles.Count -gt 0) {
    Write-Host "✅ Found $($dbFiles.Count) database-related files" -ForegroundColor Green
    
    $report += "### Database Files Found`n"
    
    $dbFiles | Select-Object -First 15 | ForEach-Object {
        $relativePath = $_.FullName.Replace($sourcePath, ".")
        $report += "- ``$relativePath``  ($($_.Length) bytes)`n"
        Write-Host "   • $($_.Name)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  No obvious database files found" -ForegroundColor Yellow
    $report += "*No obvious database implementation files found.*`n"
}

Write-Host ""

# Search for Firebase/sync code
Write-Host "🔍 Searching for Firebase/sync implementation..." -ForegroundColor Cyan

$syncFiles = Get-ChildItem -Path $sourcePath -Recurse -Filter "*firebase*" -File -ErrorAction SilentlyContinue
$syncFiles += Get-ChildItem -Path $sourcePath -Recurse -Filter "*sync*" -File -ErrorAction SilentlyContinue

$report += @"


## 🔥 Firebase / Sync Implementation

"@

if ($syncFiles.Count -gt 0) {
    Write-Host "✅ Found $($syncFiles.Count) sync-related files" -ForegroundColor Green
    
    $report += "### Sync Files Found`n"
    
    $syncFiles | Select-Object -First 15 | ForEach-Object {
        $relativePath = $_.FullName.Replace($sourcePath, ".")
        $report += "- ``$relativePath``  ($($_.Length) bytes)`n"
        Write-Host "   • $($_.Name)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  No Firebase/sync files found" -ForegroundColor Yellow
    $report += "*No obvious sync implementation files found.*`n"
}

Write-Host ""

# Search for main entry points
Write-Host "🔍 Locating main entry points..." -ForegroundColor Cyan

$entryPoints = @("main.js", "index.js", "app.js", "main/index.js", "renderer/index.js")
$foundEntries = @()

$report += @"


## 🚀 Application Entry Points

"@

foreach ($entry in $entryPoints) {
    $found = Get-ChildItem -Path $sourcePath -Recurse -Filter $entry -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $foundEntries += $found
        $relativePath = $found.FullName.Replace($sourcePath, ".")
        $report += "- **$entry** → ``$relativePath```n"
        Write-Host "   ✅ $entry" -ForegroundColor Green
    }
}

Write-Host ""

# File statistics
Write-Host "📊 Generating file statistics..." -ForegroundColor Cyan

$allFiles = Get-ChildItem -Path $sourcePath -Recurse -File
$jsFiles = $allFiles | Where-Object { $_.Extension -in @(".js", ".jsx") }
$htmlFiles = $allFiles | Where-Object { $_.Extension -eq ".html" }
$cssFiles = $allFiles | Where-Object { $_.Extension -eq ".css" }
$jsonFiles = $allFiles | Where-Object { $_.Extension -eq ".json" }

$report += @"


## 📊 File Statistics

- **Total Files:** $($allFiles.Count)
- **JavaScript Files:** $($jsFiles.Count)
- **HTML Files:** $($htmlFiles.Count)
- **CSS Files:** $($cssFiles.Count)
- **JSON Files:** $($jsonFiles.Count)

## 📂 Directory Structure

``````
"@

# Show directory tree (top 2 levels)
$dirs = Get-ChildItem -Path $sourcePath -Directory -Depth 1 | Sort-Object FullName
foreach ($dir in $dirs) {
    $relativePath = $dir.FullName.Replace($sourcePath, "")
    $fileCount = (Get-ChildItem -Path $dir.FullName -File -Recurse).Count
    $report += "$relativePath/ ($fileCount files)`n"
}

$report += "``````"

$report += @"


## 🎯 Next Steps

1. **Locate Database Schema**
   - Search for table/collection definitions
   - Identify data models
   - Extract schema for comparison

2. **Analyze Sync Protocol**
   - Review Firebase integration code
   - Document sync API endpoints
   - Identify authentication flow

3. **Compare with Android Source**
   - Download Android repo: https://github.com/clipto-pro/Android
   - Compare database schemas
   - Check compatibility

4. **Design Custom Sync Solution**
   - Option A: Direct database sync (WiFi)
   - Option B: Self-hosted Firebase replacement
   - Option C: Export to Markdown

---

**Generated by Clipto Resurrection Protocol - Phase 2.2**
"@

# Save report
$report | Out-File -FilePath $reportPath -Encoding UTF8 -Force

Write-Host "✅ Analysis complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📄 Report saved to:" -ForegroundColor Yellow
Write-Host "   $reportPath" -ForegroundColor White
Write-Host ""

# Open report
Write-Host "Opening report..." -ForegroundColor Cyan
Start-Process $reportPath

Write-Host ""
Write-Host "=== PHASE 2.2 COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Next actions:" -ForegroundColor Yellow
Write-Host "   1. Review the analysis report" -ForegroundColor Gray
Write-Host "   2. Clone Android source for comparison" -ForegroundColor Gray
Write-Host "   3. Locate actual database files in AppData" -ForegroundColor Gray
Write-Host ""
Write-Host "Next step: Manual review and Phase 2.3 (Database Analysis)" -ForegroundColor Cyan
Write-Host ""
