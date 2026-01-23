# Clipto Import/Export JSON Format

## ✅ Purpose
Define the canonical JSON format used to move Clipto desktop data into the Android app and align export tooling with the Phase 3 sync payload.

## 📌 Required Fields (Clip Items)
Each clip entry **must** include:
- `id` (string): stable identifier (UUID preferred)
- `text` (string)
- `title` (string, optional)
- `createDate` (ISO 8601 string)
- `modifyDate` (ISO 8601 string)
- `fav` (boolean)
- `tags` (array of strings)
- `type` (string): **must be `"0"` for Text clips**

> **Why `"type": "0"`?**  
> Android expects numeric string values for `TextType`. `"0"` maps to `TextType.TEXT`. The LegacyJsonProcessor accepts both `"0"` and `"TEXT"` for backward compatibility, but production exports should emit `"0"` for reliability.

## 🧩 Top-Level Structure
```json
{
  "source": "clipto-desktop-windows",
  "version": "1.0.0",
  "exportDate": "2026-01-22T06:00:00.000Z",
  "clips": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "0",
      "text": "Example clip",
      "title": "Optional title",
      "createDate": "2026-01-21T10:30:00.000Z",
      "modifyDate": "2026-01-21T10:30:00.000Z",
      "fav": true,
      "tags": ["welcome", "sample"]
    }
  ],
  "tags": [
    { "name": "welcome", "color": "#4CAF50" }
  ]
}
```

## 🔄 Phase 3 Sync Payload Alignment
For file-based sync, the **canonical payload** should follow `docs/PHASE_3_DESIGN.md`:

```
/qklipto-sync/
├── meta.json
├── clips/
│   ├── {id}.json
├── tags.json
└── settings.json
```

Each `{id}.json` clip file should include the same required fields, including `"type": "0"`.

## ⚠️ Known Pitfalls
- Missing or non-numeric `type` values can cause 0-note imports.
- Date strings without milliseconds should be normalized before import.
- Dexie `tagIds` must be mapped to tag names before import; Android expects tag names.
- Tags are created on import if missing; duplicates may occur if names vary by case.
