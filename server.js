const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 10000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

let database = {
    users: {},
    trades: [],
    leaderboard: {}
};

function loadDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            database = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
        }
    } catch (e) {
        console.error("Database load error:", e);
    }
}

function saveDatabase() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), "utf-8");
    } catch (e) {
        console.error("Database save error:", e);
    }
}

loadDatabase();

const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Helper to send JSON
    const sendJSON = (statusCode, data) => {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    };

    // Helper to read body
    const getBody = (callback) => {
        let body = "";
        req.on("data", chunk => { body += chunk.toString(); });
        req.on("end", () => {
            try {
                const parsed = body ? JSON.parse(body) : {};
                callback(null, parsed);
            } catch (e) {
                callback(e, null);
            }
        });
    };

    // API Routes
    if (pathname === "/api/health" && req.method === "GET") {
        return sendJSON(200, { status: "online", time: Date.now(), usersCount: Object.keys(database.users || {}).length });
    }

    if ((pathname === "/api/auth/register" || pathname === "/api/auth/signup") && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.password) return sendJSON(400, { success: false, error: "Invalid data" });
            const key = body.username.trim().toLowerCase();
            if (database.users[key]) return sendJSON(409, { success: false, error: "Username already taken" });
            database.users[key] = {
                username: body.username.trim(),
                password: body.password,
                saveData: body.initialData || {},
                createdAt: Date.now(),
                lastActive: Date.now()
            };
            saveDatabase();
            return sendJSON(200, { success: true, message: "Registered", user: { username: body.username.trim() } });
        });
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.password) return sendJSON(400, { success: false, error: "Invalid data" });
            const key = body.username.trim().toLowerCase();
            const user = database.users[key];
            if (!user || user.password !== body.password) return sendJSON(401, { success: false, error: "Incorrect credentials" });
            user.lastActive = Date.now();
            saveDatabase();
            return sendJSON(200, { success: true, user: { username: user.username, saveData: user.saveData } });
        });
    }

    if (pathname === "/api/save" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.saveData) return sendJSON(400, { success: false, error: "Invalid data" });
            const key = body.username.trim().toLowerCase();
            if (!database.users[key]) {
                database.users[key] = { username: body.username.trim(), password: "", saveData: body.saveData, lastActive: Date.now() };
            } else {
                database.users[key].saveData = body.saveData;
                database.users[key].lastActive = Date.now();
            }
            saveDatabase();
            return sendJSON(200, { success: true });
        });
    }

    if (pathname === "/api/save" && req.method === "GET") {
        const username = parsedUrl.query.username;
        if (!username) return sendJSON(400, { success: false, error: "Username required" });
        const key = String(username).trim().toLowerCase();
        const user = database.users[key];
        if (!user) return sendJSON(404, { success: false, error: "User not found" });
        return sendJSON(200, { success: true, saveData: user.saveData });
    }

    if (pathname === "/api/users" && req.method === "GET") {
        const summary = {};
        for (const k in database.users) {
            const u = database.users[k];
            summary[k] = { username: u.username, lastActive: u.lastActive, saveData: u.saveData };
        }
        return sendJSON(200, { success: true, users: summary });
    }

    if (pathname === "/api/leaderboard" && req.method === "GET") {
        const list = [];
        for (const k in database.users) {
            const u = database.users[k];
            let pData = {};
            try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch (e) {}
            list.push({
                username: u.username,
                name: pData.name || u.username,
                level: Number(pData.level || 1),
                cards: Array.isArray(pData.cards) ? pData.cards.length : 0,
                gold: Number(pData.coins || 100),
                equippedTitle: pData.equippedTitle || "Collector",
                profileFrame: pData.profileFrame || "default",
                avatar: pData.avatar || "player_temp.png",
                isTradeBanned: !!pData.isTradeBanned
            });
        }
        list.sort((a, b) => b.level - a.level);
        return sendJSON(200, { success: true, leaderboard: list });
    }

    // Static Files Serving
    let filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(__dirname, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end("Server Error");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
});

// Optional WebSocket enhancement
try {
    const { WebSocketServer } = require("ws");
    const wss = new WebSocketServer({ server, path: "/ws" });
    const connectedClients = new Map();

    wss.on("connection", (ws) => {
        let clientUsername = null;
        ws.on("message", (msg) => {
            try {
                const data = JSON.parse(msg);
                if (data.type === "AUTH") {
                    clientUsername = (data.payload.username || "").trim().toLowerCase();
                    connectedClients.set(clientUsername, ws);
                } else if (data.type === "TRADE_INVITE") {
                    const target = connectedClients.get((data.payload.toUser || "").trim().toLowerCase());
                    if (target && target.readyState === 1) target.send(JSON.stringify({ type: "INCOMING_TRADE", payload: data.payload }));
                } else if (data.type === "TRADE_ACTION") {
                    const target = connectedClients.get((data.payload.targetUser || "").trim().toLowerCase());
                    if (target && target.readyState === 1) target.send(JSON.stringify({ type: "TRADE_UPDATE", payload: data.payload }));
                }
            } catch (e) {}
        });
        ws.on("close", () => {
            if (clientUsername) connectedClients.delete(clientUsername);
        });
    });
} catch (e) {
    console.log("WebSocket optional module skipped, running on HTTP server mode.");
}

server.listen(PORT, "0.0.0.0", () => {
    console.log(`[Football Cards Server] Listening on 0.0.0.0:${PORT}`);
});