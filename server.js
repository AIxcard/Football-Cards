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
        coins: 270000,
        xp: 3500,
        level: 7,
        equippedTitle: "UNIQUE",
        grantedTitles: ["UNIQUE", "Owner", "Admin", "Season 1 Champion"],
        isGrantedAdmin: true,
        cards: [
            {
                id: "alucard_mk_1",
                player: "Monkey King",
                position: "ST",
                rarity: "Developer",
                rating: 99,
                devCard: true,
                image: "monkey_king.png",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_mk_2",
                player: "Monkey King",
                position: "ST",
                rarity: "Developer",
                rating: 99,
                devCard: true,
                image: "monkey_king.png",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_messi_wc1",
                player: "Lionel Messi",
                position: "RW",
                rarity: "World Class",
                rating: 99,
                serialNumber: 1,
                maxSerial: 10,
                image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_ronaldo_wc1",
                player: "Cristiano Ronaldo",
                position: "ST",
                rarity: "World Class",
                rating: 99,
                serialNumber: 1,
                maxSerial: 10,
                image: "ronaldo_custom.png",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_emanuel_tourn",
                player: "Emanuel",
                position: "CAM",
                rarity: "Tournament",
                rating: 99,
                image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_haaland_sec",
                player: "Erling Haaland",
                position: "ST",
                rarity: "Secret",
                rating: 98,
                image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            },
            {
                id: "alucard_mbappe_sec",
                player: "Kylian Mbappé",
                position: "ST",
                rarity: "Secret",
                rating: 97,
                image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            },
            {
                id: "alucard_vini_myth",
                player: "Vinícius Júnior",
                position: "LW",
                rarity: "Mythic",
                rating: 95,
                image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            },
            {
                id: "alucard_jude_myth",
                player: "Jude Bellingham",
                position: "CAM",
                rarity: "Mythic",
                rating: 94,
                image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            },
            {
                id: "alucard_kdb_leg",
                player: "Kevin De Bruyne",
                position: "CM",
                rarity: "Legendary",
                rating: 93,
                image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            }
        ],
        stats: {
            playtime: 3600,
            packsOpened: 150,
            cardsPulled: 200,
            duplicates: 30,
            cardsSold: 20,
            coinsEarned: 270000,
            coinsSpent: 10000,
            tournamentScore: 850
        }
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
            if (raw && raw.users) {
                database = raw;
                database.users = database.users || {};
                if (!database.users["alucard"]) {
                    database.users["alucard"] = ALUCARD_USER;
                }
                return;
            }
        }
    } catch (e) {
        console.error("Error loading database:", e);
    }

    database = database || { users: {}, trades: [], leaderboard: {} };
    database.users = database.users || {};
    database.users["alucard"] = ALUCARD_USER;
    saveDatabase();
}

loadDatabase();

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml; charset=utf-8",
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
            if (err || !body.username || !body.password) return sendJSON(400, { success: false, error: "Please provide both username and password." });
            const key = body.username.trim().toLowerCase();
            const user = database.users[key];
            if (!user) {
                return sendJSON(404, { success: false, error: "Username does not exist. Please click Sign Up to create this account." });
            }
            if (user.password !== body.password) {
                return sendJSON(401, { success: false, error: "Incorrect password. Please try again." });
            }
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

const SERVER_CARD_VALUES = {
    Common: 20,
    Uncommon: 50,
    Rare: 150,
    Epic: 400,
    Legendary: 1200,
    Exclusive: 2500,
    Mythic: 6000,
    Secret: 15000,
    Tournament: 30000,
    "World Class": 75000,
    Developer: 200000
};

function calculateServerCollectionValue(cards) {
    if (!Array.isArray(cards)) return 0;
    return cards.reduce((sum, c) => {
        if (!c) return sum;
        if (c.serialNumber) return sum + 500000;
        return sum + (SERVER_CARD_VALUES[c.rarity] || 20);
    }, 0);
}

    if ((pathname === "/api/user/delete" || pathname === "/api/user") && (req.method === "POST" || req.method === "DELETE")) {
        return getBody((err, body) => {
            const rawTarget = (body && body.username) || parsedUrl.query.username;
            if (!rawTarget) return sendJSON(400, { success: false, error: "Username required" });
            const key = String(rawTarget).trim().toLowerCase();
            if (key === "alucard") return sendJSON(403, { success: false, error: "Cannot delete owner account" });
            if (database.users[key]) {
                delete database.users[key];
            }
            if (database.backups && database.backups[key]) {
                delete database.backups[key];
            }
            saveDatabase();
            return sendJSON(200, { success: true, message: `Account ${rawTarget} deleted permanently.` });
        });
    }

    if (pathname === "/api/leaderboard" && req.method === "GET") {
        const list = [];
        for (const k in database.users) {
            const u = database.users[k];
            let pData = {};
            try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch (e) {}
            const cardsArr = Array.isArray(pData.cards) ? pData.cards : [];
            const colVal = (pData.collectionValue !== undefined && Number(pData.collectionValue) > 0)
                ? Number(pData.collectionValue)
                : calculateServerCollectionValue(cardsArr);
            list.push({
                username: u.username,
                name: pData.name || u.username,
                level: Number(pData.level || 1),
                cards: cardsArr.length,
                gold: Number(pData.coins || 100),
                value: colVal,
                equippedTitle: pData.equippedTitle || "Collector",
                profileFrame: pData.profileFrame || "default",
                avatar: pData.avatar || "player_temp.png",
                isTradeBanned: !!pData.isTradeBanned
            });
        }
        list.sort((a, b) => b.level - a.level || b.value - a.value);
        return sendJSON(200, { success: true, leaderboard: list });
    }

    // Static Files Serving (Cross-platform POSIX / Windows path normalization)
    const cleanPath = (pathname === "/" || !pathname) ? "index.html" : pathname.replace(/^\/+/, "");
    let filePath = path.join(__dirname, cleanPath);
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