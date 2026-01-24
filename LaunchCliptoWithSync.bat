@echo off
title Clipto Sync Launcher
echo ===================================================
echo   🧙 Clipto Sync Launcher (Daemon Mode)
echo ===================================================

:: 1. Start Sync Server in Background
echo Starting Sync Server...
cd /d "c:\Users\Erik\.gemini\antigravity\scratch\qklipto\sync-server"

:: Check if pm2 is available, otherwise use node
where pm2 >nul 2>nul
if %errorlevel%==0 (
    echo   - Found PM2, starting managed process...
    call pm2 start server.js --name "clipto-sync" --silent
) else (
    echo   - PM2 not found, using simple background node process...
    start /B node server.js
)

:: Wait for server to warm up
timeout /t 2 /nobreak >nul

:: 2. Launch Desktop App
echo Starting Desktop App...
cd /d "c:\Users\Erik\.gemini\antigravity\scratch\qklipto\scripts\CliptoDesktopSource"
call npx --yes electron .

echo.
echo ===================================================
echo   Done! Sync Server is running in background.
echo   You can close this window if you used PM2.
echo   If you used basic Node, keep this window open.
echo ===================================================
timeout /t 5
