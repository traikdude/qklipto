# 🎉 Release v1.0.2 - qklipto

## 📅 Release Information
- Date: Saturday, January 25, 2026
- Tag: qklipto-v1.0.2
- Branch: master

## 📦 Included Files
- qklipto-v1.0.2.apk

## 📋 Summary
This critical maintenance release modernizes the build system, enhancing stability, security, and developer experience.

## 🔄 Changes in This Release

### 🔧 Build & Infrastructure
- **Stability Stack**: Standardized on Firebase BoM `31.2.0`, Kotlin `1.6.10`, and SDK 31 to resolve persistent compatibility issues.
- **Security**: Secured `google-services.json` credentials.

### ✨ Features
- **Offline Auth**: Enhanced auth reliability for offline/dev modes.
- **Dev Tools**: Added offline sync button to `debug-entry.js` for easier local testing.

### 🐛 Fixed
- Resolved AAPT2 resource processing crashes on build.
- Fixed `LegacyJsonProcessor.kt` for reliable import handling.

## 🧪 Testing Performed
- Full `assembleDebug` build success (41m).
- Verified artifact creation.
