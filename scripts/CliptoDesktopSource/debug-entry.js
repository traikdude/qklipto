const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron; // Added ipcMain
const fs = require('fs');
const path = require('path');

// ============================================================================
// LOGGING
// ============================================================================
const logFile = path.join(__dirname, 'injection.log');
function log(msg) {
    try {
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) { console.error(e); }
}

log("=== STARTING AGENT ENTRY (Final Polish) ===");

// 1. Setup Reload Handler (Bypasses will-navigate)
ipcMain.on('trigger-reload', (event) => {
    log("IPC: Triggering Reload");
    event.sender.reload();
});

// ============================================================================
// PAYLOAD
// ============================================================================
const UI_PAYLOAD = `
(function() {
    try {
        console.log("🚀 QKLIPTO AGENT RUNNING");

        function createToolbar() {
            if (document.getElementById('qklipto-toolbar')) return;

            const toolbar = document.createElement('div');
            toolbar.id = 'qklipto-toolbar';
            // POLISHED DARK UI
            Object.assign(toolbar.style, {
                position: 'fixed', bottom: '20px', right: '20px', zIndex: '2147483647',
                display: 'flex', gap: '12px', padding: '12px 16px',
                backgroundColor: '#202124', 
                border: '1px solid #5f6368', 
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)', 
                fontFamily: 'Inter, Segoe UI, sans-serif',
                alignItems: 'center'
            });
            
            // Label
            const label = document.createElement('span');
            label.innerText = 'QKlip Server:';
            Object.assign(label.style, {
                color: '#9aa0a6',
                fontSize: '12px',
                fontWeight: '500',
                marginRight: '4px'
            });
            toolbar.appendChild(label);

            // SYNC BTN
            const btnSync = document.createElement('button');
            btnSync.innerHTML = '📥 Restore / Sync';
            Object.assign(btnSync.style, {
                padding: '8px 16px', backgroundColor: '#8ab4f8', color: '#202124',
                border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                fontSize: '13px', transition: 'background 0.2s'
            });
            btnSync.onmouseover = () => btnSync.style.backgroundColor = '#aecbfa';
            btnSync.onmouseout = () => btnSync.style.backgroundColor = '#8ab4f8';
            
            btnSync.onclick = async () => {
                btnSync.innerHTML = "⏳ Connecting...";
                try {
                    const response = await fetch('http://localhost:3000/sync?version=0');
                    const json = await response.json();
                    const clips = json.data || json.clips || [];
                    
                     btnSync.innerHTML = "⬇️ Importing " + clips.length + "...";

                    const request = indexedDB.open("clipto");
                    request.onsuccess = (event) => {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains("clips")) {
                             alert("Error: 'clips' database not found. Please create a note manually first!"); return; 
                        }
                        const tx = db.transaction(["clips"], "readwrite");
                        const store = tx.objectStore("clips");
                        let count = 0;
                        clips.forEach(c => { store.put(c); count++; });
                        tx.oncomplete = () => {
                            // Use IPC Reload to avoid 'will-navigate' lock
                            const { ipcRenderer } = require('electron');
                            ipcRenderer.send('trigger-reload');
                        };
                    };
                } catch (e) {
                    alert("Sync Failed: " + e.message + "\\nCheck if server is running!");
                    btnSync.innerHTML = "❌ Fail";
                }
            };

            // EXPORT BTN
            const btnExport = document.createElement('button');
            btnExport.innerHTML = '📤 Backup Data';
            Object.assign(btnExport.style, {
                padding: '8px 16px', backgroundColor: 'transparent', color: '#8ab4f8',
                border: '1px solid #5f6368', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                fontSize: '13px'
            });
            btnExport.onmouseover = () => btnExport.style.backgroundColor = 'rgba(138, 180, 248, 0.1)';
            btnExport.onmouseout = () => btnExport.style.backgroundColor = 'transparent';

            btnExport.onclick = async () => {
                const dbName = "clipto";
                const req = indexedDB.open(dbName);
                req.onsuccess = (event) => {
                    const db = event.target.result;
                    const tables = ["clips", "tags", "users", "settings", "fileRefs"];
                    const exportData = { version: "1.0-native", timestamp: new Date().toISOString() };
                    
                    const getAll = (s) => new Promise((resolve) => {
                         if (!db.objectStoreNames.contains(s)) return resolve([]);
                         const t = db.transaction(s, "readonly").objectStore(s).getAll();
                         t.onsuccess = () => resolve(t.result);
                         t.onerror = () => resolve([]);
                    });
                     Promise.all(tables.map(async t => exportData[t] = await getAll(t))).then(() => {
                        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"});
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = "clipto-backup.json";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    });
                };
            };

            toolbar.appendChild(btnSync);
            toolbar.appendChild(btnExport);
            document.body.appendChild(toolbar);
        }

        if (document.readyState === "complete") createToolbar();
        else window.addEventListener("load", createToolbar);
        setInterval(createToolbar, 2000);

    } catch (err) {
        console.error("Injection Error", err);
    }
})();
`;

function inject(win) {
    if (!win || win.webContents.isDestroyed()) return;
    log(`Injecting into window: ${win.getTitle()}`);

    win.webContents.executeJavaScript(UI_PAYLOAD)
        .then(() => log("Injection Success"))
        .catch(e => log("Injection Error: " + e.message));
}

// 1. Hook Creation
app.on('browser-window-created', (event, win) => {
    log("Event: browser-window-created");
    win.webContents.on('did-finish-load', () => inject(win));
    win.webContents.on('dom-ready', () => inject(win)); // Try earlier too
});

// 2. Poll for existing (Backup)
setTimeout(() => {
    log("Polling for windows...");
    const windows = BrowserWindow.getAllWindows();
    log(`Found ${windows.length} existing windows`);
    windows.forEach(w => inject(w));
}, 3000);

log("Requiring electron-main.js...");
require('./electron-main.js');

