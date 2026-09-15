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

const HARD_WIPE_VERSION = "v30_clean_reset";

let database = {
    wipeVersion: HARD_WIPE_VERSION,
    users: {},
    trades: [],
    tradeSessions: {},
    auditLogs: {},
    backups: {},
    leaderboard: {}
};

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
            if (raw && raw.wipeVersion === HARD_WIPE_VERSION && raw.users) {
                database = raw;
                database.users = database.users || {};
                database.trades = database.trades || [];
                database.tradeSessions = database.tradeSessions || {};
                database.auditLogs = database.auditLogs || {};
                database.backups = database.backups || {};
                return;
            }
        }
    } catch (e) {
        console.error("Error loading database:", e);
    }

    database = {
        wipeVersion: HARD_WIPE_VERSION,
        users: {},
        trades: [],
        tradeSessions: {},
        auditLogs: {},
        backups: {},
        leaderboard: {}
    };
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

    const sendJSON = (statusCode, data) => {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    };

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

    if (pathname === "/api/health" && req.method === "GET") {
        return sendJSON(200, { status: "online", time: Date.now(), usersCount: Object.keys(database.users || {}).length });
    }

    // SIGNUP / REGISTER
    if ((pathname === "/api/auth/register" || pathname === "/api/auth/signup") && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.password) return sendJSON(400, { success: false, error: "Invalid username or password." });
            const key = body.username.trim().toLowerCase();
            if (database.users[key]) return sendJSON(409, { success: false, error: "Username is already taken. Please choose another username or log in." });

            const isAdmin = key === "alucard";
            let sData = body.initialData || {
                name: body.username.trim(),
                accountUser: body.username.trim(),
                coins: 100,
                xp: 0,
                level: 1,
                cards: [],
                equippedTitle: isAdmin ? "UNIQUE" : "Collector",
                grantedTitles: isAdmin ? ["UNIQUE", "Owner", "Admin"] : [],
                isGrantedAdmin: isAdmin,
                lastSave: Date.now()
            };

            database.users[key] = {
                username: body.username.trim(),
                password: body.password,
                saveData: sData,
                createdAt: Date.now(),
                lastActive: Date.now()
            };
            saveDatabase();
            return sendJSON(200, { success: true, message: "Registered", user: { username: body.username.trim(), saveData: sData } });
        });
    }

    // LOGIN
    if (pathname === "/api/auth/login" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.password) return sendJSON(400, { success: false, error: "Please provide both username and password." });
            const key = body.username.trim().toLowerCase();
            const user = database.users[key];
            if (!user) {
                return sendJSON(404, { success: false, error: "Username does not exist. Click Sign Up to create this account." });
            }
            if (user.password !== body.password) {
                return sendJSON(401, { success: false, error: "Incorrect password. Please try again." });
            }
            user.lastActive = Date.now();
            saveDatabase();
            return sendJSON(200, { success: true, user: { username: user.username, saveData: user.saveData } });
        });
    }

    // CHANGE USERNAME
    if (pathname === "/api/user/change-username" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.oldUsername || !body.newUsername || !body.password) {
                return sendJSON(400, { success: false, error: "Missing required fields." });
            }
            const oldKey = body.oldUsername.trim().toLowerCase();
            const newKey = body.newUsername.trim().toLowerCase();
            const user = database.users[oldKey];

            if (!user) return sendJSON(404, { success: false, error: "Current account not found." });
            if (user.password !== body.password) return sendJSON(401, { success: false, error: "Incorrect password." });
            if (oldKey !== newKey && database.users[newKey]) {
                return sendJSON(409, { success: false, error: "New username is already taken." });
            }

            // Migrate account data to new username
            let sData = user.saveData || {};
            sData.name = body.newUsername.trim();
            sData.accountUser = body.newUsername.trim();
            sData.lastSave = Date.now();

            database.users[newKey] = {
                username: body.newUsername.trim(),
                password: user.password,
                saveData: sData,
                createdAt: user.createdAt || Date.now(),
                lastActive: Date.now()
            };

            // Free the old username if it changed
            if (oldKey !== newKey) {
                delete database.users[oldKey];
                if (database.backups && database.backups[oldKey]) {
                    database.backups[newKey] = database.backups[oldKey];
                    delete database.backups[oldKey];
                }
            }

            saveDatabase();
            return sendJSON(200, { success: true, message: `Username updated to ${body.newUsername.trim()}`, user: database.users[newKey] });
        });
    }

    // CHANGE PASSWORD
    if (pathname === "/api/user/change-password" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.currentPassword || !body.newPassword) {
                return sendJSON(400, { success: false, error: "Missing required fields." });
            }
            const key = body.username.trim().toLowerCase();
            const user = database.users[key];
            if (!user) return sendJSON(404, { success: false, error: "Account not found." });
            if (user.password !== body.currentPassword) return sendJSON(401, { success: false, error: "Current password is incorrect." });

            user.password = body.newPassword;
            user.lastActive = Date.now();
            saveDatabase();
            return sendJSON(200, { success: true, message: "Password updated successfully!" });
        });
    }

    // SAVE GAME DATA
    if (pathname === "/api/save" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.saveData) return sendJSON(400, { success: false, error: "Invalid data" });
            const key = body.username.trim().toLowerCase();
            database.backups = database.backups || {};
            
            let incoming = body.saveData;
            if (typeof incoming === "string") {
                try { incoming = JSON.parse(incoming); } catch(e) {}
            }

            if (!database.users[key]) {
                database.users[key] = { username: body.username.trim(), password: "", saveData: incoming, lastActive: Date.now() };
            } else {
                if (database.users[key].saveData) {
                    database.backups[key] = database.backups[key] || [];
                    database.backups[key].unshift({
                        timestamp: Date.now(),
                        saveData: database.users[key].saveData
                    });
                    if (database.backups[key].length > 15) database.backups[key].pop();
                }
                incoming.lastSave = Date.now();
                database.users[key].saveData = incoming;
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

    // DELETE USER (Frees username immediately)
    if ((pathname === "/api/user/delete" || pathname === "/api/user") && (req.method === "POST" || req.method === "DELETE")) {
        return getBody((err, body) => {
            const rawTarget = (body && body.username) || parsedUrl.query.username;
            if (!rawTarget) return sendJSON(400, { success: false, error: "Username required" });
            const key = String(rawTarget).trim().toLowerCase();
            
            if (database.users[key]) {
                delete database.users[key];
            }
            if (database.backups && database.backups[key]) {
                delete database.backups[key];
            }
            if (database.auditLogs && database.auditLogs[key]) {
                delete database.auditLogs[key];
            }
            saveDatabase();
            return sendJSON(200, { success: true, message: `Account ${rawTarget} permanently deleted and username freed.` });
        });
    }

    // LEADERBOARD
    if (pathname === "/api/leaderboard" && req.method === "GET") {
        const list = [];
        for (const k in database.users) {
            const u = database.users[k];
            let pData = {};
            try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch (e) {}
            const cardsArr = Array.isArray(pData.cards) ? pData.cards : [];
            const tScore = Number((pData.stats && pData.stats.tournamentScore) || pData.tournamentScore || 0);
            const tWins = Number((pData.stats && pData.stats.tournamentWins) || pData.tournamentWins || 0);
            list.push({
                username: u.username,
                name: pData.name || u.username,
                level: Number(pData.level || 1),
                cards: cardsArr.length,
                gold: Number(pData.coins || 100),
                value: Number(pData.collectionValue || 0),
                tournamentScore: tScore,
                tournamentWins: tWins,
                equippedTitle: pData.equippedTitle || "Collector",
                profileFrame: pData.profileFrame || "default",
                avatar: pData.avatar || "player_temp.png",
                isTradeBanned: !!pData.isTradeBanned
            });
        }
        list.sort((a, b) => b.level - a.level || b.value - a.value);
        return sendJSON(200, { success: true, leaderboard: list });
    }

    // TRADING REST API
    if (pathname === "/api/trade/request" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.sender || !body.receiver) return sendJSON(400, { success: false, error: "Invalid trade request" });
            const sKey = String(body.sender).trim().toLowerCase();
            const rKey = String(body.receiver).trim().toLowerCase();
            if (sKey === rKey) return sendJSON(400, { success: false, error: "Cannot trade with yourself" });
            if (!database.users[rKey]) return sendJSON(404, { success: false, error: "Recipient user not found on server" });

            const tradeId = body.id || ("tr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7));
            const tradeReq = {
                id: tradeId,
                sender: database.users[sKey] ? database.users[sKey].username : body.sender,
                receiver: database.users[rKey].username,
                senderTitle: body.senderTitle || "Collector",
                senderLevel: Number(body.senderLevel || 1),
                status: "pending",
                timestamp: Date.now()
            };

            database.trades = database.trades || [];
            database.trades = database.trades.filter(t => t.id !== tradeId && (Date.now() - t.timestamp < 300000));
            database.trades.push(tradeReq);
            saveDatabase();
            return sendJSON(200, { success: true, trade: tradeReq });
        });
    }

    if (pathname === "/api/trade/pending" && req.method === "GET") {
        const username = parsedUrl.query.username;
        if (!username) return sendJSON(400, { success: false, error: "Username required" });
        const key = String(username).trim().toLowerCase();
        database.trades = database.trades || [];
        const pending = database.trades.filter(t => 
            (t.receiver.toLowerCase() === key || t.sender.toLowerCase() === key) && 
            (Date.now() - t.timestamp < 300000)
        );
        return sendJSON(200, { success: true, trades: pending });
    }

    // Static Files Serving
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
