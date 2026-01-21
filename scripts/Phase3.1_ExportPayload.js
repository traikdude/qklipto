// ============================================
// CLIPTO SYNC BRIDGE - EXPORT PAYLOAD (POC)
// Purpose: Extract all data from IndexedDB
// Usage: Paste this into Clipto DevTools Console (Ctrl+Shift+I)
// ============================================

(async () => {
    console.log("🚀 Starting Clipto Data Export...");

    // 1. Detect Database
    // Dexie is usually available globally or we can open it
    let db;
    const DB_NAME = "clipto"; 

    try {
        if (typeof Dexie === 'undefined') {
            console.error("❌ Dexie not found in global scope. Trying to open directly...");
            // Fallback: simple IDB request if Dexie missing (harder, let's hope Dexie is there or we use window.db)
            if (window.db && window.db.clips) {
                db = window.db;
                console.log("✅ Found 'window.db' instance!");
            } else {
                 throw new Error("Cannot find database instance");
            }
        } else {
            // Try explicit open
            db = new Dexie(DB_NAME);
            await db.open();
            console.log("✅ Opened 'clipto' database via Dexie constructor");
        }

        // 2. Fetch Data
        console.log("📦 Fetching tables...");
        const data = {
             version: 1,
             timestamp: new Date().toISOString(),
             source: "desktop-bridge",
             clips: [],
             tags: [],
             users: [],
             settings: []
        };

        // Fetch Clips (Notes)
        if (db.clips) {
            data.clips = await db.clips.toArray();
            console.log(`   - Clips: ${data.clips.length}`);
        }

        // Fetch Tags
        if (db.tags) {
            data.tags = await db.tags.toArray();
            console.log(`   - Tags: ${data.tags.length}`);
        }

        // Fetch Users
        if (db.users) {
            data.users = await db.users.toArray();
            console.log(`   - Users: ${data.users.length}`);
        }

        // Fetch Settings
        if (db.settings) {
            data.settings = await db.settings.toArray();
            console.log(`   - Settings: ${data.settings.length}`);
        }
        
        // 3. Export
        const json = JSON.stringify(data, null, 2);
        console.log("✅ Data serialized successfully!");

        // 4. Save/Copy
        // Try the File System Access API if available (modern Electron)
        try {
            const blob = new Blob([json], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `clipto-export-${new Date().getTime()}.json`;
            a.click();
            console.log("💾 Download triggered!");
        } catch (e) {
            console.warn("⚠️ File save failed, copying to clipboard...", e);
            copy(json);
            console.log("📋 Data copied to clipboard!");
        }

    } catch (err) {
        console.error("❌ Export Failed:", err);
    }
})();
