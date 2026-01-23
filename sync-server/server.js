const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ip = require('ip');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Helper: Load DB
function loadDB() {
    if (!fs.existsSync(DATA_FILE)) return { clips: [], version: 0 };
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Helper: Save DB
function saveDB(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/', (req, res) => {
    res.send(`<h1>Clipto Sync Server</h1><p>Running on ${ip.address()}:${PORT}</p>`);
});

// GET /sync - Device asks for latest data
app.get('/sync', (req, res) => {
    const db = loadDB();
    const clientVersion = parseInt(req.query.version) || 0;
    
    console.log(`📥 Sync Request from ${req.ip} (v${clientVersion})`);
    
    if (clientVersion < db.version) {
        res.json({ status: 'update', data: db.clips, version: db.version });
    } else {
        res.json({ status: 'uptodate', version: db.version });
    }
});

// POST /sync - Device pushes new data
app.post('/sync', (req, res) => {
    const incomingClips = req.body.clips; // Array of clips
    if (!incomingClips || !Array.isArray(incomingClips)) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    console.log(`📤 Push Request from ${req.ip}: ${incomingClips.length} clips`);
    
    const db = loadDB();
    let changes = 0;

    // Simple Merge Strategy (Last Write Wins based on ID)
    incomingClips.forEach(newClip => {
        const index = db.clips.findIndex(c => c.id === newClip.id);
        if (index >= 0) {
            // Update existing
            db.clips[index] = newClip;
        } else {
            // Add new
            db.clips.push(newClip);
        }
        changes++;
    });

    if (changes > 0) {
        db.version = Date.now();
        saveDB(db);
        console.log(`✅ Merged ${changes} changes. New Version: ${db.version}`);
    }

    res.json({ status: 'success', version: db.version });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
🚀 CLIPTO SYNC SERVER STARTED
---------------------------
📡 Local Address:   http://localhost:${PORT}
📡 Network Address: http://${ip.address()}:${PORT}
---------------------------
    `);
});
