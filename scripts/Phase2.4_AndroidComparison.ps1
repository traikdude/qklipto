# ============================================
# CLIPTO RESURRECTION - PHASE 2.4
# Android Schema Comparison (ObjectBox JSON)
# ============================================

Write-Host ""
Write-Host "=== PHASE 2.4: ANDROID SCHEMA COMPARISON ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$androidJsonPath = "$PSScriptRoot\..\android-source-zip\clipto-android-main\app\objectbox-models\default.json"
$desktopSchemaPath = "$PSScriptRoot\CliptoSchema.json"
$reportPath = "$PSScriptRoot\..\docs\SCHEMA_COMPARISON.md"

# Step 1: Check for Desktop Schema
Write-Host "🔍 Step 1: Loading Desktop Schema..." -ForegroundColor Cyan

if (-not (Test-Path $desktopSchemaPath)) {
    Write-Host "❌ Desktop schema not found: $desktopSchemaPath" -ForegroundColor Red
    exit 1
}

$desktopSchema = Get-Content $desktopSchemaPath -Raw | ConvertFrom-Json
$desktopTables = $desktopSchema.schemas[0].stores.PSObject.Properties.Name
Write-Host "✅ Desktop schema loaded ($($desktopTables.Count) tables)" -ForegroundColor Green

# Step 2: Load Android ObjectBox Schema
Write-Host "🔍 Step 2: Loading Android Schema..." -ForegroundColor Cyan

if (-not (Test-Path $androidJsonPath)) {
    Write-Host "❌ Android schema not found at: $androidJsonPath" -ForegroundColor Red
    exit 1
}

$androidSchema = Get-Content $androidJsonPath -Raw | ConvertFrom-Json
$androidEntities = $androidSchema.entities

Write-Host "✅ Android ObjectBox schema loaded ($($androidEntities.Count) entities)" -ForegroundColor Green
Write-Host ""

# Step 3: Compare Schemas
Write-Host "⚖️  Step 3: Comparing Tables..." -ForegroundColor Cyan
Write-Host ""

$report = @"
# ⚖️ Schema Comparison Report
**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Desktop Source:** Dexie.js (IndexedDB)
**Android Source:** ObjectBox (NoSQL)

## 📊 Table Status

| Feature | Desktop (IndexedDB) | Android (ObjectBox) | Status |
|---------|---------------------|---------------------|--------|
"@

$allTables = ($desktopTables + $androidEntities.name) | Select-Object -Unique | Sort-Object

$matchCount = 0
$coreTables = @("Clip", "Tag", "FileRef", "User", "Label") # Adjusted for common naming conventions

foreach ($table in $allTables) {
    # Normalize naming (Clip vs clips, Tag vs tags)
    $dName = $desktopTables | Where-Object { $_ -eq $table -or $_ -eq "${table}s" -or "${_}s" -eq $table } | Select-Object -First 1
    $aEntity = $androidEntities | Where-Object { $_.name -eq $table -or $_.name -eq "${table}s" -or "${_}s" -eq $table } | Select-Object -First 1
    
    $dExists = $null -ne $dName
    $aExists = $null -ne $aEntity
    
    $status = if ($dExists -and $aExists) { 
        $matchCount++
        "✅ Match" 
    } elseif ($dExists) { 
        "⚠️ Desktop Only" 
    } else { 
        "⚠️ Android Only" 
    }
    
    # Format for table
    $dDisplay = if ($dExists) { $dName } else { "-" }
    $aDisplay = if ($aExists) { $aEntity.name } else { "-" }
    
    $report += "`n| **$table** | $dDisplay | $aDisplay | $status |"
    
    # Detailed Field Comparison if Match
    if ($dExists -and $aExists) {
        $report += "`n`n### 🔍 Detail: $table"
        $report += "`n| Field | Desktop | Android |"
        $report += "`n|-------|---------|---------|"
        
        # Get Desktop Indexes
        $dIndexes = $desktopSchema.schemas[0].stores.$dName -split ","
        # Get Android Properties
        $aProps = $aEntity.properties.name
        
        $allFields = ($dIndexes + $aProps) | Select-Object -Unique | Sort-Object
        foreach ($field in $allFields) {
            # Normalize field check
            $dHas = $dIndexes -contains $field
            $aHas = $aProps -contains $field
            $report += "`n| $field | $(if($dHas){'✅'}else{'-'}) | $(if($aHas){'✅'}else{'-'}) |"
        }
    }
}

$report += @"

## 📝 Analysis
- **Core Compatibility:** $matchCount tables matched
- **Sync Feasibility:** "
"@

if ($matchCount -ge 4) {
    $report += "**HIGH** (Core tables align)"
    Write-Host "✅ Sync Feasibility: HIGH ($matchCount matches)" -ForegroundColor Green
} else {
    $report += "**MEDIUM** (Partial alignment)"
    Write-Host "⚠️  Sync Feasibility: MEDIUM ($matchCount matches)" -ForegroundColor Yellow
}

$report | Out-File $reportPath -Encoding UTF8

Write-Host ""
Write-Host "=== PHASE 2.4 COMPLETE ===" -ForegroundColor Cyan
Write-Host "📄 Comparison saved to: $reportPath" -ForegroundColor Yellow
Write-Host ""
