// ============================================
// CLIPTO SYNC BRIDGE - AUTOMATED EXPORT
// Purpose: Connect to running Clipto app and extract data
// Usage: 
// 1. Close Clipto.
// 2. Run Clipto with: clipto.exe --remote-debugging-port=9222
// 3. Run: node Phase3.2_AutomatedExport.js
// ============================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Configuration
const DEBUG_PORT = 9222;
const EXPORT_DIR = path.join(__dirname, '..', 'qklipto-sync');
const CLIPS_DIR = path.join(EXPORT_DIR, 'clips');

async function ensureDirs() {
    if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);
    if (!fs.existsSync(CLIPS_DIR)) fs.mkdirSync(CLIPS_DIR);
}

(async () => {
    console.log("🚀 Starting Automated Export...");
    
    try {
        await ensureDirs();

        // 1. Connect to Clipto
        console.log(`🔌 Connecting to http://localhost:${DEBUG_PORT}...`);
        const browser = await puppeteer.connect({
            browserURL: `http://localhost:${DEBUG_PORT}`
        });
        
        console.log("✅ Connected to Clipto instance!");

        // 2. Find the main window (the one with the data)
        const pages = await browser.pages();
        const page = pages[0]; // Usually the first page is the main window
        console.log(`📄 Target Page: ${page.url()}`);

        // 3. Inject Extraction Logic
        console.log("📦 Extracting data from IndexedDB...");
        const data = await page.evaluate(async () => {
            // Check for Dexie or raw DB
            let db;
            const DB_NAME = "clipto";
            
            // Helper to wait for DB
            const openDB = () => new Promise((resolve, reject) => {
                if (window.db && window.db.clips) resolve(window.db);
                // Try Dexie
                if (typeof Dexie !== 'undefined') {
                    const d = new Dexie(DB_NAME);
                    d.open().then(() => resolve(d)).catch(reject);
                } else {
                    reject("Dexie not found");
                }
            });

            try {
                db = await openDB();
                const result = {
                    clips: await db.clips.toArray(),
                    tags: await db.tags.toArray(),
                    settings: await db.settings.toArray(),
                    timestamp: new Date().toISOString()
                };
                return result;
            } catch (e) {
                return { error: e.toString() };
            }
        });

        if (data.error) {
            throw new Error(`Extraction Logic Failed: ${data.error}`);
        }

        console.log(`   - Clips Found: ${data.clips.length}`);
        console.log(`   - Tags Found: ${data.tags.length}`);

        // 4. Save to Disk (Split Files Strategy)
        console.log("💾 Saving files...");
        
        // Save Master Meta
        const meta = {
            timestamp: data.timestamp,
            totalClips: data.clips.length,
            version: "1.0"
        };
        fs.writeFileSync(path.join(EXPORT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

        // Save Clips (Individual Files)
        let newCount = 0;
        data.clips.forEach(clip => {
            const clipPath = path.join(CLIPS_DIR, `${clip.firestoreId || clip.id}.json`);
            // LWW Check (Simplified: Always overwrite for now, optimized later)
            fs.writeFileSync(clipPath, JSON.stringify(clip, null, 2));
            newCount++;
        });

        // Save Tags
        fs.writeFileSync(path.join(EXPORT_DIR, 'tags.json'), JSON.stringify(data.tags, null, 2));

        console.log(`✅ Success! Exported ${newCount} clips to ${EXPORT_DIR}`);
        
        // Disconnect (don't close the app)
        browser.disconnect();

    } catch (err) {
        console.error("❌ Error:", err.message);
        console.error("   HINT: Is Clipto running with '--remote-debugging-port=9222'?");
    }
})();
