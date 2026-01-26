# QKlipto Desktop (Phase 4)

Hybrid Local/Cloud Clipboard Synchronization Tool.

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* Android Sync Server running locally (for Local Sync)

### Installation

```bash
cd qklipto-desktop
npm install
```

### Development

Run the Electron app in development mode:

```bash
npm run electron:dev
```

### Building

Build for production (Windows):

```bash
npm run electron:build
```

## 🏗️ Architecture

* **Frontend**: React + Vite + Tailwind CSS
* **Desktop Shell**: Electron
* **Database**: Dexie.js (IndexedDB wrapper)
* **State Management**: Zustand
* **Sync**:
    * **Local**: Axios -> REST API (Legacy Android Server)
    * **Cloud**: Firebase v9 SDK (Firestore)

## 📁 Structure

* `src/components`: UI Components
* `src/db`: Database schema & Dexie instance
* `src/models`: TypeScript interfaces
* `src/services`: Sync logic (Local & Firebase)
* `src/stores`: Global state (Zustand)
