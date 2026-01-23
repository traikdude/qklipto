# Execution Guide: Phase 3 (Sync)

## 🔄 Automated Data Export

This tool connects to your running Clipto application and exports your clipboard history to a folder compatible with Syncthing, Dropbox, etc.

### Prerequisites
1.  **Node.js** installed.
2.  Run `npm install` inside the `scripts/` folder once.

### Step 1: Launch Clipto in Debug Mode
You must start Clipto with a special flag so our script can talk to it.

**Windows (PowerShell):**
```powershell
& "C:\Users\%USERNAME%\AppData\Local\Programs\Clipto\Clipto.exe" --remote-debugging-port=9222
```

**Linux:**
```bash
/path/to/clipto --remote-debugging-port=9222
```

### Step 2: Run the Export Script
While Clipto is running:

```bash
cd scripts
node Phase3.2_AutomatedExport.js
```

### Step 3: Check the Results
Your data will be available in the `qklipto-sync` folder in the project root.

Expected structure (matches `docs/PHASE_3_DESIGN.md`):
```
/qklipto-sync/
├── meta.json
├── clips/
│   ├── {id}.json
├── tags.json
└── settings.json
```

If the exporter cannot locate the Clipto Dexie database, it will still emit a debug payload in `qklipto-sync/raw/` so you can inspect available IndexedDB stores.
