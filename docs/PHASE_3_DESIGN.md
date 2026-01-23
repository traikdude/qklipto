# Phase 3: Custom Sync Architecture (File-Based)

## 🎯 Objective
Replace the defunct Firebase/Firestore backend with a local file-based synchronization protocol. This allows users to sync their clipboard history across devices using their preferred file transport layer (Syncthing, OneDrive, Dropbox, Git, etc.) without relying on a proprietary cloud service.

## 🏗️ Architecture Overview

The system treats the Local File System as the "Server".

**Components:**
1.  **The Bridge (Adapter):** A script/module that interfaces with the extracted Clipto Dexie.js database.
2.  **The Payload (Canonical State):** A structured set of JSON files representing the user's data.
3.  **The Transport:** External tools (Syncthing/Cloud Drive) that move files between devices.

## 💾 Data Model (The Payload)

To ensure compatibility and easy conflict resolution, we will export data into a split-file structure in a `sync/` directory.

### Directory Structure
```
/qklipto-sync/
├── meta.json         # Sync state (device IDs, last sync timestamps)
├── clips/
│   ├── {firestoreId}.json  # Individual clip files (easier for partial syncs)
│   └── ...
├── tags.json         # All tags in one file (low volume)
└── settings.json     # User preferences
```

### JSON Schema (Clip)
Each `{firestoreId}.json` will contain:
```json
{
  "id": "uuid-v4-or-original-firestore-id",
  "type": "0",
  "text": "The clipboard content...",
  "modifyDate": 1678888888888,
  "deleted": false,
  "deviceOrigin": "desktop-linux-01"
}
```

## 🔄 Synchronization Logic

We will implement a **Last Write Wins (LWW)** strategy based on `modifyDate`.

### 1. Export Flow (Local DB -> File System)
*Trigger:* Scheduled task or File Watcher on DB file change.
1.  **Read** local Dexie.js database.
2.  **Compare** local records with the "Sync Payload" files.
    *   If Local `modifyDate` > File `modifyDate`: **WRITE** to file.
    *   If Local `modifyDate` < File `modifyDate`: **SKIP** (Import needed).
3.  **Update** `meta.json` with local sync timestamp.

### 2. Import Flow (File System -> Local DB)
*Trigger:* File Watcher on `sync/` directory.
1.  **Scan** `sync/` directory for changed files.
2.  **Iterate** through clips:
    *   **Case New:** ID exists in File but not in DB -> **INSERT**.
    *   **Case Update:** File `modifyDate` > DB `modifyDate` -> **UPDATE**.
    *   **Case Delete:** File has `deleted: true` -> **SOFT DELETE** in DB.
    *   **Case Stale:** File `modifyDate` < DB `modifyDate` -> **IGNORE** (Export needed).
3.  **Reload** Electron app renderer (if needed) to reflect changes.

## 🛠️ Implementation Plan

### Step 3.1: The Exporter (Proof of Concept)
*   **Goal:** Read `clips` from the LevelDB/IndexedDB dump and write them to `sync/clips/`.
*   **Input:** The extracted data from Phase 2.
*   **Output:** JSON files.

### Step 3.2: The Importer
*   **Goal:** Read JSON files and inject them back into the application's database.

### Step 3.3: The Watcher (Daemon)
*   **Goal:** Automate the Export/Import cycle.

## 🔒 Security Note
Since data is stored in plain text JSON, users relying on public cloud storage (Dropbox/Drive) should use an encrypted overlay like Cryptomator if their clipboard contains sensitive data.
