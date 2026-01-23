# ⚖️ Schema Comparison Report
**Generated:** 2026-01-21 15:59:56
**Desktop Source:** Dexie.js (IndexedDB)
**Android Source:** ObjectBox (NoSQL)

## 📊 Entity Alignment (Conceptual Mapping)

| Desktop (IndexedDB / Dexie) | Android (ObjectBox) | Alignment | Notes |
|-----------------------------|---------------------|-----------|-------|
| `clips`                     | `ClipBox`           | ✅ Conceptual match | Same core entity, different storage + naming. Requires field mapping. |
| `tags`                      | `FilterBox`         | ✅ Conceptual match | Tags are modeled as filters on Android. |
| `filters`                   | `FilterBox`         | ✅ Conceptual match | Filter entity represents tags + saved filters. |
| `users`                     | `UserBox`           | ✅ Conceptual match | User metadata represented differently but same intent. |
| `settings`                  | `SettingsBox`       | ✅ Conceptual match | Preferences stored in separate ObjectBox entity. |
| `fileRefs`                  | `FileRefBox`        | ✅ Conceptual match | Attachment metadata differs in structure. |
| `publicLinks`               | (No direct box)     | ⚠️ Partial | Android may not expose public links or uses a different entity. |
| (N/A)                       | `LinkPreviewBox`    | ⚠️ Android-only | Android-only entity; ignore during desktop export. |

## 🔎 Field-Level Mapping Snapshot (Clips)
- **Desktop:** `text`, `title`, `createDate`, `modifyDate`, `fav`, `tagIds`, `firestoreId` (Dexie indexes).  
- **Android:** `ClipBox` supports core text/date/fav/tag associations via ObjectBox entities.  
- **Implication:** Requires a transformation layer (LegacyJsonProcessor + export mapping) rather than 1:1 table sync.

## 📝 Analysis
- **Core Compatibility:** Conceptual alignment across core entities (clips/tags/users/settings/file refs) despite naming differences.
- **Sync Feasibility:** **MEDIUM → HIGH** once export/import mapping is enforced via JSON payloads.
