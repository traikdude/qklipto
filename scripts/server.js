const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'clipto-data.json');

// Mock Data if file doesn't exist
const DEFAULT_DATA = {
    clips: [
        {
            id: "welcome-note",
            text: "👋 Welcome to your Local QKlipto Server!\n\nThis note was synced from your local machine.",
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            status: "active"
        }
    ]
};

const server = http.createServer((req, res) => {
    // Enable CORS for all
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(`${req.method} ${url.pathname}`);

    if (url.pathname === '/sync' && req.method === 'GET') {
        try {
            let data = DEFAULT_DATA;
            if (fs.existsSync(DATA_FILE)) {
                console.log("Reading data from disk...");
                const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
                data = JSON.parse(fileContent);
            } else {
                console.log("No data file found, serving default welcome note.");
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (err) {
            console.error("Sync Error:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`🚀 QKlipto Data Server running at http://localhost:${PORT}`);
    console.log(`📂 Data Source: ${DATA_FILE}`);
});
