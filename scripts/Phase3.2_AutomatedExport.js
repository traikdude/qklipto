// ============================================
// CLIPTO SYNC BRIDGE - MULTI-VECTOR EXPORT
// Purpose: Extract data from Storage, DOM, and Firestore
// ============================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const DEBUG_PORT = 9222;
const EXPORT_DIR = path.join(__dirname, '..', 'qklipto-sync');

(async () => {
    console.log("🚀 Starting Multi-Vector Export...");
    
    try {
        if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);

        console.log(`🔌 Connecting to http://localhost:${DEBUG_PORT}...`);
        const browser = await puppeteer.connect({
            browserURL: `http://localhost:${DEBUG_PORT}`
        });
        
        console.log("✅ Connected!");
        const pages = await browser.pages();
        console.log(`🔎 Found ${pages.length} pages/targets.`);

        let targetPage = null;

        for (let i = 0; i < pages.length; i++) {
            const p = pages[i];
            const title = await p.title();
            const url = p.url();
            console.log(`   [${i}] "${title}" - ${url}`);

            // Heuristic: The main window usually has the title "Clipto" and is not an extension/devtools
            if (title === "Clipto" && !url.includes("devtools")) {
                targetPage = p;
            }
        }

        if (!targetPage) {
            console.warn("⚠️  Could not identify Main Window. Defaulting to [0].");
            targetPage = pages[0];
        } else {
            console.log(`🎯 Targeted Main Window: "${await targetPage.title()}"`);
        }
        
        const page = targetPage;
        
        console.log("📦 Extracting Data...");
        const data = await page.evaluate(async () => {
            const result = {
                localStorage: {},
                domScrape: [],
                firestoreDump: null,
                debug: []
            };

            // 1. LocalStorage
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    result.localStorage[key] = localStorage.getItem(key);
                }
            } catch (e) { result.debug.push("LS Error: " + e.message); }

            // 2. DOM Scrape (Visible Notes)
            try {
                // Try standard selectors
                const nodes = document.querySelectorAll('.list-item, .note-card, .item, div[role="listitem"]');
                result.domScrape = Array.from(nodes).map(n => ({
                    text: n.innerText,
                    html: n.innerHTML
                }));
            } catch (e) { result.debug.push("DOM Error: " + e.message); }

            // 3. Firestore Cache (The Big One)
            try {
                const DB_NAME = "firestore/[DEFAULT]/wb-clipto/main";
                const db = await new Promise((res, rej) => {
                    const req = indexedDB.open(DB_NAME);
                    req.onsuccess = () => res(req.result);
                    req.onerror = () => rej(req.error);
                });

                const stores = {};
                const tx = db.transaction(Array.from(db.objectStoreNames), 'readonly');
                
                await Promise.all(Array.from(db.objectStoreNames).map(name => new Promise(res => {
                    const req = tx.objectStore(name).getAll();
                    req.onsuccess = () => { stores[name] = req.result; res(); };
                    req.onerror = () => { stores[name] = "Error"; res(); };
                })));
                
                result.firestoreDump = stores;
            } catch (e) { result.debug.push("Firestore Error: " + e.message); }

            return result;
        });

        // Save Results
        fs.writeFileSync(path.join(EXPORT_DIR, 'localstorage.json'), JSON.stringify(data.localStorage, null, 2));
        fs.writeFileSync(path.join(EXPORT_DIR, 'dom.json'), JSON.stringify(data.domScrape, null, 2));
        if (data.firestoreDump) {
            fs.writeFileSync(path.join(EXPORT_DIR, 'firestore.json'), JSON.stringify(data.firestoreDump, null, 2));
        }

        console.log("✅ EXPORT COMPLETE");
        console.log(`   - LocalStorage Keys: ${Object.keys(data.localStorage).length}`);
        console.log(`   - Visible Notes: ${data.domScrape.length}`);
        console.log(`   - Firestore Stores: ${data.firestoreDump ? Object.keys(data.firestoreDump).length : 0}`);

        browser.disconnect();

    } catch (err) {
        console.error("❌ Error:", err.message);
    }
})();
