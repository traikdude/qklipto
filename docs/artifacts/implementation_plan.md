# Clipto Directory Consolidation Plan

## Goal
Consolidate scattered Clipto files from OneDrive into the main project directory with proper organization and safety backups.

## Current State
### Main Project
- **Location**: `C:\Users\Erik\.gemini\antigravity\scratch\qklipto\`
- **Size**: Mixed (git repo, scripts, sync-server, android source)
- **Status**: Active development directory

### Scattered Files
- **Backups**: `C:\Users\Erik\OneDrive\CliptoBackups\` (2 dirs + 2 files, ~2.4 MB)
  - `CliptoDailyBackup.ps1`
  - `Clipto_20260121/`
  - `Clipto_20260122/`
  - `clipto_backup_260123_124444.json` (2.3 MB)
- **Archive**: `C:\Users\Erik\OneDrive\CliptoArchive_20260121_224104\` (App data cache)

## User Review Required

> [!WARNING]
> **Pre-Migration Backup**
> Before ANY moves, we will create `FULL_BACKUP_qklipto_20260123` in OneDrive as a complete safety copy. This ensures rollback is possible.

> [!IMPORTANT]
> **No Hardcoded Paths Found**
> Search confirmed: No OneDrive paths are hardcoded in `.js`, `.bat`, or `.json` files. Safe to proceed with moves.

## Proposed Changes

### Phase 1: Safety Backup (CRITICAL)
#### Create Full Backup
```batch
robocopy "C:\Users\Erik\.gemini\antigravity\scratch\qklipto" ^
         "C:\Users\Erik\OneDrive\FULL_BACKUP_qklipto_20260123" ^
         /MIR /R:2 /W:5 /LOG:backup_log.txt
```
- **Purpose**: Complete mirror backup before any structural changes
- **Estimation**: ~50-100 MB (git repo + node_modules)

---

### Phase 2: Directory Structure Creation
#### Create New Subdirectories
Inside `C:\Users\Erik\.gemini\antigravity\scratch\qklipto\`:
- `backups/` - For JSON backup files
- `archives/` - For historical archives (app data caches)
- `build/` - For compiled executables (if generated)
- `data/` - For shared data files

---

### Phase 3: Move Scattered Files
#### Move Backups
```batch
robocopy "C:\Users\Erik\OneDrive\CliptoBackups" ^
         "C:\Users\Erik\.gemini\antigravity\scratch\qklipto\backups" ^
         /MOVE /E /R:2 /W:5
```

#### Move Archive
```batch
robocopy "C:\Users\Erik\OneDrive\CliptoArchive_20260121_224104" ^
         "C:\Users\Erik\.gemini\antigravity\scratch\qklipto\archives\CliptoArchive_20260121_224104" ^
         /MOVE /E /R:2 /W:5
```

---

### Phase 4: Update `.gitignore`
#### [MODIFY] [.gitignore](file:///C:/Users/Erik/.gemini/antigravity/scratch/qklipto/.gitignore)
Add exclusions:
```gitignore
# Consolidated directories
/backups/
/archives/
/build/
/data/
```

---

### Phase 5: Locate/Generate `.exe`
#### Search for Existing Build
```batch
dir /s /b "C:\Users\Erik\*.exe" | findstr /i "clipto"
```

#### If Not Found
- Check if `scripts/CliptoDesktopSource/` contains build configuration
- Look for `electron-builder` or `electron-packager` scripts in `package.json`
- Generate if build tools are configured

---

## Verification Plan

### Automated Tests
1. **Backup Verification**: Compare file counts between source and backup
2. **Launcher Test**: Run `LaunchCliptoWithSync.bat` and verify both components start
3. **Sync Server Test**: Verify `http://localhost:3000` responds
4. **Desktop App Test**: Verify UI loads and displays existing clips

### Manual Verification
1. **Android Sync**: Have user trigger sync from Android device
2. **Import/Export**: Test new Tray menu items
3. **Data Integrity**: Confirm `sync-server/db.json` size unchanged (~2.2 MB)

---

## Rollback Plan

> [!CAUTION]
> **If Anything Goes Wrong**
> ```batch
> robocopy "C:\Users\Erik\OneDrive\FULL_BACKUP_qklipto_20260123" ^
>          "C:\Users\Erik\.gemini\antigravity\scratch\qklipto" ^
>          /MIR /R:2 /W:5
> ```
> This restores to pre-consolidation state.
