# 🧭 Strategic Alternatives Analysis: Clipto Desktop Resurrection

**Context**: The current "Runtime Patch" approach (`debug-entry.js` injection) failed to launch. We are evaluating 6 alternative strategies provided by the "Strategic Work Product Enhancement Framework".

| Option | Strategy | Feasibility | Risk | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **A** | **Electron Preload Script** 🛡️ | **High** | Low | **Recommended**. Uses standard `contextBridge` API. Stable, race-condition free. Requires refactoring `debug-entry.js`. |
| **B** | **Local Proxy Interception** 🕵️ | Medium | Medium | **High Value**, but high effort. Requires reverse-engineering Firebase protocol. Best long-term if successful. |
| **C** | **LevelDB Direct Access** 💾 | **High** | Low | **Solid Fallback**. Best for "Export Only". Doesn't give a GUI sync button but guarantees data extraction. |
| **D** | **Dexie Cloud Self-Hosted** ☁️ | Low | High | **Unknown**. Depends on minified code flexibility. Likely requires specific endpoints hardcoded in the generic Dexie build. |
| **E** | **WebView Container** 📦 | Medium | Low | **Cleanest Arch**. Wraps the legacy app in a fresh shell. Solves isolation but adds complexity in IPC messaging. |
| **F** | **Headless Sync Daemon** 👻 | High | Low | **Functional**. Good for background sync, but lacks user visibility/control. |

## Deep Dive: The Top Contenders

### 🥇 Alternative A: Preload Script (The Refinement)
Instead of using `executeJavaScript` (brittle, race-conditions) to inject code *after* load, we use a `preload.js` script.
*   **Why**: Electron runs this script *before* the renderer. We can expose a clean `window.qklipto` API to the app.
*   **Fixes**: The current launch failure might be due to security policies blocking `executeJavaScript` or script errors crashing the renderer.
*   **Action**: Convert `debug-entry.js` logic into a `preload.js` structure.

### 🥈 Alternative E: WebView Container (The Sandbox)
We treat the `app.asar` (or extracted source) purely as "content" to be loaded in a `<webview>` tag within a *new*, healthy Electron app.
*   **Why**: Total isolation. The host app controls the menu, the sync logic, and the storage access (via protocol interception).
*   **Fixes**: "God Mode" sync is handled by the Host, not injected into the Guest.

### 🥉 Alternative C: LevelDB Direct (The Escape Hatch)
If Electron refuses to launch (due to native module mismatches or version rot), we stop trying to run the UI.
*   **Why**: We only need the *data*.
*   **Action**: Write a Node.js script `export-cli.js` that uses `classic-level` or `leveldown` to read the IndexedDB files directly from disk and push them to the Sync Server.

## Recommendation
**Pivot to Alternative A (Preload)** if we want a GUI.
**Pivot to Alternative C (Direct)** if we just want the data *now*.

Given the launch failure, **Alternative A** is the logical "next attempt" at a GUI fix, as it aligns with modern Electron security standards better than the current injection method.
