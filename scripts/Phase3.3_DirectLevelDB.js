// ============================================ 
// CLIPTO SYNC BRIDGE - DIRECT LEVELDB READ 
// Purpose: Read .ldb files directly, bypassing Electron 
// ============================================ 

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');

// Target the TEMP STAGING (Safe, unlocked)
const DB_PATH = "C:\\Users\\Erik\\AppData\\Local\\Temp\\CliptoRecovery";
const EXPORT_DIR = path.join(__dirname, '..', 'qklipto-sync');
(async () => { 
    console.log(`🚀 Opening LevelDB: ${DB_PATH}`);
    
    try { 
        if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);
        
        const db = new ClassicLevel(DB_PATH, { valueEncoding: 'binary' });
        await db.open();

        console.log("✅ DB Opened. Scanning for content...");
        
        let count = 0;
        let foundClips = [];
        let rawStrings = [];

        for await (const [key, value] of db.iterator()) { 
            count++;
            
            // Try to decode value
            try { 
                const str = value.toString('utf8');
                
                // Heuristic: Is it a Clipto note? 
                // Clipto notes usually have "text", "title", "created_at" or just are JSON
                if (str.includes("text") || str.includes("html") || str.includes("clips")) { 
                    rawStrings.push(str);
                    
                    // Try parsing JSON
                    if (str.startsWith('{') || str.startsWith('[')) { 
                        try { 
                            const json = JSON.parse(str);
                            foundClips.push(json);
                        } catch (e) { 
                            // It might be wrapped or partial
                        }
                    }
                }
            } catch (e) { 
                // Not a string
            }
        }

        console.log(`✅ Scan Complete.`);
        console.log(`   - Total Keys Scanned: ${count}`);
        console.log(`   - Potential Notes/JSON: ${rawStrings.length}`);
        console.log(`   - Parsed JSON Objects: ${foundClips.length}`);

        // Save Results
        const dumpPath = path.join(EXPORT_DIR, 'leveldb_raw.json');
        fs.writeFileSync(dumpPath, JSON.stringify({ 
            rawMatches: rawStrings,
            parsedObjects: foundClips
        }, null, 2));
        
        console.log(`💾 Dump Saved: ${dumpPath}`);
        
        await db.close();

    } catch (err) { 
        console.error("❌ Error:", err.message);
    }
})();
