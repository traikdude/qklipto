const { dialog, app } = require('electron');
const fs = require('fs');
const http = require('http');
const path = require('path');

// Configuration
const SYNC_SERVER_URL = 'http://localhost:3000/sync';
// We assume sync-server is in a parallel folder structure based on user's workspace
// c:\Users\Erik\.gemini\antigravity\scratch\qklipto\sync-server\db.json
const DB_PATH = path.resolve(__dirname, '../../sync-server/db.json');

const DataHandler = {
    // EXPORT: Save current DB to a file
    exportData: async (browserWindow) => {
        try {
            // 1. Try to read from disk (simplest for export)
            if (!fs.existsSync(DB_PATH)) {
                await dialog.showMessageBox(browserWindow, {
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Could not find local database file.',
                    detail: `Expected at: ${DB_PATH}`
                });
                return;
            }

            const dbContent = fs.readFileSync(DB_PATH, 'utf8');
            const dbRef = JSON.parse(dbContent);
            const clipCount = dbRef.clips ? dbRef.clips.length : 0;

            // 2. Ask user where to save
            const { filePath } = await dialog.showSaveDialog(browserWindow, {
                title: 'Export Clipto Data',
                defaultPath: `clipto-export-${Date.now()}.json`,
                filters: [{ name: 'JSON Files', extensions: ['json'] }]
            });

            if (filePath) {
                fs.writeFileSync(filePath, dbContent);
                await dialog.showMessageBox(browserWindow, {
                    type: 'info',
                    title: 'Export Successful',
                    message: `Successfully exported ${clipCount} clips.`,
                    detail: `Saved to: ${filePath}`
                });
            }
        } catch (error) {
            console.error('Export error:', error);
            await dialog.showMessageBox(browserWindow, {
                type: 'error',
                title: 'Export Error',
                message: 'An error occurred during export.',
                detail: error.message
            });
        }
    },

    // IMPORT: Load a file and push to Sync Server
    importData: async (browserWindow) => {
        try {
            // 1. Ask user for file
            const { filePaths } = await dialog.showOpenDialog(browserWindow, {
                title: 'Import Clipto Data',
                filters: [{ name: 'JSON Files', extensions: ['json'] }],
                properties: ['openFile']
            });

            if (!filePaths || filePaths.length === 0) return;

            const filePath = filePaths[0];
            const content = fs.readFileSync(filePath, 'utf8');
            let data;

            try {
                data = JSON.parse(content);
            } catch (e) {
                throw new Error('Invalid JSON file.');
            }

            // 2. Normalize data structure
            // Handle both Sync Server format { version, clips: [] } and Legacy Export { notes: [] }
            let clipsToImport = [];

            if (Array.isArray(data.clips)) {
                clipsToImport = data.clips;
            } else if (Array.isArray(data.notes)) {
                // Legacy format conversion
                clipsToImport = data.notes.map(n => ({
                    id: n.uuid || n.id || `legacy_${Date.now()}_${Math.random()}`,
                    text: n.text || '',
                    title: n.title || '',
                    createDate: n.created,
                    modifyDate: n.modified || n.updated,
                    fav: n.isFavorite || false,
                    tags: n.tags || []
                }));
            } else {
                throw new Error('Unrecognized file format. Expected "clips" or "notes" array.');
            }

            if (clipsToImport.length === 0) {
                throw new Error('No clips found in file.');
            }

            // 3. Send to Sync Server via HTTP POST (Keep this for Android Sync)
            const payload = JSON.stringify({ clips: clipsToImport });

            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/sync',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                }
            };

            // Fire and forget to Server
            const req = http.request(options, (res) => {
                // We don't block UI on this anymore
            });
            req.on('error', (e) => console.log("Sync Server not running (OK for offline mode)"));
            req.write(payload);
            req.end();

            // 4. INJECT DIRECTLY INTO DESKTOP APP (The Fix)
            if (browserWindow) {
                try {
                    // We need to pass the clips array to the window
                    // Serialize it safely
                    const scriptPayload = JSON.stringify(clipsToImport);

                    // Execute the exposed function from debug-entry.js
                    await browserWindow.webContents.executeJavaScript(`
                        if (window.importClips) {
                            window.importClips(${scriptPayload});
                        } else {
                            alert("Error: Import Agent not ready. Please restart the app and try again.");
                        }
                    `);

                    // We let the in-window alert handle the success message now
                } catch (injectionError) {
                    console.error("Injection failed:", injectionError);
                    dialog.showErrorBox("Import Failed", "Could not inject data into the App Window.\n" + injectionError.message);
                }
            }

        } catch (error) {
            console.error('Import error:', error);
            await dialog.showMessageBox(browserWindow, {
                type: 'error',
                title: 'Import Error',
                message: 'Failed to import data.',
                detail: error.message
            });
        }
    }
};

module.exports = DataHandler;
