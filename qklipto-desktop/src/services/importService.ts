import { db } from '../db/database';
import { Clip } from '../models/Clip';
import { Tag, TAG_COLORS } from '../models/Tag';

interface ImportData {
    source: string;
    version: string;
    clips: Clip[];
    tags: Tag[];
}

export const importData = async (file: File): Promise<{ success: boolean; count: number; error?: string }> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const json = e.target?.result as string;
                if (!json) throw new Error("File is empty");

                const data: ImportData = JSON.parse(json);
                
                if (!Array.isArray(data.clips)) {
                    throw new Error("Invalid format: 'clips' array missing");
                }

                // Import Tags
                if (Array.isArray(data.tags)) {
                    await db.transaction('rw', db.tags, async () => {
                        for (const tag of data.tags) {
                            // Check if tag exists
                            const existing = await db.tags.where('name').equals(tag.name).first();
                            if (!existing) {
                                await db.tags.add({
                                    id: crypto.randomUUID(),
                                    name: tag.name,
                                    color: tag.color || TAG_COLORS[0]
                                });
                            }
                        }
                    });
                }

                // Import Clips
                let importedCount = 0;
                await db.transaction('rw', db.clips, async () => {
                    for (const clip of data.clips) {
                        // Basic validation
                        if (!clip.text) continue;

                        // Check if clip with this ID already exists
                        const existing = await db.clips.get(clip.id);
                        
                        if (existing) {
                            // Strategy: Overwrite if imported is newer? Or skip?
                            // For simple restore, let's overwrite if modifyDate is newer or just overwrite.
                            // Let's assume overwrite for restore.
                            await db.clips.put(clip);
                        } else {
                            await db.clips.add(clip);
                        }
                        importedCount++;
                    }
                });

                resolve({ success: true, count: importedCount });

            } catch (err: any) {
                console.error("Import failed:", err);
                resolve({ success: false, count: 0, error: err.message });
            }
        };

        reader.onerror = () => {
            resolve({ success: false, count: 0, error: "Failed to read file" });
        };

        reader.readAsText(file);
    });
};
