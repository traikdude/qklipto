const fs = require('fs');
const path = require('path');

// Allow passing file path as argument, otherwise default to sample in repo
const BACKUP_FILE = process.argv[2] || path.join(__dirname, '../sample-clipto-export.json');
const DB_FILE = path.join(__dirname, 'db.json');

try {
    console.log(`📖 Reading Backup from: ${BACKUP_FILE}`);
    if (!fs.existsSync(BACKUP_FILE)) {
        throw new Error(`File not found: ${BACKUP_FILE}`);
    }
    const raw = fs.readFileSync(BACKUP_FILE, 'utf8');
    const backup = JSON.parse(raw);

    // Support both 'notes' (Legacy) and 'clips' (Desktop Export)
    const sourceClips = backup.clips || backup.notes || [];
    console.log(`✅ Loaded Backup: ${sourceClips.length} items found.`);

    if (sourceClips.length === 0) {
        console.warn("⚠️ No clips found in the backup file.");
    }

    const newDb = {
        version: Date.now(),
        clips: sourceClips.map(n => {
            return {
                // Map fields checking both new and legacy formats
                id: n.id || n.uuid || `legacy_${Date.now()}_${Math.random()}`,
                text: n.text || "",
                title: n.title || "",
                // 'created' is legacy, 'createDate' is new
                createDate: n.createDate || n.created || new Date().toISOString(),
                // 'modified'/'updated' are legacy, 'modifyDate' is new
                modifyDate: n.modifyDate || n.modified || n.updated || new Date().toISOString(),
                // 'isFavorite' is legacy, 'fav' is new
                fav: (n.fav !== undefined) ? n.fav : (n.isFavorite || false),
                tags: n.tags || []
            };
        })
    };

    console.log("💾 Saving to Server DB...");
    fs.writeFileSync(DB_FILE, JSON.stringify(newDb, null, 2));
    
    console.log("🚀 MIGRATION COMPLETE!");
    console.log(`   - ${newDb.clips.length} clips restored to Sync Server.`);

} catch (e) {
    console.error("❌ Error:", e.message);
    process.exit(1);
}
