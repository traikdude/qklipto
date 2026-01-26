# Firebase Deployment Script for QKlipto

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Green

# 1. Ensure Dependencies
Write-Host "📦 Checking dependencies..."
if (!(Test-Path "node_modules")) {
    npm install
}

# 2. Build the Web App
Write-Host "🛠️ Building Web App..."
# We use npm script to handle path resolution
npm run build:web

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed! Please check the errors above."
    exit 1
}

# 3. Deploy to Firebase
Write-Host "☁️ Deploying to Firebase Hosting..."
# Check if logged in
firebase projects:list > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warning "⚠️ You are not logged in to Firebase CLI."
    Write-Host "👉 Please run: firebase login"
    exit 1
}

firebase deploy --only hosting

Write-Host "✅ Deployment Complete! Visit https://qklipto.web.app" -ForegroundColor Cyan
