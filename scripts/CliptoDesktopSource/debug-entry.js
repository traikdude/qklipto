const { app } = require('electron');

// ============================================
// CLIPTO EXPORT AGENT (NATIVE IDB MODE)
// ============================================

const UI_PAYLOAD = `
(function() {
    console.log(" Export Agent Loaded (Native Mode)");

    function createExportButton() {
        if (document.getElementById('clipto-export-btn')) return;

        const btn = document.createElement("button");
        btn.id = 'clipto-export-btn';
        btn.innerHTML = "📥 EXPORT DATA";
        
        // Style: Clean Green Button
        Object.assign(btn.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "999999",
            padding: "12px 24px",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            cursor: "pointer",
            fontFamily: "sans-serif"
        });

        btn.onclick = async () => {
            btn.innerHTML = "⏳ SCANNING IDB...";
            btn.style.backgroundColor = "#f1c40f"; 
            
            try {
                // 1. OPEN NATIVE DB
                // Dexie databases are just IndexedDB databases
                const dbName = "clipto";
                const req = indexedDB.open(dbName);

                req.onerror = () => {
                    alert("❌ Could not open IndexedDB 'clipto'");
                    btn.innerHTML = "❌ IO ERROR";
                };

                req.onsuccess = (event) => {
                    const db = event.target.result;
                    const tables = ["clips", "tags", "users", "settings", "fileRefs"];
                    const exportData = {
                        version: "1.0-native",
                        timestamp: new Date().toISOString(),
                        source: "clipto-native-export"
                    };

                    let tablesProcessed = 0;

                    // Helper to get all data from a store
                    const getAll = (storeName) => {
                        return new Promise((resolve) => {
                            if (!db.objectStoreNames.contains(storeName)) {
                                resolve([]);
                                return;
                            }
                            const transaction = db.transaction(storeName, "readonly");
                            const store = transaction.objectStore(storeName);
                            const request = store.getAll();
                            request.onsuccess = () => resolve(request.result);
                            request.onerror = () => resolve([]);
                        });
                    };

                    // Process all tables
                    Promise.all(tables.map(async (table) => {
                        exportData[table] = await getAll(table);
                    })).then(() => {
                        const count = exportData.clips ? exportData.clips.length : 0;
                        console.log(\`✅ Extracted \${count} items\`);

                        // DOWNLOAD
                        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"});
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = "clipto-native-export.json";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        btn.innerHTML = \`✅ DONE (\${count})\`;
                        btn.style.backgroundColor = "#27ae60";
                        setTimeout(() => btn.innerHTML = "📥 EXPORT DATA", 3000);
                        
                        db.close();
                    }).catch(err => {
                         alert("Read Error: " + err.message);
                         btn.innerHTML = "❌ READ ERR";
                    });
                };

            } catch (err) {
                console.error(err);
                alert("Critical Error: " + err.message);
                btn.innerHTML = "❌ CRITICAL";
            }
        };

        document.body.appendChild(btn);
    }

    // IMPORT API (Called by Main Process)
    window.importClips = function(clips) {
        console.log("📥 Receiving " + clips.length + " clips from Main Process...");
        
        const request = indexedDB.open("clipto");
        
        request.onerror = (event) => {
            console.error("❌ Database error: " + event.target.errorCode);
            alert("Database Error: Could not open local database.");
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            
            // Check if store exists
            if (!db.objectStoreNames.contains("clips")) {
                alert("❌ Error: 'clips' table not found in database. The app might need to initialize first.");
                return;
            }

            const transaction = db.transaction(["clips"], "readwrite");
            const objectStore = transaction.objectStore("clips");
            
            let successCount = 0;
            let errorCount = 0;

            transaction.oncomplete = () => {
                console.log("✅ Import Transaction Complete.");
                const msg = "Import Complete!\\n\\n✅ Success: " + successCount + "\\n❌ Skipped: " + errorCount + "\\n\\nPlease RESTART the app or press Ctrl+R to see changes.";
                alert(msg);
                // Optional: Try to force Vue refresh if possible, otherwise reload
                location.reload(); 
            };

            transaction.onerror = (event) => {
                console.error("❌ Transaction error:", event.target.error);
                alert("Transaction Failed: " + event.target.error);
            };

            clips.forEach(clip => {
                // Ensure dates are valid Date objects if required by Dexie/IDB
                // But usually strings are fine if not using keypath indexing on them
                // Let's keep them as they are from JSON (strings) unless we know schema enforces strict types
                // Note: Dexie often handles string dates, but let's be safe.
                // Actually, existing export code shows raw dump.
                
                const request = objectStore.put(clip); // put() updates if key exists, add() fails
                request.onsuccess = () => { successCount++; };
                request.onerror = () => { errorCount++; };
            });
        };
    };

    if (document.readyState === "complete") {
        createExportButton();
    } else {
        window.addEventListener("load", createExportButton);
    }
    setTimeout(createExportButton, 2000);
})();
`;

// Inject into all windows
app.on('web-contents-created', (event, contents) => {
    contents.on('did-finish-load', () => {
        contents.executeJavaScript(UI_PAYLOAD).catch(e => console.log("Injection Error:", e));
    });
});

require('./electron-main.js');
