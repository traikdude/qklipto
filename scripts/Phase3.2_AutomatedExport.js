// ============================================
// CLIPTO SYNC BRIDGE - MULTI-VECTOR EXPORT
// Purpose: Extract data from Storage, DOM, and Firestore
// ============================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const DEBUG_PORT = 9222;
const EXPORT_DIR = path.join(__dirname, '..', 'qklipto-sync');
const RAW_DIR = path.join(EXPORT_DIR, 'raw');
const CLIPS_DIR = path.join(EXPORT_DIR, 'clips');

const TEXT_TYPE_DEFAULT = "0";

(async () => {
    console.log("🚀 Starting Multi-Vector Export...");
    
    try {
        if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);
        if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR);
        if (!fs.existsSync(CLIPS_DIR)) fs.mkdirSync(CLIPS_DIR);

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
                dexieDump: null,
                dexieDbName: null,
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
                const nodes = document.querySelectorAll('.list-item, .note-card, .item, div[role="listitem"]');
                result.domScrape = Array.from(nodes).map(n => ({
                    text: n.innerText,
                    html: n.innerHTML
                }));
            } catch (e) { result.debug.push("DOM Error: " + e.message); }

            // 3. Dexie / IndexedDB (Preferred)
            try {
                const databases = indexedDB.databases ? await indexedDB.databases() : [];
                const candidate = databases.find(db => (db.name || "").toLowerCase().includes("clipto"));
                const dbName = (candidate && candidate.name) ? candidate.name : (databases[0] && databases[0].name);
                if (!dbName) {
                    result.debug.push("Dexie Error: No IndexedDB databases found.");
                    return result;
                }
                const db = await new Promise((res, rej) => {
                    const req = indexedDB.open(dbName);
                    req.onsuccess = () => res(req.result);
                    req.onerror = () => rej(req.error);
                });
                result.dexieDbName = dbName;

                const stores = {};
                const tx = db.transaction(Array.from(db.objectStoreNames), 'readonly');
                await Promise.all(Array.from(db.objectStoreNames).map(name => new Promise(res => {
                    const req = tx.objectStore(name).getAll();
                    req.onsuccess = () => { stores[name] = req.result; res(); };
                    req.onerror = () => { stores[name] = "Error"; res(); };
                })));
                result.dexieDump = stores;
            } catch (e) { result.debug.push("Dexie Error: " + e.message); }

            return result;
        });

        // Save Results
        fs.writeFileSync(path.join(RAW_DIR, 'localstorage.json'), JSON.stringify(data.localStorage, null, 2));
        fs.writeFileSync(path.join(RAW_DIR, 'dom.json'), JSON.stringify(data.domScrape, null, 2));
        if (data.dexieDump) {
            fs.writeFileSync(path.join(RAW_DIR, 'dexie.json'), JSON.stringify(data.dexieDump, null, 2));
        }

        const meta = {
            exportedAt: new Date().toISOString(),
            source: "clipto-desktop-export",
            dexieDbName: data.dexieDbName || "unknown",
            stores: data.dexieDump ? Object.keys(data.dexieDump) : [],
            notes: "Generated by Phase3.2_AutomatedExport.js"
        };

        fs.writeFileSync(path.join(EXPORT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

        const tagLookup = {};
        if (data.dexieDump && Array.isArray(data.dexieDump.tags)) {
            data.dexieDump.tags.forEach(tag => {
                if (tag && (tag.id !== undefined || tag.uid !== undefined)) {
                    const key = tag.id ?? tag.uid;
                    tagLookup[key] = tag.name ?? tag.title ?? "";
                }
            });
        }

        if (data.dexieDump && data.dexieDump.clips) {
            const clips = data.dexieDump.clips;
            clips.forEach((clip, index) => {
                const id = clip.firestoreId || clip.id || clip.snippetId || `clip-${index + 1}`;
                const normalizedType = normalizeTextType(clip.textType ?? clip.type);
                const tags = Array.isArray(clip.tags) ? clip.tags : [];
                if (tags.length === 0 && Array.isArray(clip.tagIds)) {
                    clip.tagIds.forEach(tagId => {
                        const resolved = tagLookup[tagId];
                        if (resolved) tags.push(resolved);
                    });
                }
                const payload = {
                    id,
                    type: normalizedType,
                    text: clip.text ?? "",
                    title: clip.title ?? "",
                    createDate: clip.createDate ?? null,
                    modifyDate: clip.modifyDate ?? null,
                    fav: clip.fav ?? false,
                    tags
                };
                fs.writeFileSync(path.join(CLIPS_DIR, `${id}.json`), JSON.stringify(payload, null, 2));
            });
        }

        if (data.dexieDump && data.dexieDump.tags) {
            fs.writeFileSync(path.join(EXPORT_DIR, 'tags.json'), JSON.stringify(data.dexieDump.tags, null, 2));
        }

        if (data.dexieDump && data.dexieDump.settings) {
            fs.writeFileSync(path.join(EXPORT_DIR, 'settings.json'), JSON.stringify(data.dexieDump.settings, null, 2));
        }

        console.log("✅ EXPORT COMPLETE");
        console.log(`   - LocalStorage Keys: ${Object.keys(data.localStorage).length}`);
        console.log(`   - Visible Notes: ${data.domScrape.length}`);
        console.log(`   - Dexie Stores: ${data.dexieDump ? Object.keys(data.dexieDump).length : 0}`);

        browser.disconnect();

    } catch (err) {
        console.error("❌ Error:", err.message);
    }
})();

function normalizeTextType(value) {
    if (value === undefined || value === null) return TEXT_TYPE_DEFAULT;
    if (typeof value === "number") return value.toString();
    if (typeof value === "string") {
        if (value === "0") return "0";
        if (value.toUpperCase() === "TEXT") return "0";
        return value;
    }
    return TEXT_TYPE_DEFAULT;
}
