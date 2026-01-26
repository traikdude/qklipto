# 🏗️ QKlipto "Rebirth" - Hybrid Architecture Specification

**Architecture**: Hybrid Local (Express) + Cloud (Firebase) Sync
**Stack**: Electron, React, Vite, Tailwind, Zustand, Dexie, Firebase v10
**Goal**: A clean, maintainable, user-owned desktop application.

## 1. Core Feature Set
1. **Clip Management**: CRUD, Rich Text, Favorites, Soft Delete.
2. **Tag System**: Many-to-many tags, colors, filtering.
3. **Search**: Full-text, Date filters.
4. **Sync Engine**: Dual-mode (LAN/Cloud), LWW Conflict Resolution.
5. **Settings**: Theme integration, Server URL config.

## 2. Sync Architecture
### 2.1 Local Sync (LAN)
- **Endpoint**: `http://localhost:3000/sync` (Existing Express Server)
- **Protocol**: REST (GET/POST)
- **Format**: JSON (compatible with Android `LegacyJsonProcessor`)

### 2.2 Cloud Sync (Firebase)
- **Auth**: Firebase Auth (Email/Pass)
- **DB**: Firestore (Collections: `users`, `clips`, `tags`)
- **Security**: Row-level security (users access only their own data).

## 3. Data Models (TypeScript)

### 3.1 Clip Interface
```typescript
export interface Clip {
  id: string; // UUID v4
  text: string;
  title?: string;
  type: "0"; // Strict string for Android compatibility
  fav: boolean;
  deleted: boolean;
  tags: string[]; // Tag names
  createDate: string; // ISO 8601
  modifyDate: string; // ISO 8601
  syncVersion?: number;
  pendingSync?: boolean;
}
```

### 3.2 Dexie Schema (Local)
```typescript
class QKliptoDatabase extends Dexie {
    clips: Table<Clip, string>;
    tags: Table<Tag, string>;
    syncMeta: Table<SyncMeta, number>;
    constructor() {
        super('qklipto');
        this.version(1).stores({
            clips: 'id, createDate, modifyDate, deleted, fav, *tags',
            tags: 'id, name',
            syncMeta: '++id'
        });
    }
}
```

## 4. Project Structure (Scaffold Target)
```
qklipto-desktop/
├── electron/          # Main process & Preload
├── src/               # React Renderer
│   ├── components/    # UI Components
│   ├── db/            # Dexie
│   ├── lib/           # Firebase & Utils
│   ├── models/        # TS Interfaces
│   ├── services/      # Sync Engines
│   └── stores/        # Zustand State
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 5. Implementation Phases
- [ ] **Phase 4.1**: Scaffolding (Vite/Electron setup)
- [ ] **Phase 4.2**: Database Layer (Dexie/Models)
- [ ] **Phase 4.3**: Core UI (Components/Routing)
- [ ] **Phase 4.4**: Local Sync Integration
- [ ] **Phase 4.5**: Firebase Integration
- [ ] **Phase 4.6**: Polish & Release
