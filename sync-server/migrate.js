const fs = require('fs');
const path = require('path');

const BACKUP_FILE = "C:\\Users\\Erik\\OneDrive\\Desktop\\DESKTOP SHORTCUTS\\Documents\\TYPES OF FILES\\clipto_backup_260122_111559.json";
const DB_FILE = path.join(__dirname, 'db.json');

try {
    console.log("📖 Reading Backup...");
    const raw = fs.readFileSync(BACKUP_FILE, 'utf8');
    const backup = JSON.parse(raw);

    console.log(`✅ Loaded Backup: ${backup.notes.length} notes found.`);

    // Transform to Sync Server Format
    // Backup format: { notes: [ { created:..., text:..., ... } ] }
    // Server format: { version: timestamp, clips: [ { id:..., text:..., ... } ] }

    const newDb = {
        version: Date.now(),
        clips: backup.notes.map(n => {
            return {
                id: n.uuid || n.id || `legacy_${Date.now()}_${Math.random()}`,
                text: n.text,
                title: n.title,
                createDate: n.created,
                modifyDate: n.modified || n.updated,
                fav: n.isFavorite || false,
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
}
