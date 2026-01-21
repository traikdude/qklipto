# Watch for Clipto Export Files
$folder = "C:\Users\Erik\Downloads"
$filter = "clipto-ghost-export*.json"

Write-Host "👀 Watching $folder for '$filter'..." -ForegroundColor Cyan

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $folder
$watcher.Filter = $filter
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$action = {
    $path = $Event.SourceEventArgs.FullPath
    Write-Host "✅ FILE FOUND: $path" -ForegroundColor Green
    Write-Host "   Timestamp: $(Get-Date)" -ForegroundColor Gray
    
    # Verify file content
    try {
        $json = Get-Content $path -Raw | ConvertFrom-Json
        $count = $json.items.Count
        Write-Host "   📊 Contains $count clips!" -ForegroundColor Yellow
    } catch {
        Write-Host "   ⚠️ File might be empty/corrupt" -ForegroundColor Red
    }
}

Register-ObjectEvent $watcher "Created" -Action $action
Register-ObjectEvent $watcher "Changed" -Action $action

while ($true) {
    Start-Sleep -Seconds 1
    if (Get-ChildItem -Path $folder -Filter $filter) {
        # Check existing
        # break
    }
}
