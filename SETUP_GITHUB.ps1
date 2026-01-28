# ============================================
# QKLIPTO - GITHUB REPOSITORY SETUP
# Initialize Git and Create GitHub Repo
# ============================================

Write-Host ""
Write-Host "=== QKLIPTO GITHUB REPOSITORY SETUP ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$repoName = "qklipto"
$repoDescription = "Clipto Resurrection Toolkit - Custom sync solution for abandoned Clipto Pro"
$projectPath = $PSScriptRoot

# Step 1: Check if Git is installed
Write-Host "🔍 Step 1: Checking for Git..." -ForegroundColor Cyan

try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git installed: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "❌ Git is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Installing Git..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPTION 1: Install via Winget (Recommended)" -ForegroundColor Cyan
    Write-Host "  Run: winget install Git.Git" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTION 2: Download installer" -ForegroundColor Cyan
    Write-Host "  URL: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing Git, re-run this script" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Check if GitHub CLI is installed
Write-Host "🔍 Step 2: Checking for GitHub CLI..." -ForegroundColor Cyan

try {
    $ghVersion = gh --version 2>$null
    if ($ghVersion) {
        Write-Host "✅ GitHub CLI installed" -ForegroundColor Green
        $useGH = $true
    } else {
        throw "gh not found"
    }
} catch {
    Write-Host "⚠️  GitHub CLI not installed" -ForegroundColor Yellow
    Write-Host "   You'll need to create the repo manually" -ForegroundColor Gray
    $useGH = $false
}

Write-Host ""

# Step 3: Initialize Git repository
Write-Host "🔍 Step 3: Initializing Git repository..." -ForegroundColor Cyan

if (Test-Path "$projectPath\.git") {
    Write-Host "⚠️  Git repository already exists" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Reinitialize? This will keep your history. (Y/N)"
    if ($response -ne 'Y' -and $response -ne 'y') {
        Write-Host "Skipping initialization..." -ForegroundColor Gray
    }
} else {
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Step 4: Configure Git (if needed)
Write-Host "🔍 Step 4: Checking Git configuration..." -ForegroundColor Cyan

$gitUser = git config user.name 2>$null
$gitEmail = git config user.email 2>$null

if (-not $gitUser) {
    Write-Host "⚠️  Git user.name not configured" -ForegroundColor Yellow
    $userName = Read-Host "Enter your GitHub username"
    git config user.name $userName
    Write-Host "✅ Configured user.name: $userName" -ForegroundColor Green
} else {
    Write-Host "✅ Git user.name: $gitUser" -ForegroundColor Green
}

if (-not $gitEmail) {
    Write-Host "⚠️  Git user.email not configured" -ForegroundColor Yellow
    $userEmail = Read-Host "Enter your GitHub email"
    git config user.email $userEmail
    Write-Host "✅ Configured user.email: $userEmail" -ForegroundColor Green
} else {
    Write-Host "✅ Git user.email: $gitEmail" -ForegroundColor Green
}

Write-Host ""

# Step 5: Create initial commit
Write-Host "🔍 Step 5: Creating initial commit..." -ForegroundColor Cyan

git add .

$commitMsg = "Initial commit: QKlipto - Clipto Resurrection Toolkit

Phase 0: Pre-flight safety scripts
Phase 1: Installation, air-gap, and backup scripts
Phase 2: Source extraction and analysis scripts

This toolkit successfully resurrects Clipto Pro v7.2.17 and provides
tools to extract the Desktop source code from the Electron bundle."

git commit -m "$commitMsg" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Initial commit created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nothing to commit (repository may already be initialized)" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Create GitHub repository
Write-Host "🔍 Step 6: Creating GitHub repository..." -ForegroundColor Cyan
Write-Host ""

if ($useGH) {
    Write-Host "Using GitHub CLI to create repo..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Repository Name: $repoName" -ForegroundColor Yellow
    Write-Host "Description: $repoDescription" -ForegroundColor Yellow
    Write-Host ""
    
    $response = Read-Host "Create public repository? (Y/N)"
    
    if ($response -eq 'Y' -or $response -eq 'y') {
        $visibility = "public"
    } else {
        $visibility = "private"
    }
    
    Write-Host ""
    Write-Host "Creating $visibility repository..." -ForegroundColor Cyan
    
    gh repo create $repoName --$visibility --description "$repoDescription" --source=. --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repository created and pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create repository" -ForegroundColor Red
        Write-Host "   You may need to authenticate with: gh auth login" -ForegroundColor Yellow
    }
} else {
    Write-Host "📋 Manual GitHub Repository Creation" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "GitHub CLI not installed. Please create the repository manually:" -ForegroundColor Gray
    Write-Host ""
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Repository name: $repoName" -ForegroundColor White
    Write-Host "3. Description: $repoDescription" -ForegroundColor White
    Write-Host "4. Choose Public or Private" -ForegroundColor White
    Write-Host "5. DO NOT initialize with README/gitignore (we have them)" -ForegroundColor White
    Write-Host "6. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "After creating, run these commands:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/$repoName.git" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "=== GITHUB SETUP COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📂 Local repository: $projectPath" -ForegroundColor Yellow
Write-Host "🌐 GitHub repository: https://github.com/YOUR_USERNAME/$repoName" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Visit your GitHub repository" -ForegroundColor Gray
Write-Host "   2. Add topics: clipto, electron, resurrection, sync" -ForegroundColor Gray
Write-Host "   3. Share in Clipto Discord" -ForegroundColor Gray
Write-Host "   4. Continue with Phase 2 extraction" -ForegroundColor Gray
Write-Host ""
