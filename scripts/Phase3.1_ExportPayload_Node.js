// ============================================
// CLIPTO SYNC BRIDGE - EXPORT PAYLOAD (Node.js)
// Purpose: Extract all data from Clipto's LevelDB (IndexedDB Backing Store)
// Usage: node Phase3.1_ExportPayload.js
// Note: This runs outside the browser, directly accessing the LevelDB files.
// ============================================

const path = require('path');
const fs = require('fs');
const { Level } = require('level');

// Configuration
// Location of Clipto's IndexedDB files (Electron stores them here)
// Typically: %APPDATA%\Clipto\IndexedDB\file__0.indexeddb.leveldb
// We need to find the correct path dynamically or let user config it.
const USER_DATA_PATH = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.config');
const CLIPTO_DB_PATH = path.join(USER_DATA_PATH, 'Clipto', 'IndexedDB', 'file__0.indexeddb.leveldb');

// Output Directory
const EXPORT_DIR = path.join(__dirname, '..', 'qklipto-sync');
const CLIPS_DIR = path.join(EXPORT_DIR, 'clips');

async function ensureDirs() {
    if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);
    if (!fs.existsSync(CLIPS_DIR)) fs.mkdirSync(CLIPS_DIR);
}

async function runExport() {
    console.log("🚀 Starting Clipto Data Export (Node.js Direct Access)...");
    console.log(`📂 Target DB Path: ${CLIPTO_DB_PATH}`);

    if (!fs.existsSync(CLIPTO_DB_PATH)) {
        console.error("❌ Database path not found! Ensure Clipto has been run at least once.");
        console.error(`   Checked: ${CLIPTO_DB_PATH}`);
        process.exit(1);
    }

    // Ensure output directories exist
    await ensureDirs();

    // NOTE: Direct LevelDB access to Chrome's IndexedDB is complex because
    // Chrome uses a proprietary encoding for keys/values in LevelDB.
    // Standard 'level' package usually reads raw LevelDB.
    // decoding the "IndexedDB-on-LevelDB" format requires specific logic 
    // (often using 'indexeddb-level-backend' or similar, but those are adapters).

    // STRATEGY CHANGE for Phase 3.1 MVP:
    // Since decoding Chrome's binary IndexedDB format from Node is highly error-prone
    // and subject to browser version changes, we will stick to the 
    // "In-App Injection" method validated in Phase 0/1, but automate it.
    
    // HOWEVER, if the user wants a background service, we might need a different approach.
    // For now, let's update this script to be the "In-App Injector" that we
    // paste into the DevTools, OR that we inject via the Electron remote debugging port.
    
    console.log("⚠️  NOTICE: Direct LevelDB reading of Chrome IndexedDB is unstable.");
    console.log("⚠️  Switching to 'Electron Injection' strategy.");
    console.log("==================================================");
    console.log("Please run the PowerShell script 'Phase3_ManualExport.ps1'");
    console.log("which launches Clipto with remote debugging enabled,");
    console.log("then injects the export payload via WebSocket.");
}

runExport();
