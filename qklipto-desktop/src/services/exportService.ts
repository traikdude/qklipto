import { db } from '../db/database';

export const exportData = async () => {
    try {
        const clips = await db.clips.toArray();
        const tags = await db.tags.toArray();

        // Remove local-only fields if necessary, or just export everything.
        // The sample export includes: id, type, text, title, createDate, modifyDate, fav, tags
        // Our Clip model has pendingSync, syncVersion which we might exclude or keep.
        // For backup purposes, keeping everything is safer, but for "sample format" compliance we might trim.
        // Let's keep it simple and clean for now, matching the sample format + essential fields.

        const cleanClips = clips.filter(c => !c.deleted).map(clip => ({
            id: clip.id,
            type: clip.type,
            text: clip.text,
            title: clip.title,
            createDate: clip.createDate,
            modifyDate: clip.modifyDate,
            fav: clip.fav,
            tags: clip.tags
        }));

        const cleanTags = tags.map(tag => ({
            name: tag.name,
            color: tag.color
        }));

        const exportObject = {
            source: "qklipto-desktop",
            version: "1.0.0",
            exportDate: new Date().toISOString(),
            clips: cleanClips,
            tags: cleanTags
        };

        const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `clipto-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error("Export failed:", error);
        return false;
    }
};
