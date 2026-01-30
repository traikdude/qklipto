import { db } from '../db/database';

// Helper to download file
const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export type ExportFormat = 'json' | 'txt' | 'md' | 'html';

export const exportData = async (format: ExportFormat = 'json') => {
    try {
        const clips = await db.clips.toArray();
        const activeClips = clips.filter(c => !c.deleted);
        const dateStr = new Date().toISOString().slice(0, 10);

        if (format === 'json') {
            const tags = await db.tags.toArray();
            const exportObject = {
                source: "qklipto-desktop",
                version: "1.0.0",
                exportDate: new Date().toISOString(),
                clips: activeClips,
                tags: tags
            };
            downloadFile(JSON.stringify(exportObject, null, 2), `qklipto-backup-${dateStr}.json`, 'application/json');
            return true;
        }

        let content = '';
        let ext = 'txt';
        let mime = 'text/plain';

        if (format === 'txt') {
            activeClips.forEach(clip => {
                content += `----------------------------------------\n`;
                content += `Title: ${clip.title || 'Untitled'}\n`;
                content += `Date: ${clip.createDate}\n`;
                content += `----------------------------------------\n`;
                content += `${clip.text}\n\n`;
            });
            ext = 'txt';
        } else if (format === 'md') {
            activeClips.forEach(clip => {
                content += `## ${clip.title || 'Untitled'}\n`;
                content += `*${new Date(clip.createDate).toLocaleString()}*\n\n`;
                content += `${clip.text}\n\n`;
                content += `---\n\n`;
            });
            ext = 'md';
            mime = 'text/markdown';
        } else if (format === 'html') {
            content += `<!DOCTYPE html><html><head><title>QKlipto Export</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;line-height:1.5;} .clip{border:1px solid #ddd;padding:1rem;margin-bottom:1rem;border-radius:8px;} .meta{color:#666;font-size:0.9em;}</style></head><body><h1>QKlipto Export</h1>`;
            activeClips.forEach(clip => {
                content += `<div class="clip">`;
                content += `<h3>${clip.title || 'Untitled'}</h3>`;
                content += `<div class="meta">${new Date(clip.createDate).toLocaleString()}</div>`;
                content += `<pre>${clip.text}</pre>`;
                content += `</div>`;
            });
            content += `</body></html>`;
            ext = 'html';
            mime = 'text/html';
        }

        downloadFile(content, `qklipto-export-${dateStr}.${ext}`, mime);
        return true;

    } catch (error) {
        console.error("Export failed:", error);
        return false;
    }
};
