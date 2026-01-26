import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32') app.disableHardwareAcceleration()

let win: BrowserWindow | null = null

const preload = join(__dirname, '../preload.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(__dirname, '../dist-react/index.html')

async function createWindow() {
    win = new BrowserWindow({
        title: 'QKlipto',
        width: 1200,
        height: 800,
        webPreferences: {
            preload,
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})
