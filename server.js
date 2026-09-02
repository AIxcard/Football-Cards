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

const ALUCARD_USER = {
    username: "Alucard",
    password: "Unidentified67",
    saveData: {
        name: "Alucard",
        accountUser: "Alucard",
        coins: 100,
        xp: 25,
        level: 1,
        equippedTitle: "UNIQUE",
        grantedTitles: ["UNIQUE", "Owner", "Admin"],
        isGrantedAdmin: true,
        cards: [],
        stats: { playtime: 0, packsOpened: 0, cardsPulled: 0, duplicates: 0, cardsSold: 0, coinsEarned: 0, coinsSpent: 0 }
    },
    createdAt: Date.now(),
    lastActive: Date.now()
};

let database = {
    users: {
        "alucard": ALUCARD_USER
    },
    trades: [],
    leaderboard: {}
};

const HARD_WIPE_VERSION = "v18_season_reset";

function saveDatabase() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), "utf-8");
    } catch (e) {
        console.error("Error saving database:", e);
    }
}

function loadDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
            if (raw.wipeVersion === HARD_WIPE_VERSION && raw.users) {
                database = raw;
                database.users["alucard"] = ALUCARD_USER;
                return;
            }
        }
    } catch (e) {}

    database = {
        wipeVersion: HARD_WIPE_VERSION,
        users: {
            "alucard": ALUCARD_USER
        },
        trades: [],
        leaderboard: {}
    };
    saveDatabase();
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
            database.backups = database.backups || {};
            if (!database.users[key]) {
                database.users[key] = { username: body.username.trim(), password: "", saveData: body.saveData, lastActive: Date.now() };
            } else {
                if (database.users[key].saveData) {
                    database.backups[key] = database.backups[key] || [];
                    database.backups[key].unshift({
                        timestamp: Date.now(),
                        saveData: database.users[key].saveData
                    });
                    if (database.backups[key].length > 15) database.backups[key].pop();
                }
                database.users[key].saveData = body.saveData;
                database.users[key].lastActive = Date.now();
            }
            saveDatabase();
            return sendJSON(200, { success: true });
        });
    }

    if (pathname === "/api/user/history" && req.method === "GET") {
        const username = parsedUrl.query.username;
        if (!username) return sendJSON(400, { success: false, error: "Username required" });
        const key = String(username).trim().toLowerCase();
        database.backups = database.backups || {};
        const backups = database.backups[key] || [];
        const currentUser = database.users[key];
        return sendJSON(200, {
            success: true,
            current: currentUser ? currentUser.saveData : null,
            backups: backups
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
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`[Football Cards Server] Listening on 0.0.0.0:${PORT}`);
});