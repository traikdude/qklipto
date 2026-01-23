$cliptoAppData = "$env:APPDATA\Clipto"
$backupRoot = "$env:USERPROFILE\OneDrive\CliptoArchive"
if (-not (Test-Path "$env:USERPROFILE\OneDrive")) { $backupRoot = "$env:USERPROFILE\Documents\CliptoArchive" }

Write-Host "Checking for existing data in $cliptoAppData..."

if (Test-Path $cliptoAppData) {
    $timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
    $backupPath = "${backupRoot}_${timestamp}"
    Write-Host "Found data! Backing up to $backupPath..."
    Copy-Item -Path $cliptoAppData -Destination $backupPath -Recurse -Force
    Write-Host "Backup Complete."
}
else {
    Write-Host "No existing data found."
}

$cliptoLocal = "$env:LOCALAPPDATA\Programs\Clipto"
if (Test-Path $cliptoLocal) {
    Write-Host "Found existing installation at $cliptoLocal"
}
else {
    Write-Host "No existing installation found."
}
Write-Host "Phase 0.1 Complete."
