# 🧪 QKlipto Desktop: v1.0 Alpha Testing Guide

This guide ensures that all core systems are functional before we build the final production executable.

## 🏁 Prerequisites
1.  Navigate to the project folder: `cd qklipto-desktop`
2.  Install dependencies: `npm install`
3.  Launch the dev environment: `npm run electron:dev`

---

## 📋 Test Matrix

### 1. Basic Operations (CRUD)
- [ ] **Create**: click '+' and create a note. Verify it appears in the list.
- [ ] **Edit**: change the content of a note. Verify it updates in real-time.
- [ ] **Delete**: move a note to Trash. Verify it disappears from 'All' and appears in 'Trash'.
- [ ] **Persistence**: Restart the app. Verify all notes are still present.

### 2. Synchronization (Hybrid Mode)
- [ ] **Local Sync**: 
    1. Set Mode to 'Local Sync' in Settings.
    2. Set URL to `http://localhost:3000`.
    3. Click 'Sync Now'.
    4. Verify 'Welcome' note or local data appears.
- [ ] **Cloud Sync**: 
    1. Set Mode to 'Firebase Cloud'.
    2. Sign in with Google.
    3. Verify cloud clips are fetched.
- [ ] **Sync Loop**: Wait 30 seconds. Check console for sync logs.

### 3. Data Integrity
- [ ] **Export**: Click 'Export JSON'. Verify file saves correctly.
- [ ] **Import**: Import a standard Clipto JSON. Verify clip count matches.
- [ ] **Tagging**: Add tags to clips. Verify filtering by tag works.

### 4. UI/UX
- [ ] **Theme**: Switch between Light/Dark mode. Verify all components (AppBar, Sidebar, Cards) adapt correctly.
- [ ] **Navigation**: Test all views (Favorites, Tags, Trash, Settings).

---

## 📦 Production Build
Once the tests above pass, run the following in an **Administrator Terminal**:

```bash
cd qklipto-desktop
npm run electron:build
```

**Output**: The installer will be located in `qklipto-desktop/dist/`.
