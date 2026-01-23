# Clipto Sync & Data Management Update

I have successfully enhanced your Clipto setup to ensure the Sync Server runs automatically and provided safe ways to Import/Export data.

## 🚀 New Launcher: `LaunchCliptoWithSync.bat`
Located in your root installation folder.
**Action:** Always start Clipto using this file instead of the default icon.

**What it does:**
1.  Starts the **Sync Server** in the background (using `pm2` if available, or silent `node`).
2.  Launches the **Clipto Desktop App**.
3.  Ensures the "Bridge" is open so your data appears.

## 📥 New Features: Import & Export
Since the "Skill Runes" menu is part of the locked (minified) application code, I added these options to the **System Tray Menu** for better accessibility and stability.

**How to use:**
1.  Launch the app.
2.  Locate the **Clipto icon** in your Windows Taskbar System Tray (near the clock).
3.  **Right-Click** the icon.
4.  Select:
    -   **📥 Import Data**: Pick a JSON file to restore. It automatically pushes data to the Sync Server.
    -   **📤 Export Data**: Save your current clips to a JSON file for backup.

## 🛠️ Technical Changes
-   **`LaunchCliptoWithSync.bat`**: Automation script.
-   **`scripts/CliptoDesktopSource/data-handler.js`**: New logic to handle data securely via the Sync Server API.
-   **`scripts/CliptoDesktopSource/electron-main.js`**: Modified to include the new Tray menu options.

> [!NOTE]
> If you ever reinstall or update the app, these changes (Tray Menu) might be overwritten, but the Launcher and Sync Server data will remain safe.
