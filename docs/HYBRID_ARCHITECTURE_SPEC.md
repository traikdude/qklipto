# QKlipto Hybrid Architecture Specification
## Phase 4: Desktop Application Rebirth

**Document Version:** 1.0.0
**Date:** 2026-01-25
**Author:** Claude (Anthropic) + User Collaboration
**Status:** Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Component Specifications](#3-component-specifications)
4. [Data Models & Schemas](#4-data-models--schemas)
5. [API Contracts](#5-api-contracts)
6. [File Structure](#6-file-structure)
7. [Implementation Phases](#7-implementation-phases)
8. [Configuration Guide](#8-configuration-guide)
9. [Security Considerations](#9-security-considerations)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. Executive Summary

### 1.1 Mission
Build a new, clean Desktop application (`qklipto-desktop`) that provides dual-mode synchronization:
- **Local Mode:** Fast sync via Express server on LAN (existing infrastructure)
- **Cloud Mode:** Firebase Firestore sync for anywhere access

### 1.2 Key Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Electron + React | Modern, maintainable, cross-platform |
| Local Database | Dexie.js (IndexedDB) | Matches legacy schema, offline-first |
| Cloud Database | Firebase Firestore | Free tier sufficient, Android already uses it |
| Styling | Tailwind CSS | Rapid UI development, small bundle |
| State Management | Zustand | Lightweight, simple, TypeScript-friendly |

### 1.3 Success Criteria
- [ ] Desktop app syncs with Android v1.0.6 via local sync-server
- [ ] Desktop app syncs with Android via Firebase (same project)
- [ ] User can switch between Local/Cloud modes
- [ ] All existing clips import successfully
- [ ] Zero Firebase costs for single-user usage

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        QKLIPTO HYBRID SYNC ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                            ┌──────────────────┐                              │
│                            │  FIREBASE CLOUD  │                              │
│                            │  ─────────────── │                              │
│                            │  • Firestore DB  │                              │
│                            │  • Auth Service  │                              │
│                            │  • Free Tier     │                              │
│                            └────────┬─────────┘                              │
│                                     │                                        │
│                    ┌────────────────┼────────────────┐                       │
│                    │                │                │                       │
│                    ▼                ▼                ▼                       │
│   ┌─────────────────────┐  ┌──────────────┐  ┌─────────────────────┐        │
│   │   ANDROID APP       │  │              │  │   DESKTOP APP       │        │
│   │   ───────────────   │  │   OPTIONAL   │  │   ───────────────   │        │
│   │   • Clipto v1.0.6   │  │   CLOUD      │  │   • qklipto-desktop │        │
│   │   • ObjectBox DB    │  │   SYNC       │  │   • Dexie.js DB     │        │
│   │   • Firebase SDK    │  │              │  │   • Firebase SDK    │        │
│   └──────────┬──────────┘  └──────────────┘  └──────────┬──────────┘        │
│              │                                          │                    │
│              │              LOCAL NETWORK               │                    │
│              │         ┌──────────────────┐             │                    │
│              │         │   SYNC SERVER    │             │                    │
│              └────────►│   ────────────   │◄────────────┘                    │
│                        │   • Express.js   │                                  │
│                        │   • Port 3000    │                                  │
│                        │   • JSON DB      │                                  │
│                        │   • LAN Only     │                                  │
│                        └──────────────────┘                                  │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         SYNC MODES                                   │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │  MODE A: LOCAL SYNC                 MODE B: CLOUD SYNC              │   │
│   │  ─────────────────                  ────────────────                │   │
│   │  • Fast (LAN speed)                 • Works anywhere                │   │
│   │  • No internet required             • Automatic backup              │   │
│   │  • You control data                 • Real-time sync                │   │
│   │  • Sync server must run             • Requires internet             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Diagrams

#### Local Sync Flow
```
┌──────────┐     POST /sync      ┌─────────────┐     GET /sync      ┌──────────┐
│ Desktop  │ ──────────────────► │ Sync Server │ ◄────────────────── │ Android  │
│   App    │                     │  (Express)  │                     │   App    │
└──────────┘                     └─────────────┘                     └──────────┘
     │                                  │                                  │
     │  1. User creates clip           │                                  │
     │  2. Save to local Dexie         │                                  │
     │  3. POST to sync-server         │                                  │
     │                                  │  4. Server merges (LWW)          │
     │                                  │  5. Increment version            │
     │                                  │                                  │
     │                                  │  6. Android polls GET /sync      │
     │                                  │  7. Server returns new clips     │
     │                                  │                                  │
     │                                  │                                  │  8. Android imports
```

#### Cloud Sync Flow
```
┌──────────┐                     ┌─────────────┐                     ┌──────────┐
│ Desktop  │ ◄─────────────────► │  Firebase   │ ◄─────────────────► │ Android  │
│   App    │    Real-time        │  Firestore  │    Real-time        │   App    │
└──────────┘    Listeners        └─────────────┘    Listeners        └──────────┘
     │                                  │                                  │
     │  1. User creates clip           │                                  │
     │  2. Save to local Dexie         │                                  │
     │  3. Write to Firestore          │                                  │
     │                                  │  4. Firestore propagates         │
     │                                  │                                  │
     │                                  │  5. Android listener fires       │
     │                                  │                                  │  6. Android updates local
```

---

## 3. Component Specifications

### 3.1 Desktop Application (`qklipto-desktop`)

#### Technology Stack
| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Runtime | Electron | ^28.0.0 | Cross-platform desktop |
| UI Framework | React | ^18.2.0 | Component-based UI |
| Language | TypeScript | ^5.3.0 | Type safety |
| Build Tool | Vite | ^5.0.0 | Fast builds, HMR |
| Local DB | Dexie.js | ^3.2.0 | IndexedDB wrapper |
| Cloud DB | Firebase | ^10.7.0 | Firestore + Auth |
| State | Zustand | ^4.4.0 | Global state management |
| Styling | Tailwind CSS | ^3.4.0 | Utility-first CSS |
| Icons | Lucide React | ^0.300.0 | Icon library |

#### Core Features
1. **Clip Management**
   - Create, read, update, delete clips
   - Rich text support (plain text, markdown)
   - Favorite/pin functionality
   - Soft delete with recovery

2. **Tag System**
   - Create/edit/delete tags
   - Assign multiple tags to clips
   - Filter clips by tag
   - Tag colors

3. **Search**
   - Full-text search across clips
   - Filter by date range
   - Filter by favorites

4. **Sync Engine**
   - Dual-mode: Local (Express) / Cloud (Firebase)
   - Manual sync trigger
   - Auto-sync on change (configurable)
   - Conflict resolution (Last-Write-Wins)
   - Offline queue for pending changes

5. **Settings**
   - Sync mode toggle (Local/Cloud/Off)
   - Local server URL configuration
   - Theme (Light/Dark)
   - Export/Import data

### 3.2 Sync Server (Existing - Minor Updates)

**Location:** `sync-server/server.js`

#### Current Capabilities (Keep)
- `GET /sync?version=N` - Pull changes since version N
- `POST /sync` - Push clip array, LWW merge
- JSON file persistence (`db.json`)
- CORS enabled for local access

#### Enhancements Needed
1. **Add DELETE endpoint** for soft-deleted clips
2. **Add `/health` endpoint** for connection testing
3. **Add mDNS broadcast** (optional, for auto-discovery)

#### Updated API
```
GET  /              → Server info page
GET  /health        → { status: "ok", version: N }
GET  /sync          → { status: "update"|"uptodate", data: [], version: N }
POST /sync          → { status: "success", version: N }
DELETE /sync/:id    → { status: "deleted", version: N }
```

### 3.3 Firebase Configuration

#### Required Firebase Services
| Service | Purpose | Free Tier Limit |
|---------|---------|-----------------|
| Authentication | User identity | Unlimited (email/password) |
| Firestore | Cloud database | 1 GiB storage, 50K reads/day |

#### Firestore Collections Structure
```
firestore/
├── users/
│   └── {userId}/
│       ├── email: string
│       ├── createdAt: timestamp
│       └── settings: map
│
├── clips/
│   └── {clipId}/
│       ├── userId: string (owner)
│       ├── text: string
│       ├── title: string
│       ├── type: string ("0" = text)
│       ├── fav: boolean
│       ├── deleted: boolean
│       ├── tags: array<string>
│       ├── createDate: timestamp
│       ├── modifyDate: timestamp
│       └── syncVersion: number
│
└── tags/
    └── {tagId}/
        ├── userId: string (owner)
        ├── name: string
        └── color: string
```

#### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /clips/{clipId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    match /tags/{tagId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

---

## 4. Data Models & Schemas

### 4.1 Clip Model (TypeScript)

```typescript
// src/models/Clip.ts

export interface Clip {
  // Primary identifier (UUID v4)
  id: string;

  // Content
  text: string;
  title?: string;

  // Type: "0" = plain text, "1" = markdown (future)
  type: "0" | "1";

  // Metadata
  fav: boolean;
  deleted: boolean;
  tags: string[];  // Array of tag names

  // Timestamps (ISO 8601 strings for JSON compatibility)
  createDate: string;
  modifyDate: string;

  // Sync tracking
  syncVersion?: number;
  pendingSync?: boolean;

  // Firebase reference (cloud mode only)
  firestoreId?: string;
}

// Default clip factory
export const createClip = (text: string, title?: string): Clip => ({
  id: crypto.randomUUID(),
  text,
  title: title || "",
  type: "0",
  fav: false,
  deleted: false,
  tags: [],
  createDate: new Date().toISOString(),
  modifyDate: new Date().toISOString(),
  pendingSync: true
});
```

### 4.2 Tag Model (TypeScript)

```typescript
// src/models/Tag.ts

export interface Tag {
  id: string;
  name: string;
  color: string;  // Hex color code
  userId?: string;  // For cloud mode
}

// Default colors palette
export const TAG_COLORS = [
  "#4CAF50", "#2196F3", "#9C27B0", "#FF5722",
  "#FFC107", "#009688", "#3DDC84", "#607D8B"
];

export const createTag = (name: string, color?: string): Tag => ({
  id: crypto.randomUUID(),
  name,
  color: color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]
});
```

### 4.3 Dexie Schema (Local Database)

```typescript
// src/db/database.ts

import Dexie, { Table } from 'dexie';
import { Clip } from '../models/Clip';
import { Tag } from '../models/Tag';

export interface SyncMeta {
  id: number;
  lastLocalVersion: number;
  lastCloudVersion: number;
  lastSyncTime: string;
}

export class QKliptoDatabase extends Dexie {
  clips!: Table<Clip, string>;
  tags!: Table<Tag, string>;
  syncMeta!: Table<SyncMeta, number>;

  constructor() {
    super('qklipto');

    this.version(1).stores({
      // Primary key is 'id', indexed fields listed
      clips: 'id, createDate, modifyDate, deleted, fav, *tags',
      tags: 'id, name',
      syncMeta: '++id'
    });
  }
}

export const db = new QKliptoDatabase();
```

### 4.4 Android Compatibility Matrix

| Desktop Field | Android Field | Transform Required |
|---------------|---------------|-------------------|
| `id` | `id` | None (UUID) |
| `text` | `text` | None |
| `title` | `title` | None |
| `type` | `type` | Must be string "0" |
| `fav` | `fav` | Boolean |
| `deleted` | `deleted` | Boolean |
| `tags` | `tags` | Array of tag names |
| `createDate` | `createDate` | ISO 8601 string |
| `modifyDate` | `modifyDate` | ISO 8601 string |

**Critical:** The `type` field MUST be the string `"0"` (not number `0`) for Android's `LegacyJsonProcessor` to correctly import clips.

---

## 5. API Contracts

### 5.1 Local Sync Server API

#### GET /health
```http
GET http://localhost:3000/health

Response 200:
{
  "status": "ok",
  "version": 1706234567890,
  "clipCount": 42
}
```

#### GET /sync
```http
GET http://localhost:3000/sync?version=0

Response 200 (has updates):
{
  "status": "update",
  "version": 1706234567890,
  "data": [
    {
      "id": "uuid-here",
      "type": "0",
      "text": "Clip content",
      "title": "Optional title",
      "createDate": "2026-01-25T10:00:00.000Z",
      "modifyDate": "2026-01-25T10:00:00.000Z",
      "fav": false,
      "deleted": false,
      "tags": ["tag1", "tag2"]
    }
  ]
}

Response 200 (no updates):
{
  "status": "uptodate",
  "version": 1706234567890
}
```

#### POST /sync
```http
POST http://localhost:3000/sync
Content-Type: application/json

{
  "clips": [
    {
      "id": "uuid-here",
      "type": "0",
      "text": "New clip content",
      "title": "Title",
      "createDate": "2026-01-25T10:00:00.000Z",
      "modifyDate": "2026-01-25T10:30:00.000Z",
      "fav": true,
      "deleted": false,
      "tags": ["important"]
    }
  ]
}

Response 200:
{
  "status": "success",
  "version": 1706234587890,
  "merged": 1
}
```

### 5.2 Firebase Sync Service (Internal)

```typescript
// src/services/firebaseSync.ts

interface FirebaseSyncService {
  // Initialize with user credentials
  initialize(userId: string): Promise<void>;

  // Push local changes to Firestore
  pushClips(clips: Clip[]): Promise<void>;

  // Pull remote changes from Firestore
  pullClips(since?: Date): Promise<Clip[]>;

  // Subscribe to real-time updates
  subscribe(callback: (clips: Clip[]) => void): () => void;

  // Full sync (push all, pull all)
  fullSync(): Promise<{ pushed: number, pulled: number }>;
}
```

---

## 6. File Structure

### 6.1 Project Layout

```
qklipto-desktop/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron-builder.json
├── tailwind.config.js
├── postcss.config.js
│
├── electron/
│   ├── main.ts                 # Electron main process
│   ├── preload.ts              # Preload script (contextBridge)
│   └── ipc/
│       ├── handlers.ts         # IPC message handlers
│       └── channels.ts         # Channel name constants
│
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Root component
│   ├── index.css               # Tailwind imports
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   │   ├── Header.tsx      # Top bar with search
│   │   │   └── MainArea.tsx    # Content container
│   │   │
│   │   ├── clips/
│   │   │   ├── ClipList.tsx    # Clip list view
│   │   │   ├── ClipCard.tsx    # Individual clip card
│   │   │   ├── ClipEditor.tsx  # Create/edit clip
│   │   │   └── ClipDetail.tsx  # Full clip view
│   │   │
│   │   ├── tags/
│   │   │   ├── TagList.tsx     # Tag management
│   │   │   ├── TagBadge.tsx    # Tag display component
│   │   │   └── TagPicker.tsx   # Tag selection dropdown
│   │   │
│   │   ├── sync/
│   │   │   ├── SyncStatus.tsx  # Sync indicator
│   │   │   └── SyncSettings.tsx# Sync configuration
│   │   │
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Toast.tsx
│   │
│   ├── db/
│   │   └── database.ts         # Dexie database setup
│   │
│   ├── models/
│   │   ├── Clip.ts             # Clip type definitions
│   │   └── Tag.ts              # Tag type definitions
│   │
│   ├── services/
│   │   ├── localSync.ts        # Express server sync
│   │   ├── firebaseSync.ts     # Firestore sync
│   │   ├── syncEngine.ts       # Unified sync orchestrator
│   │   └── conflictResolver.ts # LWW conflict handling
│   │
│   ├── stores/
│   │   ├── clipStore.ts        # Clip state (Zustand)
│   │   ├── tagStore.ts         # Tag state (Zustand)
│   │   ├── syncStore.ts        # Sync state (Zustand)
│   │   └── settingsStore.ts    # App settings (Zustand)
│   │
│   ├── hooks/
│   │   ├── useClips.ts         # Clip operations hook
│   │   ├── useTags.ts          # Tag operations hook
│   │   ├── useSync.ts          # Sync operations hook
│   │   └── useSearch.ts        # Search functionality
│   │
│   ├── lib/
│   │   ├── firebase.ts         # Firebase initialization
│   │   ├── utils.ts            # Utility functions
│   │   └── constants.ts        # App constants
│   │
│   └── pages/
│       ├── Home.tsx            # Main clips view
│       ├── Favorites.tsx       # Favorites filter
│       ├── Tags.tsx            # Tag management
│       ├── Trash.tsx           # Deleted clips
│       └── Settings.tsx        # App settings
│
├── public/
│   ├── icon.png                # App icon
│   └── index.html              # HTML template
│
└── resources/
    ├── icon.ico                # Windows icon
    ├── icon.icns               # macOS icon
    └── icon.png                # Linux icon
```

### 6.2 Configuration Files

#### package.json
```json
{
  "name": "qklipto-desktop",
  "version": "1.0.0",
  "description": "QKlipto Desktop - Cross-platform clipboard sync",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && electron-builder",
    "preview": "vite preview",
    "electron:dev": "concurrently \"vite\" \"electron .\"",
    "electron:build": "vite build && electron-builder"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "dexie": "^3.2.4",
    "firebase": "^10.7.1",
    "zustand": "^4.4.7",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.6",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.3.3",
    "vite": "^5.0.10",
    "electron": "^28.1.0",
    "electron-builder": "^24.9.1",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "concurrently": "^8.2.2"
  }
}
```

#### Firebase Configuration (src/lib/firebase.ts)
```typescript
// IMPORTANT: Get these values from Firebase Console
// Project Settings > Your apps > Web app > SDK setup

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // From Firebase Console
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
```

---

## 7. Implementation Phases

### Phase 4.1: Project Scaffolding (Foundation)
**Estimated Complexity:** Low

**Tasks:**
1. [ ] Create `qklipto-desktop` directory in project root
2. [ ] Initialize npm project with dependencies
3. [ ] Configure Vite for Electron + React
4. [ ] Set up Tailwind CSS
5. [ ] Create Electron main/preload structure
6. [ ] Verify app launches with blank window

**Deliverable:** Empty Electron app that opens a window

---

### Phase 4.2: Database Layer
**Estimated Complexity:** Low-Medium

**Tasks:**
1. [ ] Implement Dexie database schema
2. [ ] Create Clip model with CRUD operations
3. [ ] Create Tag model with CRUD operations
4. [ ] Implement SyncMeta tracking table
5. [ ] Write database utility functions
6. [ ] Test with sample data

**Deliverable:** Working local database with CRUD operations

---

### Phase 4.3: Core UI Components
**Estimated Complexity:** Medium

**Tasks:**
1. [ ] Build layout components (Sidebar, Header, MainArea)
2. [ ] Implement ClipList component
3. [ ] Implement ClipCard component
4. [ ] Implement ClipEditor (create/edit)
5. [ ] Implement TagBadge and TagPicker
6. [ ] Add search functionality
7. [ ] Implement basic routing (Home, Favorites, Trash, Settings)

**Deliverable:** Functional UI for managing clips locally

---

### Phase 4.4: Local Sync (Express Server)
**Estimated Complexity:** Medium

**Tasks:**
1. [ ] Implement localSync service
2. [ ] Add sync status indicator to UI
3. [ ] Implement manual sync button
4. [ ] Add server URL configuration in Settings
5. [ ] Handle offline scenarios gracefully
6. [ ] Test with existing sync-server and Android app

**Deliverable:** Desktop syncs with Android via local server

---

### Phase 4.5: Firebase Integration
**Estimated Complexity:** Medium-High

**Tasks:**
1. [ ] Add Firebase Web app to existing project (Console)
2. [ ] Configure Firebase SDK in desktop app
3. [ ] Implement Firebase Auth (email/password)
4. [ ] Implement Firestore sync service
5. [ ] Add real-time listener for changes
6. [ ] Implement sync mode toggle (Local/Cloud/Off)
7. [ ] Test with Android app in cloud mode

**Deliverable:** Desktop syncs with Android via Firebase

---

### Phase 4.6: Polish & Release
**Estimated Complexity:** Medium

**Tasks:**
1. [ ] Import/Export functionality (JSON backup)
2. [ ] Dark mode theme
3. [ ] Keyboard shortcuts
4. [ ] System tray integration
5. [ ] Auto-launch on startup option
6. [ ] Windows installer build
7. [ ] Documentation

**Deliverable:** Production-ready desktop application

---

## 8. Configuration Guide

### 8.1 Firebase Setup (Step-by-Step)

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your existing project (same as Android)

2. **Add Web App**
   - Click gear icon → Project Settings
   - Scroll to "Your apps" section
   - Click "Add app" → Web (`</>`)
   - Register app name: "QKlipto Desktop"
   - Do NOT enable Firebase Hosting (not needed)
   - Copy the `firebaseConfig` object

3. **Update Desktop App**
   - Paste config into `src/lib/firebase.ts`

4. **Enable Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider
   - (Android already has this enabled)

5. **Deploy Security Rules**
   - Go to Firestore → Rules
   - Paste the rules from Section 3.3
   - Publish

### 8.2 Local Sync Server Setup

The existing sync-server at `sync-server/server.js` works as-is.

**To run:**
```bash
cd sync-server
npm install
node server.js
```

**Verify:**
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","version":...}
```

### 8.3 Android App Configuration

The Android app (v1.0.6) already supports:
- **Local sync:** Enter `http://YOUR_PC_IP:3000` in Settings
- **Cloud sync:** Uses Firebase from `google-services.json`

No changes needed to Android app for hybrid architecture.

---

## 9. Security Considerations

### 9.1 Local Mode Security
| Risk | Mitigation |
|------|------------|
| LAN exposure | Server binds to `0.0.0.0` but only on local network |
| No authentication | Acceptable for personal single-user use |
| Data in plain JSON | Keep `db.json` in user-owned directory |

### 9.2 Cloud Mode Security
| Risk | Mitigation |
|------|------------|
| Unauthorized access | Firebase Auth + Firestore security rules |
| Data at rest | Firebase encrypts by default |
| API key exposure | Keys are safe to expose (security rules enforce access) |

### 9.3 Desktop App Security
| Risk | Mitigation |
|------|------------|
| Electron node integration | Use preload script with contextBridge |
| XSS attacks | React escapes by default; DOMPurify for rich text |
| Local data access | Stored in user's AppData (OS-protected) |

---

## 10. Testing Strategy

### 10.1 Unit Tests
- [ ] Clip CRUD operations
- [ ] Tag CRUD operations
- [ ] Conflict resolution logic
- [ ] Date formatting utilities

### 10.2 Integration Tests
- [ ] Dexie database operations
- [ ] Local sync with Express server
- [ ] Firebase sync operations

### 10.3 End-to-End Tests
- [ ] Create clip on Desktop → appears on Android (local)
- [ ] Create clip on Android → appears on Desktop (local)
- [ ] Create clip on Desktop → appears on Android (cloud)
- [ ] Offline clip creation → syncs when online
- [ ] Delete clip → soft-deletes across devices

### 10.4 Manual Test Checklist

**Local Sync:**
- [ ] Start sync-server
- [ ] Desktop: Create clip
- [ ] Android: Pull from server, verify clip appears
- [ ] Android: Create clip
- [ ] Desktop: Pull from server, verify clip appears

**Cloud Sync:**
- [ ] Desktop: Sign in with Firebase
- [ ] Desktop: Create clip
- [ ] Android: Verify clip appears (real-time)
- [ ] Android: Create clip
- [ ] Desktop: Verify clip appears (real-time)

**Offline Mode:**
- [ ] Disconnect network
- [ ] Create clip on Desktop
- [ ] Reconnect network
- [ ] Verify clip syncs automatically

---

## Appendix A: Quick Reference Commands

```bash
# Navigate to project
cd C:\Users\Erik\.gemini\antigravity\scratch\qklipto

# Create new desktop app directory
mkdir qklipto-desktop
cd qklipto-desktop

# Initialize project
npm init -y
npm install react react-dom dexie firebase zustand lucide-react date-fns uuid
npm install -D typescript vite electron electron-builder @vitejs/plugin-react tailwindcss postcss autoprefixer concurrently @types/react @types/react-dom @types/uuid

# Initialize Tailwind
npx tailwindcss init -p

# Start development
npm run electron:dev

# Build for production
npm run electron:build
```

---

## Appendix B: IDE Agent Instructions

**To the IDE Agent executing this specification:**

1. **Read this entire document** before starting implementation
2. **Follow the phases in order** (4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6)
3. **Verify each phase works** before moving to the next
4. **Use the exact file structure** defined in Section 6
5. **Use the exact data models** defined in Section 4
6. **Test with the existing Android app** at each sync milestone

**Critical compatibility notes:**
- The `type` field in clips MUST be string `"0"`, not number `0`
- Date fields MUST be ISO 8601 strings
- The Android app's `LegacyJsonProcessor` expects this exact format

**Questions to ask the user:**
- Firebase Web config values (after they add the web app)
- Preferred UI theme (if deviating from spec)
- Any additional features to include

---

**Document End**

*This specification was generated by Claude (Anthropic) in collaboration with the user for the QKlipto project.*
