# ============================================
# CLIPTO RESURRECTION - PHASE 2.3
# Database Schema Extraction
# ============================================

Write-Host ""
Write-Host "=== PHASE 2.3: DATABASE SCHEMA EXTRACTION ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$sourcePath = "$PSScriptRoot\CliptoDesktopSource"
$outputPath = "$PSScriptRoot\CliptoSchema.json"

# Verify source exists
if (-not (Test-Path $sourcePath)) {
    Write-Host "❌ ERROR: Source not found at $sourcePath" -ForegroundColor Red
    Write-Host "   Please run Phase2.1_ExtractSource.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Source found at: $sourcePath" -ForegroundColor Green
Write-Host ""

# Step 1: Find Dexie database initialization
Write-Host "🔍 Step 1: Searching for Dexie initialization..." -ForegroundColor Cyan

$dexieFiles = Get-ChildItem -Path $sourcePath -Recurse -Filter "*.js" -File | 
    Select-String -Pattern "new\s+Dexie\s*\(" -CaseSensitive | 
    Select-Object -ExpandProperty Path -Unique

if ($dexieFiles.Count -eq 0) {
    Write-Host "⚠️  No 'new Dexie()' pattern found" -ForegroundColor Yellow
    Write-Host "   Searching for alternative patterns..." -ForegroundColor Cyan
    
    # Try alternative patterns
    $dexieFiles = Get-ChildItem -Path $sourcePath -Recurse -Filter "*.js" -File | 
        Select-String -Pattern "Dexie\.open|db\.version|stores\(" | 
        Select-Object -ExpandProperty Path -Unique
}

if ($dexieFiles.Count -gt 0) {
    Write-Host "✅ Found $($dexieFiles.Count) file(s) with Dexie references" -ForegroundColor Green
    foreach ($file in $dexieFiles) {
        $relativePath = $file.Replace($sourcePath, ".").Replace("\", "/")
        Write-Host "   • $relativePath" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ No Dexie database initialization found" -ForegroundColor Red
    Write-Host "   The database might be defined differently" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Extract schema definitions
Write-Host "🔍 Step 2: Extracting schema definitions..." -ForegroundColor Cyan

$schemaData = @{
    extracted_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    source_version = "7.2.17"
    database_files = @()
    schemas = @()
}

foreach ($file in $dexieFiles) {
    $content = Get-Content $file -Raw
    $relativePath = $file.Replace($sourcePath, ".").Replace("\", "/")
    
    Write-Host "   Analyzing: $relativePath" -ForegroundColor Gray
    
    # Look for version().stores() pattern
    $versionMatches = [regex]::Matches($content, "version\s*\(\s*(\d+)\s*\)\.stores\s*\(\s*\{([^}]+)\}", 
        [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    if ($versionMatches.Count -gt 0) {
        foreach ($match in $versionMatches) {
            $version = $match.Groups[1].Value
            $storesContent = $match.Groups[2].Value
            
            Write-Host "      Found schema version: $version" -ForegroundColor Green
            
            # Parse stores definition
            $stores = @{}
            $storeMatches = [regex]::Matches($storesContent, "([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*['""]([^'""]*)['""]")
            
            foreach ($storeMatch in $storeMatches) {
                $tableName = $storeMatch.Groups[1].Value
                $indexDef = $storeMatch.Groups[2].Value
                
                $stores[$tableName] = $indexDef
                Write-Host "         Table: $tableName → $indexDef" -ForegroundColor Yellow
            }
            
            $schemaData.schemas += @{
                file = $relativePath
                version = [int]$version
                stores = $stores
            }
        }
    }
    
    $schemaData.database_files += $relativePath
}

Write-Host ""

# Step 3: Search for actual data models/structures
Write-Host "🔍 Step 3: Searching for data models..." -ForegroundColor Cyan

$modelPatterns = @(
    "interface\s+([A-Z][a-zA-Z0-9]*)\s*\{",
    "class\s+([A-Z][a-zA-Z0-9]*)\s*\{",
    "type\s+([A-Z][a-zA-Z0-9]*)\s*=\s*\{"
)

$modelFiles = @()
foreach ($pattern in $modelPatterns) {
    $matches = Get-ChildItem -Path $sourcePath -Recurse -Filter "*.js" -File | 
        Select-String -Pattern $pattern | 
        Select-Object -ExpandProperty Path -Unique
    
    $modelFiles += $matches
}

$modelFiles = $modelFiles | Select-Object -Unique

if ($modelFiles.Count -gt 0) {
    Write-Host "✅ Found $($modelFiles.Count) file(s) with potential data models" -ForegroundColor Green
    
    $schemaData.model_files = @()
    foreach ($file in $modelFiles | Select-Object -First 5) {
        $relativePath = $file.Replace($sourcePath, ".").Replace("\", "/")
        Write-Host "   • $relativePath" -ForegroundColor Yellow
        $schemaData.model_files += $relativePath
    }
    
    if ($modelFiles.Count -gt 5) {
        Write-Host "   ... and $($modelFiles.Count - 5) more" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  No TypeScript/class-based models found" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Search for import/export logic
Write-Host "🔍 Step 4: Searching for import/export functions..." -ForegroundColor Cyan

$exportPatterns = @(
    "export.*function",
    "importData|exportData",
    "toJSON|fromJSON",
    "serialize|deserialize"
)

$exportFiles = @()
foreach ($pattern in $exportPatterns) {
    $matches = Get-ChildItem -Path $sourcePath -Recurse -Filter "*.js" -File | 
        Select-String -Pattern $pattern | 
        Select-Object -ExpandProperty Path -Unique
    
    $exportFiles += $matches
}

$exportFiles = $exportFiles | Select-Object -Unique

if ($exportFiles.Count -gt 0) {
    Write-Host "✅ Found $($exportFiles.Count) file(s) with export/import patterns" -ForegroundColor Green
    
    $schemaData.export_files = @()
    foreach ($file in $exportFiles | Select-Object -First 10) {
        $relativePath = $file.Replace($sourcePath, ".").Replace("\", "/")
        Write-Host "   • $relativePath" -ForegroundColor Yellow
        $schemaData.export_files += $relativePath
    }
    
    if ($exportFiles.Count -gt 10) {
        Write-Host "   ... and $($exportFiles.Count - 10) more" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  No obvious export/import functions found" -ForegroundColor Yellow
}

Write-Host ""

# Step 5: Save schema to JSON
Write-Host "💾 Step 5: Saving schema data..." -ForegroundColor Cyan

$schemaJson = $schemaData | ConvertTo-Json -Depth 10
$schemaJson | Out-File -FilePath $outputPath -Encoding UTF8 -Force

Write-Host "✅ Schema saved to: $outputPath" -ForegroundColor Green
Write-Host ""

# Step 6: Generate summary report
Write-Host "📊 Step 6: Schema Analysis Summary" -ForegroundColor Cyan
Write-Host ""

if ($schemaData.schemas.Count -gt 0) {
    Write-Host "✅ Database Schema Found:" -ForegroundColor Green
    Write-Host ""
    
    foreach ($schema in $schemaData.schemas) {
        Write-Host "   📋 Version $($schema.version) (from $($schema.file))" -ForegroundColor Yellow
        foreach ($table in $schema.stores.Keys) {
            Write-Host "      • Table: $table" -ForegroundColor White
            Write-Host "        Indexes: $($schema.stores[$table])" -ForegroundColor Gray
        }
        Write-Host ""
    }
} else {
    Write-Host "⚠️  No versioned schema found" -ForegroundColor Yellow
    Write-Host "   Manual inspection of database files required" -ForegroundColor Gray
}

Write-Host "=== PHASE 2.3 COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📄 Schema data exported to: $outputPath" -ForegroundColor Yellow
Write-Host "🎯 Next: Review schema and plan sync bridge architecture" -ForegroundColor Cyan
Write-Host ""
