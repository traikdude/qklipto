# QKlipto - Clipto Resurrection Toolkit

**A comprehensive toolkit for resurrecting Clipto Pro v7.2.17 with custom sync capabilities**

> *"Working on it"* - d0x360  
> **Challenge accepted.** ✅

---

## 🎯 Project Goals

1. **Resurrect** Clipto Pro on Windows with air-gap protection
2. **Extract** Desktop source code from Electron bundle
3. **Analyze** database structure for sync compatibility
4. **Build** custom sync solution (Windows ↔ Android)
5. **Share** with the Clipto community

---

## 📦 What is Clipto?

**Clipto Pro** was a powerful cross-platform clipboard/note-syncing application that was abandoned after its developer (Alex Trashler) disappeared during the Ukraine conflict in 2024. The Firebase backend was shut down, breaking all sync functionality.

- **Last Version:** v7.2.17 (Windows/Mac/Linux Desktop), v7.3.8 (Android)
- **Tech Stack:** Electron (Desktop), Native Android
- **Status:** Abandoned, community-maintained
- **Community:** [Discord](https://discord.gg/clipto) led by d0x360

---

## 🚀 Quick Start

### Prerequisites
- Windows 10/11
- PowerShell 7.5+
- Administrator access (for firewall configuration)

### Phase 0: Pre-Flight Safety

```powershell
# Navigate to project directory
cd C:\Users\<YourName>\.gemini\antigravity\scratch

# Discover existing data (backs up if found)
.\Phase0.1_DataDiscovery.ps1

# Download installer and verify hash
.\Phase0.2_DownloadInstaller.ps1
```

### Phase 1: Secure Installation

```powershell
# Install Clipto v7.2.17
.\Phase1.1_Installation.ps1

# Configure firewall air-gap (REQUIRES ADMIN)
.\Phase1.2_AirGapFirewall.ps1

# Setup automated daily backups
.\Phase1.3_BackupAutomation.ps1
```

### Phase 2: Source Extraction & Analysis

```powershell
# Extract Desktop source from app.asar
.\Phase2.1_ExtractSource.ps1

# Analyze extracted code
.\Phase2.2_AnalyzeSource.ps1
```

---

## 📁 Project Structure

```
qklipto/
├── Phase0.1_DataDiscovery.ps1      # Backup existing Clipto data
├── Phase0.2_DownloadInstaller.ps1  # Download & verify v7.2.17
├── Phase1.1_Installation.ps1       # Install Clipto
├── Phase1.2_AirGapFirewall.ps1     # Block internet access
├── Phase1.3_BackupAutomation.ps1   # Daily backup system
├── Phase2.1_ExtractSource.ps1      # Extract Desktop source
├── Phase2.2_AnalyzeSource.ps1      # Analyze source code
├── EXECUTION_GUIDE.md              # Step-by-step guide
├── README.md                       # This file
└── docs/
    ├── PROGRESS.md                 # Current status
    ├── DATABASE_ANALYSIS.md        # Database schema comparisons
    └── SYNC_DESIGN.md              # Custom sync architecture
```

---

## 🛡️ Security Features

### Firewall Air-Gap
Prevents Clipto from accessing the defunct Firebase servers, eliminating 30-60 second timeout hangs during startup and usage.

**Windows Firewall Rule:**
- Name: `Block Clipto Outbound`
- Direction: Outbound
- Action: Block
- Program: `C:\Users\<User>\AppData\Local\Programs\Clipto\Clipto.exe`

### Automated Backups
Daily backups at 11:00 PM to OneDrive (or local Documents folder).

**Backup Location:** `C:\Users\<User>\OneDrive\CliptoBackups`  
**Retention:** Last 7 days

---

## 🔍 Phase 2: Source Code Extraction

QKlipto extracts the full Desktop source code from Clipto's Electron bundle using the `asar` tool.

**What we extract:**
- ✅ JavaScript source code
- ✅ React components
- ✅ Database implementation
- ✅ Firebase sync protocol
- ✅ Full app architecture

**Why this matters:**
- The Desktop source was **lost** by d0x360
- GitHub releases contain NO source code
- This gives us everything needed to build custom sync

---

## 🗄️ Database Analysis

### Windows Desktop
- **Technology:** TBD (SQLite/LevelDB/NeDB)
- **Location:** `%APPDATA%\Clipto`

### Android
- **Technology:** SQLite
- **Source:** [clipto-pro/Android](https://github.com/clipto-pro/Android) (v7.1.4)
- **Latest APK:** v7.3.8 (minor Firebase changes only)

### Compatibility Analysis
**Status:** In Progress (Phase 2.2)

---

## 🔄 Planned Sync Solutions

### Option A: Direct WiFi Sync (Weekend Project)
- Extract database schemas
- Compare Windows ↔ Android compatibility
- Build PowerShell/Python sync script
- Sync databases when on same network

### Option B: Self-Hosted Cloud Sync (1-2 weeks)
- Deploy Supabase (free) or Firebase
- Modify Android source to use new backend
- Use mitmproxy/frida translation layer for Desktop
- Full cloud sync restoration

### Option C: Markdown Export + Obsidian (Fallback)
- Export Clipto data to Markdown
- Migrate to Obsidian
- Use Obsidian Sync for cross-platform

---

## 📊 Current Status

**Phase 0:** ✅ Complete  
**Phase 1:** ✅ Complete  
**Phase 2:** 🚧 In Progress (Source extraction ready)  
**Phase 3:** ⏸️ Pending (Awaiting Phase 2 analysis)

See [PROGRESS.md](docs/PROGRESS.md) for detailed status.

---

## 🤝 Contributing

This project welcomes contributions! If you:
- ✅ Successfully extracted Desktop source
- ✅ Analyzed database schemas
- ✅ Built a working sync solution
- ✅ Found bugs or improvements

**Please share your findings!**

### How to Contribute
1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Share in the Clipto Discord

---

## 📜 License

**MIT License** - Feel free to use, modify, and distribute.

This project is NOT affiliated with the original Clipto Pro development. It's a community effort to preserve and enhance Alex Trashler's work.

---

## 🙏 Credits

- **Alex Trashler** - Original Clipto Pro developer (presumed KIA, Ukraine 2024)
- **d0x360** - Clipto community leader, Android source preserver
- **Clipto Discord Community** - Keeping the dream alive
- **QKlipto Contributors** - Solving what everyone said was impossible

---

## 🔗 Resources

- [Clipto Discord](https://discord.gg/clipto)
- [Android Source (v7.1.4)](https://github.com/clipto-pro/Android)
- [Desktop Releases (no source)](https://github.com/clipto-pro/Desktop/releases)
- [Alex's Patreon](https://www.patreon.com/clipto) (inactive)

---

## ⚠️ Disclaimer

This toolkit is provided AS-IS for educational and preservation purposes. Use at your own risk. Always backup your data before running any scripts.

**Security Note:** The installer hash verification step is critical. Never skip it.

---

**Made with ❤️ by the community who refuses to let great software die.**

*"In memory of Alex Trashler - your work lives on."*
