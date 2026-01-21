# ============================================
# CLIPTO RESURRECTION - EXECUTION GUIDE
# ============================================

## 🎯 Mission: Safely resurrect Clipto Pro v7.2.17

This folder contains PowerShell scripts to execute the Clipto Resurrection Protocol.
Each phase must be completed in order.

---

## 📋 EXECUTION CHECKLIST

### PHASE 0: Pre-Flight Safety ✈️

#### [ ] Step 0.1: Data Discovery & Backup
**Purpose:** Protect any existing Clipto data before making changes

**Command:**
```powershell
.\Phase0.1_DataDiscovery.ps1
```

**Expected Result:**
- ✅ Backup created (if existing data found)
- OR: ✅ Confirmed no existing data

**What it does:**
- Scans for existing Clipto installation in `%APPDATA%\Clipto`
- Creates timestamped backup to OneDrive (or Documents if no OneDrive)
- Reports file count and data size

---

#### [ ] Step 0.2: Download & Verify Installer
**Purpose:** Download installer and generate hash for community verification

**Command:**
```powershell
.\Phase0.2_DownloadInstaller.ps1
```

**Expected Result:**
- ✅ `clipto-7.2.17.exe` downloaded to this folder
- ✅ SHA-256 hash calculated and saved to `clipto-7.2.17_HASH_REPORT.txt`

**What it does:**
- Downloads installer from GitHub releases
- Calculates SHA-256 hash for security verification
- Creates shareable hash report for Discord community

**⚠️ IMPORTANT:** Before proceeding to Phase 1, verify the hash with:
- Discord community members who already installed v7.2.17
- d0x360 (co-founder)

---

### PHASE 1: Secure Installation (Coming Next)

Scripts for Phase 1 will handle:
- Verified installation
- Firewall air-gapping
- Automated backup configuration

**Status:** Scripts will be created after Phase 0 completion

---

## 🚨 SAFETY RULES

1. **NEVER skip Phase 0** - Data preservation is critical
2. **Verify the hash** before installation (community consensus)
3. **Keep backups** - The scripts create multiple safety copies
4. **One phase at a time** - Don't rush; each step builds on the previous

---

## 📁 FILE STRUCTURE

```
scratch/
├── Phase0.1_DataDiscovery.ps1      ← Run this FIRST
├── Phase0.2_DownloadInstaller.ps1  ← Run this SECOND
├── clipto-7.2.17.exe               ← Downloaded by Phase 0.2
├── clipto-7.2.17_HASH_REPORT.txt   ← Hash verification report
└── EXECUTION_GUIDE.md              ← You are here
```

---

## 💡 TROUBLESHOOTING

**"Execution of scripts is disabled on this system"**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Download fails in Phase 0.2**
- Check internet connection
- Try manual download from: https://github.com/clipto-pro/Desktop/releases/tag/v7.2.17
- Place downloaded file in this folder and re-run script

**Backup fails in Phase 0.1**
- Manually copy `%APPDATA%\Clipto` to a safe location
- Continue to Phase 0.2 only after manual backup

---

## 📞 SUPPORT

Discord Community: [Your Clipto Discord link]
Co-Founder: d0x360
GitHub: https://github.com/clipto-pro/Desktop

---

## 🗺️ ROADMAP

- [x] Strategic Enhancement Analysis (W→E→P→V Framework)
- [x] Enhanced Implementation Plan v2.0
- [x] Phase 0 Scripts Created
- [ ] Phase 0 Execution
- [ ] Phase 1 Scripts (Installation)
- [ ] Phase 2 Scripts (Sync Feasibility)
- [ ] Phase 3A/B Scripts (Bridge or Migration)

---

**Ready to begin?**

Open PowerShell in this directory and run:
```powershell
.\Phase0.1_DataDiscovery.ps1
```
